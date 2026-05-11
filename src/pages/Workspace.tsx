import React from 'react';
import Sidebar from '../components/workspace/Sidebar';
import CodeEditor from '../components/workspace/CodeEditor';
import LivePreview from '../components/workspace/LivePreview';
import PromptBar from '../components/workspace/PromptBar';

const Workspace: React.FC = () => {
  return (
    <div className="h-screen w-screen overflow-hidden flex bg-[#0a0a0c] text-white">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col relative h-full">
        
        {/* Top Navbar inside Workspace */}
        <div className="h-12 border-b border-white/5 bg-zinc-950 flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm">Untitled Project</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-zinc-800 text-zinc-400">DRAFT</span>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="text-xs font-medium text-zinc-400 hover:text-white transition-colors">
              Share
            </button>
            <button className="bg-white text-black text-xs font-semibold px-3 py-1.5 rounded-md hover:bg-zinc-200 transition-colors">
              Deploy
            </button>
          </div>
        </div>

        {/* 2-Pane Editor & Preview */}
        <div className="flex-1 flex overflow-hidden relative">
          {/* Editor Pane (Left half) */}
          <div className="w-1/2 h-full">
            <CodeEditor />
          </div>

          {/* Preview Pane (Right half) */}
          <div className="w-1/2 h-full">
            <LivePreview />
          </div>
        </div>

        {/* Floating Prompt Input */}
        <PromptBar />
      </div>
    </div>
  );
};

export default Workspace;
