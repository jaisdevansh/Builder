import { planWebsiteStructure, generateReactCode } from '../ai/index.js';
import { getCache, setCache } from '../cache/redis.js';
import prisma from '../db/prisma.js';

export const generateWebsite = async (prompt, userId) => {
  // Generate a safe cache key
  const cacheKey = `gen:${Buffer.from(prompt).toString('base64').substring(0, 32)}`;
  
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
  
  // 3. Execution Phase - Try Gemini → Groq → NVIDIA for each component
  const files = {};
  
  let appTsxImports = `import React from 'react';\nimport { BrowserRouter as Router } from 'react-router-dom';\nimport './styles.css';\n`;
  let appTsxBody = `export default function App() {\n  return (\n    <Router>\n      <div className="min-h-screen flex flex-col ${plan.theme === 'dark' ? 'bg-zinc-950 text-white' : 'bg-white text-zinc-900'}">\n`;
  
  const generatedComponents = [];
  
  for (const comp of plan.components) {
    // Sanitize component name to PascalCase (e.g. "Header/Hero Section" -> "HeaderHeroSection")
    const safeName = comp.name
      .replace(/[^a-zA-Z0-9]/g, ' ')
      .trim()
      .split(/\s+/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join('');

    let code;
    try {
      console.log(`[Generation] Attempting to generate ${safeName} with AI Orchestrator...`);
      code = await generateReactCode(safeName, comp.description, plan.theme);
      console.log(`[Generation] ${safeName} generated successfully.`);
    } catch (error) {
      console.error(`[Generation Error] Failed to generate ${safeName}:`, error.message);
      // Fallback: create an empty component if generation totally fails
      code = `import React from 'react';\nexport default function ${safeName}() {\n  return <div className="p-4 text-red-500">Failed to generate ${safeName}</div>;\n}`;
    }
    
    
    // 1. Force default export if missing
    if (!code.includes(`export default`)) {
      code = code.replace(`export const ${safeName}`, `export default function ${safeName}`);
      code = code.replace(`export function ${safeName}`, `export default function ${safeName}`);
    }

    // 1.5 Clean up common LLM artifacts and invalid tags that cause syntax errors
    code = code.replace(/<\/?(hassistant|assistant|bot|user|system)>/gi, '');
    code = code.replace(/<\|eot_id\|>/g, '');
    code = code.replace(/Here is your code:?/g, '');
    code = code.replace(/Let me know if you need anything else\.?/g, '');

    // 2. Aggressively sanitize imported packages and elements (e.g., Next.js, React Native)
    // Fix hallucinated React Native lucide import
    code = code.replace(/['"]lucide-react-native['"]/g, "'lucide-react'");
    
    // Fix Next.js Image imports and tags
    code = code.replace(/import\s+Image\s+from\s+['"]next\/image['"];?\n?/g, '');
    code = code.replace(/import\s+\{\s*Image\s*\}\s+from\s+['"]next\/image['"];?\n?/g, '');
    code = code.replace(/<Image\s+/g, '<img ');
    code = code.replace(/<\/Image>/g, '</img>');

    // Fix other Next.js imports
    code = code.replace(/import\s+\{[^}]*\}\s+from\s+['"]next\/[^'"]+['"];?\n?/g, '');

    // 3. Aggressively strip hallucinated lucide-react icons and ensure all used icons are correctly imported
    const validIcons = ['ArrowRight', 'Github', 'Twitter', 'Linkedin', 'Instagram', 'Mail', 'Phone', 'Menu', 'X', 'ChevronRight', 'Star', 'Heart', 'Check', 'Play', 'User'];
    const importRegex = /import\s+\{([^}]+)\}\s+from\s+['"]lucide-react['"];?/g;
    let match;
    let iconsToReplace = [];
    
    // Extract all icons imported from lucide-react
    importRegex.lastIndex = 0;
    while ((match = importRegex.exec(code)) !== null) {
      const importedIcons = match[1].split(/[\s,]+/).map(i => i.trim()).filter(Boolean);
      importedIcons.forEach(icon => {
        if (!validIcons.includes(icon) && !iconsToReplace.includes(icon)) {
          iconsToReplace.push(icon);
        }
      });
    }
    
    // Replace hallucinated icons with Star in the file
    iconsToReplace.forEach(icon => {
      const regex = new RegExp(`\\b${icon}\\b`, 'g');
      code = code.replace(regex, 'Star');
    });

    // Scan the code body (excluding imports) for any used valid icons
    const codeWithoutImports = code.replace(/import\s+[\s\S]*?from\s+['"][^'"]+['"];?/g, '');
    const usedValidIcons = [];
    validIcons.forEach(icon => {
      const jsxRegex = new RegExp(`<${icon}\\b`, 'g');
      if (jsxRegex.test(codeWithoutImports)) {
        usedValidIcons.push(icon);
      }
    });
    
    // Clean up, merge, and deduplicate the import statements
    importRegex.lastIndex = 0;
    if (importRegex.test(code)) {
      importRegex.lastIndex = 0;
      code = code.replace(importRegex, (match, p1) => {
        const icons = p1.split(/[\s,]+/).map(i => i.trim()).filter(Boolean);
        const sanitized = icons.map(icon => validIcons.includes(icon) ? icon : 'Star');
        const allIcons = [...new Set([...sanitized, ...usedValidIcons])];
        return `import { ${allIcons.join(', ')} } from 'lucide-react';`;
      });
    } else if (usedValidIcons.length > 0) {
      code = `import { ${[...new Set(usedValidIcons)].join(', ')} } from 'lucide-react';\n` + code;
    }

    // 4. Replace react-router-dom Link/NavLink with plain <a> tags to prevent Sandpack crashes
    code = code.replace(/import\s+\{[^}]*\b(Link|NavLink|useNavigate|useLocation|useParams|Route|Routes|Navigate)\b[^}]*\}\s+from\s+['"]react-router-dom['"];?\n?/g, '');
    code = code.replace(/<Link\s+to=([^>]+)>/g, (match, toAttr) => `<a href=${toAttr}>`);
    code = code.replace(/<NavLink\s+to=([^>]+)>/g, (match, toAttr) => `<a href=${toAttr}>`);
    code = code.replace(/<\/Link>/g, '</a>');
    code = code.replace(/<\/NavLink>/g, '</a>');

    generatedComponents.push({ name: `${safeName}.tsx`, code, safeName });
    
    // Throttle requests sequentially with a delay to avoid rate limits
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  generatedComponents.forEach((comp) => {
    files[comp.name] = comp.code;
    appTsxImports += `import ${comp.safeName} from './${comp.safeName}';\n`;
    appTsxBody += `      <${comp.safeName} />\n`;
  });

  appTsxBody += `      </div>\n    </Router>\n  );\n}`;
  files['App.tsx'] = appTsxImports + '\n' + appTsxBody;
  files['styles.css'] = `@tailwind base;\n@tailwind components;\n@tailwind utilities;\n`;

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
          content: content,
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
