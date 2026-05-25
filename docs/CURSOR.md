# CURSOR.md — Offscript Build Rules

> This file is the source of truth for how Offscript is built. Cursor (and any AI assistant) must read and follow it on every task. When in doubt, this file wins over default patterns.

---

## What we're building

Offscript is a **mobile-first AI communication coach for creators**. A creator picks an intent and an archetype, develops their idea in a sandbox, rehearses, records a final take, and receives a scored feedback report governed by a defined rubric and safety-rule set. The product should feel like a **rehearsal studio, not a surveillance tool**.

This repo is **Phase 1 — the foundational MVP** (8 weeks, 4 milestones). Anything tagged "Phase 2" in `/docs` is explicitly out of scope for now — do not build it.

---

## The stack (do not deviate without asking)

- **Framework:** Next.js (App Router) + TypeScript
- **Styling:** Tailwind CSS
- **Backend / DB / Auth / Storage:** Supabase (Postgres, Supabase Auth, Supabase Storage)
- **Transcription:** OpenAI Whisper API (`verbose_json`, word-level timestamps)
- **AI scoring + sandbox:** Claude API (Anthropic) with strict JSON output
- **Payments:** Stripe (Checkout, $47/year membership, promo codes enabled)
- **Hosting:** Vercel
- **State:** React state/hooks only. **NEVER use localStorage or sessionStorage** for persisted app data — use Supabase. (In-flight, pre-auth session state may live in memory or a server-side draft row.)

---

## Non-negotiable principles

### 1. Mobile-first, always
- Design and build every screen for mobile first. Desktop is Phase 2 — do not spend time on desktop layouts.
- One-thumb use: all primary actions live in the bottom third of the screen.
- No side-by-side layouts. Everything is full-width vertical scroll.
- Cards and chips replace lists wherever selection happens.
- Pull-up drawers replace side panels for reference content.
- Tap targets are **minimum 44px**, never smaller.
- Loading states always communicate — **never a blank screen**.

### 2. The rubric governs the AI — never the reverse
- All scoring and feedback flows from the rubric in `/docs/spec/`. The AI serves the rubric.
- The scoring engine returns a **single, complete JSON object** matching the contract in `AI_OUTPUT_CONTRACT.md`. No partial responses — if any required field is missing or null, trigger the error flow, do not render.
- Every AI output (scoring engine AND sandbox assistant) is validated against the **30 safety rules** before it reaches the user.

### 3. Anonymous-first, auth at the moment of value
- Users move through intent → archetype → sandbox → practice **without an account**.
- Authentication is required **only at the point of analysis generation / report delivery**.
- All pre-auth progress must be preserved through the login flow. The user must never lose work or feel penalized for signing in.

### 4. Tone & copy
- Billing/upgrade copy never mentions credits, tokens, or report counts. Frame everything as communication growth over time.
- Feedback copy is behavioral, second-person, and kind. Never about appearance or immutable traits.
- Error and loading copy is calm and human — see the spec's error/loading sections.

---

## Code conventions

- TypeScript strict mode. No `any` unless unavoidable and commented.
- Server-side: all secret keys (Anthropic, OpenAI, Stripe, Supabase service role) stay server-side in API routes / server actions. Never expose in client bundles.
- Validate all AI JSON output against a Zod schema derived from `AI_OUTPUT_CONTRACT.md` before use.
- Components: small, composable, named clearly. Co-locate component styles.
- Database access goes through a typed Supabase client. Use Row Level Security (RLS) on all user-scoped tables.
- Every Stripe interaction that grants access is confirmed via **webhook**, never via client-side success redirect alone.

---

## What to never do

- Never build Phase 2 features (Apple Sign-In, full 7-type sandbox assistance, progress visualizations, coupon admin dashboard, the 6 non-MVP archetypes, newsletter automation beyond a stored opt-in flag).
- Never use browser storage APIs for persisted data.
- Never render an AI response that failed schema validation or the safety pass.
- Never grant membership access on a client redirect — only on a verified Stripe webhook.
- Never critique appearance, immutable traits, or push generic influencer behavior in any generated copy.

---

## Reference docs in this repo

- `/docs/SCHEMA.md` — database model and reference data
- `/docs/AI_OUTPUT_CONTRACT.md` — exact AI output types + Zod validation
- `/docs/M1_BUILD_PLAN.md` — current milestone build order
- `/docs/spec/` — Shana's source documents (technical spec, input flow, account/billing, scoring prompt, sandbox prompt, 30 safety rules). **These are the source of truth for product behavior.**