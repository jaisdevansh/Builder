import React, { useEffect } from 'react';
import Editor, { useMonaco } from '@monaco-editor/react';
import { useStore } from '../../store/useStore';
import { LayoutTemplate } from 'lucide-react';

const CodeEditor: React.FC = () => {
  const { files, activeFile, updateFileContent, setPreviewLayout } = useStore();
  const file = files[activeFile];
  const monaco = useMonaco();

  useEffect(() => {
    if (monaco) {
      // Cast to any to bypass the deprecated typings issue in some monaco versions
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const ts = (monaco.languages as any).typescript;

      // Configure TypeScript defaults
      ts.typescriptDefaults.setCompilerOptions({
        jsx: ts.JsxEmit.React,
        jsxFactory: 'React.createElement',
        reactNamespace: 'React',
        allowNonTsExtensions: true,
        allowJs: true,
        target: ts.ScriptTarget.Latest,
        moduleResolution: ts.ModuleResolutionKind?.NodeJs || 2,
        module: ts.ModuleKind?.CommonJS || 1,
      });
      
      ts.typescriptDefaults.setDiagnosticsOptions({
        noSemanticValidation: true,
        noSyntaxValidation: false,
      });

      // Configure JavaScript defaults as well, just in case
      ts.javascriptDefaults.setCompilerOptions({
        jsx: ts.JsxEmit.React,
        jsxFactory: 'React.createElement',
        reactNamespace: 'React',
        allowNonTsExtensions: true,
        allowJs: true,
        target: ts.ScriptTarget.Latest,
      });
      
      ts.javascriptDefaults.setDiagnosticsOptions({
        noSemanticValidation: true,
        noSyntaxValidation: false,
      });
    }
  }, [monaco]);

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      updateFileContent(activeFile, value);
    }
  };

  if (!file) return null;

  const language = activeFile.endsWith('.css') ? 'css' : 'typescript';

  return (
    <div className="flex-1 h-full bg-[#1e1e1e] flex flex-col">
      <div className="h-10 bg-[#2d2d2d] flex items-center justify-between px-4 border-b border-black/40">
        <div className="flex items-center gap-2 bg-[#1e1e1e] px-4 py-2 text-sm text-zinc-300 border-t border-blue-500">
          {file.name}
        </div>
        <button 
          onClick={() => setPreviewLayout('split')}
          className="flex items-center gap-2 text-sm font-bold bg-blue-600 text-white hover:bg-blue-500 px-4 py-1.5 rounded-md transition-all shadow-[0_0_15px_rgba(37,99,235,0.4)] animate-pulse"
        >
          <LayoutTemplate className="w-4 h-4" />
          Restore Preview
        </button>
      </div>
      <div className="flex-1">
        <Editor
          height="100%"
          language={language}
          theme="vs-dark"
          value={file.code}
          onChange={handleEditorChange}
          path={activeFile}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            wordWrap: 'on',
            padding: { top: 16 },
            scrollBeyondLastLine: false,
            smoothScrolling: true,
            cursorBlinking: 'smooth',
            formatOnPaste: true,
          }}
          loading={
            <div className="flex items-center justify-center h-full text-zinc-500">
              Loading Premium Editor...
            </div>
          }
        />
      </div>
    </div>
  );
};

export default CodeEditor;
