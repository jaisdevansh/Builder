import { create } from 'zustand';

export interface FileData {
  name: string;
  code: string;
}

type Theme = 'dark' | 'light';

interface WorkspaceState {
  files: Record<string, FileData>;
  activeFile: string;
  isGenerating: boolean;
  promptHistory: string[];
  theme: Theme;
  projectTitle: string;
  setActiveFile: (fileName: string) => void;
  updateFileContent: (fileName: string, content: string) => void;
  setGenerating: (status: boolean) => void;
  addPrompt: (prompt: string) => void;
  toggleTheme: () => void;
  setFiles: (files: Record<string, FileData>) => void;
  setProjectTitle: (title: string) => void;
}

const defaultFiles: Record<string, FileData> = {
  '/App.tsx': {
    name: 'App.tsx',
    code: `import React from "react";
import "./styles.css";

export default function App() {
  return (
    <div className="flex min-h-[100vh] flex-col items-center justify-center bg-zinc-950 p-8 text-zinc-50">
      <div className="w-full max-w-sm rounded-3xl border border-white/10 bg-zinc-900/40 p-8 shadow-2xl backdrop-blur-2xl transition-all hover:border-blue-500/30">
        <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600/20 text-2xl shadow-[0_0_20px_rgba(37,99,235,0.2)]">
          ✨
        </div>
        <h1 className="mb-3 text-3xl font-bold tracking-tight bg-gradient-to-br from-white to-zinc-500 bg-clip-text text-transparent">
          Buildify AI
        </h1>
        <p className="mb-8 text-zinc-400 leading-relaxed">
          Your creative workspace is ready. Type a prompt below to start building high-performance web interfaces with AI.
        </p>
        <button className="group relative w-full overflow-hidden rounded-2xl bg-blue-600 py-4 font-bold text-white transition-all hover:bg-blue-500 hover:shadow-[0_0_30px_rgba(37,99,235,0.4)]">
          <span className="relative z-10">Get Started</span>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
        </button>
      </div>
    </div>
  );
}
`
  },
  '/styles.css': {
    name: 'styles.css',
    code: `/* Tailwind is loaded via CDN */

html, body {
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

#root {
  height: 100%;
  width: 100%;
}

body {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
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
  theme: 'dark',
  projectTitle: 'Untitled Project',
  
  setActiveFile: (fileName) => set({ activeFile: fileName }),
    
  updateFileContent: (fileName, content) =>
    set((state) => ({
      files: {
        ...state.files,
        [fileName]: { ...state.files[fileName], code: content }
      }
    })),
    
  setGenerating: (status) => set({ isGenerating: status }),
  
  addPrompt: (prompt) => 
    set((state) => ({ promptHistory: [prompt, ...state.promptHistory] })),

  toggleTheme: () => set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),

  setFiles: (files) => set({ files }),

  setProjectTitle: (title) => set({ projectTitle: title }),
}));
