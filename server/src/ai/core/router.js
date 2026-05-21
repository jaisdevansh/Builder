import { keyManager } from './keyManager.js';
import { modelManager } from './modelManager.js';
import { queueManager } from './queueManager.js';
import { retryManager } from './retryManager.js';
import { healthManager } from './healthManager.js';
import { cooldownManager } from './cooldownManager.js';
import { geminiProvider } from '../providers/gemini.provider.js';
import { groqProvider } from '../providers/groq.provider.js';
import { logger } from '../utils/logger.js';

class AIRouter {
  
  constructor() {
    // Make sure keys are loaded
    keyManager.loadKeys();
  }

  async executeTask(taskType, prompt, systemInstruction = null, responseFormat = 'text') {
    return queueManager.enqueue(async () => {
      
      const routing = modelManager.getProvidersForTask(taskType);
      
      // Try preferred provider
      try {
        return await this._executeWithProvider(routing.preferred, routing.category, prompt, systemInstruction, responseFormat);
      } catch (preferredError) {
        logger.warn({ preferred: routing.preferred, fallback: routing.fallback, error: preferredError.message }, 'Preferred provider failed, attempting fallback');
        
        // Try fallback provider
        return await this._executeWithProvider(routing.fallback, routing.category, prompt, systemInstruction, responseFormat);
      }
      
    });
  }

  async _executeWithProvider(providerName, taskCategory, prompt, systemInstruction, responseFormat) {
    return retryManager.withRetry(providerName, async () => {
      const model = modelManager.getBestModel(taskCategory, providerName);
      const apiKey = keyManager.getNextKey(providerName);
      
      const startTime = Date.now();
      logger.info({ providerName, model, responseFormat }, 'Executing AI request');

      try {
        let responseText;
        if (providerName === 'gemini') {
          responseText = await geminiProvider.generate(apiKey, model, prompt, systemInstruction, responseFormat);
        } else if (providerName === 'groq') {
          responseText = await groqProvider.generate(apiKey, model, prompt, systemInstruction, responseFormat);
        } else {
          throw new Error(`Unsupported provider: ${providerName}`);
        }

        const latency = Date.now() - startTime;
        healthManager.recordSuccess(providerName, model, latency);
        
        return responseText;
        
      } catch (error) {
        healthManager.recordFailure(providerName, model);
        
        // Check for rate limit or quota
        const isQuota = error.status === 429 || error.message?.includes('429');
        const isTimeout = error.status === 503 || error.message?.toLowerCase().includes('timeout');
        
        if (isQuota) {
          cooldownManager.markCooldown(providerName, model, 429);
          // Also exhaust the key
          keyManager.markKeyExhausted(apiKey, 60000); 
        } else if (isTimeout) {
          cooldownManager.markCooldown(providerName, model, 503);
        }

        throw error;
      }
    });
  }
}

export const aiRouter = new AIRouter();
