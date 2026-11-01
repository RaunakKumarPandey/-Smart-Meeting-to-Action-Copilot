import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { runIntelligentMockSynthesizer } from './src/utils/mockSynthesizer.ts';
import { resolveRelativeDeadline } from './src/utils/dateAnchor.ts';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// Health / Status endpoint
app.get('/api/status', (req, res) => {
  const hasApiKey = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY');
  res.json({
    status: 'ok',
    hasApiKey,
    model: 'gemini-3.8-flash',
    instantMockAvailable: true,
  });
});

// Synthesis Endpoint
app.post('/api/synthesize', async (req, res) => {
  const { title = 'Meeting Sync', meetingDate = '2026-11-01', notes = '', forceMock = false } = req.body;

  if (!notes || typeof notes !== 'string' || notes.trim().length === 0) {
    return res.status(400).json({ error: 'Meeting notes or transcript is required.' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  const canUseGemini = apiKey && apiKey !== 'MY_GEMINI_API_KEY' && !forceMock;

  if (!canUseGemini) {
    const mockResult = runIntelligentMockSynthesizer(title, meetingDate, notes);
    return res.json(mockResult);
  }

  try {
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const systemInstruction = `You are ActionPulse, an elite executive meeting copilot.
You convert messy meeting notes, fragmented transcripts, and audio logs into structured action items, executive summaries, and ready-to-send follow-up emails.

MANDATORY STANDING RULES:
1. NO ORPHAN TASKS: Every action item MUST have an assigned owner. If a task was mentioned without an owner, or someone said "someone needs to", "we need a volunteer", "unassigned", or no owner was chosen, you MUST assign the owner to EXACTLY "[UNASSIGNED - Needs Volunteer]". Never leave owner blank, TBD, or unassigned.
2. TEMPORAL ANCHORING: The meeting took place on ${meetingDate}. All relative deadlines mentioned in the meeting ("tonight", "tomorrow", "by Tuesday", "in two days", "by Friday", "by end of week", etc.) MUST be anchored and resolved relative to ${meetingDate}. Provide both the exact formatted date (e.g. "Nov 3, 2026") and the raw relative phrase (e.g. "by Tuesday").
3. SIGNAL FILTERING: Strictly filter out jokes, side banter, equipment issues (broken card-readers, door shoulder-checks, missing HDMI dongles), sports chatter, food topping debates (pineapple pizza), and irrelevant tangents. Capture these filtered snippets in the "filteredNoise" array to confirm they were removed from the official record.
4. ACTION ORIENTATION: Every task description MUST begin with an imperative action verb (e.g., "Finalize...", "Submit...", "Deploy...", "Contact...", "Audit...", "Escalate...").
5. DECISIONS & BLOCKERS: Capture concrete agreements under decisions, and critical bottlenecks/risks under blockers.`;

    const prompt = `Synthesize the following meeting notes:
Meeting Title: ${title}
Meeting Anchor Date: ${meetingDate}

Notes / Transcript:
"""
${notes}
"""

Return valid JSON adhering strictly to the schema.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            date: { type: Type.STRING },
            attendees: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'List of attendees identified in the meeting',
            },
            executiveSummary: {
              type: Type.STRING,
              description: 'Concise executive summary of meeting outcomes',
            },
            decisions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  decision: { type: Type.STRING },
                  rationale: { type: Type.STRING },
                  tags: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
                required: ['id', 'decision'],
              },
            },
            actionItems: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  description: { type: Type.STRING, description: 'Imperative verb task' },
                  owner: { type: Type.STRING, description: 'Person name or [UNASSIGNED - Needs Volunteer]' },
                  deadline: { type: Type.STRING, description: 'Formatted resolved date e.g. Nov 3, 2026' },
                  rawDeadlineText: { type: Type.STRING, description: 'Original relative phrase' },
                  priority: { type: Type.STRING, enum: ['High', 'Medium', 'Low'] },
                  done: { type: Type.BOOLEAN },
                  category: { type: Type.STRING },
                  notes: { type: Type.STRING },
                },
                required: ['id', 'description', 'owner', 'deadline', 'priority', 'done'],
              },
            },
            blockers: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  blocker: { type: Type.STRING },
                  severity: { type: Type.STRING, enum: ['High', 'Medium', 'Low'] },
                  mitigation: { type: Type.STRING },
                },
                required: ['id', 'blocker', 'severity'],
              },
            },
            filteredNoise: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'List of side banter or jokes filtered out',
            },
            email: {
              type: Type.OBJECT,
              properties: {
                subject: { type: Type.STRING },
                greeting: { type: Type.STRING },
                tldr: { type: Type.STRING },
                decisions: { type: Type.ARRAY, items: { type: Type.STRING } },
                actionSteps: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      owner: { type: Type.STRING },
                      task: { type: Type.STRING },
                      deadline: { type: Type.STRING },
                      priority: { type: Type.STRING },
                    },
                    required: ['owner', 'task', 'deadline', 'priority'],
                  },
                },
                blockers: { type: Type.ARRAY, items: { type: Type.STRING } },
                nextMeeting: { type: Type.STRING },
                signoff: { type: Type.STRING },
              },
              required: ['subject', 'greeting', 'tldr', 'decisions', 'actionSteps', 'blockers', 'nextMeeting', 'signoff'],
            },
          },
          required: [
            'title',
            'date',
            'attendees',
            'executiveSummary',
            'decisions',
            'actionItems',
            'blockers',
            'filteredNoise',
            'email',
          ],
        },
      },
    });

    const rawJson = response.text;
    if (!rawJson) {
      throw new Error('Empty response received from Gemini model.');
    }

    const parsed = JSON.parse(rawJson);

    // Enforce standing rules on returned payload
    if (Array.isArray(parsed.actionItems)) {
      parsed.actionItems = parsed.actionItems.map((item: any, idx: number) => {
        let owner = item.owner || '';
        if (
          !owner ||
          owner.toLowerCase().includes('unassigned') ||
          owner.toLowerCase().includes('volunteer') ||
          owner.toLowerCase().includes('anyone') ||
          owner.toLowerCase().includes('tbd')
        ) {
          owner = '[UNASSIGNED - Needs Volunteer]';
        }

        // Ensure temporal deadline resolution if needed
        let deadline = item.deadline;
        if (!deadline || deadline.toLowerCase().includes('tuesday') || deadline.toLowerCase().includes('tonight') || deadline.toLowerCase().includes('tomorrow')) {
          deadline = resolveRelativeDeadline(item.rawDeadlineText || deadline, meetingDate).formatted;
        }

        return {
          id: item.id || `act-${idx + 1}`,
          description: item.description,
          owner,
          deadline,
          rawDeadlineText: item.rawDeadlineText || 'Standard turnaround',
          priority: item.priority || 'Medium',
          done: Boolean(item.done),
          category: item.category || 'General',
          notes: item.notes || '',
        };
      });
    }

    return res.json({
      ...parsed,
      engineUsed: 'gemini-3.8-flash',
      processedAt: new Date().toISOString(),
    });
  } catch (err: any) {
    console.warn('Gemini API call failed or encountered error, falling back to intelligent synthesizer:', err?.message);
    const mockResult = runIntelligentMockSynthesizer(title, meetingDate, notes);
    return res.json({
      ...mockResult,
      engineUsed: 'intelligent-mock-synthesizer',
    });
  }
});

// Mount Vite or static server
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.resolve(__dirname, 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
  });
} else {
  const { createServer } = await import('vite');
  const vite = await createServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`ActionPulse server running on http://localhost:${PORT}`);
});
