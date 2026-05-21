import { PROVIDER_CONFIG } from '../config/providers.config.js';
import { logger } from '../utils/logger.js';

class CooldownManager {
  constructor() {
    this.cooldowns = new Map(); // 'provider:model' -> expirationTimeMs
  }

  markCooldown(provider, model, errorStatus) {
    const config = PROVIDER_CONFIG[provider];
    if (!config) return;

    const duration = config.cooldowns[errorStatus] || config.cooldowns.timeout || 30000;
    const expiration = Date.now() + duration;
    
    const key = `${provider}:${model}`;
    this.cooldowns.set(key, expiration);
    
    logger.warn({ provider, model, duration, errorStatus }, 'Model placed in cooldown');
  }

  isCooledDown(provider, model) {
    const key = `${provider}:${model}`;
    const expiration = this.cooldowns.get(key);
    
    if (!expiration) return false;
    
    if (Date.now() > expiration) {
      this.cooldowns.delete(key);
      return false;
    }
    
    return true;
  }
}

export const cooldownManager = new CooldownManager();
