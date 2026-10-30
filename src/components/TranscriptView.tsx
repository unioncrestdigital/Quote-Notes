import React, { useState } from 'react';
import { 
  Play, 
  Pause, 
  Search, 
  Quote, 
  Clock, 
  Plus, 
  Upload, 
  Check, 
  Filter, 
  FileAudio,
  Volume2
} from 'lucide-react';
import { TranscriptSegment, VerbatimQuote } from '../types';

interface TranscriptViewProps {
  transcript: TranscriptSegment[];
  onAddQuoteFromTranscript: (quote: VerbatimQuote) => void;
  onAddManualSegment: (segment: TranscriptSegment) => void;
  jumpTimestampSeconds?: number;
}

export const TranscriptView: React.FC<TranscriptViewProps> = ({
  transcript,
  onAddQuoteFromTranscript,
  onAddManualSegment,
  jumpTimestampSeconds,
}) => {
  const [search, setSearch] = useState('');
  const [filterSpeaker, setFilterSpeaker] = useState('all');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [showPasteModal, setShowPasteModal] = useState(false);
  const [pastedText, setPastedText] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Extract unique speakers
  const speakers = Array.from(new Set(transcript.map((t) => t.speaker)));

  const filtered = transcript.filter((t) => {
    const matchesSearch = t.text.toLowerCase().includes(search.toLowerCase()) ||
                          t.speaker.toLowerCase().includes(search.toLowerCase());
    const matchesSpeaker = filterSpeaker === 'all' || t.speaker === filterSpeaker;
    return matchesSearch && matchesSpeaker;
  });

  const handleMakeQuote = (item: TranscriptSegment) => {
    const newQuote: VerbatimQuote = {
      id: `q-manual-${Date.now()}`,
      quote: item.text,
      speaker: item.speaker,
      time: item.time,
      timestampSeconds: item.timestampSeconds,
      context: `Selected directly from transcript at ${item.time}`,
      relevance: 'high',
      tags: ['Manual Extract'],
    };
    onAddQuoteFromTranscript(newQuote);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleProcessPastedTranscript = () => {
    if (!pastedText.trim()) return;

    // Parse simple format e.g. "Speaker: text" or lines
    const lines = pastedText.split('\n').filter(Boolean);
    let secondsCounter = 0;

    lines.forEach((line, idx) => {
      const match = line.match(/^(\[?\d{1,2}:\d{2}\]?\s*)?([^:]+):\s*(.*)$/);
      let speaker = 'Speaker';
      let text = line;
      let timeStr = '00:00';

      if (match) {
        speaker = match[2].trim();
        text = match[3].trim();
      }

      secondsCounter += 15;
      const m = Math.floor(secondsCounter / 60).toString().padStart(2, '0');
      const s = (secondsCounter % 60).toString().padStart(2, '0');
      timeStr = `${m}:${s}`;

      onAddManualSegment({
        id: `imported-${Date.now()}-${idx}`,
        speaker,
        time: timeStr,
        timestampSeconds: secondsCounter,
        text,
        isKeyMoment: text.length > 50,
      });
    });

    setPastedText('');
    setShowPasteModal(false);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-stone-200/80 dark:border-zinc-800/80">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-stone-700 dark:text-zinc-300 flex items-center gap-2">
            <Volume2 size={16} />
            Full Meeting Audio Transcript ({transcript.length} segments)
          </h2>
          <p className="text-[11px] text-stone-500 dark:text-zinc-400">
            Diarized speech record. Click "Quote this" on any line to pin as an official Verbatim Quote.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowPasteModal(true)}
            className="text-xs px-2.5 py-1.5 rounded-lg bg-white dark:bg-zinc-800 hover:bg-stone-100 dark:hover:bg-zinc-700 text-stone-700 dark:text-zinc-300 border border-stone-200 dark:border-zinc-700 flex items-center gap-1.5 transition"
          >
            <Upload size={12} />
            Import Transcript
          </button>
        </div>
      </div>

      {/* Search and Speaker Filter */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search transcript by keyword or phrase..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg bg-white dark:bg-zinc-800/90 border border-stone-200 dark:border-zinc-700 text-stone-800 dark:text-zinc-200 placeholder-stone-400 outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1">
          <span className="text-[11px] text-stone-500 shrink-0">Speaker:</span>
          <button
            onClick={() => setFilterSpeaker('all')}
            className={`px-2 py-1 text-xs rounded-md transition ${
              filterSpeaker === 'all'
                ? 'bg-stone-800 text-white dark:bg-zinc-200 dark:text-zinc-900 font-medium'
                : 'bg-stone-100 dark:bg-zinc-800 text-stone-600 dark:text-zinc-400'
            }`}
          >
            All
          </button>
          {speakers.map((spk) => (
            <button
              key={spk}
              onClick={() => setFilterSpeaker(spk)}
              className={`px-2 py-1 text-xs rounded-md whitespace-nowrap transition ${
                filterSpeaker === spk
                  ? 'bg-stone-800 text-white dark:bg-zinc-200 dark:text-zinc-900 font-medium'
                  : 'bg-stone-100 dark:bg-zinc-800 text-stone-600 dark:text-zinc-400'
              }`}
            >
              {spk}
            </button>
          ))}
        </div>
      </div>

      {/* Transcript Stream */}
      <div className="space-y-2.5">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-xs text-stone-400 rounded-2xl border border-dashed border-stone-200 dark:border-zinc-800">
            No spoken segments matching your criteria.
          </div>
        ) : (
          filtered.map((item) => {
            const isHighlighted = jumpTimestampSeconds !== undefined && Math.abs(jumpTimestampSeconds - item.timestampSeconds) < 20;

            return (
              <div
                key={item.id}
                id={`transcript-${item.id}`}
                className={`group p-3.5 sm:p-4 rounded-2xl border transition-all duration-150 ease-emil ${
                  isHighlighted
                    ? 'border-[var(--theme-primary)] shadow-craft'
                    : 'bg-white dark:bg-[#181817] border-black/[0.06] dark:border-white/[0.07] hover:border-black/[0.12] dark:hover:border-white/[0.12] shadow-craft-sm'
                }`}
                style={
                  isHighlighted
                    ? { backgroundColor: 'var(--theme-primary-light)' }
                    : undefined
                }
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-stone-900 dark:text-zinc-100 flex items-center gap-1.5">
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: 'var(--theme-primary)' }}
                      />
                      {item.speaker}
                    </span>
                    <span className="font-mono-code text-[11px] text-stone-400 dark:text-zinc-500 flex items-center gap-0.5">
                      <Clock size={10} />
                      {item.time}
                    </span>
                    {item.isKeyMoment && (
                      <span
                        className="text-[10px] px-1.5 py-0.2 rounded-full font-medium"
                        style={{
                          backgroundColor: 'var(--theme-primary-light)',
                          color: 'var(--theme-primary-text)',
                        }}
                      >
                        Key moment
                      </span>
                    )}
                  </div>

                  {/* 1-Click "Pin as Quote" Button */}
                  <button
                    onClick={() => handleMakeQuote(item)}
                    className="opacity-0 group-hover:opacity-100 px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-all btn-tactile cursor-pointer shadow-craft-sm"
                    style={{
                      backgroundColor: 'var(--theme-primary-light)',
                      color: 'var(--theme-primary-text)',
                    }}
                    title="Pin this verbatim quote into Quote Notes"
                  >
                    {copiedId === item.id ? (
                      <>
                        <Check size={11} className="text-emerald-600" />
                        <span>Pinned to Quotes</span>
                      </>
                    ) : (
                      <>
                        <Quote size={11} style={{ color: 'var(--theme-primary)' }} />
                        <span>Pin as Quote</span>
                      </>
                    )}
                  </button>
                </div>

                <p className="text-xs sm:text-[13px] text-stone-700 dark:text-zinc-300 leading-relaxed font-sans pl-3 border-l-2 border-stone-200 dark:border-zinc-700">
                  {item.text}
                </p>
              </div>
            );
          })
        )}
      </div>

      {/* Import Modal */}
      {showPasteModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 animate-emil-fade">
          <div className="bg-white dark:bg-[#181817] rounded-2xl max-w-lg w-full p-5 shadow-craft-modal border border-black/[0.08] dark:border-white/[0.08] space-y-4 animate-emil-modal">
            <h3 className="text-sm font-bold text-stone-900 dark:text-zinc-100 flex items-center gap-2">
              <Upload size={16} />
              Import Meeting Transcript
            </h3>
            <p className="text-xs text-stone-400 dark:text-zinc-500">
              Paste transcript text from Zoom, Google Meet, Teams, or an audio export:
            </p>
            <textarea
              value={pastedText}
              onChange={(e) => setPastedText(e.target.value)}
              placeholder={`Sarah: Good morning team, let's review our deliverables.\nAlex: I checked the retention cohorts and we're at 64%.\nDavid: That is well above industry benchmark.`}
              rows={8}
              className="w-full text-xs p-3 rounded-xl bg-stone-50 dark:bg-zinc-900 border border-black/[0.08] dark:border-white/[0.08] text-stone-800 dark:text-zinc-200 outline-none shadow-craft-sm"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowPasteModal(false)}
                className="px-3 py-1.5 text-xs text-stone-500 dark:text-zinc-400 hover:text-stone-900 btn-tactile cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleProcessPastedTranscript}
                className="px-4 py-1.5 text-xs bg-stone-900 dark:bg-amber-500 text-white dark:text-stone-950 font-semibold rounded-lg shadow-craft-sm btn-tactile cursor-pointer"
              >
                Import Transcript
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
