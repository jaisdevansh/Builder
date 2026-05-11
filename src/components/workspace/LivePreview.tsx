import React, { useState } from 'react';
import { 
  SandpackProvider, 
  SandpackLayout, 
  SandpackPreview,
} from "@codesandbox/sandpack-react";
import { atomDark } from "@codesandbox/sandpack-themes";
import { useStore } from '../../store/useStore';
import { Monitor, Smartphone, RotateCw } from 'lucide-react';

const LivePreview: React.FC = () => {
  const { files, isGenerating } = useStore();
  const [viewport, setViewport] = useState<'desktop' | 'mobile'>('desktop');
  
  // Convert our store files format to Sandpack files format
  const sandpackFiles = Object.entries(files).reduce((acc, [path, file]) => {
    acc[path] = file.code;
    return acc;
  }, {} as Record<string, string>);

  return (
    <div className="flex-1 h-full bg-[#0a0a0c] flex flex-col border-l border-white/5">
      {/* Browser Bar */}
      <div className="h-12 bg-zinc-900 border-b border-white/5 flex items-center justify-between px-4">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-green-500/80" />
        </div>
        
        <div className="flex items-center bg-black/40 px-3 py-1.5 rounded-md border border-white/5 w-1/2 max-w-sm overflow-hidden">
          <span className="text-xs text-zinc-500 truncate text-center w-full">localhost:3000</span>
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={() => setViewport('mobile')}
            className={`p-1.5 rounded-md transition-colors ${viewport === 'mobile' ? 'bg-primary/20 text-primary' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            <Smartphone className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setViewport('desktop')}
            className={`p-1.5 rounded-md transition-colors ${viewport === 'desktop' ? 'bg-primary/20 text-primary' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            <Monitor className="w-4 h-4" />
          </button>
          <button className="p-1.5 text-zinc-500 hover:text-zinc-300 transition-colors">
            <RotateCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Preview Area */}
      <div className="flex-1 overflow-hidden relative flex items-center justify-center p-4 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]">
        
        <div className={`transition-all duration-300 ease-in-out h-full ${viewport === 'mobile' ? 'w-[375px] max-h-[812px] shadow-2xl border-4 border-zinc-800 rounded-[2rem] overflow-hidden bg-white' : 'w-full shadow-lg border border-white/5 rounded-lg overflow-hidden'}`}>
          <SandpackProvider 
            template="react-ts" 
            theme={atomDark}
            files={sandpackFiles}
            options={{
              externalResources: ["https://cdn.tailwindcss.com"]
            }}
          >
            <SandpackLayout style={{ height: '100%', border: 'none' }}>
              <SandpackPreview 
                showOpenInCodeSandbox={false}
                showRefreshButton={false}
                style={{ height: '100%' }}
              />
            </SandpackLayout>
          </SandpackProvider>
        </div>

        {/* AI Generating Overlay */}
        {isGenerating && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md flex flex-col items-center justify-center z-50">
            <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-6" />
            <div className="text-xl font-medium text-white mb-2">AI is building your UI...</div>
            <div className="text-zinc-400 text-sm animate-pulse">Writing React & Tailwind code in real-time</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LivePreview;
