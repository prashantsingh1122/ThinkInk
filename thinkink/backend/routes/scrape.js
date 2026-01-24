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

    // 1) Cache key: same limit + same sources = same cache entry
    const sourcesKey = sources && Array.isArray(sources) ? sources.slice().sort().join(',') : 'all';
    const cacheKey = `scrape:trending:${limit}:${sourcesKey}`;

    // 2) Try Redis first (unless force refresh)
    if (!force && isRedisAvailable()) {
      const cached = await cacheGet(cacheKey);
      if (cached && Array.isArray(cached.blogs)) {
        console.log('✅ Scrape cache HIT:', cacheKey);
        return res.json({
          success: true,
          blogs: cached.blogs,
          summary: cached.summary,
          cached: true,
          cachedAt: cached.cachedAt,
          meta: { fromCache: true }
        });
      }
    }
    if (force && isRedisAvailable()) {
      await cacheDelete(cacheKey);
      console.log('🗑️ Scrape cache cleared (force):', cacheKey);
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

    // 3) Store in Redis for next time (TTL 6 hours)
    if (isRedisAvailable()) {
      await cacheSet(cacheKey, {
        blogs,
        summary,
        cachedAt: new Date().toISOString()
      }, 6 * 60 * 60); // 21600
      console.log('💾 Scrape cached in Redis:', cacheKey);
    }

    res.json({ success: true, blogs, summary, dbResult, meta: { durationMs: Date.now() - start } });
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

    // 1) Cache key: hash of sorted URLs so same URLs = same cache
    const urlsHash = crypto.createHash('sha256').update([...urls].sort().join('|')).digest('hex').slice(0, 16);
    const cacheKey = `scrape:urls:${urlsHash}`;

    // 2) Try Redis first (unless force)
    if (!force && isRedisAvailable()) {
      const cached = await cacheGet(cacheKey);
      if (cached && Array.isArray(cached.blogs)) {
        console.log('✅ Scrape URLs cache HIT:', cacheKey);
        return res.json({
          success: true,
          blogs: cached.blogs,
          summary: cached.summary,
          cached: true,
          cachedAt: cached.cachedAt,
          meta: { fromCache: true }
        });
      }
    }
    if (force && isRedisAvailable()) {
      await cacheDelete(cacheKey);
      console.log('🗑️ Scrape URLs cache cleared (force):', cacheKey);
    }

    const blogs = await scraper.scrapeSpecificUrls(urls);
    await scraper.saveToFile(blogs, `custom_${Date.now()}.json`);
    const summary = scraper.getSummary(blogs);
    let dbResult = null;
    if (saveToDB) dbResult = await scraper.saveBlogsToDB(blogs);

    // 3) Store in Redis (TTL 12 hours; URLs change less often)
    if (isRedisAvailable()) {
      await cacheSet(cacheKey, {
        blogs,
        summary,
        cachedAt: new Date().toISOString()
      }, 12 * 60 * 60); // 43200
      console.log('💾 Scrape URLs cached in Redis:', cacheKey);
    }

    res.json({ success: true, blogs, summary, dbResult });
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
  recentResults = [];
  lastScrape = null;

  let redisDeleted = 0;
  if (isRedisAvailable()) {
    redisDeleted = await cacheDeleteByPattern('scrape:*');
    if (redisDeleted > 0) console.log('🗑️ Redis scrape cache cleared, keys:', redisDeleted);
  }

  res.json({
    success: true,
    message: 'Cache cleared',
    redisKeysDeleted: redisDeleted
  });
});

export default router;