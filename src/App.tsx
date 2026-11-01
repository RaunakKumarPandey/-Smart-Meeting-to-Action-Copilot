import React, { useState, useEffect } from 'react';
import {
  Zap,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  Mail,
  ListTodo,
  FileText,
  Clock,
  Sparkles,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';
import { Header } from './components/Header.tsx';
import { MeetingInputSection } from './components/MeetingInputSection.tsx';
import { ActionItemsTable } from './components/ActionItemsTable.tsx';
import { FollowUpEmailTab } from './components/FollowUpEmailTab.tsx';
import { SummaryDecisionsTab } from './components/SummaryDecisionsTab.tsx';
import { Toast } from './components/Toast.tsx';
import { ActionItem, SynthesisResult } from './types.ts';
import { CAMPUS_HACKATHON_SAMPLE } from './utils/sampleData.ts';
import { runIntelligentMockSynthesizer } from './utils/mockSynthesizer.ts';

export default function App() {
  // Input states
  const [meetingTitle, setMeetingTitle] = useState(CAMPUS_HACKATHON_SAMPLE.title);
  const [meetingDate, setMeetingDate] = useState(CAMPUS_HACKATHON_SAMPLE.date);
  const [rawNotes, setRawNotes] = useState(CAMPUS_HACKATHON_SAMPLE.transcript);
  const [attendees, setAttendees] = useState<string[]>(CAMPUS_HACKATHON_SAMPLE.attendees);

  // Active Output Tab
  const [activeTab, setActiveTab] = useState<'actions' | 'email' | 'summary'>('actions');

  // Processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('');

  // Synthesis Output Result
  const [synthesisResult, setSynthesisResult] = useState<SynthesisResult | null>(null);

  // Toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Auto-synthesize on initial load so the user sees immediate high-fidelity results
  useEffect(() => {
    // Run initial instant synthesis for the default sample
    const initial = runIntelligentMockSynthesizer(
      CAMPUS_HACKATHON_SAMPLE.title,
      CAMPUS_HACKATHON_SAMPLE.date,
      CAMPUS_HACKATHON_SAMPLE.transcript
    );
    setSynthesisResult(initial);
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
  };

  const handleSynthesize = async () => {
    if (!rawNotes.trim()) return;

    setIsProcessing(true);
    setProcessingStep('Filtering jokes & side banter...');

    try {
      // Step 1: Simulate progressive intelligence steps for awesome feedback
      await new Promise((r) => setTimeout(r, 400));
      setProcessingStep(`Anchoring dates to ${meetingDate}...`);
      await new Promise((r) => setTimeout(r, 400));
      setProcessingStep('Enforcing No Orphan Tasks rule...');

      // Attempt server-side API call
      let result: SynthesisResult | null = null;
      try {
        const response = await fetch('/api/synthesize', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: meetingTitle,
            meetingDate: meetingDate,
            notes: rawNotes,
          }),
        });

        if (response.ok) {
          result = await response.json();
        }
      } catch (networkErr) {
        console.warn('Backend endpoint unavailable, using local intelligent synthesizer:', networkErr);
      }

      // If backend was unavailable or returned fallback
      if (!result) {
        result = runIntelligentMockSynthesizer(meetingTitle, meetingDate, rawNotes);
      }

      setSynthesisResult(result);
      if (result.attendees && result.attendees.length > 0) {
        setAttendees(Array.from(new Set([...attendees, ...result.attendees])));
      }
      triggerToast('⚡ Meeting synthesized successfully!');
    } catch (err: any) {
      console.error('Synthesis error:', err);
      // Failsafe fallback
      const fallback = runIntelligentMockSynthesizer(meetingTitle, meetingDate, rawNotes);
      setSynthesisResult(fallback);
      triggerToast('Synthesized using offline fallback engine');
    } finally {
      setIsProcessing(false);
      setProcessingStep('');
    }
  };

  // Action item handlers
  const handleToggleDone = (id: string) => {
    if (!synthesisResult) return;
    const updated = synthesisResult.actionItems.map((item) =>
      item.id === id ? { ...item, done: !item.done } : item
    );
    setSynthesisResult({
      ...synthesisResult,
      actionItems: updated,
    });
    const toggled = updated.find((i) => i.id === id);
    triggerToast(toggled?.done ? 'Marked task as completed! 🎉' : 'Marked task as pending');
  };

  const handleUpdateOwner = (id: string, newOwner: string) => {
    if (!synthesisResult) return;
    const updated = synthesisResult.actionItems.map((item) =>
      item.id === id ? { ...item, owner: newOwner } : item
    );
    setSynthesisResult({
      ...synthesisResult,
      actionItems: updated,
    });
  };

  const handleUpdateItem = (updatedItem: ActionItem) => {
    if (!synthesisResult) return;
    const updated = synthesisResult.actionItems.map((item) =>
      item.id === updatedItem.id ? updatedItem : item
    );
    setSynthesisResult({
      ...synthesisResult,
      actionItems: updated,
    });
  };

  const handleDeleteItem = (id: string) => {
    if (!synthesisResult) return;
    const updated = synthesisResult.actionItems.filter((item) => item.id !== id);
    setSynthesisResult({
      ...synthesisResult,
      actionItems: updated,
    });
    triggerToast('Action item removed');
  };

  const handleAddItem = (newItem: ActionItem) => {
    if (!synthesisResult) return;
    setSynthesisResult({
      ...synthesisResult,
      actionItems: [newItem, ...synthesisResult.actionItems],
    });
  };

  // Dashboard Stats
  const totalActions = synthesisResult?.actionItems.length || 0;
  const completedActions = synthesisResult?.actionItems.filter((i) => i.done).length || 0;
  const unassignedActions =
    synthesisResult?.actionItems.filter((i) => i.owner === '[UNASSIGNED - Needs Volunteer]').length || 0;
  const totalDecisions = synthesisResult?.decisions.length || 0;
  const totalBlockers = synthesisResult?.blockers.length || 0;

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col antialiased selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Header */}
      <Header engineUsed={synthesisResult?.engineUsed} />

      {/* Main Container - 2 Column Split View */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-6 flex flex-col gap-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start flex-1">
          {/* LEFT COLUMN: Meeting Input Section (5 cols on lg) */}
          <section className="lg:col-span-5 h-full">
            <MeetingInputSection
              title={meetingTitle}
              setTitle={setMeetingTitle}
              date={meetingDate}
              setDate={setMeetingDate}
              notes={rawNotes}
              setNotes={setRawNotes}
              attendees={attendees}
              setAttendees={setAttendees}
              onSynthesize={handleSynthesize}
              isProcessing={isProcessing}
              processingStep={processingStep}
            />
          </section>

          {/* RIGHT COLUMN: Synthesized Dashboard (7 cols on lg) */}
          <section className="lg:col-span-7 flex flex-col space-y-4">
            {/* Quick Metrics & Standing Rules Status Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl flex items-center gap-3 shadow-md">
                <div className="p-2 rounded-lg bg-cyan-950/60 border border-cyan-800/40 text-cyan-400">
                  <ListTodo className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-lg font-extrabold text-white">
                    {completedActions}/{totalActions}
                  </div>
                  <div className="text-[11px] text-slate-400">Tasks Completed</div>
                </div>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl flex items-center gap-3 shadow-md">
                <div className="p-2 rounded-lg bg-rose-950/60 border border-rose-800/40 text-rose-400">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-lg font-extrabold text-rose-300">{unassignedActions}</div>
                  <div className="text-[11px] text-slate-400">Needs Volunteer</div>
                </div>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl flex items-center gap-3 shadow-md">
                <div className="p-2 rounded-lg bg-emerald-950/60 border border-emerald-800/40 text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-lg font-extrabold text-emerald-300">{totalDecisions}</div>
                  <div className="text-[11px] text-slate-400">Decisions Agreed</div>
                </div>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl flex items-center gap-3 shadow-md">
                <div className="p-2 rounded-lg bg-amber-950/60 border border-amber-800/40 text-amber-400">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-lg font-extrabold text-amber-300">{totalBlockers}</div>
                  <div className="text-[11px] text-slate-400">Open Blockers</div>
                </div>
              </div>
            </div>

            {/* Dashboard Container with Tabs */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 lg:p-6 shadow-xl flex-1 flex flex-col">
              {/* Tab Navigation */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-5 gap-2 flex-wrap">
                <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-950/80 border border-slate-800">
                  <button
                    onClick={() => setActiveTab('actions')}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                      activeTab === 'actions'
                        ? 'bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                        : 'text-slate-400 hover:text-white hover:bg-slate-900'
                    }`}
                  >
                    <ListTodo className="w-3.5 h-3.5" />
                    <span>Tab 1: Action Items</span>
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-800 text-slate-300">
                      {totalActions}
                    </span>
                  </button>

                  <button
                    onClick={() => setActiveTab('email')}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                      activeTab === 'email'
                        ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border border-purple-500/40 shadow-sm'
                        : 'text-slate-400 hover:text-white hover:bg-slate-900'
                    }`}
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Tab 2: Follow-Up Email</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('summary')}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                      activeTab === 'summary'
                        ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                        : 'text-slate-400 hover:text-white hover:bg-slate-900'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Tab 3: Summary & Log</span>
                  </button>
                </div>

                {/* Synthesis freshness indicator */}
                {synthesisResult && (
                  <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                    <span>Anchored to: {synthesisResult.date}</span>
                  </div>
                )}
              </div>

              {/* Tab Contents */}
              <div className="flex-1">
                {synthesisResult ? (
                  <>
                    {activeTab === 'actions' && (
                      <ActionItemsTable
                        meetingTitle={meetingTitle}
                        meetingDate={meetingDate}
                        items={synthesisResult.actionItems}
                        attendees={attendees}
                        onToggleDone={handleToggleDone}
                        onUpdateOwner={handleUpdateOwner}
                        onUpdateItem={handleUpdateItem}
                        onDeleteItem={handleDeleteItem}
                        onAddItem={handleAddItem}
                        onTriggerToast={triggerToast}
                      />
                    )}

                    {activeTab === 'email' && (
                      <FollowUpEmailTab
                        email={synthesisResult.email}
                        actionItems={synthesisResult.actionItems}
                        meetingTitle={meetingTitle}
                        meetingDate={meetingDate}
                        attendees={attendees}
                        onTriggerToast={triggerToast}
                      />
                    )}

                    {activeTab === 'summary' && (
                      <SummaryDecisionsTab
                        executiveSummary={synthesisResult.executiveSummary}
                        decisions={synthesisResult.decisions}
                        blockers={synthesisResult.blockers}
                        filteredNoise={synthesisResult.filteredNoise}
                        actionItems={synthesisResult.actionItems}
                        attendees={attendees}
                      />
                    )}
                  </>
                ) : (
                  <div className="py-16 text-center flex flex-col items-center justify-center space-y-3">
                    <div className="p-3.5 rounded-2xl bg-cyan-950/50 border border-cyan-800/40 text-cyan-400">
                      <Sparkles className="w-8 h-8 animate-bounce" />
                    </div>
                    <h3 className="text-base font-bold text-white">No Synthesis Generated Yet</h3>
                    <p className="text-xs text-slate-400 max-w-sm">
                      Click the synthesis button on the left to extract structured actions, anchored deadlines, and
                      executive emails.
                    </p>
                    <button
                      onClick={handleSynthesize}
                      className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs shadow-lg shadow-cyan-600/20 transition cursor-pointer"
                    >
                      <Zap className="w-4 h-4 text-amber-300" />
                      <span>Synthesize Now</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Floating Toast Alert */}
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
    </div>
  );
}
