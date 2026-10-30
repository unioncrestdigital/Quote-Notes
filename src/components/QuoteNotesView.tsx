import React, { useState } from 'react';
import { 
  Quote as QuoteIcon, 
  CheckSquare, 
  Clock, 
  User, 
  ExternalLink, 
  Copy, 
  Check, 
  Plus, 
  Trash2, 
  Sparkles, 
  Send, 
  Share2, 
  Layers, 
  AlertCircle,
  Tag,
  ArrowUpRight,
  Flame
} from 'lucide-react';
import { Meeting, ActionItem, VerbatimQuote, Priority } from '../types';

interface QuoteNotesViewProps {
  meeting: Meeting;
  onUpdateActionItems: (items: ActionItem[]) => void;
  onJumpToTranscript: (seconds?: number) => void;
  onOpenSyncModal: () => void;
  onOpenShareModal: () => void;
  onReEnhance: () => void;
  isEnhancing: boolean;
}

export const QuoteNotesView: React.FC<QuoteNotesViewProps> = ({
  meeting,
  onUpdateActionItems,
  onJumpToTranscript,
  onOpenSyncModal,
  onOpenShareModal,
  onReEnhance,
  isEnhancing,
}) => {
  const [copiedQuoteId, setCopiedQuoteId] = useState<string | null>(null);
  const [newActionTitle, setNewActionTitle] = useState('');
  const [newActionAssignee, setNewActionAssignee] = useState(
    meeting.participants[0]?.name || 'Me'
  );
  const [newActionPriority, setNewActionPriority] = useState<Priority>('high');
  const [newActionDue, setNewActionDue] = useState('This week');
  const [showAddActionForm, setShowAddActionForm] = useState(false);

  const handleCopyQuote = (quote: VerbatimQuote) => {
    const textToCopy = `"${quote.quote}" — ${quote.speaker} [${quote.time}]`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedQuoteId(quote.id);
    setTimeout(() => setCopiedQuoteId(null), 2000);
  };

  const handleToggleActionCompleted = (id: string) => {
    const updated = meeting.actionItems.map((item) =>
      item.id === id ? { ...item, completed: !item.completed } : item
    );
    onUpdateActionItems(updated);
  };

  const handleDeleteAction = (id: string) => {
    const updated = meeting.actionItems.filter((item) => item.id !== id);
    onUpdateActionItems(updated);
  };

  const handleCreateTaskFromQuote = (quote: VerbatimQuote) => {
    const newTask: ActionItem = {
      id: `act-${Date.now()}`,
      title: `Action on quote: "${quote.quote.slice(0, 50)}..."`,
      assignee: quote.speaker,
      priority: 'high',
      dueDate: 'Next sprint',
      sourceQuote: quote.quote,
    };
    onUpdateActionItems([...meeting.actionItems, newTask]);
  };

  const handleAddNewAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActionTitle.trim()) return;

    const newTask: ActionItem = {
      id: `act-${Date.now()}`,
      title: newActionTitle.trim(),
      assignee: newActionAssignee,
      priority: newActionPriority,
      dueDate: newActionDue.trim() || 'Pending',
    };

    onUpdateActionItems([...meeting.actionItems, newTask]);
    setNewActionTitle('');
    setShowAddActionForm(false);
  };

  const pendingSyncTasks = meeting.actionItems.filter(
    (t) => !t.syncedTo || Object.keys(t.syncedTo).length === 0
  );

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      {/* Granola Top Info Pill & Re-Enhance Notice */}
      <div className="flex items-center justify-between gap-4 pb-2 border-b border-black/[0.04] dark:border-white/[0.05]">
        <div className="flex items-center gap-2">
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: 'var(--theme-primary)' }}
          />
          <span className="text-xs font-semibold text-stone-800 dark:text-zinc-200">
            Quote Notes
          </span>
          <span className="text-[11px] text-stone-400 dark:text-zinc-500">
            {meeting.lastEnhancedAt ? 'Synthesized' : 'Draft'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenShareModal}
            className="text-xs text-stone-400 hover:text-stone-700 dark:hover:text-zinc-200 flex items-center gap-1 transition-colors btn-tactile cursor-pointer"
          >
            <Share2 size={12} />
            Export Digest
          </button>
          <span className="text-stone-200 dark:text-zinc-800">|</span>
          <button
            onClick={onReEnhance}
            disabled={isEnhancing}
            className="text-xs hover:underline flex items-center gap-1 font-medium disabled:opacity-50 btn-tactile cursor-pointer"
            style={{ color: 'var(--theme-primary)' }}
          >
            <Sparkles size={12} className={isEnhancing ? 'animate-spin' : ''} />
            {isEnhancing ? 'Synthesizing...' : 'Refresh AI Notes'}
          </button>
        </div>
      </div>

      {/* 1. Executive Summary */}
      <section className="space-y-2">
        <h2 className="text-[10px] font-semibold uppercase tracking-wider text-stone-400 dark:text-zinc-500">
          Executive Summary
        </h2>
        
        <div className="p-5 rounded-2xl bg-white dark:bg-[#161615] border border-black/[0.05] dark:border-white/[0.06] shadow-clean-xs relative overflow-hidden transition-all">
          <div
            className="absolute top-0 left-0 bottom-0 w-1"
            style={{ backgroundColor: 'var(--theme-primary)' }}
          />
          <p className="text-sm sm:text-[15px] text-stone-700 dark:text-zinc-200 leading-relaxed font-sans pl-1.5">
            {meeting.executiveSummary || 'No executive summary generated yet. Click "Enhance Notes" above to synthesize transcript and raw notes.'}
          </p>
        </div>
      </section>

      {/* 2. Verbatim Quote Bank ("The Quote Engine") */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-[10px] font-semibold uppercase tracking-wider text-stone-400 dark:text-zinc-500">
              Verbatim Quotes ({meeting.quotes.length})
            </h2>
          </div>
        </div>

        {meeting.quotes.length === 0 ? (
          <div className="p-8 rounded-2xl border border-dashed border-stone-200 dark:border-zinc-800 text-center text-xs text-stone-400 dark:text-zinc-500">
            No verbatim quotes extracted yet. Click "Enhance Notes" to pull high-signal quotes from the transcript!
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-2.5">
            {meeting.quotes.map((q) => {
              const isCopied = copiedQuoteId === q.id;

              return (
                <div
                  key={q.id}
                  className="group p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#161615] border border-black/[0.05] dark:border-white/[0.06] hover:border-black/[0.12] dark:hover:border-white/[0.12] shadow-clean-xs hover:shadow-clean-sm transition-all duration-150 relative"
                >
                  {/* Quote Body with Granola Serif styling */}
                  <div className="flex items-start gap-3">
                    <span
                      className="text-2xl font-serif-quote font-bold leading-none select-none"
                      style={{ color: 'var(--theme-accent-quote)', opacity: 0.6 }}
                    >
                      “
                    </span>
                    <blockquote className="flex-1 font-serif-quote text-base sm:text-[17px] text-stone-900 dark:text-stone-100 italic leading-snug tracking-tight">
                      {q.quote}
                    </blockquote>
                  </div>

                  {/* Context and attribution bar */}
                  <div className="mt-3 pt-2.5 border-t border-black/[0.03] dark:border-white/[0.04] flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      {/* Speaker Badge */}
                      <span className="font-semibold text-stone-700 dark:text-zinc-300 flex items-center gap-1.5 text-xs">
                        <span
                          className="w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] font-bold"
                          style={{
                            backgroundColor: 'var(--theme-primary-light)',
                            color: 'var(--theme-primary-text)',
                          }}
                        >
                          {q.speaker.charAt(0)}
                        </span>
                        {q.speaker}
                      </span>

                      {/* Timestamp button (click to jump to transcript) */}
                      <button
                        onClick={() => onJumpToTranscript(q.timestampSeconds)}
                        className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono-code bg-black/[0.03] dark:bg-white/[0.05] text-stone-500 dark:text-zinc-400 hover:text-amber-700 dark:hover:text-amber-300 transition-colors btn-tactile cursor-pointer"
                        title="Jump to exact transcript moment"
                      >
                        <Clock size={10} />
                        {q.time}
                      </button>

                      {/* Quiet Tags */}
                      {q.tags && q.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] text-stone-400 dark:text-zinc-500"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleCreateTaskFromQuote(q)}
                        className="px-2 py-1 rounded-lg text-[11px] font-medium bg-stone-100 hover:bg-stone-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-stone-600 dark:text-zinc-300 flex items-center gap-1 btn-tactile cursor-pointer"
                        title="Create an Action Item from this quote"
                      >
                        <Plus size={11} />
                        <span>Make Task</span>
                      </button>

                      <button
                        onClick={() => handleCopyQuote(q)}
                        className="p-1 rounded-lg hover:bg-stone-100 dark:hover:bg-zinc-800 text-stone-400 hover:text-stone-700 dark:hover:text-zinc-200 btn-tactile cursor-pointer"
                        title="Copy Quote text"
                      >
                        {isCopied ? (
                          <Check size={12} className="text-emerald-600" />
                        ) : (
                          <Copy size={12} />
                        )}
                      </button>
                    </div>
                  </div>

                  {q.context && (
                    <div className="mt-1 text-[11px] text-stone-400 dark:text-zinc-500 italic pl-1">
                      Context: {q.context}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 3. Thematic Key Takeaways */}
      <section className="space-y-3">
        <h2 className="text-[10px] font-semibold uppercase tracking-wider text-stone-400 dark:text-zinc-500">
          Key Decisions & Takeaways
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {meeting.keyTakeaways.map((cat, idx) => (
            <div
              key={idx}
              className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#161615] border border-black/[0.05] dark:border-white/[0.06] shadow-clean-xs space-y-2.5 transition-all hover:shadow-clean-sm"
            >
              <h3 className="text-xs font-semibold text-stone-800 dark:text-zinc-200 border-b border-black/[0.04] dark:border-white/[0.05] pb-2 flex items-center gap-1.5">
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: 'var(--theme-primary)' }}
                />
                {cat.category}
              </h3>
              <ul className="space-y-2">
                {cat.points.map((pt, pIdx) => (
                  <li
                    key={pIdx}
                    className="text-xs sm:text-[13px] text-stone-600 dark:text-zinc-300 flex items-start gap-2 leading-relaxed"
                  >
                    <span className="text-stone-300 dark:text-zinc-600 select-none font-bold">•</span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Action Items & Professional Task Syncing */}
      <section className="space-y-3 pt-2">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <h2 className="text-[10px] font-semibold uppercase tracking-wider text-stone-400 dark:text-zinc-500">
              Action Items ({meeting.actionItems.length})
            </h2>
            {pendingSyncTasks.length > 0 && (
              <span className="text-[10px] px-2 py-0.2 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-medium">
                {pendingSyncTasks.length} to sync
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddActionForm(!showAddActionForm)}
              className="text-xs px-2.5 py-1 rounded-lg text-stone-600 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-zinc-200 hover:bg-black/[0.03] dark:hover:bg-white/[0.04] font-medium flex items-center gap-1 btn-tactile cursor-pointer"
            >
              <Plus size={12} />
              Add Task
            </button>

            <button
              onClick={onOpenSyncModal}
              className="text-xs px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium flex items-center gap-1.5 shadow-clean-xs btn-tactile cursor-pointer"
            >
              <Send size={11} />
              <span>Sync All to Linear / Notion</span>
            </button>
          </div>
        </div>

        {/* Inline Add Task Form */}
        {showAddActionForm && (
          <form
            onSubmit={handleAddNewAction}
            className="p-4 rounded-2xl bg-white dark:bg-[#161615] border border-black/[0.07] dark:border-white/[0.08] shadow-clean space-y-3 animate-clean-modal"
          >
            <div className="text-xs font-semibold text-stone-800 dark:text-zinc-200">
              New Action Item
            </div>
            <input
              type="text"
              placeholder="What needs to get done? (e.g. Deploy Redis queue throttler)"
              value={newActionTitle}
              onChange={(e) => setNewActionTitle(e.target.value)}
              className="w-full text-xs p-2 rounded-lg bg-stone-50 dark:bg-zinc-900 border border-black/[0.06] dark:border-white/[0.08] text-stone-900 dark:text-zinc-100 outline-none"
              autoFocus
            />
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="text-stone-400 text-xs">Assignee:</span>
                <select
                  value={newActionAssignee}
                  onChange={(e) => setNewActionAssignee(e.target.value)}
                  className="p-1 rounded-md bg-stone-50 dark:bg-zinc-900 border border-black/[0.06] dark:border-white/[0.08] text-stone-800 dark:text-zinc-200 text-xs"
                >
                  {meeting.participants.map((p) => (
                    <option key={p.id} value={p.name}>
                      {p.name}
                    </option>
                  ))}
                  <option value="Me">Me</option>
                  <option value="Engineering Team">Engineering Team</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-stone-400 text-xs">Priority:</span>
                <select
                  value={newActionPriority}
                  onChange={(e) => setNewActionPriority(e.target.value as Priority)}
                  className="p-1 rounded-md bg-stone-50 dark:bg-zinc-900 border border-black/[0.06] dark:border-white/[0.08] text-stone-800 dark:text-zinc-200 text-xs"
                >
                  <option value="urgent">Urgent</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-stone-400 text-xs">Due:</span>
                <input
                  type="text"
                  placeholder="e.g. Friday"
                  value={newActionDue}
                  onChange={(e) => setNewActionDue(e.target.value)}
                  className="p-1 w-24 rounded-md bg-stone-50 dark:bg-zinc-900 border border-black/[0.06] dark:border-white/[0.08] text-stone-800 dark:text-zinc-200 text-xs"
                />
              </div>

              <div className="ml-auto flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddActionForm(false)}
                  className="px-2.5 py-1 text-xs text-stone-400 hover:text-stone-700 dark:hover:text-zinc-300 btn-tactile cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 text-xs bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-950 font-medium rounded-lg shadow-clean-xs btn-tactile cursor-pointer"
                >
                  Create Task
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Action Items List */}
        <div className="space-y-1.5">
          {meeting.actionItems.map((item) => {
            const hasLinearSync = item.syncedTo?.linear;
            const hasJiraSync = item.syncedTo?.jira;

            return (
              <div
                key={item.id}
                className={`p-3 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  item.completed
                    ? 'bg-stone-50/50 dark:bg-zinc-900/30 border-black/[0.03] dark:border-white/[0.03] opacity-40'
                    : 'bg-white dark:bg-[#161615] border-black/[0.05] dark:border-white/[0.06] shadow-clean-xs hover:border-black/[0.1] dark:hover:border-white/[0.1]'
                }`}
              >
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <button
                    onClick={() => handleToggleActionCompleted(item.id)}
                    className={`mt-0.5 w-4 h-4 rounded-md border flex items-center justify-center shrink-0 transition-colors btn-tactile cursor-pointer ${
                      item.completed
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : 'border-stone-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:border-indigo-500'
                    }`}
                  >
                    {item.completed && <Check size={11} strokeWidth={3} />}
                  </button>

                  <div className="space-y-0.5 min-w-0">
                    <p
                      className={`text-xs sm:text-[13px] font-medium leading-snug ${
                        item.completed
                          ? 'line-through text-stone-400 dark:text-zinc-500'
                          : 'text-stone-800 dark:text-zinc-100'
                      }`}
                    >
                      {item.title}
                    </p>

                    {item.sourceQuote && (
                      <p className="text-[10px] font-serif-quote italic text-stone-400 dark:text-zinc-500 flex items-center gap-1 truncate">
                        <QuoteIcon size={8} className="shrink-0 text-amber-500" />
                        "{item.sourceQuote}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Task Badges & Sync Links */}
                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  {/* Assignee */}
                  <span className="text-[11px] text-stone-500 dark:text-zinc-400 flex items-center gap-1">
                    <User size={10} className="text-stone-400" />
                    {item.assignee}
                  </span>

                  {/* Priority Indicator */}
                  <span
                    className={`text-[9px] uppercase font-semibold tracking-wider px-1.5 py-0.5 rounded ${
                      item.priority === 'urgent'
                        ? 'text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950/40'
                        : item.priority === 'high'
                        ? 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40'
                        : 'text-stone-500 dark:text-zinc-400 bg-black/[0.03] dark:bg-white/[0.04]'
                    }`}
                  >
                    {item.priority}
                  </span>

                  {/* Due Date */}
                  <span className="text-[10px] text-stone-400 dark:text-zinc-500 font-mono-code">
                    {item.dueDate}
                  </span>

                  {/* Sync Status Badge */}
                  {hasLinearSync ? (
                    <a
                      href={hasLinearSync.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono-code text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 hover:underline btn-tactile"
                    >
                      #{hasLinearSync.externalId}
                      <ArrowUpRight size={9} />
                    </a>
                  ) : hasJiraSync ? (
                    <a
                      href={hasJiraSync.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono-code text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 hover:underline btn-tactile"
                    >
                      #{hasJiraSync.externalId}
                      <ArrowUpRight size={9} />
                    </a>
                  ) : (
                    <button
                      onClick={onOpenSyncModal}
                      className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono-code text-stone-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors btn-tactile cursor-pointer"
                      title="Sync this task"
                    >
                      <Send size={8} />
                      Sync
                    </button>
                  )}

                  <button
                    onClick={() => handleDeleteAction(item.id)}
                    className="p-1 rounded text-stone-300 hover:text-red-500 transition-colors btn-tactile cursor-pointer"
                    title="Delete task"
                  >
                    <Trash2 size={11} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
