import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  Share2, 
  Users, 
  Plus, 
  Clock, 
  Calendar, 
  MessageSquare, 
  Check, 
  Copy,
  Mail,
  FileDown,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { Meeting, Participant } from '../types';
import { ColorPalette } from '../utils/themePalettes';
import { PaletteSelector } from './PaletteSelector';

interface MeetingHeaderProps {
  meeting: Meeting;
  onUpdateTitle: (title: string) => void;
  onUpdateTemplate: (template: Meeting['template']) => void;
  onAddParticipant: (p: Participant) => void;
  onEnhanceNotes: () => void;
  isEnhancing: boolean;
  onOpenSyncModal: () => void;
  onToggleCopilot: () => void;
  isCopilotOpen: boolean;
  onOpenShareModal: () => void;
  currentPalette: ColorPalette;
  onSelectPalette: (palette: ColorPalette) => void;
}

export const MeetingHeader: React.FC<MeetingHeaderProps> = ({
  meeting,
  onUpdateTitle,
  onUpdateTemplate,
  onAddParticipant,
  onEnhanceNotes,
  isEnhancing,
  onOpenSyncModal,
  onToggleCopilot,
  isCopilotOpen,
  onOpenShareModal,
  currentPalette,
  onSelectPalette,
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState(meeting.title);
  const [showParticipantInput, setShowParticipantInput] = useState(false);
  const [newPersonName, setNewPersonName] = useState('');
  const [newPersonRole, setNewPersonRole] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  const handleTitleSubmit = () => {
    if (titleInput.trim()) {
      onUpdateTitle(titleInput.trim());
    }
    setIsEditingTitle(false);
  };

  const handleAddPerson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPersonName.trim()) return;
    onAddParticipant({
      id: `p-${Date.now()}`,
      name: newPersonName.trim(),
      role: newPersonRole.trim() || 'Contributor',
    });
    setNewPersonName('');
    setNewPersonRole('');
    setShowParticipantInput(false);
  };

  const pendingTasksCount = meeting.actionItems.filter(
    (t) => !t.syncedTo || Object.keys(t.syncedTo).length === 0
  ).length;

  return (
    <header className="px-6 py-3 bg-[var(--bg-main)]/90 backdrop-blur-md border-b border-[var(--border-hairline)] sticky top-0 z-20 transition-colors">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Left: Meeting Title & Metadata */}
        <div className="space-y-1 flex-1 min-w-0">
          <div className="flex items-center gap-2">
            {isEditingTitle ? (
              <input
                type="text"
                value={titleInput}
                onChange={(e) => setTitleInput(e.target.value)}
                onBlur={handleTitleSubmit}
                onKeyDown={(e) => e.key === 'Enter' && handleTitleSubmit()}
                autoFocus
                className="text-lg md:text-xl font-bold text-stone-900 dark:text-zinc-50 bg-white dark:bg-zinc-800 px-2 py-0.5 rounded-lg border border-black/[0.08] dark:border-white/[0.1] outline-none w-full max-w-xl shadow-clean-xs"
              />
            ) : (
              <h1
                onClick={() => {
                  setTitleInput(meeting.title);
                  setIsEditingTitle(true);
                }}
                className="text-lg md:text-xl font-bold text-stone-900 dark:text-zinc-50 tracking-tight hover:opacity-80 cursor-pointer transition-colors truncate flex items-center gap-2 group"
                title="Click to rename meeting"
              >
                <span>{meeting.title || 'Untitled Meeting'}</span>
                <span className="opacity-0 group-hover:opacity-100 text-xs text-stone-400 font-normal transition-opacity">
                  (edit)
                </span>
              </h1>
            )}

            <span className="hidden sm:inline-flex text-[11px] text-stone-400 dark:text-zinc-500 font-medium">
              / {meeting.template}
            </span>
          </div>

          {/* Metadata Row: Date, Duration, Participants */}
          <div className="flex items-center gap-2.5 text-xs text-stone-400 dark:text-zinc-500 flex-wrap">
            <span>{meeting.date} at {meeting.time}</span>
            <span>•</span>
            <span>{meeting.durationMinutes} min</span>
            <span>•</span>

            {/* Participants list */}
            <div className="flex items-center gap-1.5 relative">
              <div className="flex items-center -space-x-1.5">
                {meeting.participants.map((p) => (
                  <div
                    key={p.id}
                    title={`${p.name} (${p.role})`}
                    className="w-5 h-5 rounded-full ring-2 ring-white dark:ring-zinc-900 overflow-hidden bg-stone-200 dark:bg-zinc-700 flex items-center justify-center text-[9px] font-semibold text-stone-700 dark:text-zinc-300"
                  >
                    {p.avatar ? (
                      <img src={p.avatar} alt={p.name} className="w-full h-full object-cover" />
                    ) : (
                      p.name.charAt(0)
                    )}
                  </div>
                ))}
              </div>

              <span className="text-[11px] text-stone-600 dark:text-zinc-400">
                {meeting.participants.map(p => p.name.split(' ')[0]).join(', ')}
              </span>

              <button
                onClick={() => setShowParticipantInput(!showParticipantInput)}
                className="p-0.5 rounded text-stone-400 hover:text-stone-700 dark:hover:text-zinc-200 transition btn-tactile cursor-pointer"
                title="Add attendee"
              >
                <Plus size={12} />
              </button>

              {showParticipantInput && (
                <div className="absolute left-0 top-7 z-30 p-3.5 bg-white dark:bg-zinc-800 rounded-xl shadow-clean-modal border border-black/[0.07] dark:border-white/[0.08] w-64 animate-clean-modal">
                  <form onSubmit={handleAddPerson} className="space-y-2">
                    <div className="text-[11px] font-semibold text-stone-800 dark:text-zinc-200">
                      Add Attendee
                    </div>
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={newPersonName}
                      onChange={(e) => setNewPersonName(e.target.value)}
                      className="w-full text-xs p-1.5 rounded-lg border border-black/[0.08] dark:border-white/[0.08] bg-stone-50 dark:bg-zinc-900 text-stone-800 dark:text-zinc-200 outline-none"
                      autoFocus
                    />
                    <input
                      type="text"
                      placeholder="Role (e.g. Lead Designer)"
                      value={newPersonRole}
                      onChange={(e) => setNewPersonRole(e.target.value)}
                      className="w-full text-xs p-1.5 rounded-lg border border-black/[0.08] dark:border-white/[0.08] bg-stone-50 dark:bg-zinc-900 text-stone-800 dark:text-zinc-200 outline-none"
                    />
                    <div className="flex justify-end gap-1.5 pt-1">
                      <button
                        type="button"
                        onClick={() => setShowParticipantInput(false)}
                        className="px-2 py-1 text-[10px] text-stone-400 hover:text-stone-700 dark:hover:text-zinc-300"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-2.5 py-1 text-[10px] bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-950 font-medium rounded-lg shadow-clean-xs btn-tactile"
                      >
                        Add
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Clean Action Buttons */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Palette Selector */}
          <PaletteSelector
            currentPalette={currentPalette}
            onSelectPalette={onSelectPalette}
          />

          {/* Ask Quote Notes (Copilot) */}
          <button
            onClick={onToggleCopilot}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all btn-tactile cursor-pointer border ${
              isCopilotOpen
                ? 'border-[var(--theme-primary)]'
                : 'bg-white dark:bg-zinc-800 text-stone-600 dark:text-zinc-300 hover:text-stone-900 dark:hover:text-zinc-100 border-black/[0.05] dark:border-white/[0.06] shadow-clean-xs'
            }`}
            style={
              isCopilotOpen
                ? {
                    backgroundColor: 'var(--theme-primary-light)',
                    color: 'var(--theme-primary-text)',
                  }
                : undefined
            }
            title="Ask questions about this meeting"
          >
            <MessageSquare size={13} style={{ color: 'var(--theme-primary)' }} />
            <span>Ask Notes</span>
          </button>

          {/* Sync Tasks Button */}
          <button
            onClick={onOpenSyncModal}
            className="px-3 py-1.5 rounded-xl text-xs font-medium bg-white dark:bg-zinc-800 text-stone-700 dark:text-zinc-300 hover:text-stone-900 dark:hover:text-zinc-100 border border-black/[0.05] dark:border-white/[0.06] shadow-clean-xs flex items-center gap-1.5 transition-all btn-tactile cursor-pointer"
            title="Sync action items to Linear, Notion, Asana or Slack"
          >
            <Send size={12} className="text-stone-700 dark:text-zinc-300" />
            <span>Sync Tasks</span>
            {pendingTasksCount > 0 && (
              <span
                className="text-[10px] font-semibold font-mono-code px-1.5 py-0.2 rounded-full"
                style={{
                  backgroundColor: 'var(--theme-primary-light)',
                  color: 'var(--theme-primary-text)',
                }}
              >
                {pendingTasksCount}
              </span>
            )}
          </button>

          {/* Export / Share */}
          <button
            onClick={onOpenShareModal}
            className="p-2 rounded-xl bg-white dark:bg-zinc-800 text-stone-500 hover:text-stone-800 dark:text-zinc-400 dark:hover:text-zinc-200 border border-black/[0.05] dark:border-white/[0.06] shadow-clean-xs btn-tactile cursor-pointer transition-all"
            title="Share & Follow-up Draft"
          >
            <Share2 size={13} />
          </button>

          {/* Enhance with AI */}
          <button
            onClick={onEnhanceNotes}
            disabled={isEnhancing}
            className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white shadow-clean-xs flex items-center gap-1.5 transition-all btn-tactile disabled:opacity-50 cursor-pointer"
            style={{ backgroundColor: 'var(--theme-primary)' }}
            title="Synthesize raw notes and extract quotes with Gemini AI (⌘E)"
          >
            <Sparkles size={13} className={isEnhancing ? 'animate-spin' : ''} />
            <span>{isEnhancing ? 'Synthesizing...' : 'Enhance Notes'}</span>
            <kbd className="hidden md:inline-block px-1 py-0.2 rounded text-[9px] bg-black/20 text-white font-mono-code ml-0.5">
              ⌘E
            </kbd>
          </button>
        </div>
      </div>
    </header>
  );
};
