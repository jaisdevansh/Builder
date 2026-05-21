import { sleep } from '../utils/sleep.js';
import { logger } from '../utils/logger.js';
import { PROVIDER_CONFIG } from '../config/providers.config.js';

class RetryManager {
  
  async withRetry(provider, operation) {
    const config = PROVIDER_CONFIG[provider];
    const maxRetries = config ? config.maxRetries : 3;
    let attempt = 1;
    let baseDelay = 1000;

    while (attempt <= maxRetries) {
      try {
        return await operation();
      } catch (error) {
        // Determine if error is retryable
        const isRateLimit = error.status === 429 || error.message?.includes('429');
        const isServerOverload = error.status === 503 || error.status === 502 || error.message?.includes('503');
        const isTimeout = error.message?.toLowerCase().includes('timeout') || error.code === 'ECONNABORTED';

        if (!isRateLimit && !isServerOverload && !isTimeout) {
          // Not a retryable error (e.g. Invalid API key, Bad Request)
          logger.error({ provider, attempt }, 'Non-retryable error encountered', error);
          throw error;
        }

        if (attempt === maxRetries) {
          logger.error({ provider, attempt }, 'Max retries reached', error);
          throw error;
        }

        // Calculate exponential backoff with jitter
        const jitter = Math.random() * 500;
        const delayMs = isRateLimit ? 5000 * attempt : baseDelay * Math.pow(2, attempt - 1) + jitter;
        
        logger.warn({ provider, attempt, delayMs, error: error.message }, 'Retryable error, backing off...');
        await sleep(delayMs);
        
        attempt++;
      }
    }
  }
}

export const retryManager = new RetryManager();
