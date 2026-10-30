import React, { useState } from 'react';
import { 
  X, 
  Mail, 
  Copy, 
  Check, 
  Download, 
  ExternalLink, 
  Share2, 
  FileText,
  Quote
} from 'lucide-react';
import { Meeting } from '../types';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  meeting: Meeting;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  meeting,
}) => {
  const [activeTab, setActiveTab] = useState<'email' | 'markdown'>('email');
  const [copied, setCopied] = useState(false);
  const [emailSubject, setEmailSubject] = useState(
    meeting.followUpEmailDraft?.subject || `Recap & Action Items: ${meeting.title}`
  );
  const [emailBody, setEmailBody] = useState(
    meeting.followUpEmailDraft?.body || generateDefaultEmail(meeting)
  );

  if (!isOpen) return null;

  function generateDefaultEmail(m: Meeting): string {
    const attendees = m.participants.map((p) => p.name).join(', ');
    const bullets = m.keyTakeaways
      .flatMap((k) => k.points)
      .slice(0, 4)
      .map((p) => `• ${p}`)
      .join('\n');

    const tasks = m.actionItems
      .slice(0, 5)
      .map((t, idx) => `${idx + 1}. ${t.title} (${t.assignee} - Due: ${t.dueDate})`)
      .join('\n');

    const quotes = m.quotes
      .slice(0, 2)
      .map((q) => `> "${q.quote}" — ${q.speaker} [${q.time}]`)
      .join('\n\n');

    return `Hi team,\n\nHere is a recap and next steps from our meeting: "${m.title}".\n\nExecutive Summary:\n${m.executiveSummary}\n\nKey Takeaways:\n${bullets}\n\nVerbatim Highlights:\n${quotes}\n\nAction Items:\n${tasks}\n\nBest,\nQuote Notes`;
  }

  function generateFullMarkdown(m: Meeting): string {
    return `# ${m.title}
**Date:** ${m.date} | **Duration:** ${m.durationMinutes} mins
**Participants:** ${m.participants.map((p) => `${p.name} (${p.role})`).join(', ')}

## Executive Summary
${m.executiveSummary}

## Verbatim Quotes
${m.quotes.map((q) => `> "${q.quote}"\n> — **${q.speaker}** [${q.time}] *(${q.context})*`).join('\n\n')}

## Key Decisions & Takeaways
${m.keyTakeaways.map((cat) => `### ${cat.category}\n${cat.points.map((pt) => `- ${pt}`).join('\n')}`).join('\n\n')}

## Action Items
${m.actionItems.map((a) => `- [${a.completed ? 'x' : ' '}] **${a.title}** (${a.assignee}) - Priority: ${a.priority.toUpperCase()} - Due: ${a.dueDate}${a.sourceQuote ? `\n  - *Ref: "${a.sourceQuote}"*` : ''}`).join('\n')}

---
*Generated with Quote Notes — Granola-style meeting tool*
`;
  }

  const handleCopy = () => {
    const text = activeTab === 'email' ? `${emailSubject}\n\n${emailBody}` : generateFullMarkdown(meeting);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadMarkdown = () => {
    const md = generateFullMarkdown(meeting);
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${meeting.title.toLowerCase().replace(/\s+/g, '-')}-notes.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleOpenMailClient = () => {
    const mailto = `mailto:${meeting.participants.map(p => p.email).filter(Boolean).join(',')}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
    window.open(mailto, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 animate-emil-fade">
      <div className="bg-white dark:bg-[#181817] rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-craft-modal border border-black/[0.08] dark:border-white/[0.08] overflow-hidden animate-emil-modal">
        {/* Header */}
        <div className="p-4.5 border-b border-black/[0.06] dark:border-white/[0.07] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Share2 size={16} className="text-amber-600 dark:text-amber-400" />
            <h3 className="text-sm font-bold text-stone-900 dark:text-zinc-100">
              Share & Export Meeting Digest
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-zinc-200 btn-tactile cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="px-5 pt-3 flex gap-2 border-b border-black/[0.06] dark:border-white/[0.07]">
          <button
            onClick={() => setActiveTab('email')}
            className={`pb-2.5 text-xs font-semibold flex items-center gap-1.5 border-b-2 transition-all ease-emil btn-tactile cursor-pointer ${
              activeTab === 'email'
                ? 'border-amber-600 dark:border-amber-400 text-stone-900 dark:text-white'
                : 'border-transparent text-stone-400 hover:text-stone-700 dark:hover:text-zinc-300'
            }`}
          >
            <Mail size={13} />
            Follow-Up Email Draft
          </button>
          <button
            onClick={() => setActiveTab('markdown')}
            className={`pb-2.5 text-xs font-semibold flex items-center gap-1.5 border-b-2 transition-all ease-emil btn-tactile cursor-pointer ${
              activeTab === 'markdown'
                ? 'border-amber-600 dark:border-amber-400 text-stone-900 dark:text-white'
                : 'border-transparent text-stone-400 hover:text-stone-700 dark:hover:text-zinc-300'
            }`}
          >
            <FileText size={13} />
            Clean Markdown Document
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {activeTab === 'email' ? (
            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-stone-500 block mb-1">
                  Subject Line
                </label>
                <input
                  type="text"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg bg-stone-50 dark:bg-zinc-900 border border-stone-200 dark:border-zinc-700 text-stone-800 dark:text-zinc-200 outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-stone-500 block mb-1">
                  Email Body (Editable)
                </label>
                <textarea
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  rows={12}
                  className="w-full text-xs p-3 rounded-lg bg-stone-50 dark:bg-zinc-900 border border-stone-200 dark:border-zinc-700 text-stone-800 dark:text-zinc-200 font-sans outline-none leading-relaxed"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <label className="text-[11px] font-semibold text-stone-500 block">
                Markdown Preview
              </label>
              <pre className="text-xs p-3 rounded-lg bg-stone-900 text-stone-200 font-mono-code overflow-x-auto max-h-96 whitespace-pre-wrap">
                {generateFullMarkdown(meeting)}
              </pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-200 dark:border-zinc-800 bg-stone-50 dark:bg-zinc-900 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {activeTab === 'email' && (
              <button
                onClick={handleOpenMailClient}
                className="text-xs px-3 py-1.5 rounded-lg border border-stone-300 dark:border-zinc-700 text-stone-700 dark:text-zinc-300 hover:bg-stone-100 dark:hover:bg-zinc-800 flex items-center gap-1.5 transition"
              >
                <ExternalLink size={12} />
                Open Email App
              </button>
            )}

            {activeTab === 'markdown' && (
              <button
                onClick={handleDownloadMarkdown}
                className="text-xs px-3 py-1.5 rounded-lg border border-stone-300 dark:border-zinc-700 text-stone-700 dark:text-zinc-300 hover:bg-stone-100 dark:hover:bg-zinc-800 flex items-center gap-1.5 transition"
              >
                <Download size={12} />
                Download .md
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 text-xs text-stone-500 hover:text-stone-700"
            >
              Done
            </button>
            <button
              onClick={handleCopy}
              className="px-3.5 py-1.5 text-xs font-semibold bg-stone-900 dark:bg-amber-500 text-white dark:text-stone-950 rounded-lg flex items-center gap-1.5 shadow-xs"
            >
              {copied ? <Check size={13} className="text-emerald-400 dark:text-emerald-950" /> : <Copy size={13} />}
              <span>{copied ? 'Copied to Clipboard' : 'Copy All'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
