import express from 'express';
import rateLimit from 'express-rate-limit';
import crypto from 'crypto';
import BlogScraper from '../scripts/scrapers/fetchBlogs.js';
import { protect } from '../middleware/authMiddleware.js';
import { cacheGet, cacheSet, cacheDelete, cacheDeleteByPattern, isRedisAvailable } from '../utils/redis.js';

const router = express.Router();

const scrapeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: 'Too many scraping requests, please wait 15 minutes' },
  standardHeaders: true,
  legacyHeaders: false
});

const readLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  message: { error: 'Too many requests, slow down' }
});

const scraper = new BlogScraper();

let recentResults = [];
let lastScrape = null;

router.get('/status', readLimiter, (req, res) => {
  res.json({
    success: true,
    status: 'operational',
    sources: scraper.sources.length,
    lastScrape,
    recent: recentResults.length
  });
});

router.get('/sources', readLimiter, (req, res) => {
  res.json({
    success: true,
    sources: scraper.sources.map(s => ({ name: s.name, category: s.category })),
    total: scraper.sources.length
  });
});

// Protected endpoint (only authenticated users can trigger)
router.post('/trending', protect, scrapeLimiter, async (req, res) => {
  try {
    const { limit = 10, sources = null, saveToDB = true, force = false } = req.body;
    if (limit > 50) return res.status(400).json({ success: false, error: 'Limit too high' });

    // 🔥 STEP 1: Check Redis cache for trending blogs
    // Create cache key based on limit and sources
    const sourcesKey = sources ? sources.sort().join(',') : 'all';
    const cacheKey = `scrape:trending:${limit}:${sourcesKey}`;
    
    if (!force && isRedisAvailable()) {
      const cachedBlogs = await cacheGet(cacheKey);
      if (cachedBlogs) {
        console.log(`✅ Trending blogs cache HIT for limit: ${limit}, sources: ${sourcesKey}`);
        return res.json({
          success: true,
          blogs: cachedBlogs.blogs,
          summary: cachedBlogs.summary,
          cached: true,
          cachedFrom: 'redis',
          meta: { cachedAt: cachedBlogs.cachedAt }
        });
      } else {
        console.log(`❌ Trending blogs cache MISS for limit: ${limit}, sources: ${sourcesKey}`);
      }
    }

    // Clear cache if force=true
    if (force && isRedisAvailable()) {
      await cacheDelete(cacheKey);
      console.log(`🗑️  Cache cleared for trending blogs (force refresh)`);
    }

    const originalSources = [...scraper.sources];
    if (sources && Array.isArray(sources)) {
      scraper.sources = scraper.sources.filter(s => sources.includes(s.name));
      if (scraper.sources.length === 0) { scraper.sources = originalSources; return res.status(400).json({ success: false, error: 'No valid sources' }); }
    }

    const start = Date.now();
    const blogs = await scraper.scrapeAllSources(limit);
    lastScrape = new Date().toISOString();
    recentResults = blogs;
    await scraper.saveToFile(blogs, `trending_${Date.now()}.json`);

    const summary = scraper.getSummary(blogs);
    let dbResult = null;
    if (saveToDB) dbResult = await scraper.saveBlogsToDB(blogs);

    // 🔥 STEP 2: Cache the scraped results in Redis (6 hours TTL)
    // Scraping is slow, so cache for 6 hours to avoid repeated scraping
    if (isRedisAvailable()) {
      await cacheSet(cacheKey, {
        blogs,
        summary,
        cachedAt: new Date().toISOString()
      }, 21600); // 6 hours
      console.log(`💾 Trending blogs cached in Redis for limit: ${limit}, sources: ${sourcesKey}`);
    }

    res.json({
      success: true,
      blogs,
      summary,
      dbResult,
      cached: false,
      meta: { durationMs: Date.now() - start }
    });
  } catch (err) {
    console.error('Trending scrape failed:', err);
    res.status(500).json({ success: false, error: 'Scraping failed', message: err.message });
  }
});

router.post('/urls', protect, scrapeLimiter, async (req, res) => {
  try {
    const { urls = [], saveToDB = true, force = false } = req.body;
    if (!Array.isArray(urls) || urls.length === 0) return res.status(400).json({ success: false, error: 'URLs required' });
    if (urls.length > 10) return res.status(400).json({ success: false, error: 'Max 10 URLs' });

    // 🔥 STEP 1: Check Redis cache for these specific URLs
    // Create cache key from URL hashes
    const urlsHash = crypto.createHash('sha256')
      .update(urls.sort().join('|'))
      .digest('hex')
      .substring(0, 16);
    const cacheKey = `scrape:urls:${urlsHash}`;

    if (!force && isRedisAvailable()) {
      const cachedBlogs = await cacheGet(cacheKey);
      if (cachedBlogs) {
        console.log(`✅ URL scrape cache HIT for URLs hash: ${urlsHash}`);
        return res.json({
          success: true,
          blogs: cachedBlogs.blogs,
          summary: cachedBlogs.summary,
          cached: true,
          cachedFrom: 'redis',
          meta: { cachedAt: cachedBlogs.cachedAt }
        });
      } else {
        console.log(`❌ URL scrape cache MISS for URLs hash: ${urlsHash}`);
      }
    }

    // Clear cache if force=true
    if (force && isRedisAvailable()) {
      await cacheDelete(cacheKey);
      console.log(`🗑️  Cache cleared for URL scrape (force refresh)`);
    }

    const blogs = await scraper.scrapeSpecificUrls(urls);
    await scraper.saveToFile(blogs, `custom_${Date.now()}.json`);
    const summary = scraper.getSummary(blogs);
    let dbResult = null;
    if (saveToDB) dbResult = await scraper.saveBlogsToDB(blogs);

    // 🔥 STEP 2: Cache the scraped URLs in Redis (12 hours TTL)
    // URLs don't change often, so cache longer
    if (isRedisAvailable()) {
      await cacheSet(cacheKey, {
        blogs,
        summary,
        cachedAt: new Date().toISOString()
      }, 43200); // 12 hours
      console.log(`💾 URL scrape cached in Redis for URLs hash: ${urlsHash}`);
    }

    res.json({
      success: true,
      blogs,
      summary,
      dbResult,
      cached: false
    });
  } catch (err) {
    console.error('Custom URLs scrape failed:', err);
    res.status(500).json({ success: false, error: 'Scraping failed', message: err.message });
  }
});

router.get('/recent', readLimiter, (req, res) => {
  res.json({ success: true, blogs: recentResults.slice(0, 10), total: recentResults.length, lastScrape });
});

router.post('/test', protect, scrapeLimiter, async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ success: false, error: 'URL required' });
    const blogs = await scraper.scrapeSpecificUrls([url]);
    res.json({ success: true, blog: blogs[0] });
  } catch (err) {
    console.error('Test scrape failed:', err);
    res.status(500).json({ success: false, error: 'Scraping failed', message: err.message });
  }
});

router.delete('/cache', protect, async (req, res) => {
  // Clear in-memory cache
  recentResults = [];
  lastScrape = null;
  
  // Clear Redis cache for scrape-related keys
  if (isRedisAvailable()) {
    const deleted = await cacheDeleteByPattern('scrape:*');
    return res.json({
      success: true,
      message: 'Cache cleared',
      redisKeysDeleted: deleted
    });
  }
  
  res.json({ success: true, message: 'Cache cleared (Redis not available)' });
});

export default router;