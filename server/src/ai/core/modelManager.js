import { SUPPORTED_MODELS } from '../config/models.config.js';
import { TASK_ROUTING } from '../config/providers.config.js';
import { cooldownManager } from './cooldownManager.js';
import { healthManager } from './healthManager.js';
import { logger } from '../utils/logger.js';

class ModelManager {
  
  getBestModel(taskCategory, provider) {
    const models = SUPPORTED_MODELS[provider]?.[taskCategory];
    
    if (!models || models.length === 0) {
      throw new Error(`No models configured for category '${taskCategory}' on provider '${provider}'`);
    }

    // Filter out cooled down models
    const availableModels = models.filter(m => !cooldownManager.isCooledDown(provider, m));
    
    if (availableModels.length === 0) {
      throw new Error(`All models for ${provider}:${taskCategory} are currently in cooldown.`);
    }

    // Sort by health (success rate) - just a simple optimization
    availableModels.sort((a, b) => {
      const hA = healthManager.getHealth(provider, a);
      const hB = healthManager.getHealth(provider, b);
      return hB.successRate - hA.successRate;
    });

    return availableModels[0]; // Return the healthiest available model
  }

  getProvidersForTask(taskType) {
    const routing = TASK_ROUTING[taskType];
    if (!routing) {
      return { 
        preferred: 'gemini', 
        fallback: 'groq',
        category: 'planning' 
      };
    }
    return {
      preferred: routing.preferredProvider,
      fallback: routing.fallbackProvider,
      category: routing.preferredCategory
    };
  }
}

export const modelManager = new ModelManager();
