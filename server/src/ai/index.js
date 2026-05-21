export { executePlanningTask as planWebsiteStructure } from './tasks/planning.task.js';
export { executeEditTask as editWebsiteCode } from './tasks/edit.task.js';

export { aiRouter } from './core/router.js';

// Also export an equivalent of the old enhanceUserPrompt but integrated with the router
export const enhanceUserPrompt = async (rawPrompt) => {
  const systemPrompt = `You are an elite AI Prompt Engineer for a premium website builder. Your job is to take the user's raw, potentially brief or vague request for a website/UI and expand it into a highly detailed, breathtaking, and effective prompt.
Rules:
1. Make the prompt highly descriptive, mentioning premium modern UI trends like glassmorphism, dark mode, vibrant glowing gradients, and subtle micro-animations.
2. Recommend specific, relevant sections (e.g., Hero, Features, Pricing, Testimonials, Portfolio, Contact, Footer) based on the user's core intent.
3. Keep it focused purely on frontend UI/UX design and aesthetics.
4. Do NOT wrap the response in quotes. Return ONLY the enhanced prompt text, nothing else.`;

  // Use the 'small' task category which routes to fast/cheap models
  const { aiRouter } = await import('./core/router.js');
  const enhanced = await aiRouter.executeTask('small', rawPrompt, systemPrompt, 'text');
  return enhanced;
};
