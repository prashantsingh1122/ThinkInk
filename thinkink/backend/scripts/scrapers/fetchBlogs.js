import axios from 'axios';
import { load } from 'cheerio';                // <- changed import
import fs from 'fs/promises';
import path from 'path';
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'url';
import Post from '../../models/Post.js';
import User from '../../models/userModel.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class BlogScraper {
  constructor() {
    this.delayMs = 2000;    // delay between requests (avoid rate limits)
    this.maxRetries = 3;    // retry failed requests
    this.timeout = 15000;   // axios timeout (15 sec)

    // RSS sources to scrape
    this.sources = [
      { name: 'TechCrunch', rss: 'https://techcrunch.com/feed/', category: 'technology' },
      { name: 'Medium Tech', rss: 'https://medium.com/feed/topic/technology', category: 'technology' },
      { name: 'Dev.to', rss: 'https://dev.to/feed', category: 'programming' },
      { name: 'HackerNews', rss: 'https://hnrss.org/frontpage', category: 'technology' },
      { name: 'Mashable', rss: 'https://feeds.feedburner.com/Mashable', category: 'gaming' },
      { name: 'Wired', rss: 'https://www.wired.com/feed/rss', category: 'sports' }
    ];
  }

  async sleep(ms = this.delayMs) {
    return new Promise((r) => setTimeout(r, ms));
  }

  async retryRequest(fn, retries = this.maxRetries) {
    for (let i = 0; i < retries; i++) {
      try {
        return await fn();
      } catch (err) {
        if (i === retries - 1) throw err;
        await this.sleep(1000 * (i + 1));
      }
    }
  }

   //Scrape RSS Feed
  async scrapeRSSFeed(source) {
    try {
      const res = await this.retryRequest(() =>
        axios.get(source.rss, {
          timeout: this.timeout,
          headers: { 'User-Agent': 'Mozilla/5.0 (compatible; BlogBot/1.0)' }
        })
      );
      const $ = load(res.data, { xmlMode: true }); // <- use load
      const items = [];
      $('item, entry').each((i, el) => {
        const $el = $(el);
        const link = $el.find('link').text() || $el.find('link').attr('href');
        const title = $el.find('title').text();
        const pubDate = $el.find('pubDate, published').text();
        const description = $el.find('description, summary').text();
        if (link && title) {
          items.push({
            url: link.trim(),
            title: title.trim(),
            description: (description || '').trim(),
            publishDate: pubDate || new Date().toISOString(),
            source: source.name,
            category: source.category
          });
        }
      });
      return items.slice(0, 10);
    } catch (err) {
      console.error(`Error scraping RSS ${source.name}:`, err.message);
      return [];
    }
  }

  async scrapeBlogPost(item) {
    try {
      const res = await this.retryRequest(() =>
        axios.get(item.url, {
          timeout: this.timeout,
          headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
        })
      );
      const $ = load(res.data); // <- use load
      const content = this.extractContent($);
      const author = this.extractAuthor($) || 'Unknown';
      const tags = this.extractTags($);
      const featuredImage = this.extractFeaturedImage($, item.url);
      return {
        ...item,
        content: content?.slice(0, 20000) || item.description || '',
        author,
        tags,
        featuredImage,
        wordCount: content ? content.split(/\s+/).length : 0,
        scrapedAt: new Date().toISOString(),
        status: 'scraped'
      };
    } catch (err) {
      console.error(`Error scraping post ${item.url}:`, err.message);
      return {
        ...item,
        content: item.description || 'Content unavailable',
        author: 'Unknown',
        tags: [],
        featuredImage: null,
        wordCount: 0,
        scrapedAt: new Date().toISOString(),
        status: 'failed',
        error: err.message
      };
    }
  }

  extractContent($) {
    const selectors = [
      'article',
      '.entry-content',
      '.post-content',
      '.article-content',
      '.content',
      '.post-body',
      '[class*="content"]',
      'main',
      '.story-body'
    ];
    for (const sel of selectors) {
      const el = $(sel).first();
      if (el.length) {
        el.find('script, style, nav, aside, .advertisement, .social-share').remove();
        const text = el.text().trim();
        if (text.length > 200) return text;
      }
    }
    const paragraphs = $('p').map((i, el) => $(el).text().trim()).get()
      .filter(t => t.length > 20)
      .join(' ');
    return paragraphs || '';
  }

  extractAuthor($) {
    const selectors = ['.author-name', '.byline', '[rel="author"]', '.post-author', '.entry-author', '[class*="author"]', '[data-author]'];
    for (const sel of selectors) {
      const v = $(sel).first().text().trim();
      if (v && v.length < 150) return v.replace(/^by\s+/i, '');
    }
    const meta = $('meta[name="author"]').attr('content') || $('meta[property="article:author"]').attr('content');
    if (meta) return meta;
    return null;
  }

  extractTags($) {
    const selectors = ['.tags a', '.categories a', '.post-tags a', '[rel="tag"]', '.tag', '.category'];
    const s = new Set();
    for (const sel of selectors) {
      $(sel).each((i, el) => {
        const t = $(el).text().trim();
        if (t && t.length < 40) s.add(t);
      });
    }
    return Array.from(s).slice(0, 10);
  }

  extractFeaturedImage($, baseUrl) {
    const selectors = ['meta[property="og:image"]', 'meta[name="twitter:image"]', '.featured-image img', '.post-image img', 'article img'];
    for (const sel of selectors) {
      let url = '';
      if (sel.startsWith('meta')) url = $(sel).attr('content');
      else url = $(sel).first().attr('src');
      if (!url) continue;
      if (url.startsWith('//')) return 'https:' + url;
      if (url.startsWith('/')) {
        try {
          const u = new URL(baseUrl);
          return u.origin + url;
        } catch { return url; }
      }
      return url;
    }
    return null;
  }

  async scrapeAllSources(limit = 5) {
    const allItems = [];
    for (const src of this.sources) {
      const items = await this.scrapeRSSFeed(src);
      allItems.push(...items);
      await this.sleep(1000);
    }
    const sorted = allItems.sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate)).slice(0, limit);
    const results = [];
    for (const item of sorted) {
      const blog = await this.scrapeBlogPost(item);
      results.push(blog);
      await this.sleep();
    }
    return results;
  }

  async scrapeSpecificUrls(urls = []) {
    const results = [];
    for (const url of urls) {
      const item = { url, title: 'Loading...', source: 'Manual', category: 'custom' };
      const blog = await this.scrapeBlogPost(item);
      results.push(blog);
      await this.sleep();
    }
    return results;
  }

  async saveToFile(blogs, filename = 'scraped_blogs.json') {
    const dataDir = path.join(__dirname, '../../data');
    await fs.mkdir(dataDir, { recursive: true });
    const filepath = path.join(dataDir, filename);
    await fs.writeFile(filepath, JSON.stringify(blogs, null, 2));
    return filepath;
  }

  getSummary(blogs) {
    const total = blogs.length;
    const successful = blogs.filter(b => b.status === 'scraped').length;
    const failed = total - successful;
    const sources = [...new Set(blogs.map(b => b.source))];
    const categories = [...new Set(blogs.map(b => b.category))];
    const avgWords = Math.round(blogs.reduce((s, b) => s + (b.wordCount || 0), 0) / Math.max(1, blogs.length));
    return { total, successful, failed, sources, categories, avgWords, lastUpdated: new Date().toISOString() };
  }

  // --- Project integration helpers ---

  async getOrCreateScraperUser() {
    const email = 'scraper@thinkink.local';
    let user = await User.findOne({ email }).exec();
    if (user) return user;
    const hashed = await bcrypt.hash('ChangeMe123!', 10);
    user = new User({ username: 'Scraper Bot', email, password: hashed });
    await user.save();
    return user;
  }

  async saveBlogsToDB(blogs) {
    const author = await this.getOrCreateScraperUser();
    const results = { saved: 0, skipped: 0, errors: [] };
    for (const b of blogs) {
      try {
        const exists = await Post.findOne({ title: b.title }).exec();
        if (exists) { results.skipped++; continue; }
        const p = new Post({
          title: b.title,
          content: b.content || b.description || '',
          author: author._id,
          image: b.featuredImage || null
        });
        await p.save();
        results.saved++;
      } catch (err) {
        results.errors.push({ title: b.title, message: err.message });
      }
    }
    return results;
  }
}

export default BlogScraper;