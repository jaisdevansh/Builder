import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, Paperclip, X, FileImage } from 'lucide-react';
import { useStore, type FileData } from '../../store/useStore';

const PromptBar: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { setGenerating, isGenerating, addPrompt } = useStore();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setAttachedFiles(prev => [...prev, ...newFiles].slice(0, 3)); // max 3 files
    }
    e.target.value = ''; // reset so same file can be re-picked
  };

  const removeFile = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isGenerating) return;

    addPrompt(prompt);
    setGenerating(true);

    // Build enriched prompt with attached file context
    let enrichedPrompt = prompt;
    if (attachedFiles.length > 0) {
      enrichedPrompt += `\n\n[User attached ${attachedFiles.length} image(s) as design reference: ${attachedFiles.map(f => f.name).join(', ')}. Match the style and layout from these references.]`;
    }

    setPrompt('');
    setAttachedFiles([]);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ prompt: enrichedPrompt })
      });

      const result = await response.json();

      if (result.success && result.data.files) {
        const formattedFiles = Object.entries(result.data.files as Record<string, string>).reduce<Record<string, FileData>>((acc, [name, code]) => {
          acc[`/${name}`] = { name, code };
          return acc;
        }, {});

        useStore.getState().setFiles(formattedFiles);
        if (result.data.projectName) {
          useStore.getState().setProjectTitle(result.data.projectName);
        }
        useStore.getState().setActiveFile('/App.tsx');
      } else {
        console.error('Generation failed:', result.error);
        alert(result.error || 'Failed to generate UI. Please try again.');
      }
    } catch (error) {
      console.error('Error calling generate API:', error);
      alert('An error occurred during generation. Please check your connection.');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-full max-w-3xl px-6 z-40">
      <motion.form
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        onSubmit={handleGenerate}
        className="relative flex flex-col bg-zinc-900/80 backdrop-blur-2xl border border-white/10 rounded-2xl p-2 shadow-2xl focus-within:border-primary/50 focus-within:ring-4 focus-within:ring-primary/10 transition-all"
      >
        {/* Attached file chips */}
        <AnimatePresence>
          {attachedFiles.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex flex-wrap gap-2 px-2 pt-1 pb-2"
            >
              {attachedFiles.map((file, index) => (
                <motion.div
                  key={`${file.name}-${index}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex items-center gap-1.5 bg-primary/20 border border-primary/30 rounded-lg px-2 py-1 text-xs text-primary"
                >
                  <FileImage className="w-3 h-3 flex-shrink-0" />
                  <span className="max-w-[120px] truncate">{file.name}</span>
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="ml-0.5 hover:text-white transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-end gap-2">
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleFileChange}
          />

          {/* Paperclip button — now fully wired */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            title="Attach design reference image (max 3)"
            className={`p-3 transition-colors rounded-xl hover:bg-white/5 ${
              attachedFiles.length > 0 ? 'text-primary' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Paperclip className="w-5 h-5" />
          </button>

          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the UI you want to build..."
            className="flex-1 max-h-32 min-h-[44px] bg-transparent border-none outline-none text-white placeholder:text-zinc-500 resize-none py-3 px-2"
            rows={1}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleGenerate(e);
              }
            }}
          />

          <button
            type="submit"
            disabled={!prompt.trim() || isGenerating}
            className="p-3 rounded-xl bg-primary text-white hover:bg-blue-600 disabled:opacity-50 disabled:hover:bg-primary transition-all flex items-center justify-center disabled:cursor-not-allowed"
          >
            <AnimatePresence mode="wait">
              {isGenerating ? (
                <motion.div
                  key="generating"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"
                />
              ) : (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                >
                  <Send className="w-5 h-5" />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>
      </motion.form>

      <div className="flex items-center justify-center gap-2 mt-4 text-xs text-zinc-500 font-medium">
        <Sparkles className="w-3 h-3 text-primary" />
        <span>Buildify AI can make mistakes. Check the code.</span>
      </div>
    </div>
  );
};

export default PromptBar;
