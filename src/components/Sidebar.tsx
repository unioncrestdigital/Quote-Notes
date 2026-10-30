import React, { useState } from 'react';
import { 
  FileText, 
  Mic, 
  Plus, 
  Search, 
  Quote, 
  CheckSquare, 
  Clock, 
  Calendar, 
  Moon, 
  Sun, 
  SlidersHorizontal,
  ChevronRight,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { Meeting } from '../types';

interface SidebarProps {
  meetings: Meeting[];
  currentMeetingId: string;
  onSelectMeeting: (id: string) => void;
  onOpenNewMeetingModal: () => void;
  onStartLiveMeeting: () => void;
  isRecordingActive: boolean;
  recordingSeconds: number;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  meetings,
  currentMeetingId,
  onSelectMeeting,
  onOpenNewMeetingModal,
  onStartLiveMeeting,
  isRecordingActive,
  recordingSeconds,
  darkMode,
  onToggleDarkMode,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTemplate, setFilterTemplate] = useState<string>('all');

  const filteredMeetings = meetings.filter((m) => {
    const matchesSearch = 
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.quotes.some(q => q.quote.toLowerCase().includes(searchQuery.toLowerCase())) ||
      m.participants.some(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesTemplate = filterTemplate === 'all' || m.template === filterTemplate;
    return matchesSearch && matchesTemplate;
  });

  // Calculate total quotes & synced tasks
  const totalQuotes = meetings.reduce((acc, m) => acc + m.quotes.length, 0);
  const totalSynced = meetings.reduce((acc, m) => 
    acc + m.actionItems.filter(item => item.syncedTo && Object.keys(item.syncedTo).length > 0).length, 0
  );

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <aside className="w-80 h-screen flex flex-col bg-[var(--bg-sidebar)] border-r border-[var(--border-hairline)] select-none shrink-0 transition-colors">
      {/* Brand Header */}
      <div className="p-4 pb-3 border-b border-[var(--border-hairline)]">
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-2.5">
            <div
              className="w-7 h-7 rounded-lg text-white flex items-center justify-center font-serif-quote font-bold text-lg shadow-clean-xs"
              style={{ backgroundColor: 'var(--theme-primary)' }}
            >
              “
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-stone-900 dark:text-stone-100 text-sm tracking-tight">
                  Quote Notes
                </span>
                <span className="text-[10px] text-stone-400 dark:text-zinc-500 font-mono-code font-normal">
                  v1.2
                </span>
              </div>
              <p className="text-[11px] text-stone-400 dark:text-zinc-500 font-normal">Meeting notes & task sync</p>
            </div>
          </div>

          <button
            onClick={onToggleDarkMode}
            className="p-1.5 rounded-md hover:bg-stone-200/50 dark:hover:bg-zinc-800 text-stone-400 hover:text-stone-700 dark:hover:text-zinc-200 btn-tactile cursor-pointer"
            title={darkMode ? 'Light mode' : 'Dark mode'}
          >
            {darkMode ? <Sun size={14} /> : <Moon size={14} />}
          </button>
        </div>

        {/* Primary Action Button: Record or New */}
        <div className="flex gap-2">
          {isRecordingActive ? (
            <button
              onClick={() => onSelectMeeting(currentMeetingId)}
              className="flex-1 py-2 px-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-medium text-xs flex items-center justify-center gap-2 shadow-clean-xs animate-pulse btn-tactile cursor-pointer"
            >
              <span className="w-2 h-2 rounded-full bg-white"></span>
              Recording {formatTime(recordingSeconds)}
            </button>
          ) : (
            <button
              onClick={onStartLiveMeeting}
              className="flex-1 py-2 px-3 rounded-xl bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-white text-white dark:text-stone-950 font-medium text-xs flex items-center justify-center gap-2 shadow-clean-xs btn-tactile cursor-pointer"
            >
              <Mic size={13} className="text-amber-400 dark:text-amber-600" />
              <span>Record Meeting</span>
            </button>
          )}

          <button
            onClick={onOpenNewMeetingModal}
            className="p-2 rounded-xl bg-white dark:bg-zinc-800 hover:bg-stone-100 dark:hover:bg-zinc-700 text-stone-600 dark:text-zinc-300 border border-black/[0.06] dark:border-white/[0.08] shadow-clean-xs btn-tactile cursor-pointer"
            title="Create blank meeting note"
          >
            <Plus size={15} />
          </button>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="p-3 pb-2.5 border-b border-black/[0.04] dark:border-white/[0.05] space-y-2">
        <div className="relative">
          <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-stone-400 dark:text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notes, quotes..."
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-black/[0.03] dark:bg-white/[0.05] border border-transparent focus:border-stone-300 dark:focus:border-zinc-700 focus:bg-white dark:focus:bg-zinc-800 text-stone-800 dark:text-zinc-200 placeholder-stone-400 dark:placeholder-zinc-500 outline-none transition-all"
          />
        </div>

        <div className="flex gap-1 overflow-x-auto pb-0.5 text-[11px] scrollbar-none">
          {['all', 'Product Review', 'Customer Discovery', 'Sprint Architecture'].map((tmpl) => (
            <button
              key={tmpl}
              onClick={() => setFilterTemplate(tmpl)}
              className={`px-2 py-0.5 rounded-lg whitespace-nowrap btn-tactile cursor-pointer transition-colors ${
                filterTemplate === tmpl
                  ? 'text-white font-medium shadow-clean-xs'
                  : 'text-stone-500 dark:text-zinc-400 hover:text-stone-800 dark:hover:text-zinc-200 hover:bg-black/[0.03] dark:hover:bg-white/[0.04]'
              }`}
              style={
                filterTemplate === tmpl
                  ? { backgroundColor: 'var(--theme-primary)' }
                  : undefined
              }
            >
              {tmpl === 'all' ? 'All' : tmpl}
            </button>
          ))}
        </div>
      </div>

      {/* Meetings List */}
      <div className="flex-1 overflow-y-auto px-2 py-2.5 space-y-1">
        <div className="px-2 pb-1 text-[10px] font-semibold tracking-wider uppercase text-stone-400 dark:text-zinc-500">
          Meetings ({filteredMeetings.length})
        </div>

        {filteredMeetings.length === 0 ? (
          <div className="p-6 text-center text-xs text-stone-400 dark:text-zinc-500">
            No meetings found. Start a new one!
          </div>
        ) : (
          filteredMeetings.map((m) => {
            const isSelected = m.id === currentMeetingId;
            const syncedCount = m.actionItems.filter(item => item.syncedTo && Object.keys(item.syncedTo).length > 0).length;

            return (
              <div
                key={m.id}
                onClick={() => onSelectMeeting(m.id)}
                className={`group p-2.5 rounded-xl cursor-pointer text-left relative transition-all btn-tactile ${
                  isSelected
                    ? 'bg-white dark:bg-zinc-800/90 shadow-clean-sm border border-black/[0.06] dark:border-white/[0.08]'
                    : 'hover:bg-black/[0.025] dark:hover:bg-white/[0.03] border border-transparent'
                }`}
              >
                <div className="flex items-start justify-between gap-1.5 mb-1">
                  <h4 className={`text-xs font-semibold line-clamp-1 leading-snug ${
                    isSelected ? 'text-stone-900 dark:text-zinc-50' : 'text-stone-700 dark:text-zinc-300'
                  }`}>
                    {m.title || 'Untitled Meeting'}
                  </h4>
                  {m.isLiveRecording && (
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping shrink-0 mt-1" />
                  )}
                </div>

                <div className="flex items-center gap-2 text-[10px] text-stone-400 dark:text-zinc-500 mb-1.5">
                  <span>{m.date}</span>
                  <span>•</span>
                  <span>{m.durationMinutes}m</span>
                  <span>•</span>
                  <span>{m.template}</span>
                </div>

                {/* Clean, quiet signals */}
                <div className="flex items-center justify-between text-[10px]">
                  <span
                    className="flex items-center gap-1 font-medium"
                    style={{ color: 'var(--theme-primary)' }}
                  >
                    <Quote size={8} style={{ color: 'var(--theme-primary)' }} />
                    {m.quotes.length} {m.quotes.length === 1 ? 'quote' : 'quotes'}
                  </span>

                  {syncedCount > 0 ? (
                    <span className="text-emerald-700 dark:text-emerald-400 font-medium flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      {syncedCount} synced
                    </span>
                  ) : (
                    <span className="text-stone-400 dark:text-zinc-500">
                      {m.actionItems.length} tasks
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Bottom Integration Footer */}
      <div className="p-3 border-t border-black/[0.04] dark:border-white/[0.05] bg-stone-100/40 dark:bg-zinc-900/40 text-xs">
        <div className="flex items-center justify-between text-[11px] bg-white dark:bg-zinc-800/80 p-2 rounded-xl border border-black/[0.05] dark:border-white/[0.06] shadow-clean-xs">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span className="font-medium text-stone-700 dark:text-zinc-300">Sync Pipeline</span>
          </div>
          <span className="text-[10px] text-stone-400 dark:text-zinc-500 font-mono-code">{totalSynced} tasks exported</span>
        </div>
      </div>
    </aside>
  );
};
