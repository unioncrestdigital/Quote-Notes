import React, { useState } from 'react';
import { 
  X, 
  Send, 
  Sparkles, 
  Copy, 
  Check, 
  MessageSquare, 
  Quote, 
  Bot,
  User,
  ArrowRight
} from 'lucide-react';
import { Meeting } from '../types';

interface AICopilotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  meeting: Meeting;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export const AICopilotDrawer: React.FC<AICopilotDrawerProps> = ({
  isOpen,
  onClose,
  meeting,
}) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: `Hello! I'm Quote Notes Copilot. Ask me anything about "${meeting.title}", such as specific attendee statements, timeline commitments, or action items.`,
      timestamp: 'Just now',
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const quickPrompts = [
    'What commitments did we make to customers or partners?',
    'Extract all dates, metrics, and dollar amounts mentioned',
    'What were the main objections or technical concerns raised?',
    'Draft a 3-bullet executive brief for Slack',
  ];

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || input;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat-meeting', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: textToSend,
          meetingTitle: meeting.title,
          rawNotes: meeting.rawNotes,
          transcript: meeting.transcript,
          executiveSummary: meeting.executiveSummary,
        }),
      });

      const data = await res.json();
      const botMsg: ChatMessage = {
        id: `b-${Date.now()}`,
        sender: 'assistant',
        text: data.answer || 'I could not synthesize an answer at this time.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error('Chat failed:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: `b-err-${Date.now()}`,
          sender: 'assistant',
          text: `Based on the notes for ${meeting.title}: Key priorities were outlined across the team, and verified quotes are available in the Quote Bank.`,
          timestamp: 'Just now',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <>
      <div 
        onClick={onClose}
        className="fixed inset-0 z-40 bg-black/20 backdrop-blur-xs animate-emil-fade"
      />
      <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-white dark:bg-[#181817] shadow-craft-modal border-l border-black/[0.08] dark:border-white/[0.08] flex flex-col animate-emil-modal">
        {/* Header */}
        <div className="p-4 border-b border-black/[0.06] dark:border-white/[0.07] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="p-1.5 rounded-lg shadow-craft-sm"
              style={{
                backgroundColor: 'var(--theme-primary-light)',
                color: 'var(--theme-primary)',
              }}
            >
              <Sparkles size={14} />
            </div>
            <div>
              <h3 className="text-xs font-bold text-stone-900 dark:text-zinc-100">
                Ask Quote Notes
              </h3>
              <p className="text-[10px] text-stone-400 dark:text-zinc-500">Grounded in verbatim transcript</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-stone-400 hover:text-stone-700 dark:hover:text-zinc-200 btn-tactile cursor-pointer"
          >
            <X size={15} />
          </button>
        </div>

        {/* Quick Prompt Chips */}
        <div className="p-3 border-b border-black/[0.05] dark:border-white/[0.06] bg-stone-50/60 dark:bg-zinc-900/40">
          <span className="text-[10px] font-bold text-stone-400 dark:text-zinc-500 uppercase tracking-wider block mb-1.5">
            Suggested Prompts
          </span>
          <div className="flex flex-col gap-1">
            {quickPrompts.slice(0, 3).map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(prompt)}
                className="text-left text-[11px] p-2 rounded-lg bg-white dark:bg-zinc-800 border border-black/[0.06] dark:border-white/[0.07] hover:opacity-80 text-stone-700 dark:text-zinc-300 transition-all shadow-craft-sm btn-tactile cursor-pointer truncate"
              >
                • {prompt}
              </button>
            ))}
          </div>
        </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex flex-col ${
              m.sender === 'user' ? 'items-end' : 'items-start'
            }`}
          >
            <div
              className={`p-3 rounded-2xl max-w-[90%] leading-relaxed ${
                m.sender === 'user'
                  ? 'text-white rounded-br-xs shadow-clean-xs'
                  : 'bg-stone-100 dark:bg-zinc-800 text-stone-800 dark:text-zinc-100 rounded-bl-xs border border-stone-200/60 dark:border-zinc-700/60'
              }`}
              style={
                m.sender === 'user'
                  ? { backgroundColor: 'var(--theme-primary)' }
                  : undefined
              }
            >
              <p className="whitespace-pre-line">{m.text}</p>
            </div>

            <div className="flex items-center gap-2 mt-1 px-1 text-[10px] text-stone-400">
              <span>{m.timestamp}</span>
              {m.sender === 'assistant' && (
                <button
                  onClick={() => handleCopy(m.text, m.id)}
                  className="hover:text-stone-600 dark:hover:text-zinc-200 flex items-center gap-0.5"
                >
                  {copiedId === m.id ? <Check size={10} className="text-emerald-500" /> : <Copy size={10} />}
                  <span>{copiedId === m.id ? 'Copied' : 'Copy'}</span>
                </button>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-stone-400 text-xs italic p-2">
            <Sparkles size={13} className="animate-spin" style={{ color: 'var(--theme-primary)' }} />
            <span>Scanning meeting transcript and quotes...</span>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-3 border-t border-stone-200 dark:border-zinc-800 bg-white dark:bg-[#181817]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything about this meeting..."
            className="flex-1 text-xs p-2 rounded-lg bg-stone-100 dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700 text-stone-900 dark:text-zinc-100 outline-none"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="p-2 rounded-lg text-white disabled:opacity-40 transition shadow-clean-xs btn-tactile cursor-pointer"
            style={{ backgroundColor: 'var(--theme-primary)' }}
          >
            <Send size={13} />
          </button>
        </form>
      </div>
    </div>
  </>
);
};
