# M1_BUILD_PLAN.md — Milestone 1: Foundation & Design System

> **2 weeks · $1,400 · 20% of Phase 1**
> **Definition of done:** A creator can land on the marketing page, start the flow, pick an intent and an archetype on a polished mobile-native shell, and authenticate (Google + Magic Link). Everything deploys to a live URL. The data foundation and design system are in place for M2 to build on.

---

## Build order (foundations before features)

The sequence matters. Each step unblocks the next. Aim to have **something demoable by the end of week 1.**

### Week 1 — Infrastructure & foundation

**Day 1 — Pipeline live**
- [ ] Create GitHub repo (private), invite Shana as collaborator
- [ ] Next.js (App Router) + TypeScript + Tailwind scaffold
- [ ] Deploy to Vercel — get a live "hello world" URL on day one (proves the whole pipeline works)
- [ ] Drop `/docs` (CURSOR.md, SCHEMA.md, AI_OUTPUT_CONTRACT.md, this file, and Shana's spec docs) into the repo

**Day 2 — Supabase + schema**
- [ ] Create Supabase project, wire env vars (local + Vercel)
- [ ] Write the migration for all core tables (profiles, sessions, analysis_results, progress_snapshots)
- [ ] Seed reference data: 5 intents, 5 archetypes (with signal sets), MVP signals, starter practice prompts
- [ ] Enable RLS policies on user-scoped tables
- [ ] Typed Supabase client + generated types

**Day 3–4 — Auth (anonymous-first)**
- [ ] Google OAuth flow (account auto-created on first sign-in)
- [ ] Magic Link email flow (passwordless, mobile-optimized)
- [ ] **Anonymous-first architecture**: sessions can start with `user_id = NULL`; auth gate appears only at analysis time; pre-auth state is preserved and claimed on login
- [ ] Profile row auto-created on first auth with default `subscription_status: 'free'`, `free_analysis_used: false`
- [ ] Test the full loop: anonymous start → sign in → session claimed → sign out

**Day 5 — Design system foundation**
- [ ] Design tokens: dark + gold palette, spacing scale, radii (match the in-product aesthetic)
- [ ] Typography setup (mobile type scale)
- [ ] Base components: Button, Card, Chip, RatingPill, PullUpDrawer, LoadingState (never blank)
- [ ] Confirm all tap targets ≥ 44px, primary actions in bottom third

> **End of week 1 demo:** live URL, sign-up/sign-in working, design system preview. Even if flow screens are stubs.

### Week 2 — Core flow screens

**Day 6–7 — Marketing page**
- [ ] Replace GoDaddy site with a proper Next.js marketing page in Offscript brand (warm marketing aesthetic; the app itself is dark)
- [ ] Single clear CTA: "Start a free analysis" → drops into the flow, no account required yet
- [ ] Mobile-first, fast, clean

**Day 8–9 — Intent + Archetype selection**
- [ ] Intent selection screen: 5 intents as cards/chips (Teach, Sell, Connect, Entertain, Motivate)
- [ ] Archetype selection screen: 5 archetypes as cards, filtered/surfaced by chosen intent
- [ ] Selection writes to a `draft` session (anonymous OK)
- [ ] "You can change this anytime" affordance per the prototype
- [ ] Smooth transitions, mobile-native feel

**Day 10 — Polish, QA, demo prep**
- [ ] End-to-end mobile QA: land → start → intent → archetype → (auth gate stub)
- [ ] Loading/empty/error states present on every screen touched
- [ ] Vercel production deploy clean
- [ ] Prep the Friday demo

> **End of M1 demo:** a creator lands, starts, picks intent + archetype on a polished mobile shell, can authenticate. Foundation + design system done. Ready to submit M1 for approval.

---

## Definition of done checklist (what Shana approves)

- [ ] Live production URL on Vercel
- [ ] Google + Magic Link auth both working end-to-end
- [ ] Anonymous-first flow: can start before login, state preserved through auth
- [ ] Database schema migrated + reference data seeded
- [ ] RLS protecting user data
- [ ] Marketing page replacing GoDaddy, mobile-first
- [ ] Intent selection (5) + archetype selection (5) working and writing to a session
- [ ] Design system: tokens, base components, dark + gold, all tap targets ≥ 44px
- [ ] Handover note: how to run locally, env vars documented

---

## Out of scope for M1 (do NOT build yet)
- Recording, transcription, sandbox → **M2**
- Scoring engine, output report → **M3**
- Dashboard, Stripe, promo codes → **M4**
- Apple Sign-In, progress visualizations, 6 extra archetypes, coupon admin → **Phase 2**

---

## ⚠️ Two things to confirm with Shana before/at kickoff

1. **Apple Sign-In timing.** Her account/billing narrative lists *three* MVP auth methods (Google, Apple, Magic Link). The proposal she agreed to puts **Apple Sign-In in Phase 2**. These conflict. Phase 1 currently plans Google + Magic Link only. Confirm she's okay with Apple landing in Phase 2 — or, if Apple must be in Phase 1, flag that it's added scope (Apple Developer account setup + review overhead).

2. **Intent → archetype pairings.** Confirm which of the 5 intents surface which of the 5 archetypes, or whether all 5 archetypes are available under every intent for Phase 1. This drives the archetype selection screen's filtering logic.