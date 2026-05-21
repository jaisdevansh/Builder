import { MODEL_MAX_TOKENS } from '../config/models.config.js';

class TokenManager {
  
  optimizeTokens(prompt, model) {
    const maxTokens = MODEL_MAX_TOKENS[model] || 4000;
    
    // Very simple optimization: if prompt is extremely large, compress it.
    // In a real production system, you might use a tokenizer library here like 'tiktoken'
    const approxTokens = prompt.length / 4; 
    
    let optimizedPrompt = prompt;
    if (approxTokens > maxTokens * 0.8) {
      // Truncate keeping the most important parts
      const charsToKeep = (maxTokens * 0.8) * 4;
      optimizedPrompt = prompt.substring(0, charsToKeep) + '\n\n[Prompt truncated for token optimization]';
    }
    
    return {
      prompt: optimizedPrompt,
      maxOutputTokens: Math.floor(maxTokens * 0.5) // Reserve 50% for output
    };
  }
}

export const tokenManager = new TokenManager();
