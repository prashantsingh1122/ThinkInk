import cron from 'node-cron';
import BlogScraper from '../scripts/scrapers/fetchBlogs.js';

const scheduled = new Map();
const DEFAULT_SCHEDULE = '0 */6 * * *'; // every 6 hours

export function startScrapeScheduler(schedule = DEFAULT_SCHEDULE, options = {}) {
  if (scheduled.has('scrape')) return;
  const scraper = new BlogScraper();

  console.log('Starting scraper scheduler with cron:', schedule);
  const job = cron.schedule(schedule, async () => {
    console.log('Scheduled scraper running at', new Date().toISOString());
    try {
      const blogs = await scraper.scrapeAllSources(options.limit || 15);
      await scraper.saveToFile(blogs, `scheduled_${Date.now()}.json`);
      if (options.saveToDB) await scraper.saveBlogsToDB(blogs);
      console.log('Scheduled scrape finished, items:', blogs.length);
    } catch (err) {
      console.error('Scheduled scrape failed:', err);
    }
  }, { scheduled: true, timezone: 'UTC' });

  scheduled.set('scrape', job);
  return job;
}

export function stopScrapeScheduler() {
  const job = scheduled.get('scrape');
  if (job) { job.stop(); scheduled.delete('scrape'); }
}