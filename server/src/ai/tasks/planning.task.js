import { aiRouter } from '../core/router.js';
import { tokenManager } from '../core/tokenManager.js';

export const executePlanningTask = async (prompt) => {
  const systemPrompt = `You are an elite React UI/UX architect.
Your job is to analyze the user's request for a website and break it down into a JSON structure of specific, premium, interactive UI components.

Allowed Components: ["Navbar", "Hero", "Features", "Portfolio", "Pricing", "Testimonials", "Contact", "Footer"]

Rules:
- theme = "dark" or "light" only.
- Generate 4 to 7 components from the allowed list. Do NOT use any other component names. Always include Navbar at the start and Footer at the end.
- Include a Portfolio section if the user describes showing projects, editing, designs, or art.
- Include a Pricing section if they mention rates, pricing, payment, or packages.
- Provide sensible, rich, engaging copy for the props based on the user's request.
- For ANY image URL (bgImageUrl, imageUrl, avatar), you MUST use a working image from picsum.photos (e.g., "https://picsum.photos/seed/bg1/1920/1080" for backgrounds, "https://picsum.photos/seed/port1/800/600" for portfolio items, "https://picsum.photos/seed/av1/150/150" for avatars). NEVER leave them empty ("") or use fake placeholder text.
- Return ONLY valid JSON with this exact structure:
{
  "projectName": "string",
  "theme": "dark" | "light",
  "sections": [
    { 
      "type": "Navbar", 
      "props": { "logo": "string", "links": ["string"] } 
    },
    { 
      "type": "Hero", 
      "props": { 
        "title": "string", 
        "subtitle": "string", 
        "ctaText": "string",
        "badgeText": "string",
        "bgImageUrl": "string"
      } 
    },
    {
      "type": "Portfolio",
      "props": {
        "title": "string",
        "subtitle": "string",
        "projects": [
          { "title": "string", "description": "string", "category": "string", "imageUrl": "string", "duration": "string" }
        ]
      }
    },
    {
      "type": "Features",
      "props": {
        "title": "string",
        "subtitle": "string",
        "features": [
          { "title": "string", "description": "string" }
        ]
      }
    },
    {
      "type": "Pricing",
      "props": {
        "title": "string",
        "subtitle": "string",
        "plans": [
          { "name": "string", "price": "string", "yearlyPrice": "string", "features": ["string"], "popular": true/false, "ctaText": "string" }
        ]
      }
    },
    {
      "type": "Testimonials",
      "props": {
        "title": "string",
        "subtitle": "string",
        "reviews": [
          { "name": "string", "role": "string", "comment": "string", "rating": 5, "avatar": "string" }
        ]
      }
    },
    {
      "type": "Contact",
      "props": {
        "title": "string",
        "subtitle": "string",
        "email": "string",
        "phone": "string",
        "buttonText": "string"
      }
    },
    {
      "type": "Footer",
      "props": {
        "logo": "string",
        "text": "string"
      }
    }
  ]
}`;

  // Simple optimization if needed
  const { prompt: optimizedPrompt } = tokenManager.optimizeTokens(prompt, 'gemini-2.5-flash-lite');

  const responseText = await aiRouter.executeTask('planning', optimizedPrompt, systemPrompt, 'json_object');
  
  let parsed;
  try {
    parsed = JSON.parse(responseText);
  } catch (e) {
    throw new Error('Failed to parse AI planning response as JSON');
  }

  if (!parsed.projectName || !parsed.theme || !Array.isArray(parsed.sections)) {
    throw new Error('Invalid JSON structure from AI planning');
  }

  return parsed;
};
