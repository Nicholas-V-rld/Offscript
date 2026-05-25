# SCHEMA.md — Offscript Data Model (Phase 1)

> The schema is the foundation. Get it right before building features. This reflects the MVP scope: 5 archetypes, 5 intents, 5 Universal Questions + 5 archetype signals per session, one-free-analysis gating, $47/yr membership.

---

## Design notes

- **Anonymous-first.** A `session` can exist with `user_id = NULL` (created before login). On auth, the in-flight session is claimed by linking `user_id`. Never lose pre-auth work.
- **JSONB for AI output.** The analysis result is a single JSON object (see `AI_OUTPUT_CONTRACT.md`). Store it whole in `analysis_results`, with a few denormalized columns for querying/progress.
- **RLS everywhere user-scoped.** `sessions`, `analysis_results`, `progress_snapshots` are protected by Row Level Security keyed to `auth.uid()`.
- **Reference data** (archetypes, intents, signals, practice prompts) can live in DB tables or as typed constants in code. Recommendation: seed them as DB tables so they're queryable and editable without a deploy.

---

## Core tables

### `profiles`
Extends Supabase `auth.users`. One row per account.

| column | type | notes |
|---|---|---|
| id | uuid (PK) | = `auth.users.id` |
| name | text | from OAuth or entered |
| email | text | unique |
| auth_provider | text | 'google' \| 'magic_link' (Phase 2: 'apple') |
| subscription_status | text | 'free' \| 'active' \| 'expired' — default 'free' |
| free_analysis_used | boolean | default false — the one-free-analysis gate |
| newsletter_opt_in | boolean | default false |
| stripe_customer_id | text | nullable, set on first checkout |
| created_at | timestamptz | default now() |

### `sessions`
One per recording attempt/flow. Created possibly before auth.

| column | type | notes |
|---|---|---|
| id | uuid (PK) | |
| user_id | uuid (FK → profiles.id) | **nullable** (anonymous-first) |
| intent | text | one of 5 intents |
| archetype | text | one of 5 archetypes |
| content_source | text | 'prompted' \| 'own_material' |
| sandbox_content | text | the creator's draft text, nullable |
| practice_count | int | default 0, how many practice takes |
| recording_url | text | Supabase Storage signed path, nullable |
| transcript | jsonb | Whisper verbose_json (words + timestamps) |
| duration_seconds | numeric | final recording length |
| status | text | 'draft' \| 'recorded' \| 'analyzing' \| 'complete' \| 'error' |
| created_at | timestamptz | default now() |

### `analysis_results`
One per completed analysis. Holds the full AI output.

| column | type | notes |
|---|---|---|
| id | uuid (PK) | |
| session_id | uuid (FK → sessions.id) | |
| analysis_complete | boolean | from AI contract |
| content_source_note | text | nullable |
| result | jsonb | **the full output object** (scorecard, archetype_signals, strength_callout, growth_edge, focus, practice_prompt, transcript_highlights) |
| created_at | timestamptz | default now() |

### `progress_snapshots`
Denormalized signal scores per completed session, for the progress view (Phase 1 stores; Phase 2 visualizes).

| column | type | notes |
|---|---|---|
| id | uuid (PK) | |
| user_id | uuid (FK → profiles.id) | |
| session_id | uuid (FK → sessions.id) | |
| archetype | text | |
| intent | text | |
| uq_scores | jsonb | {uq1..uq5: RatingLabel} |
| signal_scores | jsonb | {signal_name: RatingLabel} for the 5 archetype signals |
| created_at | timestamptz | default now() |

---

## Reference tables (seed data)

### `intents` (5 rows)
`Teach`, `Sell`, `Connect`, `Entertain`, `Motivate`
Columns: id, name, description, display_order.

### `archetypes` (5 rows for Phase 1)
| name | scored signals (5 each) |
|---|---|
| The Guide | Warmth · Conversational Flow · Conviction · Action Clarity · Payoff Clarity |
| The Friend | Warmth · Authenticity · Conversational Flow · Specificity · Narrative Momentum |
| The Expert | Conviction · Specificity · Digestibility · Payoff Clarity · Hook Strength |
| The Storyteller | Emotional Congruence · Authenticity · Narrative Momentum · Specificity · Hook Strength |
| The Challenger | Conviction · Hook Strength · Action Clarity · Specificity · Emotional Congruence |

Columns: id, name, description, intent_associations (which intents surface it), signal_set (array of 5 signal codes), display_order.

### `signals` (MVP set)
**5 Universal Questions** (scored every session):
`UQ1 Clarity & Direction`, `UQ2 Hook & Opening`, `UQ3 Value & Insight`, `UQ4 Presence & Authenticity`, `UQ5 Closing & Payoff`

**Archetype signals used in Phase 1** (the union across the 5 chosen archetypes): Warmth, Conversational Flow, Conviction, Action Clarity, Payoff Clarity, Authenticity, Specificity, Narrative Momentum, Digestibility, Hook Strength, Emotional Congruence.

Columns: id, code, human_label, category (Universal/Presence/Structure/Resonance), description.

### `practice_prompts`
Linked to archetype + intent. Multiple per combination.
Columns: id, archetype, intent, prompt_text.
> Phase 1: seed a starter set for the 5 archetypes × the intents they pair with. Doesn't need to be exhaustive — enough that every combination has prompts.

---

## Rating scale (enum, used throughout)
`Blocked` · `Emerging` · `Present` · `Strong` · `Signature`
> `Signature` should be gated/rare — see scoring prompt. Most early sessions land Emerging–Strong.

---

## Storage buckets
- `recordings` — final audio. Private bucket, signed URLs only. Practice recordings are **not** persisted here.

---

## RLS policy summary
- `profiles`: user can read/update own row only.
- `sessions`, `analysis_results`, `progress_snapshots`: user can CRUD only rows where `user_id = auth.uid()`. Anonymous sessions (`user_id IS NULL`) are accessible via a short-lived server-issued token until claimed at auth.