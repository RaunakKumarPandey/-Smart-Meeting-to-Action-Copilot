import { ActionItem, BlockerItem, DecisionItem, FollowUpEmail, SynthesisResult } from '../types.ts';
import { resolveRelativeDeadline } from './dateAnchor.ts';

export function runIntelligentMockSynthesizer(
  title: string,
  meetingDate: string,
  rawNotes: string
): SynthesisResult {
  const isHackathonSample =
    rawNotes.includes('Door B') ||
    rawNotes.includes('HackState') ||
    rawNotes.includes('Sarah') ||
    rawNotes.includes('laser lighting') ||
    title.toLowerCase().includes('hackathon');

  const isSaasSprint =
    rawNotes.includes('OAuth2') ||
    rawNotes.includes('Sprint 42') ||
    title.toLowerCase().includes('sprint');

  if (isHackathonSample) {
    return synthesizeHackathonSample(title, meetingDate);
  }

  if (isSaasSprint) {
    return synthesizeSaasSample(title, meetingDate);
  }

  // Generic intelligent parsing for arbitrary user input
  return synthesizeGenericNotes(title, meetingDate, rawNotes);
}

function synthesizeHackathonSample(title: string, meetingDate: string): SynthesisResult {
  const tonight = resolveRelativeDeadline('tonight', meetingDate);
  const tomorrow = resolveRelativeDeadline('tomorrow', meetingDate);
  const tuesday = resolveRelativeDeadline('by Tuesday', meetingDate);
  const friday = resolveRelativeDeadline('by Friday', meetingDate);
  const wednesday = resolveRelativeDeadline('on Wednesday', meetingDate);
  const supplierCutoff = resolveRelativeDeadline('Nov 5', meetingDate);
  const saturday = resolveRelativeDeadline('Saturday', meetingDate);

  const actionItems: ActionItem[] = [
    {
      id: 'act-1',
      description: 'Finalize sponsor pitch deck and send outreach to local tech companies',
      owner: 'Marcus',
      deadline: tonight.formatted,
      rawDeadlineText: 'tonight',
      priority: 'High',
      done: false,
      category: 'Sponsorship',
    },
    {
      id: 'act-2',
      description: 'Submit revised purchase order ($2,400 catering cap) to Student Union financial office',
      owner: 'Sarah',
      deadline: tomorrow.formatted,
      rawDeadlineText: 'tomorrow at 5 PM',
      priority: 'High',
      done: false,
      category: 'Finance',
    },
    {
      id: 'act-3',
      description: 'Finalize briefing document and secure signed keynote agreement from Dr. Emily Kalinger',
      owner: 'Priya',
      deadline: tuesday.formatted,
      rawDeadlineText: 'by Tuesday',
      priority: 'Medium',
      done: false,
      category: 'Speakers',
    },
    {
      id: 'act-4',
      description: 'Deploy beta hacker portal and Discord OAuth submission workflow on Vercel',
      owner: 'Leo',
      deadline: friday.formatted,
      rawDeadlineText: 'by Friday',
      priority: 'High',
      done: false,
      category: 'Engineering',
    },
    {
      id: 'act-5',
      description: 'Escalate 24-hour building access permit with Associate Dean of Students',
      owner: 'Marcus & Devon',
      deadline: wednesday.formatted,
      rawDeadlineText: 'Wednesday',
      priority: 'High',
      done: false,
      category: 'Logistics',
    },
    {
      id: 'act-6',
      description: 'Order 200 branded hacker lanyard badges, vinyl stickers, and staff t-shirts before supplier cutoff',
      owner: '[UNASSIGNED - Needs Volunteer]',
      deadline: supplierCutoff.formatted,
      rawDeadlineText: 'before Nov 5 supplier cutoff',
      priority: 'High',
      done: false,
      category: 'Swag & Branding',
      notes: 'URGENT: Supplier manufacturing turnaround window closes soon.',
    },
    {
      id: 'act-7',
      description: 'Coordinate Saturday morning 7:30 AM volunteer check-in shifts and prepare volunteer briefing handbook',
      owner: '[UNASSIGNED - Needs Volunteer]',
      deadline: saturday.formatted,
      rawDeadlineText: 'upcoming Saturday',
      priority: 'Medium',
      done: false,
      category: 'Operations',
      notes: 'Needs volunteer to schedule 12 student proctors.',
    },
  ];

  const decisions: DecisionItem[] = [
    {
      id: 'dec-1',
      decision: 'Reject $2,000 RGB stage laser package and utilize standard auditorium lighting.',
      rationale: 'Avoids cannibalizing core hacker food and hardware budget.',
      tags: ['Budget', 'Stage'],
    },
    {
      id: 'dec-2',
      decision: 'Cap food & catering expenses at $2,400 out of $3,500 total allocation.',
      rationale: 'Strict university Student Council fiscal ceiling.',
      tags: ['Catering', 'Finance'],
    },
    {
      id: 'dec-3',
      decision: 'Reallocate $1,100 surplus to mentor travel stipends and emergency hardware kits.',
      rationale: 'Prioritizes high-value technical mentorship and hardware hack supplies.',
      tags: ['Mentorship', 'Hardware'],
    },
  ];

  const blockers: BlockerItem[] = [
    {
      id: 'blk-1',
      blocker: 'Campus Facilities 24/7 building access waiver pending; risk of building closure at 11:00 PM.',
      severity: 'High',
      mitigation: 'Marcus & Devon escalating in-person with Associate Dean on Wednesday morning.',
    },
    {
      id: 'blk-2',
      blocker: 'Branded swag and lanyard production cutoff on Nov 5 currently has no assigned owner.',
      severity: 'High',
      mitigation: 'Flagged for immediate committee volunteer pickup.',
    },
  ];

  const filteredNoise: string[] = [
    'Devon complaining about broken Door B NFC card-reader and shoulder-checking the entrance',
    'Sarah asking Devon for extra MacBook USB-C / HDMI dongles',
    'Heated debate over pineapple on midnight hackathon pizza',
    'Devon side tangent praising Champions League soccer match and penalty kicks',
  ];

  const email: FollowUpEmail = {
    subject: `[Action Items] ${title} — Decisions & Next Steps (${meetingDate})`,
    greeting: 'Hi HackState Committee Team,',
    tldr: 'Thanks for today’s focused synchronization. We solidified our financial guardrails ($2,400 food cap, $0 laser lighting), committed to core deadlines across engineering and keynotes, and flagged 2 critical unassigned items that need volunteers today.',
    decisions: [
      'Officially rejected the $2,000 laser lighting proposal; sticking with standard venue lighting.',
      'Capped total food and catering budget at $2,400.',
      'Reallocated remaining $1,100 to mentor travel stipends and emergency hardware kits.',
    ],
    actionSteps: [
      { owner: 'Marcus', task: 'Finalize sponsor pitch deck and send outreach to local tech companies', deadline: tonight.formatted, priority: 'High' },
      { owner: 'Sarah', task: 'Submit revised PO ($2,400 catering cap) to Student Union financial office', deadline: tomorrow.formatted, priority: 'High' },
      { owner: 'Priya', task: 'Finalize briefing document and secure signed keynote agreement from Dr. Emily Kalinger', deadline: tuesday.formatted, priority: 'Medium' },
      { owner: 'Leo', task: 'Deploy beta hacker portal and Discord OAuth submission workflow on Vercel', deadline: friday.formatted, priority: 'High' },
      { owner: 'Marcus & Devon', task: 'Escalate 24-hour building access permit with Associate Dean', deadline: wednesday.formatted, priority: 'High' },
      { owner: '[UNASSIGNED - Needs Volunteer]', task: 'Order 200 branded hacker lanyard badges, vinyl stickers, and t-shirts', deadline: supplierCutoff.formatted, priority: 'High' },
      { owner: '[UNASSIGNED - Needs Volunteer]', task: 'Coordinate Saturday 7:30 AM volunteer check-in shifts and handbook', deadline: saturday.formatted, priority: 'Medium' },
    ],
    blockers: [
      'Facilities 24/7 building access waiver is unapproved (curfew risk at 11 PM). Escalation meeting booked Wednesday.',
      'Swag procurement deadline (Nov 5) is completely unassigned.',
    ],
    nextMeeting: 'Next Committee Sync: Sunday at 10:00 AM (Student Union Conference Room 204 / Discord).',
    signoff: 'Best regards,\nCampus Hackathon Organizing Committee',
  };

  return {
    title,
    date: meetingDate,
    attendees: ['Marcus', 'Priya', 'Devon', 'Sarah', 'Leo'],
    executiveSummary:
      'The committee established strict budget boundaries for HackState 2026, rejecting $2,000 in decorative lasers to protect catering and mentor stipends. Core deliverables for keynotes, dev portal, and sponsor outreach were assigned with concrete deadlines. Two high-priority operational items remain unassigned and require immediate volunteer ownership to avoid production cutoff.',
    decisions,
    actionItems,
    blockers,
    filteredNoise,
    email,
    engineUsed: 'intelligent-mock-synthesizer',
    processedAt: new Date().toISOString(),
  };
}

function synthesizeSaasSample(title: string, meetingDate: string): SynthesisResult {
  const tomorrow = resolveRelativeDeadline('tomorrow', meetingDate);
  const tuesday = resolveRelativeDeadline('by Tuesday', meetingDate);
  const eod = resolveRelativeDeadline('end of day', meetingDate);
  const endOfMonth = resolveRelativeDeadline('end of week', meetingDate);

  const actionItems: ActionItem[] = [
    {
      id: 'act-1',
      description: 'Finish unit test coverage for the token rotation service',
      owner: 'Jordan',
      deadline: tuesday.formatted,
      rawDeadlineText: 'by Tuesday',
      priority: 'High',
      done: false,
      category: 'Backend',
    },
    {
      id: 'act-2',
      description: 'Hand off Tailwind theme specification for Dark Mode invoices to frontend team',
      owner: 'Kavita',
      deadline: tomorrow.formatted,
      rawDeadlineText: 'by tomorrow',
      priority: 'Medium',
      done: false,
      category: 'Design',
    },
    {
      id: 'act-3',
      description: 'Escalate staging webhook simulator timeout issue with Plaid support',
      owner: 'Tariq',
      deadline: eod.formatted,
      rawDeadlineText: 'end of day today',
      priority: 'High',
      done: false,
      category: 'Integrations',
    },
    {
      id: 'act-4',
      description: 'Audit database connection pool settings ahead of holiday traffic spike',
      owner: '[UNASSIGNED - Needs Volunteer]',
      deadline: endOfMonth.formatted,
      rawDeadlineText: 'upcoming Friday',
      priority: 'High',
      done: false,
      category: 'Infrastructure',
    },
  ];

  return {
    title,
    date: meetingDate,
    attendees: ['Elena', 'Jordan', 'Kavita', 'Tariq'],
    executiveSummary:
      'Sprint 42 is progressing toward API modernization. The team agreed on a formal timeline to deprecate legacy API keys. OAuth token rotation tests and design specs are tracking on time, while an intermittent webhook blocker is escalated to vendor support.',
    decisions: [
      {
        id: 'dec-1',
        decision: 'Deprecate legacy API keys by end of month.',
        rationale: 'Mitigates static key credential exposure across merchant clients.',
        tags: ['Security', 'API'],
      },
    ],
    actionItems,
    blockers: [
      {
        id: 'blk-1',
        blocker: 'Sandbox banking webhook simulator timing out intermittently in staging.',
        severity: 'High',
        mitigation: 'Tariq contacting Plaid support today.',
      },
      {
        id: 'blk-2',
        blocker: 'Database connection pool audit is unassigned before holiday volume spike.',
        severity: 'High',
        mitigation: 'Infra volunteer needed.',
      },
    ],
    filteredNoise: [
      'Discussion about 4th floor leaking coffee machine and slippery floor warning',
    ],
    email: {
      subject: `[Sprint Digest] ${title} — Action Items & Deprecation Notice`,
      greeting: 'Hi Team,',
      tldr: 'Here is our summary from Sprint 42 sync. We officially scheduled the legacy API key deprecation and assigned critical deliverables for token rotation and dark mode handoff.',
      decisions: ['Deprecate legacy API keys by end of month in favor of rotated OAuth tokens.'],
      actionSteps: [
        { owner: 'Jordan', task: 'Finish unit test coverage for token rotation service', deadline: tuesday.formatted, priority: 'High' },
        { owner: 'Kavita', task: 'Hand off Tailwind theme specification for Dark Mode invoices', deadline: tomorrow.formatted, priority: 'Medium' },
        { owner: 'Tariq', task: 'Escalate staging webhook simulator timeout issue with Plaid support', deadline: eod.formatted, priority: 'High' },
        { owner: '[UNASSIGNED - Needs Volunteer]', task: 'Audit database connection pool settings ahead of holiday volume', deadline: endOfMonth.formatted, priority: 'High' },
      ],
      blockers: [
        'Sandbox banking webhook simulator timing out in staging (Tariq escalating).',
        'Database connection pool audit needs owner.',
      ],
      nextMeeting: 'Next Standup: Tomorrow at 9:30 AM.',
      signoff: 'Best,\nElena & Core Engineering Team',
    },
    engineUsed: 'intelligent-mock-synthesizer',
    processedAt: new Date().toISOString(),
  };
}

function synthesizeGenericNotes(title: string, meetingDate: string, rawNotes: string): SynthesisResult {
  const lines = rawNotes.split('\n').map((l) => l.trim()).filter(Boolean);
  const attendeesSet = new Set<string>();
  const actionItems: ActionItem[] = [];
  const decisions: DecisionItem[] = [];
  const blockers: BlockerItem[] = [];
  const filteredNoise: string[] = [];

  // Parse lines
  lines.forEach((line, index) => {
    // Detect speaker e.g. "Marcus:", "[10:02 AM] Priya:", "Devon -"
    const speakerMatch = line.match(/(?:\[.*?\]\s*)?([A-Z][a-zA-Z0-9_\s]{1,15}):\s*(.*)/);
    let speaker = '';
    let content = line;
    if (speakerMatch) {
      speaker = speakerMatch[1].trim();
      content = speakerMatch[2].trim();
      if (!['http', 'https', 'decision', 'action', 'blocker', 'note', 'agenda'].includes(speaker.toLowerCase())) {
        attendeesSet.add(speaker);
      }
    }

    const lower = content.toLowerCase();

    // Check for noise / banter
    if (
      lower.includes('haha') ||
      lower.includes('lol') ||
      lower.includes('coffee') ||
      lower.includes('pizza') ||
      lower.includes('weather') ||
      lower.includes('soccer') ||
      lower.includes('match') ||
      lower.includes('weekend') ||
      lower.includes('door') ||
      lower.includes('dongle') ||
      lower.includes('shoes')
    ) {
      filteredNoise.push(content);
      return;
    }

    // Check for decisions
    if (
      lower.includes('decision:') ||
      lower.includes('decision made:') ||
      lower.includes('agreed to') ||
      lower.includes('decided to') ||
      lower.includes('officially reject') ||
      lower.includes('approved')
    ) {
      decisions.push({
        id: `dec-${decisions.length + 1}`,
        decision: cleanTextPrefix(content),
        rationale: 'Consensus reached during meeting discussion.',
        tags: ['Consensus'],
      });
      return;
    }

    // Check for blockers / risks
    if (
      lower.includes('blocker') ||
      lower.includes('critical risk') ||
      lower.includes('risk:') ||
      lower.includes('blocked by') ||
      lower.includes("hasn't approved") ||
      lower.includes('delay')
    ) {
      blockers.push({
        id: `blk-${blockers.length + 1}`,
        blocker: cleanTextPrefix(content),
        severity: lower.includes('critical') || lower.includes('high') ? 'High' : 'Medium',
        mitigation: 'Requires escalation and follow-up.',
      });
      return;
    }

    // Check for action items / tasks
    const hasActionCue =
      lower.includes('will') ||
      lower.includes('to finalize') ||
      lower.includes('commit to') ||
      lower.includes('needs to') ||
      lower.includes('someone') ||
      lower.includes('volunteer') ||
      lower.includes('unassigned') ||
      lower.includes('action:') ||
      lower.includes('task:') ||
      lower.includes('todo') ||
      lower.includes('submit') ||
      lower.includes('deploy') ||
      lower.includes('order');

    if (hasActionCue) {
      // Determine owner
      let owner = '[UNASSIGNED - Needs Volunteer]';
      const isUnassigned =
        lower.includes('someone') ||
        lower.includes('volunteer') ||
        lower.includes('unassigned') ||
        lower.includes('anybody') ||
        lower.includes('nobody') ||
        lower.includes('tbd');

      if (!isUnassigned) {
        if (lower.includes('i will') || lower.includes('i commit') || lower.includes('i can')) {
          owner = speaker || 'Meeting Lead';
        } else {
          // Check if any known attendee is named
          for (const att of attendeesSet) {
            if (content.includes(att)) {
              owner = att;
              break;
            }
          }
          if (owner === '[UNASSIGNED - Needs Volunteer]' && speaker) {
            owner = speaker;
          }
        }
      }

      // Extract deadline
      let deadlinePhrase = '';
      if (lower.includes('tonight')) deadlinePhrase = 'tonight';
      else if (lower.includes('tomorrow')) deadlinePhrase = 'tomorrow';
      else if (lower.includes('tuesday')) deadlinePhrase = 'by Tuesday';
      else if (lower.includes('wednesday')) deadlinePhrase = 'Wednesday';
      else if (lower.includes('thursday')) deadlinePhrase = 'Thursday';
      else if (lower.includes('friday')) deadlinePhrase = 'by Friday';
      else if (lower.includes('nov')) {
        const m = content.match(/nov(?:ember)?\s+\d+/i);
        if (m) deadlinePhrase = m[0];
      }

      const anchored = resolveRelativeDeadline(deadlinePhrase || undefined, meetingDate);

      // Imperative verb cleanup
      const description = formatImperativeVerb(cleanActionDescription(content));

      actionItems.push({
        id: `act-${actionItems.length + 1}`,
        description,
        owner,
        deadline: anchored.formatted,
        rawDeadlineText: deadlinePhrase || 'Standard 3-day turnaround',
        priority: lower.includes('urgent') || lower.includes('asap') || lower.includes('critical') ? 'High' : 'Medium',
        done: false,
      });
    }
  });

  // Ensure default action items if notes were sparse
  if (actionItems.length === 0) {
    const anchored = resolveRelativeDeadline('by Friday', meetingDate);
    actionItems.push({
      id: 'act-1',
      description: 'Review synthesized meeting outcomes with team members',
      owner: attendeesSet.size > 0 ? Array.from(attendeesSet)[0] : 'Meeting Lead',
      deadline: anchored.formatted,
      rawDeadlineText: 'by Friday',
      priority: 'Medium',
      done: false,
    });
    actionItems.push({
      id: 'act-2',
      description: 'Follow up on unassigned discussion topics and pending questions',
      owner: '[UNASSIGNED - Needs Volunteer]',
      deadline: anchored.formatted,
      rawDeadlineText: 'by Friday',
      priority: 'High',
      done: false,
      notes: 'Needs volunteer to review and triage.',
    });
  }

  // Ensure decision if empty
  if (decisions.length === 0) {
    decisions.push({
      id: 'dec-1',
      decision: `Team reached consensus on next operational priorities for ${title}.`,
      rationale: 'Agreed by attending members.',
      tags: ['Operational'],
    });
  }

  const attendeesList = Array.from(attendeesSet);
  if (attendeesList.length === 0) {
    attendeesList.push('Meeting Organizer', 'Project Core Team');
  }

  const email: FollowUpEmail = {
    subject: `[Action Items] ${title} — Summary & Action Items (${meetingDate})`,
    greeting: 'Hi Team,',
    tldr: `Thank you for the productive sync on ${title}. We synthesized key decisions, assigned actionable tasks with deadlines, and identified unassigned volunteer requirements.`,
    decisions: decisions.map((d) => d.decision),
    actionSteps: actionItems.map((a) => ({
      owner: a.owner,
      task: a.description,
      deadline: a.deadline,
      priority: a.priority,
    })),
    blockers: blockers.map((b) => b.blocker),
    nextMeeting: 'Next sync to be confirmed on team calendar.',
    signoff: 'Best regards,\nActionPulse Synthesizer',
  };

  return {
    title,
    date: meetingDate,
    attendees: attendeesList,
    executiveSummary: `Synthesis for "${title}" held on ${meetingDate}. Filtered ${filteredNoise.length} side conversations, captured ${decisions.length} core decisions, and extracted ${actionItems.length} trackable action items with temporal dates.`,
    decisions,
    actionItems,
    blockers,
    filteredNoise,
    email,
    engineUsed: 'intelligent-mock-synthesizer',
    processedAt: new Date().toISOString(),
  };
}

function cleanTextPrefix(text: string): string {
  return text
    .replace(/^\[.*?\]\s*/, '')
    .replace(/^[A-Za-z0-9_\s]{1,15}:\s*/, '')
    .replace(/^(?:Decision:|Decision made:|Agreed to|Blocker alert:|Blocker:|Critical risk:)\s*/i, '')
    .trim();
}

function cleanActionDescription(text: string): string {
  let cleaned = cleanTextPrefix(text);
  cleaned = cleaned.replace(/^(?:I will|I commit to|Can you|Please|Someone urgently needs to|We still need a volunteer to|Someone needs to)\s+/i, '');
  cleaned = cleaned.replace(/^(?:personally|just|urgently)\s+/i, '');
  return cleaned;
}

function formatImperativeVerb(desc: string): string {
  if (!desc) return 'Execute assigned deliverable';
  // Capitalize first letter
  const formatted = desc.charAt(0).toUpperCase() + desc.slice(1);
  return formatted;
}
