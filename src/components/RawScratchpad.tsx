import React, { useState } from 'react';
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Quote, 
  Clock, 
  Sparkles, 
  Check, 
  FileText,
  CornerDownLeft,
  Info
} from 'lucide-react';

interface RawScratchpadProps {
  rawNotes: string;
  onChange: (notes: string) => void;
  onEnhance: () => void;
  isEnhancing: boolean;
}

export const RawScratchpad: React.FC<RawScratchpadProps> = ({
  rawNotes,
  onChange,
  onEnhance,
  isEnhancing,
}) => {
  const [copied, setCopied] = useState(false);

  const insertTextAtCursor = (prefix: string, suffix: string = '') => {
    const textarea = document.getElementById('scratchpad-editor') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = rawNotes.substring(start, end);
    const replacement = `${prefix}${selected || 'text'}${suffix}`;

    const newNotes = rawNotes.substring(0, start) + replacement + rawNotes.substring(end);
    onChange(newNotes);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + replacement.length - suffix.length);
    }, 10);
  };

  const insertTimestamp = () => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    insertTextAtCursor(`[${timeStr}] `);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(rawNotes);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const wordCount = rawNotes.trim() ? rawNotes.trim().split(/\s+/).length : 0;
  const lineCount = rawNotes ? rawNotes.split('\n').length : 0;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 space-y-4">
      {/* Scratchpad Header & Formatting Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-stone-200/80 dark:border-zinc-800/80">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-stone-700 dark:text-zinc-300 flex items-center gap-2">
            <FileText size={15} />
            Raw Scratchpad Notes
          </h2>
          <p className="text-[11px] text-stone-500 dark:text-zinc-400">
            Type fast bullets as you listen. Quote Notes will synthesize these with the live transcript.
          </p>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-1 bg-stone-100/90 dark:bg-zinc-800/80 p-1 rounded-xl border border-black/[0.06] dark:border-white/[0.07] shadow-craft-sm">
          <button
            onClick={() => insertTextAtCursor('**', '**')}
            className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-zinc-700 text-stone-700 dark:text-zinc-300 transition-colors btn-tactile cursor-pointer"
            title="Bold"
          >
            <Bold size={13} />
          </button>
          <button
            onClick={() => insertTextAtCursor('*', '*')}
            className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-zinc-700 text-stone-700 dark:text-zinc-300 transition-colors btn-tactile cursor-pointer"
            title="Italic"
          >
            <Italic size={13} />
          </button>
          <button
            onClick={() => insertTextAtCursor('- ')}
            className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-zinc-700 text-stone-700 dark:text-zinc-300 transition-colors btn-tactile cursor-pointer"
            title="Bullet item"
          >
            <List size={13} />
          </button>
          <button
            onClick={() => insertTextAtCursor('1. ')}
            className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-zinc-700 text-stone-700 dark:text-zinc-300 transition-colors btn-tactile cursor-pointer"
            title="Numbered list"
          >
            <ListOrdered size={13} />
          </button>
          <button
            onClick={() => insertTextAtCursor('> "')}
            className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-zinc-700 text-stone-700 dark:text-zinc-300 transition-colors btn-tactile cursor-pointer"
            title="Quote block"
          >
            <Quote size={13} />
          </button>
          <button
            onClick={insertTimestamp}
            className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-zinc-700 text-stone-700 dark:text-zinc-300 transition-colors btn-tactile cursor-pointer"
            title="Insert timestamp"
          >
            <Clock size={13} />
          </button>
        </div>
      </div>

      {/* Main Textarea */}
      <div className="relative rounded-2xl bg-white dark:bg-[#181817] border border-black/[0.07] dark:border-white/[0.08] shadow-craft p-4 sm:p-6 transition-all focus-within:border-amber-400 dark:focus-within:border-amber-500/80 focus-within:ring-2 focus-within:ring-amber-400/20">
        <textarea
          id="scratchpad-editor"
          value={rawNotes}
          onChange={(e) => onChange(e.target.value)}
          placeholder={`Take messy bullets while listening...
- Discussed launch milestone
- Sarah: "If we don't fix the Linear sync roundtrip, users won't switch from Granola"
- High retention cohort numbers
- Action: Alex to finalize comparison page`}
          rows={15}
          className="w-full bg-transparent text-stone-800 dark:text-zinc-100 placeholder-stone-400 dark:placeholder-zinc-600 text-sm sm:text-base leading-relaxed font-sans outline-none resize-y"
        />

        {/* Footer info bar */}
        <div className="mt-4 pt-3 border-t border-black/[0.05] dark:border-white/[0.06] flex items-center justify-between text-xs text-stone-400 dark:text-zinc-500">
          <div className="flex items-center gap-3">
            <span>{wordCount} words</span>
            <span>•</span>
            <span>{lineCount} lines</span>
            <span>•</span>
            <span className="text-emerald-700 dark:text-emerald-400 font-medium flex items-center gap-1">
              <Check size={11} /> Saved
            </span>
          </div>

          <button
            onClick={handleCopy}
            className="hover:text-stone-800 dark:hover:text-zinc-200 transition-colors btn-tactile cursor-pointer"
          >
            {copied ? 'Copied!' : 'Copy raw text'}
          </button>
        </div>
      </div>

      {/* Granola Synthesis Hint Banner */}
      <div
        className="p-4 rounded-2xl border shadow-craft-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
        style={{
          backgroundColor: 'var(--theme-primary-light)',
          borderColor: 'var(--border-hairline)',
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="p-2 rounded-xl shadow-craft-sm"
            style={{
              backgroundColor: 'var(--bg-card)',
              color: 'var(--theme-primary)',
            }}
          >
            <Sparkles size={16} />
          </div>
          <div>
            <h4
              className="text-xs font-bold"
              style={{ color: 'var(--theme-primary-text)' }}
            >
              Ready to create Quote Notes?
            </h4>
            <p
              className="text-[11px] opacity-80"
              style={{ color: 'var(--theme-primary-text)' }}
            >
              Gemini will merge your scratchpad notes with the full transcript to extract verbatim quotes and sync-ready tasks.
            </p>
          </div>
        </div>

        <button
          onClick={onEnhance}
          disabled={isEnhancing}
          className="px-4 py-2 rounded-xl text-white font-semibold text-xs flex items-center gap-1.5 shadow-clean-xs transition-all shrink-0 btn-tactile cursor-pointer disabled:opacity-50"
          style={{ backgroundColor: 'var(--theme-primary)' }}
        >
          <Sparkles size={13} className={isEnhancing ? 'animate-spin' : ''} />
          <span>{isEnhancing ? 'Synthesizing...' : 'Enhance Notes (⌘E)'}</span>
        </button>
      </div>
    </div>
  );
};
