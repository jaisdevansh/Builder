import React from 'react';
import { motion } from 'framer-motion';
import { X, Minus, Maximize2 } from 'lucide-react';

const DemoSection: React.FC = () => {
  return (
    <section id="demo" className="w-full max-w-6xl mx-auto px-6 py-20 z-10">
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative rounded-2xl md:rounded-[32px] overflow-hidden border border-white/10 bg-black/50 backdrop-blur-2xl shadow-2xl p-2 md:p-4"
      >
        {/* Glow effect behind the mock editor */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-primary/20 blur-[100px] pointer-events-none rounded-full" />
        
        {/* Mock Window Header */}
        <div className="relative flex items-center px-4 py-3 border-b border-white/5 bg-zinc-900/50 rounded-t-xl md:rounded-t-2xl">
          <div className="flex gap-2 group cursor-default">
            <div className="w-3 h-3 rounded-full bg-[#ff5f56] flex items-center justify-center overflow-hidden">
              <X className="w-2 h-2 text-black/70 opacity-0 group-hover:opacity-100 transition-opacity stroke-[3]" />
            </div>
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e] flex items-center justify-center overflow-hidden">
              <Minus className="w-2 h-2 text-black/70 opacity-0 group-hover:opacity-100 transition-opacity stroke-[3]" />
            </div>
            <div className="w-3 h-3 rounded-full bg-[#27c93f] flex items-center justify-center overflow-hidden">
              <Maximize2 className="w-2 h-2 text-black/70 opacity-0 group-hover:opacity-100 transition-opacity stroke-[3] p-[0.5px]" />
            </div>
          </div>
          <div className="absolute left-1/2 -translate-x-1/2 flex items-center bg-black/40 px-3 py-1 rounded-md border border-white/5 text-xs text-zinc-500">
            <span className="text-zinc-400 mr-2">buildify.ai</span> / workspace
          </div>
        </div>

        {/* Mock Editor Body */}
        <div className="relative bg-zinc-950 rounded-b-xl md:rounded-b-2xl h-[400px] md:h-[600px] w-full flex flex-col md:flex-row overflow-hidden border-t border-white/5">
          
          {/* Mock Sidebar / Prompt Area */}
          <div className="w-full md:w-1/3 border-r border-white/5 p-6 flex flex-col justify-end bg-gradient-to-b from-zinc-900/30 to-black">
            <div className="glass-panel p-4 rounded-xl shadow-lg border border-white/10 animate-float">
              <div className="flex gap-3 items-center mb-2">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs text-primary">✨</div>
                <div className="h-4 w-3/4 bg-zinc-800 rounded animate-pulse" />
              </div>
              <div className="h-3 w-1/2 bg-zinc-800 rounded mb-4 animate-pulse" />
              <div className="h-2 w-full bg-zinc-800/50 rounded mt-2" />
              <div className="h-2 w-4/5 bg-zinc-800/50 rounded mt-2" />
            </div>
            
            <div className="mt-8 relative">
              <div className="absolute inset-0 bg-primary/10 blur-xl rounded-full" />
              <div className="relative bg-zinc-900 border border-white/10 rounded-xl p-3 flex items-center">
                <div className="h-4 w-4 rounded bg-zinc-700 mr-3" />
                <span className="text-zinc-500 text-sm">Create a modern SaaS landing page...</span>
              </div>
            </div>
          </div>

          {/* Mock Preview Area */}
          <div className="flex-1 bg-[#0a0a0c] relative p-6 flex flex-col">
            <div className="w-full h-full border border-white/5 rounded-lg bg-zinc-900/20 overflow-hidden relative">
               {/* Simulated Code lines */}
               <div className="p-4 flex flex-col gap-2 opacity-50">
                 {[...Array(15)].map((_, i) => (
                   <div key={i} className={`h-3 rounded bg-zinc-800 ${i % 2 === 0 ? 'w-2/3' : 'w-1/2'} ${i % 3 === 0 ? 'ml-4' : ''}`} />
                 ))}
               </div>
               
               {/* Generating overlay */}
               <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                 <div className="flex flex-col items-center">
                   <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4" />
                   <span className="text-primary font-medium text-sm animate-pulse">Generating UI components...</span>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default DemoSection;
