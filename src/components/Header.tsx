import React, { useState } from 'react';
import { Sparkles, Zap, ShieldCheck, Clock, Filter, AlertCircle, Info, X } from 'lucide-react';

interface HeaderProps {
  engineUsed?: 'gemini-3.8-flash' | 'intelligent-mock-synthesizer';
}

export const Header: React.FC<HeaderProps> = ({ engineUsed }) => {
  const [showRulesModal, setShowRulesModal] = useState(false);

  return (
    <>
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40 px-4 lg:px-8 py-3.5 transition-all">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-indigo-600 shadow-lg shadow-cyan-500/20 text-white font-bold">
              <Zap className="w-5 h-5 text-white animate-pulse" />
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-extrabold tracking-tight text-white flex items-center gap-1.5">
                  Action<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-400">Pulse</span>
                </h1>
                {/* Handshake Vibe Coding Mission Badge */}
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gradient-to-r from-amber-500/15 via-purple-500/15 to-cyan-500/15 border border-purple-500/30 text-purple-300 shadow-sm">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  ✨ Handshake Vibe Coding Mission
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Smart Meeting-to-Action Copilot • Extract clean tasks, anchored deadlines & executive emails
              </p>
            </div>
          </div>

          {/* Right actions & Badges */}
          <div className="flex items-center gap-2.5 self-end sm:self-auto">
            {/* Engine badge */}
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50"></span>
              <span className="font-medium text-slate-400">Engine:</span>
              <span className="text-cyan-300 font-semibold">
                {engineUsed === 'gemini-3.8-flash' ? 'Gemini 3.8 Flash' : 'Instant Synthesizer'}
              </span>
            </div>

            {/* Standing Rules Trigger */}
            <button
              onClick={() => setShowRulesModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-xs font-medium text-slate-200 transition-colors shadow-sm"
              title="View Built-in Intelligence Rules"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>Standing Rules</span>
            </button>
          </div>
        </div>
      </header>

      {/* Standing Rules Modal */}
      {showRulesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setShowRulesModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-xl bg-cyan-950/60 border border-cyan-800/50 text-cyan-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">ActionPulse Built-in Intelligence</h3>
                <p className="text-xs text-slate-400">Autonomous processing rules enforced on every sync</p>
              </div>
            </div>

            <div className="space-y-3.5 text-xs text-slate-300">
              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-start gap-3">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-white">1. No Orphan Tasks</h4>
                  <p className="text-slate-400 mt-0.5">
                    Any action item without a clear individual assignee is explicitly labeled{' '}
                    <span className="text-rose-400 font-mono font-medium">[UNASSIGNED - Needs Volunteer]</span> so
                    critical work is never lost in limbo.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-start gap-3">
                <Clock className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-white">2. Temporal Anchoring</h4>
                  <p className="text-slate-400 mt-0.5">
                    Relative dates like &ldquo;tonight&rdquo;, &ldquo;tomorrow at 5 PM&rdquo;, &ldquo;by Tuesday&rdquo;, or &ldquo;by Friday&rdquo;
                    are dynamically resolved relative to the actual meeting date.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-start gap-3">
                <Filter className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-white">3. Signal-to-Noise Filtering</h4>
                  <p className="text-slate-400 mt-0.5">
                    Jokes, side banter, broken door card-readers, missing HDMI dongles, and pizza debates are filtered out
                    of official action items and logged separately.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-start gap-3">
                <Zap className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-white">4. Instant Demo Mode</h4>
                  <p className="text-slate-400 mt-0.5">
                    Works instantaneously out-of-the-box with Gemini 3.8 Flash or deterministic natural-language parsing
                    fallback if no API key is supplied.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowRulesModal(false)}
                className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs transition shadow-md shadow-cyan-600/20"
              >
                Got it, let&apos;s build
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
