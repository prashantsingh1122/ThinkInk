// Redis Client Utility
// This file handles Redis connection and provides helper functions for caching

import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

let redisClient = null;
let isConnected = false;

/**
 * Initialize Redis client connection
 * Handles both local and cloud Redis instances
 */
export async function initRedis() {
  // Skip if Redis URL is not provided (optional for development)
  const redisUrl = process.env.REDIS_URL || process.env.REDISCLOUD_URL;
  
  if (!redisUrl) {
    console.log('⚠️  Redis URL not provided. Caching will be disabled.');
    console.log('   Set REDIS_URL in your .env file to enable caching.');
    return null;
  }

  try {
    // Create Redis client
    redisClient = createClient({
      url: redisUrl,
      socket: {
        reconnectStrategy: (retries) => {
          // Reconnect strategy: wait longer between retries
          if (retries > 10) {
            console.error('❌ Redis: Too many reconnection attempts');
            return new Error('Redis connection failed');
          }
          return Math.min(retries * 100, 3000); // Max 3 seconds between retries
        }
      }
    });

    // Handle connection events
    redisClient.on('error', (err) => {
      console.error('❌ Redis Client Error:', err.message);
      isConnected = false;
    });

    redisClient.on('connect', () => {
      console.log('🔄 Redis: Connecting...');
    });

    redisClient.on('ready', () => {
      console.log('✅ Redis: Connected and ready');
      isConnected = true;
    });

    redisClient.on('reconnecting', () => {
      console.log('🔄 Redis: Reconnecting...');
      isConnected = false;
    });

    // Connect to Redis
    await redisClient.connect();
    
    return redisClient;
  } catch (error) {
    console.error('❌ Redis Connection Failed:', error.message);
    console.log('⚠️  Continuing without Redis cache. App will still work, just without caching.');
    redisClient = null;
    isConnected = false;
    return null;
  }
}

/**
 * Get Redis client instance
 * Returns null if Redis is not available
 */
export function getRedisClient() {
  return redisClient && isConnected ? redisClient : null;
}

/**
 * Check if Redis is available
 */
export function isRedisAvailable() {
  return redisClient !== null && isConnected;
}

/**
 * Generic cache get function
 * @param {string} key - Cache key
 * @returns {Promise<any|null>} - Cached value or null if not found
 */
export async function cacheGet(key) {
  const client = getRedisClient();
  if (!client) return null;

  try {
    const value = await client.get(key);
    if (value) {
      // Try to parse as JSON, fallback to string
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    }
    return null;
  } catch (error) {
    console.error(`Redis GET error for key "${key}":`, error.message);
    return null; // Fail gracefully
  }
}

/**
 * Generic cache set function with TTL
 * @param {string} key - Cache key
 * @param {any} value - Value to cache (will be JSON stringified)
 * @param {number} ttlSeconds - Time to live in seconds (default: 1 hour)
 * @returns {Promise<boolean>} - Success status
 */
export async function cacheSet(key, value, ttlSeconds = 3600) {
  const client = getRedisClient();
  if (!client) return false;

  try {
    // Convert value to string
    const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
    
    // Set with expiration time (TTL)
    await client.setEx(key, ttlSeconds, stringValue);
    return true;
  } catch (error) {
    console.error(`Redis SET error for key "${key}":`, error.message);
    return false; // Fail gracefully
  }
}

/**
 * Delete a specific cache key
 * @param {string} key - Cache key to delete
 * @returns {Promise<boolean>} - Success status
 */
export async function cacheDelete(key) {
  const client = getRedisClient();
  if (!client) return false;

  try {
    await client.del(key);
    return true;
  } catch (error) {
    console.error(`Redis DELETE error for key "${key}":`, error.message);
    return false;
  }
}

/**
 * Delete multiple cache keys by pattern
 * @param {string} pattern - Pattern to match (e.g., "post:summary:*")
 * @returns {Promise<number>} - Number of keys deleted
 */
export async function cacheDeleteByPattern(pattern) {
  const client = getRedisClient();
  if (!client) return 0;

  try {
    const keys = await client.keys(pattern);
    if (keys.length === 0) return 0;
    
    return await client.del(keys);
  } catch (error) {
    console.error(`Redis DELETE pattern error for "${pattern}":`, error.message);
    return 0;
  }
}

/**
 * Get cache statistics (useful for monitoring)
 * @returns {Promise<object>} - Cache stats
 */
export async function getCacheStats() {
  const client = getRedisClient();
  if (!client) {
    return { available: false, message: 'Redis not available' };
  }

  try {
    const info = await client.info('memory');
    const keys = await client.dbSize();
    
    return {
      available: true,
      connected: isConnected,
      keysCount: keys,
      info: info
    };
  } catch (error) {
    return {
      available: true,
      connected: false,
      error: error.message
    };
  }
}

/**
 * Close Redis connection (useful for graceful shutdown)
 */
export async function closeRedis() {
  if (redisClient && isConnected) {
    try {
      await redisClient.quit();
      console.log('✅ Redis: Connection closed');
      isConnected = false;
    } catch (error) {
      console.error('❌ Redis: Error closing connection:', error.message);
    }
  }
}

// Export default client getter for direct access (advanced usage)
export default {
  initRedis,
  getRedisClient,
  isRedisAvailable,
  cacheGet,
  cacheSet,
  cacheDelete,
  cacheDeleteByPattern,
  getCacheStats,
  closeRedis
};

