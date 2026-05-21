export { executePlanningTask as planWebsiteStructure } from './tasks/planning.task.js';
export { executeCodeTask as generateReactCode } from './tasks/code.task.js';
export { aiRouter } from './core/router.js';

// Also export an equivalent of the old enhanceUserPrompt but integrated with the router
export const enhanceUserPrompt = async (rawPrompt) => {
  const systemPrompt = `You are an elite AI Prompt Engineer. Your job is to take the user's raw, potentially brief or vague request for a website/UI and expand it into a highly detailed, professional, and effective prompt.
Rules:
1. Make the prompt descriptive, mentioning modern UI trends.
2. Keep it focused on frontend UI/UX design.
3. Return ONLY the enhanced prompt text.`;

  // Use the 'small' task category which routes to fast/cheap models
  const { aiRouter } = await import('./core/router.js');
  const enhanced = await aiRouter.executeTask('small', rawPrompt, systemPrompt, 'text');
  return enhanced;
};
