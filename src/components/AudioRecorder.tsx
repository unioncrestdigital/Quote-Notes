import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Square, Play, Pause, Volume2, UserCheck, Sparkles, AlertCircle } from 'lucide-react';
import { TranscriptSegment } from '../types';

interface AudioRecorderProps {
  isRecording: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onNewTranscriptSegment: (segment: TranscriptSegment) => void;
  participants: string[];
}

export const AudioRecorder: React.FC<AudioRecorderProps> = ({
  isRecording,
  onStartRecording,
  onStopRecording,
  onNewTranscriptSegment,
  participants,
}) => {
  const [seconds, setSeconds] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [currentSpeaker, setCurrentSpeaker] = useState(participants[0] || 'Me');
  const [liveInterimText, setLiveInterimText] = useState('');
  const [isMicAvailable, setIsMicAvailable] = useState(true);
  const [audioLevel, setAudioLevel] = useState(0);
  const [simulationActive, setSimulationActive] = useState(false);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const recognitionRef = useRef<any>(null);
  const timerRef = useRef<any>(null);
  const simTimerRef = useRef<any>(null);

  // Update currentSpeaker if participants change
  useEffect(() => {
    if (participants.length > 0 && !participants.includes(currentSpeaker)) {
      setCurrentSpeaker(participants[0]);
    }
  }, [participants]);

  // Handle timer
  useEffect(() => {
    if (isRecording && !isPaused) {
      timerRef.current = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isRecording, isPaused]);

  // Audio recording initialization
  useEffect(() => {
    if (isRecording) {
      startAudioCapture();
    } else {
      stopAudioCapture();
    }
    return () => stopAudioCapture();
  }, [isRecording]);

  const startAudioCapture = async () => {
    // 1. Try real Web Speech Recognition
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    let recognitionStarted = false;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
          let interim = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              pushSegment(transcript.trim());
              setLiveInterimText('');
            } else {
              interim += transcript;
            }
          }
          if (interim) {
            setLiveInterimText(interim);
          }
        };

        recognition.onerror = (e: any) => {
          console.warn('Speech recognition notice:', e.error);
          if (e.error === 'not-allowed' || e.error === 'service-not-allowed') {
            setIsMicAvailable(false);
            startSimulation();
          }
        };

        recognition.start();
        recognitionRef.current = recognition;
        recognitionStarted = true;
      } catch (err) {
        console.warn('Could not start Web Speech Recognition:', err);
      }
    }

    // 2. Try Web Audio API for visualizer
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaStreamRef.current = stream;

        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioContextClass();
        audioContextRef.current = ctx;

        const analyser = ctx.createAnalyser();
        analyser.fftSize = 64;
        analyserRef.current = analyser;

        const source = ctx.createMediaStreamSource(stream);
        source.connect(analyser);

        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        const updateLevel = () => {
          if (!analyserRef.current) return;
          analyserRef.current.getByteFrequencyData(dataArray);
          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) {
            sum += dataArray[i];
          }
          const avg = sum / dataArray.length;
          setAudioLevel(Math.min(100, Math.round(avg * 1.5)));
          if (isRecording) {
            requestAnimationFrame(updateLevel);
          }
        };
        updateLevel();
      } else {
        setIsMicAvailable(false);
        if (!recognitionStarted) startSimulation();
      }
    } catch (micErr) {
      console.warn('Microphone permission skipped or unavailable:', micErr);
      setIsMicAvailable(false);
      startSimulation();
    }
  };

  const stopAudioCapture = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (_) {}
      recognitionRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (audioContextRef.current) {
      try {
        audioContextRef.current.close();
      } catch (_) {}
      audioContextRef.current = null;
    }
    clearInterval(simTimerRef.current);
    setAudioLevel(0);
    setLiveInterimText('');
  };

  // Automated dialogue simulator for testing without microphone input
  const startSimulation = () => {
    setSimulationActive(true);
    const mockPhrases = [
      { speaker: participants[0] || 'Sarah', text: "Let's review the key requirements for our Q4 milestone delivery." },
      { speaker: participants[1] || 'Alex', text: "We verified that verbatim quote attribution is our highest-converting customer feature." },
      { speaker: participants[0] || 'Sarah', text: "Exactly. The team must sync tasks directly to Linear before Thursday." },
      { speaker: participants[2] || 'David', text: "Agreed. Speed of execution and zero-friction integrations will define our moat." },
      { speaker: participants[1] || 'Alex', text: "I'll make sure the API latency stays below 100 milliseconds for all webhook dispatches." },
    ];

    let index = 0;
    simTimerRef.current = setInterval(() => {
      if (index < mockPhrases.length) {
        const item = mockPhrases[index];
        pushSegment(item.text, item.speaker);
        index++;
      } else {
        clearInterval(simTimerRef.current);
      }
    }, 6000);
  };

  const pushSegment = (text: string, speakerOverride?: string) => {
    if (!text) return;
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    const timeStr = `${m}:${s}`;

    onNewTranscriptSegment({
      id: `live-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      speaker: speakerOverride || currentSpeaker,
      time: timeStr,
      timestampSeconds: seconds,
      text,
      isKeyMoment: text.length > 40 && (text.includes('must') || text.includes('will') || text.includes('agree') || text.includes('critical')),
    });
  };

  const formatTimer = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-stone-900 text-white p-3.5 rounded-xl shadow-lg border border-stone-800 transition-all">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Left: Recording status & Audio Waveform */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex items-center justify-center">
            <span className="w-3.5 h-3.5 rounded-full bg-red-500 animate-ping absolute" />
            <span className="w-3.5 h-3.5 rounded-full bg-red-600 relative z-10" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold tracking-wide uppercase text-stone-300">
                Live Recording
              </span>
              <span className="font-mono-code text-xs font-bold text-amber-400 bg-stone-800 px-2 py-0.5 rounded">
                {formatTimer(seconds)}
              </span>
            </div>
            <p className="text-[11px] text-stone-400">
              {simulationActive ? 'Simulated live speech stream active' : 'Listening & transcribing quietly...'}
            </p>
          </div>

          {/* Dynamic Audio Visualizer waveform bars */}
          <div className="flex items-center gap-0.5 h-6 px-2 bg-stone-950/60 rounded-md border border-stone-800 ml-2">
            {[40, 75, 55, 90, 60, 80, 45, 95, 70, 50].map((h, i) => {
              const dynamicHeight = Math.max(4, Math.round((h * (audioLevel || 25)) / 100));
              return (
                <div
                  key={i}
                  className="w-1 rounded-full transition-all duration-75"
                  style={{
                    height: `${dynamicHeight}px`,
                    backgroundColor: 'var(--theme-primary)',
                  }}
                />
              );
            })}
          </div>
        </div>

        {/* Center: Quick Speaker Tag Switcher */}
        <div className="flex items-center gap-1.5 bg-stone-800/80 p-1 rounded-lg border border-stone-700/60 text-xs">
          <span className="text-[10px] text-stone-400 pl-1.5 flex items-center gap-1">
            <UserCheck size={12} />
            Speaking:
          </span>
          <select
            value={currentSpeaker}
            onChange={(e) => setCurrentSpeaker(e.target.value)}
            className="bg-transparent text-amber-300 text-xs font-medium outline-none cursor-pointer pr-1"
          >
            {participants.map((p) => (
              <option key={p} value={p} className="bg-stone-800 text-stone-100">
                {p}
              </option>
            ))}
            <option value="Speaker 1" className="bg-stone-800 text-stone-100">Speaker 1</option>
            <option value="Speaker 2" className="bg-stone-800 text-stone-100">Speaker 2</option>
          </select>
        </div>

        {/* Right: Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs flex items-center gap-1 transition-colors btn-tactile cursor-pointer shadow-craft-sm"
            title={isPaused ? 'Resume recording' : 'Pause recording'}
          >
            {isPaused ? <Play size={14} className="text-emerald-400" /> : <Pause size={14} />}
          </button>

          <button
            onClick={onStopRecording}
            className="px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-craft-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] transition-all btn-tactile cursor-pointer"
            title="Finish recording & enhance notes"
          >
            <Square size={12} fill="currentColor" />
            <span>Stop & Synthesize</span>
          </button>
        </div>
      </div>

      {/* Live Interim Transcript Bubble */}
      {liveInterimText && (
        <div className="mt-2.5 pt-2 border-t border-stone-800/80 text-xs text-amber-200/90 italic flex items-center gap-2 font-serif-quote">
          <span className="text-[10px] not-italic px-1.5 py-0.5 rounded bg-stone-800 text-stone-300 font-sans">
            {currentSpeaker}
          </span>
          "{liveInterimText}..."
        </div>
      )}
    </div>
  );
};
