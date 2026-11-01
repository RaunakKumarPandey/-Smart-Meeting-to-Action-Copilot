export interface SampleMeetingPreset {
  id: string;
  name: string;
  description: string;
  title: string;
  date: string;
  attendees: string[];
  transcript: string;
}

export const CAMPUS_HACKATHON_SAMPLE: SampleMeetingPreset = {
  id: 'campus-hackathon',
  name: 'Campus Hackathon Committee Sync',
  description: '5 attendees, side banter, budget debate, unassigned tasks, relative dates',
  title: 'Campus Hackathon Committee Sync',
  date: '2026-11-01',
  attendees: ['Marcus', 'Priya', 'Devon', 'Sarah', 'Leo'],
  transcript: `[10:02 AM] Marcus: Okay team, let's kick off the Campus Hackathon Committee Sync. We're 3 weeks out from HackState 2026.
[10:03 AM] Devon: Wait, before we start, did anyone else have trouble getting into the student center? The NFC card reader at Door B was totally dead, I had to literally shoulder-check the door until security buzzed me in haha.
[10:04 AM] Sarah: Classic Hall B. Devon, did you grab extra HDMI dongles? My MacBook has zero ports today.
[10:04 AM] Devon: Yeah, I've got two in my backpack. Also, who's ordering pizza for the midnight snack? If we get pineapple again Marcus, we riot.
[10:05 AM] Marcus: Okay, no pineapple, noted! Let's focus on actual blockers. First item: Budget and catering. Sarah, what's the damage?
[10:06 AM] Sarah: Here's the hard ceiling: Student Council approved a maximum $3,500 for total food, drinks, and incidentals. Devon's initial proposal wanted $2,000 just for stage RGB laser lighting, which leaves us starving our hackers.
[10:07 AM] Devon: But lasers bring the hype! Look at ETHGlobal and PennApps!
[10:08 AM] Priya: Devon, hackers care about caffeine, Wi-Fi, and real mentors, not festival pyrotechnics. We can't blow half our budget on lighting.
[10:09 AM] Marcus: I agree with Priya and Sarah. Decision made: we officially reject the $2,000 laser light package. We will stick with standard venue lighting, cap catering at $2,400, and reallocate the remaining $1,100 toward mentor travel stipends and emergency hardware kits.
[10:10 AM] Sarah: Perfect. I will submit the revised purchase order to the Student Union financial office by tomorrow at 5 PM so checks clear.
[10:11 AM] Marcus: Great. On sponsorship: Stripe and Cloudflare confirmed tier-2 booths, but we need 2 more local partners. I will personally polish the sponsor pitch deck and send outreach emails to local tech companies tonight.
[10:12 AM] Priya: Quick update on keynotes. I reached out to Dr. Emily Kalinger from the AI Ethics Lab. She's interested but needs our formal schedule and AV rider. I will finalize the briefing document and secure her signed keynote speaker agreement by Tuesday.
[10:13 AM] Devon: What about the hacker dashboard and team formation portal?
[10:14 AM] Leo: I've got the GitHub Classroom workflow and authentication repo scaffolded. I need to wire up the Discord OAuth bot and test submission rubric webhooks. I commit to deploying the beta hacker portal on Vercel by Friday.
[10:15 AM] Devon: Nice. Oh by the way, did anyone watch the Champions League match yesterday? That penalty kick was insane!
[10:16 AM] Marcus: Devon, soccer later! We have two major unassigned fires:
First: Someone urgently needs to place the bulk order for 200 branded hacker lanyard badges, vinyl stickers, and staff t-shirts before the supplier cutoff on Nov 5. We don't have an owner for this yet.
[10:17 AM] Sarah: I definitely don't have bandwidth with university PO paperwork.
[10:17 AM] Priya: I'm tied up with keynote logistics.
[10:18 AM] Marcus: So that task is currently unassigned. We urgently need a volunteer to own swag badge procurement.
[10:18 AM] Leo: Also, we still need a volunteer to coordinate the Saturday morning 7:30 AM volunteer check-in shifts and prepare the volunteer briefing handbook. Nobody has picked that up either.
[10:19 AM] Marcus: Okay, flagging both swag procurement and volunteer check-in coordination as open unassigned items that need volunteers immediately.
[10:20 AM] Priya: Blocker alert: The campus Facilities department hasn't approved our after-hours 24/7 building access waiver yet. If they deny it, hackers get kicked out at 11 PM.
[10:21 AM] Marcus: That's a critical risk. Devon, can you accompany me to the Associate Dean's office on Wednesday to escalate the 24-hour building permit?
[10:21 AM] Devon: Yes, put me down for that Wednesday morning meeting.
[10:22 AM] Marcus: Awesome. Next committee sync is this Sunday at 10 AM. Let's execute!`,
};

export const SAAS_SPRINT_SAMPLE: SampleMeetingPreset = {
  id: 'saas-sprint',
  name: 'FinTech Core Sprint Review & Planning',
  description: 'Engineering, product & design sync with auth migration blockers',
  title: 'FinTech Core Sprint Review & Planning',
  date: '2026-11-01',
  attendees: ['Elena', 'Jordan', 'Kavita', 'Tariq'],
  transcript: `[09:00 AM] Elena: Morning folks. Let's review Sprint 42 deliverables. Coffee machine on 4th floor is leaking again by the way, watch your shoes.
[09:01 AM] Jordan: Ha, already slipped earlier. Anyway, OAuth2 token migration is 80% done.
[09:03 AM] Elena: Decision made: We are deprecating legacy API keys by end of month.
[09:05 AM] Jordan: I will finish unit test coverage for the token rotation service by Tuesday.
[09:07 AM] Kavita: Figma design tokens for the Dark Mode invoice table are ready. I will hand off the Tailwind theme spec to frontend by tomorrow.
[09:09 AM] Tariq: Blocker: The sandbox banking webhook simulator has been timing out intermittently in staging.
[09:11 AM] Elena: Tariq, please escalate that with Plaid support by end of day today.
[09:13 AM] Jordan: We still have an unassigned task: Someone needs to audit the database connection pool settings before the upcoming holiday traffic spike.
[09:15 AM] Elena: Agreed, marking database connection pool audit as unassigned, needs volunteer from infra.
[09:16 AM] Elena: Next standup tomorrow 9:30 AM.`,
};

export const SAMPLE_PRESETS: SampleMeetingPreset[] = [
  CAMPUS_HACKATHON_SAMPLE,
  SAAS_SPRINT_SAMPLE,
];
