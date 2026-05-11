import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, Paperclip } from 'lucide-react';
import { useStore } from '../../store/useStore';

const PromptBar: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const { setGenerating, isGenerating, addPrompt, updateFileContent } = useStore();

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isGenerating) return;

    addPrompt(prompt);
    setGenerating(true);
    setPrompt('');

    // Simulate AI Generation Delay
    setTimeout(() => {
      const generatedCode = `import React from "react";
import "./styles.css";

export default function App() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 p-6 text-zinc-50">
      <div className="w-full max-w-2xl rounded-3xl border border-white/10 bg-zinc-900/40 p-10 shadow-2xl backdrop-blur-2xl">
        <div className="flex items-center gap-4 mb-8">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">AI Generated UI</h1>
            <p className="text-zinc-400">Based on your prompt</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="h-32 rounded-xl bg-zinc-800/50 border border-white/5 p-4">
             <div className="h-4 w-1/3 bg-zinc-700 rounded animate-pulse mb-3" />
             <div className="h-3 w-full bg-zinc-700/50 rounded animate-pulse mb-2" />
             <div className="h-3 w-5/6 bg-zinc-700/50 rounded animate-pulse" />
          </div>
          <button className="w-full rounded-xl bg-white py-4 font-bold text-black transition-all hover:bg-zinc-200 hover:scale-[1.02] active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.1)]">
            Deploy Now
          </button>
        </div>
      </div>
    </div>
  );
}
`;
      updateFileContent('/App.tsx', generatedCode);
      setGenerating(false);
    }, 3000);
  };

  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-full max-w-3xl px-6 z-40">
      <motion.form 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        onSubmit={handleGenerate}
        className="relative flex items-end gap-2 bg-zinc-900/80 backdrop-blur-2xl border border-white/10 rounded-2xl p-2 shadow-2xl focus-within:border-primary/50 focus-within:ring-4 focus-within:ring-primary/10 transition-all"
      >
        <button type="button" className="p-3 text-zinc-400 hover:text-white transition-colors rounded-xl hover:bg-white/5">
          <Paperclip className="w-5 h-5" />
        </button>
        
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe the UI you want to build..."
          className="flex-1 max-h-32 min-h-[44px] bg-transparent border-none outline-none text-white placeholder:text-zinc-500 resize-none py-3 px-2"
          rows={1}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleGenerate(e);
            }
          }}
        />

        <button 
          type="submit"
          disabled={!prompt.trim() || isGenerating}
          className="p-3 rounded-xl bg-primary text-white hover:bg-blue-600 disabled:opacity-50 disabled:hover:bg-primary transition-all flex items-center justify-center disabled:cursor-not-allowed"
        >
          <AnimatePresence mode="wait">
            {isGenerating ? (
              <motion.div
                key="generating"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"
              />
            ) : (
              <motion.div
                key="idle"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
              >
                <Send className="w-5 h-5" />
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </motion.form>
      
      <div className="flex items-center justify-center gap-2 mt-4 text-xs text-zinc-500 font-medium">
        <Sparkles className="w-3 h-3 text-primary" />
        <span>Buildify AI can make mistakes. Check the code.</span>
      </div>
    </div>
  );
};

export default PromptBar;
