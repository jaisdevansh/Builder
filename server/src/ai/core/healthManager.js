import { logger } from '../utils/logger.js';

class HealthManager {
  constructor() {
    this.stats = new Map(); // 'provider:model' -> { successes, failures, totalLatency, reqCount }
  }

  _initStats(key) {
    if (!this.stats.has(key)) {
      this.stats.set(key, { successes: 0, failures: 0, totalLatency: 0, reqCount: 0 });
    }
  }

  recordSuccess(provider, model, latencyMs) {
    const key = `${provider}:${model}`;
    this._initStats(key);
    const s = this.stats.get(key);
    s.successes++;
    s.reqCount++;
    s.totalLatency += latencyMs;
  }

  recordFailure(provider, model) {
    const key = `${provider}:${model}`;
    this._initStats(key);
    this.stats.get(key).failures++;
  }

  getHealth(provider, model) {
    const key = `${provider}:${model}`;
    const s = this.stats.get(key);
    if (!s || s.reqCount === 0) return { successRate: 1, avgLatency: 0 };
    
    return {
      successRate: s.successes / (s.successes + s.failures),
      avgLatency: s.totalLatency / s.reqCount
    };
  }
}

export const healthManager = new HealthManager();
