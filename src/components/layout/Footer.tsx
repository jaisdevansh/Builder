import React from 'react';
import { Layers } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-white/5 bg-black/20 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-zinc-500" />
          <span className="font-semibold text-zinc-400">Buildify AI</span>
        </div>
        
        <div className="flex gap-6 text-sm text-zinc-500">
          <a href="#" className="hover:text-zinc-300 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-zinc-300 transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-zinc-300 transition-colors">Twitter</a>
          <a href="#" className="hover:text-zinc-300 transition-colors">GitHub</a>
        </div>
        
        <div className="text-sm text-zinc-600">
          &copy; {new Date().getFullYear()} Buildify AI. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
