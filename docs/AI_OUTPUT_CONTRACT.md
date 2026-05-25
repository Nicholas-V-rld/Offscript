# AI_OUTPUT_CONTRACT.md — Scoring Engine Output (Phase 1)

> The scoring engine returns **one complete JSON object**. All fields required. No partial output — if any required field is missing/null, trigger the error flow (do not render). The frontend builds entirely from this contract; backend and frontend can be built in parallel against it. Validate every response with the Zod schema below before use.

---

## TypeScript types

```ts
type RatingLabel = 'Blocked' | 'Emerging' | 'Present' | 'Strong' | 'Signature';

interface AnalysisOutput {
  session_id: string;
  archetype: string;
  intent: string;
  content_source: 'prompted' | 'own_material';
  analysis_complete: boolean;
  content_source_note: string | null;
  scorecard: ScoreCard;
  archetype_signals: ArchetypeSignals;
  strength_callout: StrengthCallout;
  growth_edge: GrowthEdge;
  focus: Focus;
  practice_prompt: PracticePrompt;
  transcript_highlights: TranscriptHighlight[];
}

// Five Universal Questions — scored every session
interface ScoreCard {
  uq1_clarity:  { label: RatingLabel; evidence: string };
  uq2_hook:     { label: RatingLabel; evidence: string };
  uq3_value:    { label: RatingLabel; evidence: string };
  uq4_presence: { label: RatingLabel; evidence: string };
  uq5_closing:  { label: RatingLabel; evidence: string };
}
// evidence: one sentence, behavioral, second-person, MAX 120 chars (shorten, never truncate)

// Five archetype-specific signals — always exactly 5
interface ArchetypeSignals {
  signals: {
    signal_name: string;
    label: RatingLabel;
    evidence: string;              // max 120 chars, behavioral, second-person
    suppressor: string | null;     // REQUIRED when label === 'Blocked', else null
    next_level_note: string | null;// REQUIRED when label is Blocked|Emerging|Present, else null
  }[]; // length === 5
}

interface StrengthCallout {
  signal_name: string;
  label: 'Strong' | 'Signature' | 'building'; // 'building' when no signal reaches Strong
  headline: string;  // max 60 chars
  body: string;      // max 160 chars
}

interface GrowthEdge {
  signal_name: string;
  label: RatingLabel;
  headline: string;  // max 60 chars
  body: string;      // max 160 chars
  suppressor: string | null;
}

interface Focus {
  signal_name: string;
  direction: string; // the single behavioral action, max 120 chars, must be a behavior not a trait
  source: 'universal_question' | 'archetype_signal';
}

interface PracticePrompt {
  prompt_id: string;
  prompt_text: string;
  rationale: string; // why this prompt fits the focus signal, max 100 chars
}

interface TranscriptHighlight {
  type: 'strong_moment' | 'make_stronger' | 'memorable_line';
  timestamp_start: number; // seconds from recording start
  timestamp_end: number;
  text: string;
  note: string; // what makes it notable, max 100 chars
}
// Max highlights: 2 strong_moment, 2 make_stronger, 1 memorable_line
```

---

## Zod validation (validate before render)

```ts
import { z } from 'zod';

const RatingLabel = z.enum(['Blocked','Emerging','Present','Strong','Signature']);

const ScoreEntry = z.object({
  label: RatingLabel,
  evidence: z.string().max(120),
});

const AnalysisOutputSchema = z.object({
  session_id: z.string(),
  archetype: z.string(),
  intent: z.string(),
  content_source: z.enum(['prompted','own_material']),
  analysis_complete: z.literal(true),  // false => error flow
  content_source_note: z.string().nullable(),
  scorecard: z.object({
    uq1_clarity: ScoreEntry,
    uq2_hook: ScoreEntry,
    uq3_value: ScoreEntry,
    uq4_presence: ScoreEntry,
    uq5_closing: ScoreEntry,
  }),
  archetype_signals: z.object({
    signals: z.array(z.object({
      signal_name: z.string(),
      label: RatingLabel,
      evidence: z.string().max(120),
      suppressor: z.string().nullable(),
      next_level_note: z.string().nullable(),
    })).length(5),
  }),
  strength_callout: z.object({
    signal_name: z.string(),
    label: z.enum(['Strong','Signature','building']),
    headline: z.string().max(60),
    body: z.string().max(160),
  }),
  growth_edge: z.object({
    signal_name: z.string(),
    label: RatingLabel,
    headline: z.string().max(60),
    body: z.string().max(160),
    suppressor: z.string().nullable(),
  }),
  focus: z.object({
    signal_name: z.string(),
    direction: z.string().max(120),
    source: z.enum(['universal_question','archetype_signal']),
  }),
  practice_prompt: z.object({
    prompt_id: z.string(),
    prompt_text: z.string(),
    rationale: z.string().max(100),
  }),
  transcript_highlights: z.array(z.object({
    type: z.enum(['strong_moment','make_stronger','memorable_line']),
    timestamp_start: z.number(),
    timestamp_end: z.number(),
    text: z.string(),
    note: z.string().max(100),
  })),
});
```

---

## Mobile output screen order (single vertical scroll, full width)

1. **Communication Scorecard** — 5 rows, label left + rating pill right. Tap to expand evidence. Collapsed by default.
2. **Strength Callout** — what's working.
3. **Growth Edge** — the one thing to improve.
4. **Focus** — the single behavioral action.
5. **Archetype Signals** — the 5 scored signals.
6. **Transcript Highlights** — strong moments, make-stronger, memorable line.
7. **Practice Prompt** — leads into the next session.

Rating pill colors: Blocked = muted red · Emerging = amber · Present = neutral · Strong = green · Signature = gold.

---

## Critical handling rules
- `analysis_complete: false` OR any schema failure OR any missing required field → **error flow**, do not render a partial report.
- Run the **30-safety-rule validation pass** on generated copy before display.
- All evidence/headline/body strings already length-bounded by the prompt; enforce again client-side as a safety net (shorten gracefully, never hard-truncate mid-word).