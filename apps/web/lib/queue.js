import { Queue } from 'bullmq';
import IORedis from 'ioredis';

// Create Redis connection
const connection = new IORedis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
  tls: {
    rejectUnauthorized: false
  },
  retryStrategy(times) {
    const delay = Math.min(times * 50, 2000);
    return delay;
  }
});

// Connection event handlers
connection.on('connect', () => {
  console.log('🔗 Redis connected');
});

connection.on('ready', () => {
  console.log('✅ Redis ready');
});

connection.on('error', (err) => {
  // Suppress NOPERM errors (Upstash free tier limitation)
  if (err.message && err.message.includes('NOPERM')) {
    return; // Silently ignore
  }
  console.error('❌ Redis connection error:', err.message);
});

// Create the queue with error handling
export const eventQueue = new Queue('webhook-events', {
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
    removeOnComplete: {
      count: 1000,
    },
    removeOnFail: {
      count: 5000,
    },
  },
});

// Suppress queue errors related to INFO command
eventQueue.on('error', (err) => {
  if (err.message && err.message.includes('NOPERM')) {
    return; // Silently ignore
  }
  console.error('Queue error:', err);
});

console.log('✅ Queue initialized');

export { connection };