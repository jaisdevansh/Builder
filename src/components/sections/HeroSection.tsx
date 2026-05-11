import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';

const HeroSection: React.FC = () => {
  return (
    <section className="relative pt-40 pb-20 px-6 max-w-5xl mx-auto w-full text-center flex flex-col items-center z-10">
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8"
      >
        <Sparkles className="w-4 h-4" />
        <span>Buildify AI 2.0 is now live</span>
      </motion.div>

      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-5xl md:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white via-zinc-200 to-zinc-500 mb-6"
      >
        Build stunning websites <br className="hidden md:block" /> at the speed of thought.
      </motion.h1>

      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="text-lg md:text-xl text-zinc-400 max-w-2xl mb-10 leading-relaxed"
      >
        Describe your vision, and our AI instantly generates production-grade React code. Edit in Monaco, preview in Sandpack, and ship in seconds.
      </motion.p>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="flex flex-col sm:flex-row items-center gap-4"
      >
        <button className="h-12 px-8 rounded-xl bg-white text-black font-semibold flex items-center gap-2 hover:bg-zinc-200 transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_40px_rgba(255,255,255,0.4)] hover:scale-105 active:scale-95">
          Start Building Free
          <ArrowRight className="w-4 h-4" />
        </button>
        <button className="h-12 px-8 rounded-xl bg-card border border-card-border text-white font-medium hover:bg-zinc-800 transition-colors">
          View Components
        </button>
      </motion.div>

    </section>
  );
};

export default HeroSection;
