export const PROVIDER_CONFIG = {
  gemini: {
    enabled: true,
    maxRetries: 3,
    cooldowns: {
      429: 60000, // 60s for rate limit
      503: 30000, // 30s for server overload
      timeout: 20000 // 20s for timeouts
    }
  },
  groq: {
    enabled: true,
    maxRetries: 3,
    cooldowns: {
      429: 60000,
      503: 30000,
      timeout: 20000
    }
  }
};

export const TASK_ROUTING = {
  planning: {
    preferredProvider: 'gemini',
    fallbackProvider: 'groq',
    preferredCategory: 'planning'
  },
  content: {
    preferredProvider: 'gemini',
    fallbackProvider: 'groq',
    preferredCategory: 'content'
  },
  code: {
    preferredProvider: 'groq',
    fallbackProvider: 'gemini',
    preferredCategory: 'code'
  },
  small: {
    preferredProvider: 'groq',
    fallbackProvider: 'gemini',
    preferredCategory: 'small'
  },
  reasoning: {
    preferredProvider: 'gemini',
    fallbackProvider: 'groq',
    preferredCategory: 'reasoning'
  }
};
