import PQueue from 'p-queue';
import { logger } from '../utils/logger.js';

class QueueManager {
  constructor() {
    // Limits overall concurrency to avoid hitting rate limits too quickly
    // 10 concurrent requests at maximum
    this.queue = new PQueue({ concurrency: 10, intervalCap: 15, interval: 60000 });
    
    this.queue.on('active', () => {
      logger.debug({ size: this.queue.size, pending: this.queue.pending }, 'Queue task started');
    });
  }

  async enqueue(operation, priority = 0) {
    return this.queue.add(operation, { priority });
  }
}

export const queueManager = new QueueManager();
