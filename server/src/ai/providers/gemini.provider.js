import { GoogleGenAI } from '@google/genai';

class GeminiProvider {
  
  async generate(apiKey, model, prompt, systemInstruction = null, responseFormat = 'text') {
    const ai = new GoogleGenAI({ apiKey });
    
    const config = {
      temperature: 0.3,
    };
    
    if (systemInstruction) {
      config.systemInstruction = systemInstruction;
    }
    
    if (responseFormat === 'json_object') {
      config.responseMimeType = 'application/json';
    }

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: config
    });

    return response.text;
  }
}

export const geminiProvider = new GeminiProvider();
