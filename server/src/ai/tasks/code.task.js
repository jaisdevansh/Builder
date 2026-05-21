import { aiRouter } from '../core/router.js';

export const executeCodeTask = async (componentName, description, globalTheme) => {
  const prompt = `You are a world-class React and Tailwind CSS developer. Generate a stunning, high-fidelity React Component for: ${componentName}.
Description: ${description}
Global Theme: ${globalTheme}

Strict Styling Rules for Jaw-Dropping Aesthetics:
1. Palette & Colors: ABSOLUTELY AVOID generic primary colors. Use deep rich backgrounds or clean slates depending on the theme.
2. Text Gradients & Typography: Use elegant sans typography. Apply beautiful text gradients to headers.
3. Framer Motion Animations: You MUST use 'framer-motion' to make components animate smoothly on load.
4. Premium Hover States: Every button, link, and card must have smooth hover transitions.
5. Mock Data & Realism: NEVER leave sections empty or generic. Write rich, detailed mock contents.
6. Allowed Icons: ONLY import from 'lucide-react'.
7. Allowed Packages: Only React, 'lucide-react', 'framer-motion' are allowed.
8. Return ONLY raw TSX code. Start with 'import React'. Do not wrap in markdown \`\`\` tags.`;

  const systemInstruction = 'You are an elite frontend engineer. You output only raw code without markdown wrappers.';

  let code = await aiRouter.executeTask('code', prompt, systemInstruction, 'text');

  // Safety fallback: Strip markdown if the LLM accidentally includes it
  if (code.startsWith('```tsx') || code.startsWith('```')) {
    code = code.replace(/^\`\`\`(tsx|javascript|typescript|js|ts)?\n/, '');
    code = code.replace(/\n\`\`\`$/, '');
  }

  return code;
};
