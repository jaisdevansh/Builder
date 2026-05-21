import { aiRouter } from '../core/router.js';
import { tokenManager } from '../core/tokenManager.js';

export const executeEditTask = async (prompt, currentCode) => {
  const systemPrompt = `You are an elite React UI/UX architect and frontend developer.
The user wants to iteratively modify an existing React component file.

You will receive:
1. The user's prompt describing the desired changes.
2. The current complete code of the file.

Rules:
- Apply the user's requested changes to the code.
- Ensure the final code is robust, syntactically correct, and uses Tailwind CSS.
- If the user asks to add an image/video, use realistic "picsum.photos" URLs or other working placeholder URLs, unless they provide a specific URL.
- NEVER wrap your response in markdown code blocks (e.g. \`\`\`tsx).
- Output ONLY the raw, complete, modified code for the file. No explanations, no prefixes, no markdown blocks.`;

  const inputPrompt = `User Prompt: ${prompt}\n\n--- Current Code ---\n${currentCode}`;
  
  // Optimize tokens
  const { prompt: optimizedPrompt } = tokenManager.optimizeTokens(inputPrompt, 'gemini-2.5-flash-lite');

  // Use the 'edit' or 'code_edit' task category if available, otherwise fallback to default
  const responseText = await aiRouter.executeTask('coding', optimizedPrompt, systemPrompt, 'text');
  
  // Clean up any accidental markdown blocks just in case
  let cleanCode = responseText.trim();
  if (cleanCode.startsWith('\`\`\`tsx')) cleanCode = cleanCode.substring(6);
  else if (cleanCode.startsWith('\`\`\`javascript')) cleanCode = cleanCode.substring(13);
  else if (cleanCode.startsWith('\`\`\`')) cleanCode = cleanCode.substring(3);
  
  if (cleanCode.endsWith('\`\`\`')) cleanCode = cleanCode.substring(0, cleanCode.length - 3);

  return cleanCode.trim();
};
