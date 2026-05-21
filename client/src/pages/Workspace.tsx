import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Sidebar from '../components/workspace/Sidebar';
import CodeEditor from '../components/workspace/CodeEditor';
import LivePreview from '../components/workspace/LivePreview';
import PromptBar from '../components/workspace/PromptBar';
import { useStore } from '../store/useStore';
import { Moon, Sun, Download } from 'lucide-react';

interface ProjectFile {
  file_name: string;
  content: string;
}

const Workspace: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { theme, toggleTheme, files, projectTitle, setFiles, setProjectTitle, setActiveFile, previewLayout } = useStore();
  const projectId = searchParams.get('project');

  useEffect(() => {
    if (!projectId) return;

    const loadProject = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/projects/${projectId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          if (data.project) {
            setProjectTitle(data.project.title);
            // Format files array to Zustand store format: Record<string, { name: string, code: string }>
            const formattedFiles: Record<string, { name: string, code: string }> = {};
            data.project.files.forEach((file: ProjectFile) => {
              // Ensure path has leading slash
              const path = file.file_name.startsWith('/') ? file.file_name : `/${file.file_name}`;
              formattedFiles[path] = {
                name: file.file_name,
                code: file.content
              };
            });
            
            if (Object.keys(formattedFiles).length > 0) {
              setFiles(formattedFiles);
              // Ensure we have a valid active file to prevent CodeEditor from showing a blank screen or crashing
              if (formattedFiles['/App.tsx']) {
                setActiveFile('/App.tsx');
              } else {
                setActiveFile(Object.keys(formattedFiles)[0]);
              }
            }
          }
        }
      } catch (error) {
        console.error('Failed to load project:', error);
      }
    };

    loadProject();
  }, [projectId, setFiles, setProjectTitle, setActiveFile]);

  const handleExport = () => {
    // Basic export: create a blob from the files and trigger a download
    const projectData = JSON.stringify(files, null, 2);
    const blob = new Blob([projectData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectTitle.toLowerCase().replace(/[^a-z0-9]/g, '-')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`h-screen w-screen overflow-hidden flex ${theme === 'light' ? 'bg-zinc-100 text-zinc-900' : 'bg-[#0a0a0c] text-white'}`}>
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col relative h-full">
        
        {/* Top Navbar inside Workspace */}
        <div className={`h-12 border-b flex items-center justify-between px-4 ${theme === 'light' ? 'bg-white border-zinc-200' : 'bg-zinc-950 border-white/5'}`}>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm">{projectTitle}</span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${theme === 'light' ? 'bg-zinc-200 text-zinc-600' : 'bg-zinc-800 text-zinc-400'}`}>DRAFT</span>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={toggleTheme}
              className={`p-1.5 rounded-md transition-colors ${theme === 'light' ? 'text-zinc-500 hover:bg-zinc-100' : 'text-zinc-400 hover:bg-zinc-800'}`}
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button 
              onClick={handleExport}
              className={`flex items-center gap-1 text-xs font-medium transition-colors ${theme === 'light' ? 'text-zinc-600 hover:text-black' : 'text-zinc-400 hover:text-white'}`}
            >
              <Download className="w-3.5 h-3.5" />
              Export
            </button>
            <button className="text-xs font-medium text-zinc-400 hover:text-white transition-colors">
              Share
            </button>
            <button className="bg-primary text-white text-xs font-semibold px-3 py-1.5 rounded-md hover:bg-blue-600 transition-colors shadow-[0_0_15px_rgba(59,130,246,0.3)]">
              Deploy
            </button>
          </div>
        </div>

        {/* 2-Pane Editor & Preview */}
        <div className="flex-1 flex min-h-0 overflow-hidden relative">
          {/* Editor Pane (Left half) */}
          <div 
            className={`h-full flex flex-col min-h-0 border-r border-white/5 transition-all duration-500 ease-in-out ${
              previewLayout === 'code-maximized' ? 'w-full' :
              previewLayout === 'preview-maximized' ? 'w-0 border-none overflow-hidden opacity-0' :
              'w-1/2'
            }`}
          >
            <CodeEditor />
          </div>

          {/* Preview Pane (Right half) */}
          <div 
            className={`h-full flex flex-col min-h-0 transition-all duration-500 ease-in-out ${
              previewLayout === 'preview-maximized' ? 'w-full' :
              previewLayout === 'code-maximized' ? 'w-0 overflow-hidden opacity-0' :
              'w-1/2'
            }`}
          >
            <LivePreview />
          </div>
        </div>

        {/* Floating Prompt Input */}
        {previewLayout !== 'preview-maximized' && <PromptBar />}
      </div>
    </div>
  );
};

export default Workspace;
