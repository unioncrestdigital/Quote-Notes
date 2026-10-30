import React, { useState } from 'react';
import { 
  X, 
  Plus, 
  Mic, 
  FileText, 
  Users, 
  Sparkles,
  Calendar,
  Layers
} from 'lucide-react';
import { Meeting } from '../types';

interface NewMeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateMeeting: (newMeeting: Meeting, startRecordingImmediately: boolean) => void;
}

export const NewMeetingModal: React.FC<NewMeetingModalProps> = ({
  isOpen,
  onClose,
  onCreateMeeting,
}) => {
  const [title, setTitle] = useState('');
  const [template, setTemplate] = useState<Meeting['template']>('Product Review');
  const [attendeesText, setAttendeesText] = useState('Alex Rivera, Sarah Lin');

  if (!isOpen) return null;

  const templates: Array<{
    id: Meeting['template'];
    title: string;
    desc: string;
    starterNotes: string;
  }> = [
    {
      id: 'Product Review',
      title: 'Product Review',
      desc: 'Feature scoping, UI critiques, and launch blocker tracking',
      starterNotes: '- Key feature demo & feedback\n- Performance or UI friction points\n- Launch timeline decisions\n- Action items & ticket ownership',
    },
    {
      id: 'Customer Discovery',
      title: 'Customer Discovery / Sales',
      desc: 'Objection handling, buyer pain points, and quote capture',
      starterNotes: '- Primary customer problem / workflow\n- Current tool friction points\n- Verbatim quotes on willingness to pay\n- Follow-up commitments & security review',
    },
    {
      id: 'Sprint Architecture',
      title: 'Sprint & Engineering Sync',
      desc: 'Technical architecture, API limits, database scaling',
      starterNotes: '- Architectural bottlenecks\n- Service boundaries & latency benchmarks\n- Infrastructure migrations\n- Engineering task ownership in Linear',
    },
    {
      id: '1-on-1',
      title: '1-on-1 Feedback',
      desc: 'Career milestones, blockers, and personal alignment',
      starterNotes: '- What went well this week?\n- What was the biggest blocker?\n- Upcoming priorities & growth goals\n- Commitments from both sides',
    },
    {
      id: 'General Sync',
      title: 'General Team Sync',
      desc: 'All-purpose team alignment and quick status updates',
      starterNotes: '- Status updates across initiatives\n- Blockers and dependencies\n- Action items for the week',
    },
  ];

  const handleCreate = (startRecordingImmediately: boolean) => {
    const selectedTemplateObj = templates.find((t) => t.id === template);
    const participantNames = attendeesText.split(',').map((n) => n.trim()).filter(Boolean);
    const participants = participantNames.map((name, i) => ({
      id: `p-${Date.now()}-${i}`,
      name,
      role: i === 0 ? 'Lead' : 'Participant',
    }));

    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newMeeting: Meeting = {
      id: `meet-${Date.now()}`,
      title: title.trim() || `${template} - ${now.toLocaleDateString([], { month: 'short', day: 'numeric' })}`,
      date: dateStr,
      time: timeStr,
      durationMinutes: 30,
      template,
      participants: participants.length > 0 ? participants : [{ id: 'p-me', name: 'Me', role: 'Owner' }],
      rawNotes: selectedTemplateObj?.starterNotes || '',
      transcript: [],
      executiveSummary: '',
      keyTakeaways: [],
      quotes: [],
      actionItems: [],
      followUpEmailDraft: {
        subject: `Recap: ${title || template}`,
        body: '',
      },
    };

    onCreateMeeting(newMeeting, startRecordingImmediately);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 animate-emil-fade">
      <div className="bg-white dark:bg-[#181817] rounded-2xl max-w-xl w-full p-6 shadow-craft-modal border border-black/[0.08] dark:border-white/[0.08] space-y-5 animate-emil-modal">
        <div className="flex items-center justify-between border-b border-black/[0.06] dark:border-white/[0.07] pb-3.5">
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-lg text-white font-serif-quote font-bold flex items-center justify-center text-lg shadow-craft-sm"
              style={{ backgroundColor: 'var(--theme-primary)' }}
            >
              “
            </div>
            <h3 className="text-base font-bold text-stone-900 dark:text-zinc-100">
              New Meeting Note
            </h3>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-zinc-200 btn-tactile cursor-pointer">
            <X size={16} />
          </button>
        </div>

        {/* Meeting Title */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-400 dark:text-zinc-500 mb-1.5">
            Meeting Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Q4 Growth Architecture & GTM Alignment"
            className="w-full text-xs p-2.5 rounded-xl bg-stone-50 dark:bg-zinc-900 border border-black/[0.08] dark:border-white/[0.08] text-stone-900 dark:text-zinc-100 outline-none focus:border-amber-500 shadow-craft-sm transition-all"
            autoFocus
          />
        </div>

        {/* Template Selectors */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-400 dark:text-zinc-500 mb-2">
            Choose a Meeting Template
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {templates.map((tmpl) => (
              <div
                key={tmpl.id}
                onClick={() => setTemplate(tmpl.id)}
                className={`p-3 rounded-xl border cursor-pointer transition-all ease-emil text-left btn-tactile ${
                  template === tmpl.id
                    ? 'border-amber-500 bg-amber-50/70 dark:bg-amber-950/40 shadow-craft-sm ring-1 ring-amber-500/30'
                    : 'border-black/[0.06] dark:border-white/[0.06] hover:bg-stone-50 dark:hover:bg-zinc-900'
                }`}
              >
                <div className="text-xs font-bold text-stone-800 dark:text-zinc-200">
                  {tmpl.title}
                </div>
                <div className="text-[11px] text-stone-400 dark:text-zinc-500 line-clamp-1 mt-0.5">
                  {tmpl.desc}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Attendees */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-400 dark:text-zinc-500 mb-1.5">
            Attendees (Comma separated)
          </label>
          <input
            type="text"
            value={attendeesText}
            onChange={(e) => setAttendeesText(e.target.value)}
            placeholder="e.g. Sarah Lin, David Thorne, Marcus Vance"
            className="w-full text-xs p-2.5 rounded-xl bg-stone-50 dark:bg-zinc-900 border border-black/[0.08] dark:border-white/[0.08] text-stone-900 dark:text-zinc-100 outline-none shadow-craft-sm"
          />
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-2 pt-3 border-t border-black/[0.06] dark:border-white/[0.07]">
          <button
            onClick={() => handleCreate(false)}
            className="w-full sm:w-auto px-4 py-2 text-xs font-semibold rounded-lg bg-stone-100 dark:bg-zinc-800 hover:bg-stone-200/80 dark:hover:bg-zinc-700 text-stone-800 dark:text-zinc-200 flex items-center justify-center gap-1.5 transition-all btn-tactile cursor-pointer border border-black/[0.05] dark:border-white/[0.06] shadow-craft-sm"
          >
            <FileText size={13} />
            <span>Open Blank Scratchpad</span>
          </button>

          <button
            onClick={() => handleCreate(true)}
            className="w-full sm:w-auto px-4 py-2 text-xs font-semibold rounded-lg bg-stone-900 hover:bg-stone-800 dark:bg-amber-500 dark:hover:bg-amber-400 text-white dark:text-stone-950 flex items-center justify-center gap-1.5 shadow-craft-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.3)] transition-all btn-tactile cursor-pointer"
          >
            <Mic size={13} className="text-amber-300 dark:text-stone-950" />
            <span>Record & Transcribe Now</span>
          </button>
        </div>
      </div>
    </div>
  );
};
