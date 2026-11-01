import React, { useState } from 'react';
import {
  Copy,
  Mail,
  Edit3,
  Eye,
  CheckCircle2,
  Calendar,
  Send,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { FollowUpEmail, ActionItem } from '../types.ts';

interface FollowUpEmailTabProps {
  email: FollowUpEmail;
  actionItems: ActionItem[];
  meetingTitle: string;
  meetingDate: string;
  attendees: string[];
  onTriggerToast: (msg: string) => void;
}

export const FollowUpEmailTab: React.FC<FollowUpEmailTabProps> = ({
  email,
  actionItems,
  meetingTitle,
  meetingDate,
  attendees,
  onTriggerToast,
}) => {
  const [tone, setTone] = useState<'executive' | 'friendly' | 'concise'>('friendly');
  const [isEditing, setIsEditing] = useState(false);
  const [customSubject, setCustomSubject] = useState(email.subject);
  const [customGreeting, setCustomGreeting] = useState(email.greeting);
  const [customTldr, setCustomTldr] = useState(email.tldr);
  const [customNextMeeting, setCustomNextMeeting] = useState(email.nextMeeting);
  const [customSignoff, setCustomSignoff] = useState(email.signoff);

  // Compute email content according to selected tone
  const getSubject = () => {
    if (customSubject !== email.subject) return customSubject;
    if (tone === 'executive') return `[Action Items & Decisions] ${meetingTitle} (${meetingDate})`;
    if (tone === 'concise') return `[Sync Digest] ${meetingTitle} — Actions & Next Steps`;
    return `[Action Items] ${meetingTitle} — Decisions & Next Steps (${meetingDate})`;
  };

  const getGreeting = () => {
    if (customGreeting !== email.greeting) return customGreeting;
    if (tone === 'executive') return 'Dear Team,';
    if (tone === 'concise') return 'Team,';
    return email.greeting || 'Hi Everyone,';
  };

  const getTldr = () => {
    if (customTldr !== email.tldr) return customTldr;
    if (tone === 'concise') return `Sync outcomes for ${meetingTitle} (${meetingDate}):`;
    return email.tldr;
  };

  // Generate complete plain-text email string
  const generateEmailPlainText = (): string => {
    const lines: string[] = [];
    lines.push(`Subject: ${getSubject()}\n`);
    lines.push(getGreeting());
    lines.push('');
    lines.push('TL;DR SUMMARY:');
    lines.push(getTldr());
    lines.push('');

    if (email.decisions && email.decisions.length > 0) {
      lines.push('KEY DECISIONS AGREED UPON:');
      email.decisions.forEach((dec) => lines.push(`• ${dec}`));
      lines.push('');
    }

    lines.push('ASSIGNED ACTION ITEMS & DEADLINES:');
    actionItems.forEach((item) => {
      const statusPrefix = item.done ? '[COMPLETED]' : '[PENDING]';
      lines.push(`• ${statusPrefix} ${item.description}`);
      lines.push(`  → Owner: ${item.owner} | Due: ${item.deadline} | Priority: ${item.priority}`);
    });
    lines.push('');

    if (email.blockers && email.blockers.length > 0) {
      lines.push('OPEN BLOCKERS & RISKS:');
      email.blockers.forEach((b) => lines.push(`⚠️ ${b}`));
      lines.push('');
    }

    lines.push(`NEXT MEETING / CADENCE:`);
    lines.push(customNextMeeting || email.nextMeeting);
    lines.push('');
    lines.push(customSignoff || email.signoff);

    return lines.join('\n');
  };

  const handleCopyEmail = () => {
    const fullText = generateEmailPlainText();
    navigator.clipboard.writeText(fullText);
    onTriggerToast('📋 Ready-to-send follow-up email copied to clipboard!');
  };

  const handleCopySubject = () => {
    navigator.clipboard.writeText(getSubject());
    onTriggerToast('📋 Subject line copied!');
  };

  const handleOpenMailto = () => {
    const subject = encodeURIComponent(getSubject());
    const body = encodeURIComponent(generateEmailPlainText());
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
    onTriggerToast('Opening default email client...');
  };

  return (
    <div className="flex flex-col space-y-4">
      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
        {/* Tone Selector */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-slate-400 font-medium mr-1 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Tone:</span>
          </span>
          <button
            onClick={() => setTone('friendly')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
              tone === 'friendly'
                ? 'bg-purple-900/40 text-purple-300 border border-purple-500/40'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Friendly Team
          </button>
          <button
            onClick={() => setTone('executive')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
              tone === 'executive'
                ? 'bg-cyan-900/40 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Executive
          </button>
          <button
            onClick={() => setTone('concise')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
              tone === 'concise'
                ? 'bg-indigo-900/40 text-indigo-300 border border-indigo-500/40'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Ultra-Concise
          </button>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-slate-700 transition cursor-pointer"
          >
            {isEditing ? <Eye className="w-3.5 h-3.5 text-cyan-400" /> : <Edit3 className="w-3.5 h-3.5 text-cyan-400" />}
            <span>{isEditing ? 'View Preview' : 'Edit Draft'}</span>
          </button>

          <button
            onClick={handleCopyEmail}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md shadow-cyan-600/20 transition cursor-pointer"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>📋 Copy Email to Clipboard</span>
          </button>

          <button
            onClick={handleOpenMailto}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-slate-700 transition cursor-pointer"
            title="Open in your default mail app"
          >
            <Mail className="w-3.5 h-3.5 text-amber-400" />
            <span>Open Email App</span>
          </button>
        </div>
      </div>

      {/* Email Container (Styled like a modern inbox preview) */}
      <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5 shadow-xl font-sans">
        {/* Email Header Meta */}
        <div className="pb-4 border-b border-slate-800/80 mb-4 space-y-2.5 text-xs">
          {/* Subject Line */}
          <div className="flex items-center justify-between gap-3 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
            <div className="flex items-center gap-2 flex-1">
              <span className="font-semibold text-slate-400">Subject:</span>
              {isEditing ? (
                <input
                  type="text"
                  value={customSubject}
                  onChange={(e) => setCustomSubject(e.target.value)}
                  className="flex-1 bg-slate-950 border border-cyan-500 rounded px-2 py-1 text-white text-xs"
                />
              ) : (
                <span className="font-bold text-white tracking-wide">{getSubject()}</span>
              )}
            </div>
            <button
              onClick={handleCopySubject}
              className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] font-medium flex items-center gap-1 transition"
              title="Copy subject only"
            >
              <Copy className="w-3 h-3" />
              <span>Copy Subject</span>
            </button>
          </div>

          {/* Attendees / Recipients */}
          <div className="flex items-center gap-2 text-slate-400">
            <span className="font-medium text-slate-500">Recipients:</span>
            <div className="flex flex-wrap items-center gap-1">
              {attendees.map((att) => (
                <span
                  key={att}
                  className="px-2 py-0.5 rounded text-[11px] bg-slate-900 text-slate-300 border border-slate-800"
                >
                  {att.toLowerCase().replace(/\s+/g, '')}@org.edu
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Email Body Content */}
        <div className="space-y-4 text-xs text-slate-200 leading-relaxed">
          {isEditing ? (
            <div className="space-y-3">
              <div>
                <label className="block text-slate-400 text-[11px] mb-1">Greeting</label>
                <input
                  type="text"
                  value={customGreeting}
                  onChange={(e) => setCustomGreeting(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white text-xs"
                />
              </div>
              <div>
                <label className="block text-slate-400 text-[11px] mb-1">Executive TL;DR</label>
                <textarea
                  value={customTldr}
                  onChange={(e) => setCustomTldr(e.target.value)}
                  rows={3}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white text-xs"
                />
              </div>
              <div>
                <label className="block text-slate-400 text-[11px] mb-1">Next Meeting Cadence</label>
                <input
                  type="text"
                  value={customNextMeeting}
                  onChange={(e) => setCustomNextMeeting(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white text-xs"
                />
              </div>
              <div>
                <label className="block text-slate-400 text-[11px] mb-1">Sign-off</label>
                <textarea
                  value={customSignoff}
                  onChange={(e) => setCustomSignoff(e.target.value)}
                  rows={2}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white text-xs"
                />
              </div>
            </div>
          ) : (
            <>
              {/* Greeting */}
              <p className="font-semibold text-slate-100">{getGreeting()}</p>

              {/* TL;DR Paragraph */}
              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800/90">
                <span className="font-bold text-cyan-400 block mb-1 uppercase tracking-wider text-[11px]">
                  📌 Executive TL;DR
                </span>
                <p className="text-slate-300 leading-relaxed">{getTldr()}</p>
              </div>

              {/* Key Decisions */}
              {email.decisions && email.decisions.length > 0 && (
                <div>
                  <h4 className="font-bold text-emerald-400 uppercase tracking-wider text-[11px] mb-2 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Key Decisions Agreed Upon</span>
                  </h4>
                  <ul className="space-y-1.5 pl-1">
                    {email.decisions.map((dec, i) => (
                      <li key={i} className="flex items-start gap-2 text-slate-300">
                        <span className="text-emerald-400 font-bold shrink-0 mt-0.5">•</span>
                        <span>{dec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Assigned Action Items */}
              <div>
                <h4 className="font-bold text-cyan-400 uppercase tracking-wider text-[11px] mb-2 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Assigned Action Items & Deadlines</span>
                </h4>
                <div className="space-y-2">
                  {actionItems.map((item) => {
                    const isUnassigned = item.owner === '[UNASSIGNED - Needs Volunteer]';
                    return (
                      <div
                        key={item.id}
                        className={`p-2.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                          isUnassigned
                            ? 'bg-rose-950/20 border-rose-800/50'
                            : 'bg-slate-900/60 border-slate-800/80'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <span
                            className={`font-mono text-[10px] uppercase font-bold mt-0.5 px-1.5 py-0.5 rounded ${
                              item.done
                                ? 'bg-emerald-950/80 text-emerald-400'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            {item.done ? 'Done' : 'Pending'}
                          </span>
                          <span
                            className={`font-medium ${
                              item.done ? 'line-through text-slate-500' : 'text-slate-200'
                            }`}
                          >
                            {item.description}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                              isUnassigned
                                ? 'bg-rose-950 text-rose-400 border border-dashed border-rose-500'
                                : 'bg-purple-950 text-purple-300 border border-purple-800'
                            }`}
                          >
                            {item.owner}
                          </span>
                          <span className="text-[11px] text-slate-400 font-medium">Due: {item.deadline}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Blockers */}
              {email.blockers && email.blockers.length > 0 && (
                <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-800/40">
                  <h4 className="font-bold text-amber-400 uppercase tracking-wider text-[11px] mb-1.5 flex items-center gap-1.5">
                    <span>⚠️ Open Blockers / Needs Attention</span>
                  </h4>
                  <ul className="space-y-1 pl-1">
                    {email.blockers.map((b, i) => (
                      <li key={i} className="text-amber-200 text-xs">
                        • {b}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Next Meeting */}
              <div className="pt-2 text-slate-300">
                <span className="font-semibold text-slate-400 block mb-0.5">Next Meeting Cadence:</span>
                <p className="font-medium text-white">{customNextMeeting || email.nextMeeting}</p>
              </div>

              {/* Signoff */}
              <div className="pt-2 text-slate-400 whitespace-pre-line border-t border-slate-800/80">
                {customSignoff || email.signoff}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
