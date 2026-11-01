import React, { useState } from 'react';
import {
  FileText,
  CheckCircle2,
  AlertTriangle,
  Filter,
  Users,
  ChevronDown,
  ChevronUp,
  Tag,
  ShieldAlert,
  Flame,
} from 'lucide-react';
import { DecisionItem, BlockerItem, ActionItem } from '../types.ts';

interface SummaryDecisionsTabProps {
  executiveSummary: string;
  decisions: DecisionItem[];
  blockers: BlockerItem[];
  filteredNoise: string[];
  actionItems: ActionItem[];
  attendees: string[];
}

export const SummaryDecisionsTab: React.FC<SummaryDecisionsTabProps> = ({
  executiveSummary,
  decisions,
  blockers,
  filteredNoise,
  actionItems,
  attendees,
}) => {
  const [showNoise, setShowNoise] = useState(true);

  // Calculate task counts per attendee
  const countsByOwner: Record<string, number> = {};
  actionItems.forEach((item) => {
    countsByOwner[item.owner] = (countsByOwner[item.owner] || 0) + 1;
  });

  return (
    <div className="space-y-4">
      {/* 1. Executive TL;DR Card */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-2 rounded-xl bg-cyan-950/70 border border-cyan-800/50 text-cyan-400">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Executive TL;DR</h3>
            <p className="text-[11px] text-slate-400">High-level synthesis of meeting intent and outcomes</p>
          </div>
        </div>
        <p className="text-xs text-slate-200 leading-relaxed bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
          {executiveSummary}
        </p>
      </div>

      {/* 2. Key Decisions Agreed Upon */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-2 rounded-xl bg-emerald-950/70 border border-emerald-800/50 text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Key Decisions Agreed Upon ({decisions.length})
            </h3>
            <p className="text-[11px] text-slate-400">Consensus reached and official committee rulings</p>
          </div>
        </div>

        <div className="space-y-2.5">
          {decisions.map((dec) => (
            <div
              key={dec.id}
              className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/90 hover:border-emerald-500/40 transition flex flex-col gap-1.5"
            >
              <div className="flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 shrink-0 shadow-sm shadow-emerald-400/50" />
                <span className="text-xs font-semibold text-slate-100">{dec.decision}</span>
              </div>
              {dec.rationale && (
                <p className="text-[11px] text-slate-400 pl-4.5 italic">Rationale: {dec.rationale}</p>
              )}
              {dec.tags && dec.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 pl-4.5 mt-0.5">
                  {dec.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-950/50 text-emerald-300 border border-emerald-800/40"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 3. Open Blockers / Risks */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-2 rounded-xl bg-rose-950/70 border border-rose-800/50 text-rose-400">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Open Blockers / Risks ({blockers.length})
            </h3>
            <p className="text-[11px] text-slate-400">Critical bottlenecks and unresolved threats</p>
          </div>
        </div>

        <div className="space-y-2.5">
          {blockers.map((blk) => (
            <div
              key={blk.id}
              className="p-3.5 rounded-xl bg-rose-950/15 border border-rose-900/40 flex flex-col gap-1.5"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                  <span className="text-xs font-semibold text-rose-100">{blk.blocker}</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-rose-950 text-rose-300 border border-rose-700/60 shrink-0">
                  {blk.severity} Risk
                </span>
              </div>
              {blk.mitigation && (
                <p className="text-[11px] text-slate-300 pl-5.5">
                  <span className="text-cyan-400 font-medium">Proposed Mitigation:</span> {blk.mitigation}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 4. Filtered Noise & Side Banter (Standing Rule 3 Evidence) */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-lg">
        <button
          onClick={() => setShowNoise(!showNoise)}
          className="w-full flex items-center justify-between text-left cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-950/60 border border-indigo-800/40 text-indigo-400">
              <Filter className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <span>Filtered Signal-to-Noise Log</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-800 text-cyan-300 border border-slate-700">
                  {filteredNoise.length} items stripped
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">Side banter, jokes, and tangents excluded from official actions</p>
            </div>
          </div>
          {showNoise ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </button>

        {showNoise && (
          <div className="mt-3 pt-3 border-t border-slate-800/70 space-y-1.5">
            {filteredNoise.map((noise, i) => (
              <div
                key={i}
                className="text-[11px] text-slate-400 flex items-start gap-2 bg-slate-950/50 p-2 rounded-lg border border-slate-800/60"
              >
                <span className="text-indigo-400 font-mono text-[10px] mt-0.5">[FILTERED]</span>
                <span>{noise}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 5. Attendee Workload / Ownership Breakdown */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-lg">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-1.5 rounded-lg bg-purple-950/60 border border-purple-800/40 text-purple-400">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Task Distribution by Owner
            </h4>
            <p className="text-[11px] text-slate-400">Capacity breakdown across committee members</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {Object.entries(countsByOwner).map(([owner, count]) => {
            const isUnassigned = owner === '[UNASSIGNED - Needs Volunteer]';
            return (
              <div
                key={owner}
                className={`p-2.5 rounded-xl border text-xs flex flex-col justify-between gap-1 ${
                  isUnassigned
                    ? 'bg-rose-950/20 border-rose-800/50 text-rose-300'
                    : 'bg-slate-950/50 border-slate-800 text-slate-300'
                }`}
              >
                <span className="font-semibold truncate" title={owner}>
                  {owner}
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  {count} {count === 1 ? 'task' : 'tasks'} assigned
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
