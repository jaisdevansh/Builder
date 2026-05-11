import { create } from 'zustand';

export interface FileData {
  name: string;
  code: string;
  active: boolean;
}

interface WorkspaceState {
  files: Record<string, FileData>;
  activeFile: string;
  isGenerating: boolean;
  promptHistory: string[];
  setActiveFile: (fileName: string) => void;
  updateFileContent: (fileName: string, content: string) => void;
  setGenerating: (status: boolean) => void;
  addPrompt: (prompt: string) => void;
}

const defaultFiles = {
  '/App.tsx': {
    name: 'App.tsx',
    active: true,
    code: `import React from "react";
import "./styles.css";

export default function App() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 p-4 text-zinc-50">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-zinc-900/50 p-8 shadow-2xl backdrop-blur-xl">
        <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/20 text-blue-400">
          ✨
        </div>
        <h1 className="mb-2 text-2xl font-bold tracking-tight">Buildify AI Workspace</h1>
        <p className="mb-6 text-zinc-400">
          Enter a prompt below to generate a new UI. This preview updates in real-time as the AI writes code.
        </p>
        <button className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white transition-colors hover:bg-blue-700">
          Get Started
        </button>
      </div>
    </div>
  );
}
`
  },
  '/styles.css': {
    name: 'styles.css',
    active: false,
    code: `@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  font-family: system-ui, sans-serif;
  background-color: #09090b;
  color: #fafafa;
}
`
  }
};

export const useStore = create<WorkspaceState>((set) => ({
  files: defaultFiles,
  activeFile: '/App.tsx',
  isGenerating: false,
  promptHistory: [],
  
  setActiveFile: (fileName) => 
    set((state) => ({ 
      activeFile: fileName,
      files: Object.keys(state.files).reduce((acc, key) => {
        acc[key] = { ...state.files[key], active: key === fileName };
        return acc;
      }, {} as Record<string, FileData>)
    })),
    
  updateFileContent: (fileName, content) =>
    set((state) => ({
      files: {
        ...state.files,
        [fileName]: { ...state.files[fileName], code: content }
      }
    })),
    
  setGenerating: (status) => set({ isGenerating: status }),
  
  addPrompt: (prompt) => 
    set((state) => ({ promptHistory: [prompt, ...state.promptHistory] }))
}));
