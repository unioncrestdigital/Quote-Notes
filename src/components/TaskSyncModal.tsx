import React, { useState } from 'react';
import { 
  X, 
  Send, 
  Check, 
  CheckSquare, 
  ExternalLink, 
  Copy, 
  Layers, 
  Settings2, 
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  User
} from 'lucide-react';
import { ActionItem, SyncDestination, Meeting } from '../types';

interface TaskSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  meeting: Meeting;
  onTasksSynced: (updatedTasks: ActionItem[]) => void;
}

export const TaskSyncModal: React.FC<TaskSyncModalProps> = ({
  isOpen,
  onClose,
  meeting,
  onTasksSynced,
}) => {
  const [selectedDestination, setSelectedDestination] = useState<SyncDestination>('linear');
  const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>(
    meeting.actionItems.map((t) => t.id)
  );
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState<any | null>(null);
  const [copiedPayload, setCopiedPayload] = useState(false);

  // Destination configuration states
  const [linearConfig, setLinearConfig] = useState({
    teamKey: 'ENG',
    project: 'Q4 Product Roadmap',
    state: 'Todo',
  });

  const [notionConfig, setNotionConfig] = useState({
    database: 'Product Tasks & Action Items',
    propertyMapping: 'Status, Owner, Priority, Due Date',
  });

  const [asanaConfig, setAsanaConfig] = useState({
    workspace: 'Engineering Org',
    project: 'Sprint Planning',
  });

  const [jiraConfig, setJiraConfig] = useState({
    projectKey: 'PROD',
    issueType: 'Task',
  });

  const [slackConfig, setSlackConfig] = useState({
    channel: '#eng-team-sync',
    includeQuotes: true,
  });

  if (!isOpen) return null;

  const handleToggleTask = (id: string) => {
    setSelectedTaskIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedTaskIds.length === meeting.actionItems.length) {
      setSelectedTaskIds([]);
    } else {
      setSelectedTaskIds(meeting.actionItems.map((t) => t.id));
    }
  };

  const handleExecuteSync = async () => {
    if (selectedTaskIds.length === 0) return;
    setIsSyncing(true);
    setSyncSuccess(null);

    const tasksToSync = meeting.actionItems.filter((t) =>
      selectedTaskIds.includes(t.id)
    );

    const config =
      selectedDestination === 'linear'
        ? linearConfig
        : selectedDestination === 'notion'
        ? notionConfig
        : selectedDestination === 'asana'
        ? asanaConfig
        : selectedDestination === 'jira'
        ? jiraConfig
        : slackConfig;

    try {
      const res = await fetch('/api/sync-tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination: selectedDestination,
          tasks: tasksToSync,
          config,
          meetingTitle: meeting.title,
        }),
      });

      const data = await res.json();
      setSyncSuccess(data);

      // Update parent tasks with synced statuses
      const updatedTasks = meeting.actionItems.map((task) => {
        const syncedItem = data.results?.find((r: any) => r.taskId === task.id);
        if (syncedItem) {
          return {
            ...task,
            syncedTo: {
              ...(task.syncedTo || {}),
              [selectedDestination]: {
                syncedAt: syncedItem.syncedAt,
                externalId: syncedItem.syncId,
                externalUrl: syncedItem.externalUrl,
              },
            },
          };
        }
        return task;
      });

      onTasksSynced(updatedTasks);
    } catch (err) {
      console.error('Sync failed:', err);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleCopyPayload = () => {
    if (!syncSuccess) return;
    navigator.clipboard.writeText(JSON.stringify(syncSuccess, null, 2));
    setCopiedPayload(true);
    setTimeout(() => setCopiedPayload(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 animate-emil-fade">
      <div className="bg-white dark:bg-[#181817] rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-craft-modal border border-black/[0.08] dark:border-white/[0.08] overflow-hidden animate-emil-modal">
        {/* Header */}
        <div className="p-5 border-b border-black/[0.06] dark:border-white/[0.07] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold shadow-craft-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.25)]">
              <Send size={15} />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900 dark:text-zinc-100">
                Professional Task Syncing
              </h3>
              <p className="text-xs text-stone-500 dark:text-zinc-400">
                Export and route action items directly into your team's issue tracker
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-stone-100 dark:hover:bg-zinc-800 text-stone-400 hover:text-stone-700 dark:hover:text-zinc-200 btn-tactile cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Destination Selector Tabs */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-400 dark:text-zinc-500 mb-2">
              Select Sync Destination
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {[
                { id: 'linear', name: 'Linear', color: 'indigo', icon: '⚡' },
                { id: 'notion', name: 'Notion', color: 'stone', icon: '📝' },
                { id: 'jira', name: 'Jira', color: 'blue', icon: '🔷' },
                { id: 'asana', name: 'Asana', color: 'rose', icon: '⭕' },
                { id: 'slack', name: 'Slack', color: 'amber', icon: '💬' },
              ].map((dest) => (
                <button
                  key={dest.id}
                  onClick={() => {
                    setSelectedDestination(dest.id as SyncDestination);
                    setSyncSuccess(null);
                  }}
                  className={`p-2.5 rounded-xl border text-left transition-all ease-emil flex flex-col items-center justify-center gap-1 btn-tactile cursor-pointer ${
                    selectedDestination === dest.id
                      ? 'border-indigo-600 dark:border-indigo-500 bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-950 dark:text-indigo-200 shadow-craft-sm ring-1 ring-indigo-500/20'
                      : 'border-black/[0.06] dark:border-white/[0.06] bg-stone-50/60 dark:bg-zinc-900/60 text-stone-600 dark:text-zinc-400 hover:bg-stone-100 dark:hover:bg-zinc-800'
                  }`}
                >
                  <span className="text-lg">{dest.icon}</span>
                  <span className="text-xs font-semibold">{dest.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Destination Configuration Fields */}
          <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-zinc-900 border border-stone-200/80 dark:border-zinc-800 space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-stone-700 dark:text-zinc-300">
              <span className="flex items-center gap-1.5">
                <Settings2 size={13} />
                {selectedDestination.toUpperCase()} Integration Configuration
              </span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <ShieldCheck size={12} /> Connected
              </span>
            </div>

            {selectedDestination === 'linear' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                <div>
                  <label className="text-[11px] text-stone-500">Team Key</label>
                  <input
                    type="text"
                    value={linearConfig.teamKey}
                    onChange={(e) => setLinearConfig({ ...linearConfig, teamKey: e.target.value })}
                    className="w-full mt-1 p-1.5 rounded-md bg-white dark:bg-zinc-800 border border-stone-300 dark:border-zinc-700 text-stone-800 dark:text-zinc-200 font-mono-code"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-stone-500">Target Project</label>
                  <input
                    type="text"
                    value={linearConfig.project}
                    onChange={(e) => setLinearConfig({ ...linearConfig, project: e.target.value })}
                    className="w-full mt-1 p-1.5 rounded-md bg-white dark:bg-zinc-800 border border-stone-300 dark:border-zinc-700 text-stone-800 dark:text-zinc-200"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-stone-500">Default State</label>
                  <select
                    value={linearConfig.state}
                    onChange={(e) => setLinearConfig({ ...linearConfig, state: e.target.value })}
                    className="w-full mt-1 p-1.5 rounded-md bg-white dark:bg-zinc-800 border border-stone-300 dark:border-zinc-700 text-stone-800 dark:text-zinc-200"
                  >
                    <option value="Todo">Todo</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Backlog">Backlog</option>
                  </select>
                </div>
              </div>
            )}

            {selectedDestination === 'notion' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                <div>
                  <label className="text-[11px] text-stone-500">Notion Database</label>
                  <input
                    type="text"
                    value={notionConfig.database}
                    onChange={(e) => setNotionConfig({ ...notionConfig, database: e.target.value })}
                    className="w-full mt-1 p-1.5 rounded-md bg-white dark:bg-zinc-800 border border-stone-300 dark:border-zinc-700 text-stone-800 dark:text-zinc-200"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-stone-500">Property Schema</label>
                  <input
                    type="text"
                    value={notionConfig.propertyMapping}
                    onChange={(e) => setNotionConfig({ ...notionConfig, propertyMapping: e.target.value })}
                    className="w-full mt-1 p-1.5 rounded-md bg-white dark:bg-zinc-800 border border-stone-300 dark:border-zinc-700 text-stone-800 dark:text-zinc-200"
                  />
                </div>
              </div>
            )}

            {selectedDestination === 'jira' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                <div>
                  <label className="text-[11px] text-stone-500">Project Key</label>
                  <input
                    type="text"
                    value={jiraConfig.projectKey}
                    onChange={(e) => setJiraConfig({ ...jiraConfig, projectKey: e.target.value })}
                    className="w-full mt-1 p-1.5 rounded-md bg-white dark:bg-zinc-800 border border-stone-300 dark:border-zinc-700 text-stone-800 dark:text-zinc-200 font-mono-code"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-stone-500">Issue Type</label>
                  <input
                    type="text"
                    value={jiraConfig.issueType}
                    onChange={(e) => setJiraConfig({ ...jiraConfig, issueType: e.target.value })}
                    className="w-full mt-1 p-1.5 rounded-md bg-white dark:bg-zinc-800 border border-stone-300 dark:border-zinc-700 text-stone-800 dark:text-zinc-200"
                  />
                </div>
              </div>
            )}

            {selectedDestination === 'slack' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                <div>
                  <label className="text-[11px] text-stone-500">Slack Channel</label>
                  <input
                    type="text"
                    value={slackConfig.channel}
                    onChange={(e) => setSlackConfig({ ...slackConfig, channel: e.target.value })}
                    className="w-full mt-1 p-1.5 rounded-md bg-white dark:bg-zinc-800 border border-stone-300 dark:border-zinc-700 text-stone-800 dark:text-zinc-200 font-mono-code"
                  />
                </div>
                <div className="flex items-center gap-2 pt-4">
                  <input
                    type="checkbox"
                    id="slackQuotes"
                    checked={slackConfig.includeQuotes}
                    onChange={(e) => setSlackConfig({ ...slackConfig, includeQuotes: e.target.checked })}
                    className="rounded text-indigo-600"
                  />
                  <label htmlFor="slackQuotes" className="text-xs text-stone-700 dark:text-zinc-300">
                    Include source verbatim quotes
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Action Items to Sync */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-stone-700 dark:text-zinc-300">
                Action Items to Sync ({selectedTaskIds.length}/{meeting.actionItems.length})
              </label>
              <button
                onClick={handleSelectAll}
                className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
              >
                {selectedTaskIds.length === meeting.actionItems.length ? 'Deselect All' : 'Select All'}
              </button>
            </div>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {meeting.actionItems.map((task) => {
                const isChecked = selectedTaskIds.includes(task.id);
                const isAlreadySynced = task.syncedTo && (task.syncedTo as any)[selectedDestination];

                return (
                  <div
                    key={task.id}
                    onClick={() => handleToggleTask(task.id)}
                    className={`p-2.5 rounded-lg border text-xs flex items-center justify-between gap-3 cursor-pointer transition ${
                      isChecked
                        ? 'bg-white dark:bg-zinc-800 border-indigo-300 dark:border-indigo-700 shadow-2xs'
                        : 'bg-stone-50 dark:bg-zinc-900 border-stone-200 dark:border-zinc-800 opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                          isChecked
                            ? 'bg-indigo-600 border-indigo-600 text-white'
                            : 'border-stone-300 dark:border-zinc-600'
                        }`}
                      >
                        {isChecked && <Check size={11} strokeWidth={3} />}
                      </div>
                      <span className="font-medium text-stone-800 dark:text-zinc-200 truncate">
                        {task.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-stone-100 dark:bg-zinc-700 text-stone-600 dark:text-zinc-300">
                        {task.assignee}
                      </span>

                      {isAlreadySynced && (
                        <span className="text-[10px] font-mono-code px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                          Synced
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sync Success Results Card */}
          {syncSuccess && (
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-900 dark:text-emerald-200 font-semibold text-xs">
                  <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400" />
                  <span>{syncSuccess.message}</span>
                </div>
                <button
                  onClick={handleCopyPayload}
                  className="text-[11px] text-emerald-800 dark:text-emerald-300 hover:underline flex items-center gap-1"
                >
                  <Copy size={11} />
                  {copiedPayload ? 'Copied' : 'Copy JSON'}
                </button>
              </div>

              <div className="space-y-1.5 text-xs">
                {syncSuccess.results?.map((res: any, idx: number) => (
                  <div
                    key={idx}
                    className="p-2 rounded bg-white dark:bg-zinc-900/80 border border-emerald-100 dark:border-emerald-900/60 flex items-center justify-between gap-2"
                  >
                    <span className="font-mono-code font-bold text-emerald-700 dark:text-emerald-400">
                      #{res.syncId}
                    </span>
                    <span className="text-stone-700 dark:text-zinc-300 truncate flex-1">
                      {res.title}
                    </span>
                    <a
                      href={res.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 text-[11px]"
                    >
                      <span>Open</span>
                      <ExternalLink size={10} />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-200 dark:border-zinc-800 bg-stone-50/60 dark:bg-zinc-900/60 flex items-center justify-between">
          <p className="text-xs text-stone-500 dark:text-zinc-400">
            {selectedTaskIds.length} tasks ready for dispatch
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs text-stone-600 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-zinc-200"
            >
              Close
            </button>
            <button
              onClick={handleExecuteSync}
              disabled={isSyncing || selectedTaskIds.length === 0}
              className="px-4 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-xs flex items-center gap-1.5 transition disabled:opacity-50 cursor-pointer"
            >
              <Send size={13} className={isSyncing ? 'animate-pulse' : ''} />
              <span>{isSyncing ? 'Syncing...' : `Sync to ${selectedDestination.toUpperCase()}`}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
