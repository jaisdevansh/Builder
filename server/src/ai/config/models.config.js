export const SUPPORTED_MODELS = {
  gemini: {
    planning: [
      'gemini-2.5-flash-lite',
      'gemini-2.0-flash-lite',
      'gemini-flash-lite-latest',
      'gemini-2.5-pro'
    ],
    content: [
      'gemini-2.5-flash-lite',
      'gemini-2.0-flash-lite'
    ],
    reasoning: [
      'gemini-2.5-pro'
    ]
  },
  groq: {
    planning: [
      'llama-3.3-70b-versatile',
      'qwen/qwen3-32b',
      'groq/compound-mini'
    ],
    code: [
      'llama-3.3-70b-versatile',
      'qwen/qwen3-32b'
    ],
    small: [
      'llama-3.1-8b-instant'
    ]
  }
};

export const MODEL_MAX_TOKENS = {
  'gemini-2.5-flash-lite': 4000,
  'gemini-2.0-flash-lite': 4000,
  'gemini-flash-lite-latest': 4000,
  'gemini-2.5-pro': 8000,
  'llama-3.3-70b-versatile': 6000,
  'llama-3.1-8b-instant': 4000,
  'qwen/qwen3-32b': 6000,
  'groq/compound-mini': 4000
};
