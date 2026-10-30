import React, { useState, useEffect, useCallback } from 'react';
import { 
  Sparkles, 
  Quote, 
  FileText, 
  Volume2, 
  Send, 
  Share2, 
  Menu,
  X
} from 'lucide-react';
import { Meeting, ActionItem, VerbatimQuote, TranscriptSegment, Participant } from './types';
import { SAMPLE_MEETINGS } from './data/sampleMeetings';
import { Sidebar } from './components/Sidebar';
import { MeetingHeader } from './components/MeetingHeader';
import { AudioRecorder } from './components/AudioRecorder';
import { QuoteNotesView } from './components/QuoteNotesView';
import { RawScratchpad } from './components/RawScratchpad';
import { TranscriptView } from './components/TranscriptView';
import { TaskSyncModal } from './components/TaskSyncModal';
import { AICopilotDrawer } from './components/AICopilotDrawer';
import { ShareModal } from './components/ShareModal';
import { NewMeetingModal } from './components/NewMeetingModal';
import { SonnerToastContainer, ToastItem } from './components/SonnerToast';
import { ColorPalette, PALETTES, applyPaletteToDom } from './utils/themePalettes';

export default function App() {
  // Load meetings from localStorage or fallback to SAMPLE_MEETINGS
  const [meetings, setMeetings] = useState<Meeting[]>(() => {
    try {
      const saved = localStorage.getItem('quotenotes_meetings');
      if (saved) return JSON.parse(saved);
    } catch (_) {}
    return SAMPLE_MEETINGS;
  });

  const [currentMeetingId, setCurrentMeetingId] = useState<string>(() => {
    return meetings[0]?.id || 'meet-seed-gtm';
  });

  const [activeTab, setActiveTab] = useState<'quote-notes' | 'raw-scratchpad' | 'transcript'>('quote-notes');
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem('quotenotes_theme') === 'dark';
    } catch (_) {
      return false;
    }
  });

  const [palette, setPalette] = useState<ColorPalette>(() => {
    try {
      const saved = localStorage.getItem('quotenotes_palette');
      if (saved && saved in PALETTES) return saved as ColorPalette;
    } catch (_) {}
    return 'sage'; // New Nordic Sage color scheme by default!
  });

  const [isRecordingActive, setIsRecordingActive] = useState<boolean>(false);
  const [recordingSeconds, setRecordingSeconds] = useState<number>(0);
  const [isEnhancing, setIsEnhancing] = useState<boolean>(false);
  
  // Emil Kowalski Sonner toast stack
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  // Modals & Panels
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isNewMeetingModalOpen, setIsNewMeetingModalOpen] = useState(false);
  const [jumpTimestamp, setJumpTimestamp] = useState<number | undefined>(undefined);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Persist meetings to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('quotenotes_meetings', JSON.stringify(meetings));
    } catch (_) {}
  }, [meetings]);

  // Dark mode effect
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('quotenotes_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('quotenotes_theme', 'light');
    }
  }, [darkMode]);

  // Color palette effect
  useEffect(() => {
    applyPaletteToDom(palette, darkMode);
    try {
      localStorage.setItem('quotenotes_palette', palette);
    } catch (_) {}
  }, [palette, darkMode]);

  const currentMeeting = meetings.find((m) => m.id === currentMeetingId) || meetings[0];

  const pushToast = (title: string, description?: string, type: ToastItem['type'] = 'success', actionLabel?: string, onAction?: () => void) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`;
    const newToast: ToastItem = { id, title, description, type, actionLabel, onAction };
    setToasts((prev) => [...prev, newToast]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Update current meeting helper
  const updateCurrentMeeting = useCallback((updates: Partial<Meeting>) => {
    setMeetings((prev) =>
      prev.map((m) => (m.id === currentMeetingId ? { ...m, ...updates } : m))
    );
  }, [currentMeetingId]);

  // Handle AI synthesis
  const handleEnhanceNotes = async () => {
    if (!currentMeeting || isEnhancing) return;
    setIsEnhancing(true);

    try {
      const res = await fetch('/api/enhance-meeting', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          meetingTitle: currentMeeting.title,
          rawNotes: currentMeeting.rawNotes,
          transcript: currentMeeting.transcript,
          participants: currentMeeting.participants.map((p) => p.name),
          template: currentMeeting.template,
        }),
      });

      if (!res.ok) {
        throw new Error(`Synthesis request failed: ${res.statusText}`);
      }

      const synthesized = await res.json();
      
      updateCurrentMeeting({
        executiveSummary: synthesized.executiveSummary || currentMeeting.executiveSummary,
        keyTakeaways: synthesized.keyTakeaways || currentMeeting.keyTakeaways,
        quotes: synthesized.quotes || currentMeeting.quotes,
        actionItems: synthesized.actionItems || currentMeeting.actionItems,
        followUpEmailDraft: synthesized.followUpEmailDraft || currentMeeting.followUpEmailDraft,
        lastEnhancedAt: new Date().toISOString(),
      });

      setActiveTab('quote-notes');
      pushToast(
        'Notes synthesized with Gemini 3.8 Flash',
        `Extracted ${synthesized.quotes?.length || 0} verbatim quotes and ${synthesized.actionItems?.length || 0} action items.`,
        'success',
        'Review Quotes',
        () => setActiveTab('quote-notes')
      );
    } catch (err: any) {
      console.error('Enhance notes failed:', err);
      pushToast('Could not enhance notes', 'Please check your connection and try again.', 'error');
    } finally {
      setIsEnhancing(false);
    }
  };

  // Keyboard shortcuts (Cmd+E: Enhance, Cmd+S: Sync, Cmd+1/2/3: Tabs)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isCmdOrCtrl = e.metaKey || e.ctrlKey;
      if (isCmdOrCtrl && e.key.toLowerCase() === 'e') {
        e.preventDefault();
        handleEnhanceNotes();
      } else if (isCmdOrCtrl && e.key.toLowerCase() === 's') {
        e.preventDefault();
        setIsSyncModalOpen(true);
      } else if (isCmdOrCtrl && e.key === '1') {
        e.preventDefault();
        setActiveTab('quote-notes');
      } else if (isCmdOrCtrl && e.key === '2') {
        e.preventDefault();
        setActiveTab('raw-scratchpad');
      } else if (isCmdOrCtrl && e.key === '3') {
        e.preventDefault();
        setActiveTab('transcript');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentMeeting, isEnhancing]);

  // Jump from Quote to transcript moment
  const handleJumpToTranscript = (seconds?: number) => {
    setJumpTimestamp(seconds);
    setActiveTab('transcript');
  };

  // Start live meeting helper
  const handleStartLiveMeeting = () => {
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newMeeting: Meeting = {
      id: `meet-live-${Date.now()}`,
      title: `Live Meeting — ${now.toLocaleDateString([], { month: 'short', day: 'numeric' })}`,
      date: dateStr,
      time: timeStr,
      durationMinutes: 0,
      template: 'General Sync',
      participants: [
        { id: 'p-me', name: 'Me', role: 'Host' },
        { id: 'p-guest', name: 'Guest', role: 'Attendee' },
      ],
      rawNotes: `- Started live audio capture at ${timeStr}\n- Listening to meeting audio...`,
      transcript: [],
      executiveSummary: '',
      keyTakeaways: [],
      quotes: [],
      actionItems: [],
      followUpEmailDraft: { subject: 'Meeting Digest', body: '' },
      isLiveRecording: true,
    };

    setMeetings((prev) => [newMeeting, ...prev]);
    setCurrentMeetingId(newMeeting.id);
    setIsRecordingActive(true);
    setActiveTab('transcript');
    pushToast('Live Recording Started', 'Speech recognition and audio waveform active.', 'info');
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[var(--bg-main)] text-stone-900 dark:text-zinc-100 font-sans antialiased selection:bg-[var(--theme-primary-light)] selection:text-[var(--theme-primary-text)]">
      {/* Emil Kowalski Signature Sonner Stacked Toasts */}
      <SonnerToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* Mobile Sidebar Overlay Toggle */}
      <div className="md:hidden fixed top-3 left-3 z-30">
        <button
          onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          className="p-2 rounded-lg bg-white dark:bg-zinc-800 shadow-craft border border-black/[0.08] dark:border-white/[0.08] text-stone-700 dark:text-zinc-200 btn-tactile"
        >
          {isMobileSidebarOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Sidebar: Desktop & Mobile Drawer */}
      <div className={`${isMobileSidebarOpen ? 'block' : 'hidden'} md:block fixed md:relative z-30`}>
        <Sidebar
          meetings={meetings}
          currentMeetingId={currentMeetingId}
          onSelectMeeting={(id) => {
            setCurrentMeetingId(id);
            setIsMobileSidebarOpen(false);
          }}
          onOpenNewMeetingModal={() => setIsNewMeetingModalOpen(true)}
          onStartLiveMeeting={handleStartLiveMeeting}
          isRecordingActive={isRecordingActive}
          recordingSeconds={recordingSeconds}
          darkMode={darkMode}
          onToggleDarkMode={() => setDarkMode(!darkMode)}
        />
      </div>

      {/* Main Content Pane */}
      <main className="flex-1 flex flex-col h-screen min-w-0 overflow-hidden relative">
        {/* Top Header */}
        {currentMeeting && (
          <MeetingHeader
            meeting={currentMeeting}
            onUpdateTitle={(title) => updateCurrentMeeting({ title })}
            onUpdateTemplate={(template) => updateCurrentMeeting({ template })}
            onAddParticipant={(p) =>
              updateCurrentMeeting({
                participants: [...currentMeeting.participants, p],
              })
            }
            onEnhanceNotes={handleEnhanceNotes}
            isEnhancing={isEnhancing}
            onOpenSyncModal={() => setIsSyncModalOpen(true)}
            onToggleCopilot={() => setIsCopilotOpen(!isCopilotOpen)}
            isCopilotOpen={isCopilotOpen}
            onOpenShareModal={() => setIsShareModalOpen(true)}
            currentPalette={palette}
            onSelectPalette={(p) => {
              setPalette(p);
              pushToast(
                `Color scheme updated: ${PALETTES[p].name}`,
                PALETTES[p].subtitle,
                'info'
              );
            }}
          />
        )}

        {/* Live Audio Recording Floating Banner */}
        {isRecordingActive && (
          <div className="px-6 py-2 bg-stone-900 border-b border-stone-800 shrink-0">
            <AudioRecorder
              isRecording={isRecordingActive}
              onStartRecording={() => setIsRecordingActive(true)}
              onStopRecording={() => {
                setIsRecordingActive(false);
                updateCurrentMeeting({ isLiveRecording: false });
                pushToast('Audio Recording Stopped', 'Ready to synthesize into Quote Notes.', 'info');
              }}
              onNewTranscriptSegment={(segment) => {
                updateCurrentMeeting({
                  transcript: [...(currentMeeting?.transcript || []), segment],
                });
              }}
              participants={currentMeeting?.participants.map((p) => p.name) || ['Me']}
            />
          </div>
        )}

        {/* Granola Tabs Bar with Emil Kowalski sliding pill indicator */}
        <div className="px-6 pt-2 bg-white/40 dark:bg-black/20 border-b border-[var(--border-hairline)] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-1 p-0.5 rounded-xl bg-stone-200/40 dark:bg-zinc-800/50 mb-1.5 border border-black/[0.04] dark:border-white/[0.05]">
            <button
              onClick={() => setActiveTab('quote-notes')}
              className={`py-1.5 px-3 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all duration-150 ease-emil btn-tactile cursor-pointer ${
                activeTab === 'quote-notes'
                  ? 'bg-white dark:bg-zinc-800 text-stone-900 dark:text-zinc-50 shadow-craft-sm ring-1 ring-black/[0.04] dark:ring-white/[0.06]'
                  : 'text-stone-500 hover:text-stone-800 dark:hover:text-zinc-300'
              }`}
            >
              <Quote size={12} style={{ color: 'var(--theme-primary)' }} />
              <span>Quote Notes</span>
              {currentMeeting?.quotes.length ? (
                <span
                  className="text-[10px] px-1.5 py-0.2 rounded-full font-mono-code font-bold"
                  style={{
                    backgroundColor: 'var(--theme-primary-light)',
                    color: 'var(--theme-primary-text)',
                  }}
                >
                  {currentMeeting.quotes.length}
                </span>
              ) : null}
            </button>

            <button
              onClick={() => setActiveTab('raw-scratchpad')}
              className={`py-1.5 px-3 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all duration-150 ease-emil btn-tactile cursor-pointer ${
                activeTab === 'raw-scratchpad'
                  ? 'bg-white dark:bg-zinc-800 text-stone-900 dark:text-zinc-50 shadow-craft-sm ring-1 ring-black/[0.04] dark:ring-white/[0.06]'
                  : 'text-stone-500 hover:text-stone-800 dark:hover:text-zinc-300'
              }`}
            >
              <FileText size={12} />
              <span>Raw Scratchpad</span>
            </button>

            <button
              onClick={() => setActiveTab('transcript')}
              className={`py-1.5 px-3 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all duration-150 ease-emil btn-tactile cursor-pointer ${
                activeTab === 'transcript'
                  ? 'bg-white dark:bg-zinc-800 text-stone-900 dark:text-zinc-50 shadow-craft-sm ring-1 ring-black/[0.04] dark:ring-white/[0.06]'
                  : 'text-stone-500 hover:text-stone-800 dark:hover:text-zinc-300'
              }`}
            >
              <Volume2 size={12} />
              <span>Transcript & Audio</span>
              {currentMeeting?.transcript.length ? (
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-stone-200 dark:bg-zinc-700 text-stone-700 dark:text-zinc-300 font-mono-code">
                  {currentMeeting.transcript.length}
                </span>
              ) : null}
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-[10px] text-stone-400 dark:text-zinc-500 pb-1 font-mono-code">
            <span>⌘1 / ⌘2 / ⌘3</span>
          </div>
        </div>

        {/* Tab Viewport */}
        <div className="flex-1 overflow-y-auto">
          {currentMeeting ? (
            <>
              {activeTab === 'quote-notes' && (
                <QuoteNotesView
                  meeting={currentMeeting}
                  onUpdateActionItems={(actionItems) => updateCurrentMeeting({ actionItems })}
                  onJumpToTranscript={handleJumpToTranscript}
                  onOpenSyncModal={() => setIsSyncModalOpen(true)}
                  onOpenShareModal={() => setIsShareModalOpen(true)}
                  onReEnhance={handleEnhanceNotes}
                  isEnhancing={isEnhancing}
                />
              )}

              {activeTab === 'raw-scratchpad' && (
                <RawScratchpad
                  rawNotes={currentMeeting.rawNotes}
                  onChange={(rawNotes) => updateCurrentMeeting({ rawNotes })}
                  onEnhance={handleEnhanceNotes}
                  isEnhancing={isEnhancing}
                />
              )}

              {activeTab === 'transcript' && (
                <TranscriptView
                  transcript={currentMeeting.transcript}
                  onAddQuoteFromTranscript={(quote) => {
                    updateCurrentMeeting({
                      quotes: [quote, ...currentMeeting.quotes],
                    });
                    pushToast('Verbatim Quote Pinned', `"${quote.quote.slice(0, 45)}..." — ${quote.speaker}`, 'info');
                  }}
                  onAddManualSegment={(segment) => {
                    updateCurrentMeeting({
                      transcript: [...currentMeeting.transcript, segment],
                    });
                  }}
                  jumpTimestampSeconds={jumpTimestamp}
                />
              )}
            </>
          ) : (
            <div className="p-12 text-center text-stone-500 text-sm">
              No meeting selected.
            </div>
          )}
        </div>
      </main>

      {/* Modals & Drawers */}
      {currentMeeting && (
        <>
          <TaskSyncModal
            isOpen={isSyncModalOpen}
            onClose={() => setIsSyncModalOpen(false)}
            meeting={currentMeeting}
            onTasksSynced={(actionItems) => {
              updateCurrentMeeting({ actionItems });
              pushToast(
                'Tasks Synced Successfully',
                'Exported and routed to external workspace tracker.',
                'sync',
                'View Actions',
                () => setActiveTab('quote-notes')
              );
            }}
          />

          <AICopilotDrawer
            isOpen={isCopilotOpen}
            onClose={() => setIsCopilotOpen(false)}
            meeting={currentMeeting}
          />

          <ShareModal
            isOpen={isShareModalOpen}
            onClose={() => setIsShareModalOpen(false)}
            meeting={currentMeeting}
          />
        </>
      )}

      <NewMeetingModal
        isOpen={isNewMeetingModalOpen}
        onClose={() => setIsNewMeetingModalOpen(false)}
        onCreateMeeting={(newMeeting, startRecordingImmediately) => {
          setMeetings((prev) => [newMeeting, ...prev]);
          setCurrentMeetingId(newMeeting.id);
          if (startRecordingImmediately) {
            setIsRecordingActive(true);
            setActiveTab('transcript');
          } else {
            setActiveTab('raw-scratchpad');
          }
        }}
      />
    </div>
  );
}
