import dotenv from 'dotenv';
import Groq from 'groq-sdk';
dotenv.config();

// ─── Helpers ──────────────────────────────────────────────────────────────────
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// ─── Multi-Key + Multi-Model Failover Config ──────────────────────────────────
// delay = ms to wait before attempting this slot (gives RPM limits time to recover)
const FAILOVER_CHAIN = [
  { apiKey: process.env.OPENROUTER_API_KEY_1, model: 'meta-llama/llama-3.3-70b-instruct:free', label: 'OR-Key1/llama-70b', delay: 0 },
  { apiKey: process.env.OPENROUTER_API_KEY_2, model: 'meta-llama/llama-3.3-70b-instruct:free', label: 'OR-Key2/llama-70b', delay: 3000 },
  { apiKey: process.env.OPENROUTER_API_KEY_3, model: 'meta-llama/llama-3.3-70b-instruct:free', label: 'OR-Key3/llama-70b', delay: 3000 },
  { apiKey: process.env.OPENROUTER_API_KEY_1, model: 'meta-llama/llama-3.2-3b-instruct:free',  label: 'OR-Key1/llama-3b',  delay: 4000 },
  { apiKey: process.env.OPENROUTER_API_KEY_2, model: 'nousresearch/hermes-3-llama-3.1-405b:free', label: 'OR-Key2/hermes-405b', delay: 4000 },
  { apiKey: process.env.OPENROUTER_API_KEY_3, model: 'meta-llama/llama-3.2-3b-instruct:free',  label: 'OR-Key3/llama-3b',  delay: 4000 },
];

const OPENROUTER_URL = process.env.OPENROUTER_API_URL || 'https://openrouter.ai/api/v1/chat/completions';

// ─── Single OpenRouter call ───────────────────────────────────────────────────
const callOpenRouter = async (apiKey, model, messages, maxTokens) => {
  const response = await fetch(OPENROUTER_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://buildify.ai',
      'X-Title': 'Buildify AI',
    },
    body: JSON.stringify({ model, messages, temperature: 0.2, max_tokens: maxTokens }),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    const msg = body?.error?.message || `HTTP ${response.status}`;
    const err = new Error(msg);
    err.isRateLimit = response.status === 429;
    throw err;
  }

  const data = await response.json();
  let content = data.choices?.[0]?.message?.content || '';
  // Extract content between backticks if they exist
  const match = content.match(/```(?:tsx|typescript|javascript|json|js|ts)?\n([\s\S]*?)```/i);
  if (match) {
    content = match[1].trim();
  } else {
    // Strip accidental markdown wrappers
    content = content.replace(/^```(tsx|typescript|javascript|json|js|ts)?\n?/i, '').replace(/\n?```$/i, '').trim();
  }
  return content;
};

// ─── Groq final fallback ──────────────────────────────────────────────────────
const callGroq = async (messages, maxTokens) => {
  const completion = await groq.chat.completions.create({
    messages,
    model: 'llama-3.1-8b-instant',
    temperature: 0.2,
    max_tokens: maxTokens,
  });
  let content = completion.choices[0]?.message?.content || '';
  // Extract content between backticks if they exist
  const match = content.match(/```(?:tsx|typescript|javascript|json|js|ts)?\n([\s\S]*?)```/i);
  if (match) {
    content = match[1].trim();
  } else {
    content = content.replace(/^```(tsx|typescript|javascript|json|js|ts)?\n?/i, '').replace(/\n?```$/i, '').trim();
  }
  return content;
};

// ─── Universal failover runner ────────────────────────────────────────────────
// Tries every OpenRouter slot with delays, then falls back to Groq automatically.
const runWithFailover = async (messages, maxTokens, label) => {
  for (let i = 0; i < FAILOVER_CHAIN.length; i++) {
    const { apiKey, model, label: slotLabel, delay } = FAILOVER_CHAIN[i];

    if (!apiKey) {
      console.warn(`[AI] Skipping ${slotLabel} — API key not set.`);
      continue;
    }

    if (delay > 0) {
      console.log(`[AI] Waiting ${delay}ms before next attempt...`);
      await sleep(delay);
    }

    try {
      console.log(`[AI] ${label} → Attempt ${i + 1}/${FAILOVER_CHAIN.length} via ${slotLabel}`);
      const result = await callOpenRouter(apiKey, model, messages, maxTokens);
      console.log(`[AI] ✅ ${label} succeeded via ${slotLabel}`);
      return result;
    } catch (err) {
      console.warn(`[AI] ${slotLabel} failed: ${err.message.substring(0, 100)}`);
    }
  }

  // All OpenRouter slots exhausted — try Groq as last resort
  try {
    console.log(`[AI] 🔄 All OpenRouter slots failed. Trying Groq fallback for: ${label}`);
    const result = await callGroq(messages, maxTokens);
    console.log(`[AI] ✅ ${label} succeeded via Groq fallback`);
    return result;
  } catch (groqErr) {
    console.error(`[AI] ❌ Groq fallback also failed for ${label}:`, groqErr.message);
    throw new Error(`All AI providers are currently rate-limited. Please wait a few minutes and try again.`);
  }
};

// ─── Code Generation ──────────────────────────────────────────────────────────
export const generateReactCode = async (componentName, description, globalTheme) => {
  const messages = [
    {
      role: 'system',
      content: 'You are an elite frontend engineer. Output only raw React TSX code — no markdown, no backticks, no explanations.',
    },
    {
      role: 'user',
      content: `Write a production-ready React Functional Component for: ${componentName}.
Description: ${description}
Global Theme: ${globalTheme}

Rules:
1. Use Tailwind CSS for all styling.
2. Use modern UI/UX (glassmorphism, gradients, rich typography).
3. ICON RULE: Only use these Lucide icons: ArrowRight, Github, Twitter, Linkedin, Instagram, Mail, Phone, Menu, X, ChevronRight, Star, Heart, Check, Play, User. NO other icon names.
4. NEVER import local images or Next.js components (like next/image, next/link). NEVER import React Native components. Always use standard HTML \`img\` tags directly with https://images.unsplash.com URLs.
5. NEVER use Link or NavLink from 'react-router-dom' inside components. Use plain <a href=""> tags instead. react-router-dom is only for App.tsx routing.
6. Only use 'lucide-react' (NOT lucide-react-native) and 'framer-motion'. You are building standard web React components.
7. You MUST use: export default function ${componentName}() { ... }
8. Return ONLY raw TSX starting with 'import React'.`,

    },
  ];

  return runWithFailover(messages, 2500, `CodeGen(${componentName})`);
};

// ─── Planning ─────────────────────────────────────────────────────────────────
export const planWebsiteStructure = async (prompt) => {
  const messages = [
    {
      role: 'system',
      content: 'You are a senior UI/UX architect. Respond with valid JSON only. No markdown, no explanation.',
    },
    {
      role: 'user',
      content: `Plan a website for: "${prompt}"

Return ONLY this JSON:
{
  "projectName": "Short project name",
  "theme": "dark",
  "components": [
    { "name": "HeroSection", "description": "What this component does" },
    { "name": "FeaturesSection", "description": "What this component does" },
    { "name": "Footer", "description": "What this component does" }
  ]
}

Rules:
- theme = "dark" or "light" only
- 3 to 5 components max
- component names = PascalCase, no spaces
- Return ONLY the JSON object`,
    },
  ];

  const raw = await runWithFailover(messages, 600, 'Planning');
  try {
    return JSON.parse(raw);
  } catch {
    // Try to extract JSON from response if model added extra text
    const match = raw.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]);
    throw new Error('AI returned invalid JSON for planning phase. Please try again.');
  }
};
