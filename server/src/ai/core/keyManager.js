import { logger } from '../utils/logger.js';

class KeyManager {
  constructor() {
    this.keys = {
      gemini: [],
      groq: []
    };
    this.currentIndex = { gemini: 0, groq: 0 };
    this.exhaustedKeys = new Map(); // key -> expiration time
  }

  loadKeys() {
    // Load Gemini keys
    for (let i = 1; i <= 10; i++) {
      const k = process.env[`GEMINI_API_KEY_${i}`];
      if (k) this.keys.gemini.push(k);
    }
    // Fallback to singular key if array is empty
    if (this.keys.gemini.length === 0 && process.env.GEMINI_API_KEY) {
      this.keys.gemini.push(process.env.GEMINI_API_KEY);
    }

    // Load Groq keys
    for (let i = 1; i <= 10; i++) {
      const k = process.env[`GROQ_API_KEY_${i}`];
      if (k) this.keys.groq.push(k);
    }
    if (this.keys.groq.length === 0 && process.env.GROQ_API_KEY) {
      this.keys.groq.push(process.env.GROQ_API_KEY);
    }

    logger.info({ geminiKeys: this.keys.gemini.length, groqKeys: this.keys.groq.length }, 'API Keys loaded');
  }

  getNextKey(provider) {
    const providerKeys = this.keys[provider];
    if (!providerKeys || providerKeys.length === 0) {
      throw new Error(`No API keys configured for provider: ${provider}`);
    }

    const now = Date.now();
    let attempts = 0;

    while (attempts < providerKeys.length) {
      const key = providerKeys[this.currentIndex[provider]];
      this.currentIndex[provider] = (this.currentIndex[provider] + 1) % providerKeys.length;

      const expiration = this.exhaustedKeys.get(key);
      if (!expiration || now > expiration) {
        if (expiration) this.exhaustedKeys.delete(key);
        return key;
      }

      attempts++;
    }

    throw new Error(`All keys for ${provider} are currently in cooldown/exhausted.`);
  }

  markKeyExhausted(key, durationMs = 60000) {
    this.exhaustedKeys.set(key, Date.now() + durationMs);
    logger.warn({ keyPrefix: key.substring(0, 8), durationMs }, 'API Key marked as exhausted/cooldown');
  }
}

export const keyManager = new KeyManager();
