import Groq from 'groq-sdk';

class GroqProvider {
  
  async generate(apiKey, model, prompt, systemInstruction = null, responseFormat = 'text') {
    const groq = new Groq({ apiKey });
    
    const messages = [];
    if (systemInstruction) {
      messages.push({ role: 'system', content: systemInstruction });
    }
    messages.push({ role: 'user', content: prompt });
    
    const config = {
      messages,
      model,
      temperature: 0.3,
    };
    
    if (responseFormat === 'json_object') {
      config.response_format = { type: 'json_object' };
    }

    const response = await groq.chat.completions.create(config);

    return response.choices[0]?.message?.content || '';
  }
}

export const groqProvider = new GroqProvider();
