import Redis from 'ioredis';
import dotenv from 'dotenv';
dotenv.config();

// Graceful fallback logic so the server doesn't crash if Redis is offline during dev
const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

const redis = new Redis(redisUrl, {
  retryStrategy(times) {
    const delay = Math.min(times * 50, 2000);
    // Stop retrying after 5 attempts to allow graceful degradation
    if (times > 5) {
      console.warn("⚠️ Redis connection failed. Proceeding with in-memory fallback/no-cache.");
      return null; 
    }
    return delay;
  },
});

redis.on('error', (err) => {
  // Silent fail to prevent constant log spam in development
});

export const getCache = async (key) => {
  if (redis.status !== 'ready') return null;
  try {
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    return null;
  }
};

export const setCache = async (key, value, expirySeconds = 3600) => {
  if (redis.status !== 'ready') return;
  try {
    await redis.set(key, JSON.stringify(value), 'EX', expirySeconds);
  } catch (e) {}
};

export default redis;
