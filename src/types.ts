export type Priority = 'High' | 'Medium' | 'Low';

export interface ActionItem {
  id: string;
  description: string;
  owner: string;
  deadline: string;
  rawDeadlineText?: string;
  priority: Priority;
  done: boolean;
  category?: string;
  notes?: string;
}

export interface DecisionItem {
  id: string;
  decision: string;
  rationale?: string;
  tags?: string[];
}

export interface BlockerItem {
  id: string;
  blocker: string;
  severity: Priority;
  mitigation?: string;
}

export interface FollowUpEmail {
  subject: string;
  greeting: string;
  tldr: string;
  decisions: string[];
  actionSteps: {
    owner: string;
    task: string;
    deadline: string;
    priority: Priority;
  }[];
  blockers: string[];
  nextMeeting: string;
  signoff: string;
}

export interface SynthesisResult {
  title: string;
  date: string;
  attendees: string[];
  executiveSummary: string;
  decisions: DecisionItem[];
  actionItems: ActionItem[];
  blockers: BlockerItem[];
  filteredNoise: string[];
  email: FollowUpEmail;
  engineUsed: 'gemini-3.8-flash' | 'intelligent-mock-synthesizer';
  processedAt: string;
}
