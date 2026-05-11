import React from 'react';
import Editor from '@monaco-editor/react';
import { useStore } from '../../store/useStore';

const CodeEditor: React.FC = () => {
  const { files, activeFile, updateFileContent } = useStore();
  const file = files[activeFile];

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      updateFileContent(activeFile, value);
    }
  };

  if (!file) return null;

  const language = activeFile.endsWith('.css') ? 'css' : 'typescript';

  return (
    <div className="flex-1 h-full bg-[#1e1e1e] flex flex-col">
      <div className="h-10 bg-[#2d2d2d] flex items-center px-4 border-b border-black/40">
        <div className="flex items-center gap-2 bg-[#1e1e1e] px-4 py-2 text-sm text-zinc-300 border-t border-blue-500">
          {file.name}
        </div>
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
