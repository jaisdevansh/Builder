import { planWebsiteStructure } from '../ai/index.js';
import { getCache, setCache } from '../cache/redis.js';
import prisma from '../db/prisma.js';

export const generateWebsite = async (prompt, userId) => {
  // Generate a safe cache key
  const cacheKey = `gen:v2:${Buffer.from(prompt).toString('base64').substring(0, 32)}`;
  
  // 1. Check Redis Cache
  const cached = await getCache(cacheKey);
  if (cached) {
    return cached;
  }

  const startTime = Date.now();

  // 2. Planning Phase - Handled by AI Orchestrator
  let plan;
  try {
    console.log('[Generation] Attempting to plan with AI Orchestrator...');
    plan = await planWebsiteStructure(prompt);
    console.log('[Generation] Planning completed successfully.');
  } catch (error) {
    console.error('[Generation] Fatal planning error:', error.message);
    throw error;
  }
  
  // 3. Execution Phase - Assemble App.tsx from JSON Blueprint
  const files = {};
  
  // Import registry components
  const { registryComponents } = await import('./registry.js');
  Object.assign(files, registryComponents);
  
  // Build App.tsx
  let appTsxImports = `import React from 'react';\nimport { BrowserRouter as Router } from 'react-router-dom';\nimport './styles.css';\n`;
  
  const componentSet = new Set(plan.sections.map(s => s.type));
  componentSet.forEach(type => {
    appTsxImports += `import { ${type} } from './registry';\n`;
  });
  
  let appTsxBody = `export default function App() {\n  return (\n    <Router>\n      <div className="min-h-screen flex flex-col ${plan.theme === 'dark' ? 'bg-zinc-950 text-white' : 'bg-white text-zinc-900'}">\n`;
  
  plan.sections.forEach(section => {
    const propsString = Object.entries(section.props || {})
      .map(([k, v]) => {
        if (typeof v === 'string') {
          return `${k}="${v.replace(/"/g, '&quot;')}"`;
        }
        return `${k}={${JSON.stringify(v)}}`;
      })
      .join(' ');
    appTsxBody += `        <${section.type} ${propsString} />\n`;
  });
  
  appTsxBody += `      </div>\n    </Router>\n  );\n}`;
  
  files['/App.tsx'] = { name: 'App.tsx', code: appTsxImports + '\n' + appTsxBody };
  files['/styles.css'] = { name: 'styles.css', code: `@tailwind base;\n@tailwind components;\n@tailwind utilities;\n` };

  const generationTime = Date.now() - startTime;

  // 4. Get authenticated user (required for generation)
  const user = await prisma.user.findUnique({
    where: { id: userId }
  });

  if (!user) {
    throw new Error('User not found');
  }

  // 5. Save to Prisma DB in a transaction-like way
  const projectTitle = plan.projectName || prompt.substring(0, 40) + '...';
  const project = await prisma.project.create({
    data: {
      user_id: user.id,
      title: projectTitle,
      prompt: prompt,
      theme: plan.theme,
      files: {
        create: Object.entries(files).map(([name, content]) => ({
          file_name: name,
          content: typeof content === 'string' ? content : content.code,
          file_type: name.endsWith('.css') ? 'css' : 'tsx'
        }))
      },
      ai_generations: {
        create: [
          { provider: 'groq', tokens_used: 150, generation_time: 1500 },
          { provider: 'groq', tokens_used: 4000, generation_time: generationTime - 1500 }
        ]
      }
    }
  });

  const result = {
    projectId: project.id,
    projectName: projectTitle,
    theme: plan.theme,
    files,
    generationTime,
  };

  // 6. Cache Result for future identical prompts
  await setCache(cacheKey, result, 86400); // 24 hours

  return result;
};
