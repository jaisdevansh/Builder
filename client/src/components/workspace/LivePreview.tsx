import React, { useState } from 'react';
import { 
  SandpackProvider, 
  SandpackPreview,
  SandpackLayout
} from "@codesandbox/sandpack-react";
import { atomDark } from "@codesandbox/sandpack-themes";
import { useStore } from '../../store/useStore';
import { Monitor, Smartphone, RotateCw, X, Minus, Maximize2 } from 'lucide-react';

const LivePreview: React.FC = () => {
  const { files, isGenerating, previewLayout, setPreviewLayout } = useStore();
  const [viewport, setViewport] = useState<'desktop' | 'mobile'>('desktop');
  const [refreshKey, setRefreshKey] = useState(0);
  
  const sandpackFiles = React.useMemo(() => {
    return Object.entries(files).reduce((acc, [path, file]) => {
      acc[path] = file.code;
      return acc;
    }, {} as Record<string, string>);
  }, [files]);

  const sandpackKey = React.useMemo(() => {
    return Object.keys(files).join(',') + '_' + refreshKey;
  }, [files, refreshKey]);

  return (
    <div className="flex-1 h-full bg-[#0a0a0c] flex flex-col border-l border-white/5">
      {/* Browser Bar */}
      <div className="h-12 bg-zinc-900 border-b border-white/5 flex items-center justify-between px-4">
        <div className="flex gap-2 group">
          <button onClick={() => setPreviewLayout('code-maximized')} className="w-3 h-3 rounded-full bg-[#ff5f56] flex items-center justify-center overflow-hidden hover:scale-105 active:scale-95 transition-transform">
            <X className="w-2 h-2 text-black/70 opacity-0 group-hover:opacity-100 transition-opacity stroke-[3]" />
          </button>
          <button onClick={() => setPreviewLayout(previewLayout === 'split' ? 'code-maximized' : 'split')} className="w-3 h-3 rounded-full bg-[#ffbd2e] flex items-center justify-center overflow-hidden hover:scale-105 active:scale-95 transition-transform">
            <Minus className="w-2 h-2 text-black/70 opacity-0 group-hover:opacity-100 transition-opacity stroke-[3]" />
          </button>
          <button onClick={() => setPreviewLayout(previewLayout === 'preview-maximized' ? 'split' : 'preview-maximized')} className="w-3 h-3 rounded-full bg-[#27c93f] flex items-center justify-center overflow-hidden hover:scale-105 active:scale-95 transition-transform">
            <Maximize2 className="w-2 h-2 text-black/70 opacity-0 group-hover:opacity-100 transition-opacity stroke-[3] p-[0.5px]" />
          </button>
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
          <button 
            onClick={() => setRefreshKey(prev => prev + 1)}
            className="p-1.5 text-zinc-500 hover:text-zinc-300 transition-colors active:scale-95"
            title="Refresh Preview"
          >
            <RotateCw className={`w-4 h-4 ${refreshKey > 0 ? 'animate-spin-once' : ''}`} />
          </button>
        </div>
      </div>

      {/* Preview Area */}
      <div className="flex-1 overflow-hidden relative bg-[#0a0a0c]">
        {/* Background Decorative Pattern (Subtle) */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #fff 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        
        <div className={`absolute inset-0 transition-all duration-500 ${
          viewport === 'mobile' ? 'flex items-center justify-center p-8' : ''
        }`}>
          <div className={`transition-all duration-500 ${
            viewport === 'mobile' 
              ? 'w-[375px] h-full max-h-[812px] shadow-2xl border-[12px] border-zinc-800 rounded-[3rem] ring-1 ring-white/10 relative overflow-hidden' 
              : 'w-full h-full'
          }`}>
            <SandpackProvider 
              key={sandpackKey}
              template="react-ts" 
              theme={atomDark}
              files={sandpackFiles}
              customSetup={{
                dependencies: {
                  "lucide-react": "0.469.0",
                  "react-router-dom": "latest",
                  "framer-motion": "latest",
                  "react-hook-form": "latest"
                }
              }}
              options={{
                externalResources: ["https://cdn.tailwindcss.com"]
              }}
              style={{ height: '100%', width: '100%' }}
            >
              <SandpackLayout style={{ height: '100%', width: '100%', border: 'none', background: 'transparent' }}>
                <SandpackPreview 
                  showOpenInCodeSandbox={false}
                  showRefreshButton={false}
                  showNavigator={false}
                  actionsChildren={<div />}
                  style={{ 
                    height: '100%',
                    width: '100%'
                  }}
                />
              </SandpackLayout>
            </SandpackProvider>
          </div>
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
