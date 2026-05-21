export const logger = {
  info: (context, message) => {
    console.log(`[AI Orchestrator INFO] ${message}`, context ? JSON.stringify(context) : '');
  },
  warn: (context, message) => {
    console.warn(`[AI Orchestrator WARN] ⚠️ ${message}`, context ? JSON.stringify(context) : '');
  },
  error: (context, message, error) => {
    console.error(`[AI Orchestrator ERROR] ❌ ${message}`, context ? JSON.stringify(context) : '', error?.message || error);
  },
  debug: (context, message) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[AI Orchestrator DEBUG] 🐛 ${message}`, context ? JSON.stringify(context) : '');
    }
  }
};
