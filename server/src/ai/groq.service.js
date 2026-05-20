import Groq from 'groq-sdk';
import dotenv from 'dotenv';
dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// NEW: Planning function as fallback for Gemini
export const planWebsiteStructure = async (prompt) => {
  const systemPrompt = `You are an elite React UI/UX architect.
Your job is to analyze the user's request for a website and break it down into a JSON structure of specific, premium UI components.
Provide extremely detailed descriptions for each component, specifying:
- Visual Layout (e.g. asymmetrical grid, multi-column bento grids, responsive flexboxes)
- Interactive features (e.g., active tab states, pricing toggle, hover cards expansion)
- Premium style guide (e.g. glassmorphism opacity panels, glowing border shadow highlights, custom gradient overlays)
- High-fidelity content suggestions (e.g. concrete testimonial quotes, real-world case study facts, functional navigation layouts)

Rules:
- theme = "dark" or "light" only
- Generate exactly 4 to 5 components (e.g. Navbar, HeroSection, FeaturesSection, Testimonials/Pricing, FAQ, Footer) to make the page highly professional and complete.
- Component names must be in PascalCase with no spaces (e.g. HeroSection, FeaturesGrid, TestimonialsCarousel).
- Return ONLY valid JSON with this exact structure:
{
  "projectName": "string",
  "theme": "dark" or "light",
  "components": [
    { "name": "ComponentName", "description": "detailed description" }
  ]
}`;

  const maxRetries = 3;
  let delay = 3000;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const completion = await groq.chat.completions.create({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        model: 'llama-3.1-70b-versatile', // Use larger model for planning
        temperature: 0.3,
        max_tokens: 2000,
        response_format: { type: 'json_object' }
      });

      const responseText = completion.choices[0]?.message?.content || '{}';
      const parsed = JSON.parse(responseText);
      
      // Validate structure
      if (!parsed.projectName || !parsed.theme || !Array.isArray(parsed.components)) {
        throw new Error('Invalid response structure from Groq planning');
      }

      return parsed;
    } catch (error) {
      console.error(`Groq Planning Error (Attempt ${attempt}/${maxRetries}):`, error);
      
      if (error?.status === 429 && attempt < maxRetries) {
        const retryAfterHeader = error?.headers?.get?.('retry-after');
        let waitMs = delay;
        if (retryAfterHeader) {
          const parsedSec = parseFloat(retryAfterHeader);
          if (!isNaN(parsedSec)) {
            waitMs = (parsedSec + 0.5) * 1000;
          }
        }
        console.warn(`⚠️ Rate limited by Groq. Waiting ${waitMs}ms before retrying...`);
        await new Promise(resolve => setTimeout(resolve, waitMs));
        delay *= 2;
        continue;
      }

      if (attempt === maxRetries) {
        throw new Error('Failed to generate website plan. Please try again later.');
      }
    }
  }
};

export const generateReactCode = async (componentName, description, globalTheme) => {
  const prompt = `You are a world-class React and Tailwind CSS developer. Generate a stunning, high-fidelity React Component for: ${componentName}.
Description: ${description}
Global Theme: ${globalTheme}

Strict Styling Rules for Jaw-Dropping Aesthetics:
1. Palette & Colors: ABSOLUTELY AVOID generic primary colors (e.g., pure red/blue/green/yellow).
   - Yadi Theme is "dark": Use deep rich backgrounds like 'bg-zinc-950', card panels using 'bg-zinc-900/40 backdrop-blur-md border border-white/5'. Use vibrant indigo, violet, cyan, or amber gradients for active elements/highlights.
   - Yadi Theme is "light": Use clean slate-50 background, card panels using 'bg-white/70 backdrop-blur-md border border-black/5'.
2. Text Gradients & Typography: Use elegant sans typography. Apply beautiful text gradients to headers to make them pop, e.g., 'bg-gradient-to-r from-violet-400 via-fuchsia-500 to-pink-500 bg-clip-text text-transparent'.
3. Framer Motion Animations: You MUST use 'framer-motion' to make components animate smoothly on load (e.g., use '<motion.div>' with initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}). Add hover states like scale on cards (whileHover={{ scale: 1.02, y: -4 }} whileTap={{ scale: 0.98 }}).
4. Premium Hover States: Every button, link, and card must have smooth hover transitions ('transition-all duration-300'). Buttons should have hover scales, glow shadows, or gradient shifts.
5. Mock Data & Realism: NEVER leave sections empty or generic. Write rich, detailed mock contents, realistic numbers, fake user profiles with name/avatar, features, and interactive tabs to make it feel like a premium SaaS or personal website.
6. Allowed Icons: You MUST ONLY import from 'lucide-react': ArrowRight, Github, Twitter, Linkedin, Instagram, Mail, Phone, Menu, X, ChevronRight, Star, Heart, Check, Play, User.
7. Media & Working Images: ONLY use these exact verified Unsplash image URLs:
   - Female Portrait 1 (Avatars/Testimonials): https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80
   - Female Portrait 2 (Avatars/Testimonials): https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80
   - Male Portrait 1 (Avatars/Testimonials): https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80
   - Male Portrait 2 (Avatars/Testimonials): https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80
   - SaaS Dashboard Metrics/Charts: https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80
   - SaaS General Mockup: https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80
   - Futuristic Abstract Tech 1: https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80
   - Futuristic Abstract Tech 2: https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80
   - Laptop on Desk: https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80
   - Team Meeting: https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80
   - Modern Office: https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80
   - Abstract Dark Pattern Background: https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80
   - Abstract Light Soft Background: https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=1200&q=80
8. Allowed Packages: Only React, 'lucide-react', 'framer-motion' are allowed. Use native React state for tabs/interactivity. NEVER import from 'react-router-dom', 'next/*', or other local files. Use plain <a href="..."> tags instead of Link/NavLink.
9. Return ONLY raw TSX code. Start with 'import React'. Do not wrap in markdown \`\`\` tags.`;

  const maxRetries = 3;
  let delay = 3000;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const completion = await groq.chat.completions.create({
        messages: [
          { role: 'system', content: 'You are an elite frontend engineer. You output only raw code without markdown wrappers.' },
          { role: 'user', content: prompt }
        ],
        model: 'llama-3.1-8b-instant',
        temperature: 0.2,
        max_tokens: 2500,
      });

      let code = completion.choices[0]?.message?.content || '';
      
      // Safety fallback: Strip markdown if Groq accidentally includes it
      if (code.startsWith('```tsx') || code.startsWith('```')) {
        code = code.replace(/^\`\`\`(tsx|javascript|typescript|js|ts)?\n/, '');
        code = code.replace(/\n\`\`\`$/, '');
      }

      return code;
    } catch (error) {
      console.error(`Groq Code Generation Error for ${componentName} (Attempt ${attempt}/${maxRetries}):`, error);
      
      if (error?.status === 429 && attempt < maxRetries) {
        const retryAfterHeader = error?.headers?.get?.('retry-after');
        let waitMs = delay;
        if (retryAfterHeader) {
          const parsedSec = parseFloat(retryAfterHeader);
          if (!isNaN(parsedSec)) {
            waitMs = (parsedSec + 0.5) * 1000;
          }
        }
        console.warn(`⚠️ Rate limited by Groq. Waiting ${waitMs}ms before retrying...`);
        await new Promise(resolve => setTimeout(resolve, waitMs));
        delay *= 2;
        continue;
      }

      if (error?.status === 429) {
        const retryAfter = error?.headers?.get?.('retry-after');
        const waitMins = retryAfter ? Math.ceil(retryAfter / 60) : 'a few';
        throw new Error(`AI rate limit reached. Please wait ${waitMins} minutes and try again. (Groq free tier daily limit)`);
      }
      throw new Error(`Failed to generate code for ${componentName}.`);
    }
  }
};
