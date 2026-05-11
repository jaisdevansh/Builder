import React from 'react';
import { motion } from 'framer-motion';
import { Layers } from 'lucide-react';

const Navbar: React.FC = () => {
  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
    >
      <div className="max-w-7xl mx-auto glass rounded-2xl px-6 py-3 flex items-center justify-between shadow-lg shadow-black/20">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/30">
            <Layers className="w-5 h-5 text-primary" />
          </div>
          <span className="font-bold text-xl tracking-tight text-white">Buildify AI</span>
        </div>
        
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#demo" className="hover:text-white transition-colors">How it Works</a>
          <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
        </div>
        
        <div className="flex items-center gap-4">
          <button className="text-sm font-medium text-zinc-300 hover:text-white transition-colors hidden sm:block">
            Sign In
          </button>
          <a href="/workspace" className="bg-white text-black px-4 py-2 rounded-lg text-sm font-semibold hover:bg-zinc-200 transition-colors shadow-[0_0_15px_rgba(255,255,255,0.3)]">
            Go to Workspace
          </a>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
