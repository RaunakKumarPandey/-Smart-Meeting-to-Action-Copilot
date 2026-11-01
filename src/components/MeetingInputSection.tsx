import React, { useState } from 'react';
import {
  FileText,
  Calendar,
  Sparkles,
  Zap,
  Trash2,
  Users,
  ChevronDown,
  Clock,
  UploadCloud,
  CheckCircle2,
} from 'lucide-react';
import { CAMPUS_HACKATHON_SAMPLE, SAMPLE_PRESETS, SampleMeetingPreset } from '../utils/sampleData.ts';

interface MeetingInputSectionProps {
  title: string;
  setTitle: (t: string) => void;
  date: string;
  setDate: (d: string) => void;
  notes: string;
  setNotes: (n: string) => void;
  attendees: string[];
  setAttendees: (a: string[]) => void;
  onSynthesize: () => void;
  isProcessing: boolean;
  processingStep: string;
}

export const MeetingInputSection: React.FC<MeetingInputSectionProps> = ({
  title,
  setTitle,
  date,
  setDate,
  notes,
  setNotes,
  attendees,
  setAttendees,
  onSynthesize,
  isProcessing,
  processingStep,
}) => {
  const [showPresetsMenu, setShowPresetsMenu] = useState(false);
  const [newAttendeeInput, setNewAttendeeInput] = useState('');

  const wordCount = notes.trim() ? notes.trim().split(/\s+/).length : 0;
  const lineCount = notes.trim() ? notes.split('\n').length : 0;

  const handleLoadPreset = (preset: SampleMeetingPreset) => {
    setTitle(preset.title);
    setDate(preset.date);
    setNotes(preset.transcript);
    setAttendees(preset.attendees);
    setShowPresetsMenu(false);
  };

  const handleAddAttendee = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ('key' in e && e.key !== 'Enter') return;
    const clean = newAttendeeInput.trim();
    if (clean && !attendees.includes(clean)) {
      setAttendees([...attendees, clean]);
      setNewAttendeeInput('');
    }
  };

  const handleRemoveAttendee = (name: string) => {
    setAttendees(attendees.filter((a) => a !== name));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        if (text) {
          setNotes(text);
          if (!title || title === 'Campus Hackathon Committee Sync') {
            const fileNameClean = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
            setTitle(fileNameClean.charAt(0).toUpperCase() + fileNameClean.slice(1));
          }
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 lg:p-6 shadow-xl flex flex-col h-full">
      {/* Section Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800/80 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-cyan-950/60 border border-cyan-800/40 text-cyan-400">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Meeting Input & Transcript</h2>
            <p className="text-xs text-slate-400">Paste rough meeting notes, chat logs, or audio transcripts</p>
          </div>
        </div>

        {/* Load Sample Notes Primary Button */}
        <div className="relative">
          <div className="flex items-center rounded-xl bg-gradient-to-r from-purple-900/40 via-indigo-900/40 to-cyan-900/40 border border-purple-500/30 p-0.5 shadow-md">
            <button
              onClick={() => handleLoadPreset(CAMPUS_HACKATHON_SAMPLE)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-purple-200 hover:text-white hover:bg-purple-800/30 transition"
              title="Pre-populate realistic student org hackathon transcript"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>✨ Load Sample Notes</span>
            </button>
            <button
              onClick={() => setShowPresetsMenu(!showPresetsMenu)}
              className="px-1.5 py-1.5 rounded-lg text-purple-300 hover:text-white hover:bg-purple-800/30 transition border-l border-purple-500/30"
              title="More sample scenarios"
            >
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Presets dropdown */}
          {showPresetsMenu && (
            <div className="absolute right-0 mt-2 w-72 bg-slate-900 border border-slate-700/80 rounded-xl shadow-2xl z-30 py-1.5 animate-in fade-in slide-in-from-top-2">
              <div className="px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Preset Scenarios
              </div>
              {SAMPLE_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => handleLoadPreset(preset)}
                  className="w-full text-left px-3 py-2 text-xs text-slate-200 hover:bg-slate-800/80 hover:text-cyan-300 transition flex flex-col gap-0.5"
                >
                  <span className="font-semibold text-white">{preset.name}</span>
                  <span className="text-[11px] text-slate-400">{preset.description}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Form Fields: Title & Date */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-4">
        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-slate-300 mb-1.5">Meeting Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Campus Hackathon Committee Sync"
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/70 border border-slate-700/80 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-cyan-400" />
            <span>Meeting Date</span>
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/70 border border-slate-700/80 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition"
          />
        </div>
      </div>

      {/* Attendees Tag Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-medium text-slate-300 flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-indigo-400" />
            <span>Meeting Attendees ({attendees.length})</span>
          </label>
          <span className="text-[11px] text-slate-500">Auto-extracted or add manually</span>
        </div>
        <div className="flex flex-wrap items-center gap-1.5 p-2 rounded-xl bg-slate-950/50 border border-slate-800/80 min-h-[42px]">
          {attendees.map((attendee) => (
            <span
              key={attendee}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-indigo-950/60 border border-indigo-700/50 text-indigo-300"
            >
              {attendee}
              <button
                type="button"
                onClick={() => handleRemoveAttendee(attendee)}
                className="text-indigo-400 hover:text-white transition ml-0.5"
                title={`Remove ${attendee}`}
              >
                ×
              </button>
            </span>
          ))}

          {/* Quick Add Attendee */}
          <div className="flex items-center gap-1 ml-1">
            <input
              type="text"
              value={newAttendeeInput}
              onChange={(e) => setNewAttendeeInput(e.target.value)}
              onKeyDown={handleAddAttendee}
              placeholder="+ add attendee..."
              className="text-xs bg-transparent border-0 text-slate-200 placeholder-slate-500 focus:outline-none px-1 py-0.5 w-24"
            />
          </div>
        </div>
      </div>

      {/* Raw Notes Textarea */}
      <div className="flex-1 flex flex-col mb-4">
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
            <span>Raw Transcript or Scratch Notes</span>
            <span className="text-[11px] text-slate-500 font-normal">
              (Includes side banter, relative dates & unassigned tasks)
            </span>
          </label>
          <div className="flex items-center gap-3 text-[11px] text-slate-400">
            <span>{wordCount} words</span>
            <span>•</span>
            <span>{lineCount} lines</span>
            {notes && (
              <button
                type="button"
                onClick={() => setNotes('')}
                className="text-slate-500 hover:text-rose-400 transition flex items-center gap-0.5 ml-1"
                title="Clear notes"
              >
                <Trash2 className="w-3 h-3" />
                <span>Clear</span>
              </button>
            )}
          </div>
        </div>

        <div className="relative flex-1 min-h-[260px] flex flex-col">
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder={`Paste raw transcript or bullet notes here...\n\nExample:\n[10:02 AM] Marcus: Devon, did you see the soccer match yesterday?\n[10:05 AM] Marcus: Sarah will submit the PO by tomorrow at 5 PM.\n[10:10 AM] Priya: Someone urgently needs to order the badges before cutoff!`}
            className="w-full flex-1 p-3.5 rounded-xl bg-slate-950/80 border border-slate-700/80 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 font-mono text-xs leading-relaxed resize-y transition"
          />

          {/* Quick upload file button in corner */}
          <label className="absolute bottom-3 right-3 cursor-pointer inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900/90 border border-slate-700 hover:border-slate-600 text-[11px] text-slate-300 hover:text-white transition shadow">
            <UploadCloud className="w-3.5 h-3.5 text-cyan-400" />
            <span>Upload file (.txt, .md)</span>
            <input type="file" accept=".txt,.md,.log" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>
      </div>

      {/* Primary Action Button */}
      <div className="pt-2">
        <button
          onClick={onSynthesize}
          disabled={isProcessing || !notes.trim()}
          className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm tracking-wide transition-all shadow-lg flex items-center justify-center gap-2.5 ${
            isProcessing || !notes.trim()
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
              : 'bg-gradient-to-r from-cyan-500 via-teal-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-cyan-500/20 hover:shadow-cyan-500/30 hover:scale-[1.008] active:scale-[0.99] border border-cyan-400/30 cursor-pointer'
          }`}
        >
          {isProcessing ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>{processingStep || 'Synthesizing meeting...'}</span>
            </>
          ) : (
            <>
              <Zap className="w-4 h-4 text-amber-300" />
              <span>⚡ Synthesize Meeting & Extract Actions</span>
            </>
          )}
        </button>

        {/* Temporal reminder footnote */}
        <p className="text-[11px] text-slate-500 text-center mt-2 flex items-center justify-center gap-1.5">
          <Clock className="w-3 h-3 text-cyan-400" />
          <span>Relative deadlines will be mathematically anchored to:</span>
          <span className="font-semibold text-slate-300">{date}</span>
        </p>
      </div>
    </div>
  );
};
