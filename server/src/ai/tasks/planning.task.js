import { aiRouter } from '../core/router.js';
import { tokenManager } from '../core/tokenManager.js';

export const executePlanningTask = async (prompt) => {
  const systemPrompt = `You are an elite React UI/UX architect.
Your job is to analyze the user's request for a website and break it down into a JSON structure of specific, premium UI components.
Provide extremely detailed descriptions for each component.

Rules:
- theme = "dark" or "light" only
- Generate exactly 4 to 5 components (e.g. Navbar, HeroSection, FeaturesSection, Testimonials/Pricing, Footer).
- Component names must be in PascalCase with no spaces (e.g. HeroSection).
- Return ONLY valid JSON with this exact structure:
{
  "projectName": "string",
  "theme": "dark" or "light",
  "components": [
    { "name": "ComponentName", "description": "detailed description" }
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

  if (!parsed.projectName || !parsed.theme || !Array.isArray(parsed.components)) {
    throw new Error('Invalid JSON structure from AI planning');
  }

  return parsed;
};
