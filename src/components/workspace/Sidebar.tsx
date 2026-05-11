import React from 'react';
import { FileCode, FileJson, Settings, Home, LayoutTemplate } from 'lucide-react';
import { useStore } from '../../store/useStore';

const Sidebar: React.FC = () => {
  const { files, activeFile, setActiveFile } = useStore();

  return (
    <div className="w-64 bg-zinc-950 border-r border-white/5 h-full flex flex-col">
      <div className="p-4 border-b border-white/5 flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/30">
          <LayoutTemplate className="w-4 h-4 text-primary" />
        </div>
        <span className="font-bold text-sm text-white">Project Files</span>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4">
        <div className="px-3 mb-2">
          <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider px-2">Explorer</p>
        </div>
        <div className="space-y-1 px-2">
          {Object.entries(files).map(([path, file]) => {
            const isActive = activeFile === path;
            const Icon = path.endsWith('.css') ? FileJson : FileCode;
            
            return (
              <button
                key={path}
                onClick={() => setActiveFile(path)}
                className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors ${
                  isActive 
                    ? 'bg-primary/10 text-primary font-medium' 
                    : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                {file.name}
              </button>
            );
          })}
        </div>
      </div>
      
      <div className="p-4 border-t border-white/5 space-y-2">
        <button className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200 transition-colors">
          <Home className="w-4 h-4" />
          Dashboard
        </button>
        <button className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200 transition-colors">
          <Settings className="w-4 h-4" />
          Settings
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
