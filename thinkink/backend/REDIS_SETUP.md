# Redis Setup Guide for ThinkInk

## Quick Setup (5 minutes)

### Option 1: Upstash Redis (Recommended - Free Tier)

1. **Sign up at [Upstash](https://upstash.com)**
   - Free tier: 256MB storage, 10,000 commands/day
   - No credit card required

2. **Create a Redis Database**
   - Click "Create Database"
   - Choose a name (e.g., "thinkink-cache")
   - Select region closest to your server
   - Click "Create"

3. **Get Connection String**
   - Copy the "Redis REST URL" or "Redis URL"
   - Format: `redis://default:password@host:port`

4. **Add to Environment Variables**
   ```bash
   # In backend/.env file
   REDIS_URL=redis://default:your-password@your-host:6379
   ```

### Option 2: Redis Cloud (Free Tier)

1. **Sign up at [Redis Cloud](https://redis.com/cloud/)**
   - Free tier: 30MB storage

2. **Create Database**
   - Follow setup wizard
   - Get connection string

3. **Add to Environment Variables**
   ```bash
   REDISCLOUD_URL=redis://default:password@host:port
   ```

### Option 3: Local Redis (Development Only)

**For Windows:**
1. Download Redis from [Memurai](https://www.memurai.com/get-memurai) (Redis for Windows)
2. Install and start Memurai
3. Use: `REDIS_URL=redis://localhost:6379`

**For Mac/Linux:**
```bash
# Install Redis
brew install redis  # Mac
# or
sudo apt-get install redis-server  # Linux

# Start Redis
redis-server

# Use default connection
REDIS_URL=redis://localhost:6379
```

## Verification

After adding `REDIS_URL` to your `.env` file:

1. **Restart your backend server**
   ```bash
   cd backend
   npm run dev
   ```

2. **Check server logs** - You should see:
   ```
   ✅ Redis: Connected and ready
   ```

3. **Test caching** - Make an API request that uses caching:
   ```bash
   # First request (cache miss - slower)
   curl http://localhost:5000/api/ai/generate -H "Content-Type: application/json" -d '{"prompt":"Hello"}'
   
   # Second request (cache hit - instant!)
   curl http://localhost:5000/api/ai/generate -H "Content-Type: application/json" -d '{"prompt":"Hello"}'
   ```

## What Gets Cached?

1. **Post Summaries** (24 hours TTL)
   - Key: `post:summary:{postId}`
   - Cached after first generation

2. **AI-Generated Content** (6 hours TTL)
   - Key: `ai:generate:{promptHash}`
   - Cached based on exact prompt match

3. **Scraped Blog Posts** (6-12 hours TTL)
   - Key: `scrape:trending:{limit}:{sources}`
   - Key: `scrape:urls:{urlsHash}`
   - Reduces redundant scraping

## Cache Management

### View Cache Stats
Redis automatically manages memory. With 30MB:
- ~60,000-150,000 summaries
- ~6,000-30,000 AI responses
- ~600-6,000 scraped posts

### Clear Cache Manually
```bash
# Clear all scrape cache
DELETE /api/scrape/cache

# Force regenerate specific data
POST /api/ai/summarize
{ "postId": "123", "force": true }
```

### Monitor Cache Size
Most Redis cloud providers offer dashboards showing:
- Memory usage
- Number of keys
- Commands per second

## Troubleshooting

### "Redis URL not provided" Warning
- **Solution**: Add `REDIS_URL` to your `.env` file
- **Note**: App works without Redis, just without caching

### Connection Failed
- **Check**: Redis URL format is correct
- **Check**: Redis server is running (if local)
- **Check**: Firewall allows connection (cloud Redis)
- **Note**: App will continue working, just log warnings

### Memory Limit Reached
- **Solution**: Redis automatically evicts old data (LRU policy)
- **Solution**: Reduce TTL values in code if needed
- **Solution**: Upgrade to larger Redis plan

### Cache Not Working
1. Check Redis is connected (server logs)
2. Verify `REDIS_URL` is set correctly
3. Check if cache key exists: Use Redis CLI or provider dashboard
4. Verify TTL hasn't expired

## Cost Estimate (Free Tier)

With **30MB Redis** and typical usage:
- **Summaries**: 500 bytes × 1000 posts = 500KB
- **AI Content**: 2KB × 500 responses = 1MB
- **Scraped Posts**: 30KB × 100 posts = 3MB
- **Total**: ~4.5MB (well under 30MB limit!)

**Free tier is sufficient for small-medium projects!** 🎉

## Production Deployment

When deploying to production (Render, Railway, etc.):

1. **Get Redis URL** from your cloud provider
2. **Add as environment variable** in your hosting platform
3. **Restart server** - Redis will auto-connect
4. **Monitor usage** in Redis provider dashboard

That's it! Your app now has blazing-fast caching! 🚀
