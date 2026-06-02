-- =============================================================
-- OFFSCRIPT  ·  Migration 002  ·  User Data Tables
-- Phase 1 MVP  ·  Chunk 2 of 3
-- =============================================================
-- This chunk creates:
--   (1) profiles            — extends auth.users
--   (2) sessions            — user_id NULLABLE for anonymous-first flow
--   (3) analysis_results    — full AI JSON output (JSONB)
--   (4) progress_snapshots  — denormalized for trend tracking
--   (5) Auto-profile trigger on new auth.users
--
-- This chunk does NOT include:
--   - RLS policies (Chunk 3)
--   - Storage buckets (Chunk 3)
-- =============================================================


-- ============================================================
-- (1)  profiles — one row per authenticated user
-- ============================================================
CREATE TABLE profiles (
  id                   uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name                 text,
  email                text UNIQUE,
  auth_provider        text NOT NULL CHECK (auth_provider IN ('google','magic_link','apple')),
  subscription_status  text NOT NULL DEFAULT 'free' CHECK (subscription_status IN ('free','active','expired')),
  free_analysis_used   boolean NOT NULL DEFAULT false,
  newsletter_opt_in    boolean NOT NULL DEFAULT false,
  stripe_customer_id   text,
  created_at           timestamptz NOT NULL DEFAULT now(),
  updated_at           timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_profiles_subscription_status ON profiles(subscription_status);
CREATE INDEX idx_profiles_stripe_customer_id  ON profiles(stripe_customer_id);


-- ============================================================
-- (2)  sessions — one per recording flow attempt
--      user_id is NULLABLE: a session can start before auth
--      and be claimed (linked) when the user signs in.
-- ============================================================
CREATE TABLE sessions (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           uuid REFERENCES profiles(id) ON DELETE CASCADE,  -- NULLABLE
  intent_id         text NOT NULL REFERENCES intents(id),
  archetype_id      text NOT NULL REFERENCES archetypes(id),
  content_source    text NOT NULL CHECK (content_source IN ('prompted','own_material')),
  sandbox_content   text,
  practice_count    int NOT NULL DEFAULT 0,
  recording_url     text,
  transcript        jsonb,
  duration_seconds  numeric,
  status            text NOT NULL DEFAULT 'draft'
                    CHECK (status IN ('draft','recorded','analyzing','complete','error')),
  anon_token        text,                       -- for claiming anonymous sessions at login
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_sessions_user_id    ON sessions(user_id);
CREATE INDEX idx_sessions_status     ON sessions(status);
CREATE INDEX idx_sessions_created_at ON sessions(created_at DESC);
CREATE INDEX idx_sessions_anon_token ON sessions(anon_token) WHERE anon_token IS NOT NULL;


-- ============================================================
-- (3)  analysis_results — one per completed analysis
--      Stores the full AI JSON output (matches AI_OUTPUT_CONTRACT.md)
-- ============================================================
CREATE TABLE analysis_results (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id          uuid NOT NULL UNIQUE REFERENCES sessions(id) ON DELETE CASCADE,
  analysis_complete   boolean NOT NULL,
  content_source_note text,
  result              jsonb NOT NULL,           -- the full AnalysisOutput object
  created_at          timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_analysis_results_session_id ON analysis_results(session_id);
CREATE INDEX idx_analysis_results_created_at ON analysis_results(created_at DESC);


-- ============================================================
-- (4)  progress_snapshots — denormalized scores per completed session
--      Phase 1 stores them; Phase 2 visualizes them.
-- ============================================================
CREATE TABLE progress_snapshots (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  session_id      uuid NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  archetype_id    text NOT NULL REFERENCES archetypes(id),
  intent_id       text NOT NULL REFERENCES intents(id),
  uq_scores       jsonb NOT NULL,               -- {uq1: 'Strong', uq2: 'Present', ...}
  signal_scores   jsonb NOT NULL,               -- {warmth: 'Strong', conviction: 'Emerging', ...}
  created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_progress_snapshots_user_id    ON progress_snapshots(user_id);
CREATE INDEX idx_progress_snapshots_created_at ON progress_snapshots(created_at DESC);


-- ============================================================
-- (5)  Auto-create profile when a new auth.users row appears
-- ============================================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, auth_provider)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
    COALESCE(NEW.raw_app_meta_data->>'provider', 'magic_link')
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();


-- ============================================================
-- (6)  updated_at auto-update for profiles and sessions
-- ============================================================
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER sessions_updated_at
  BEFORE UPDATE ON sessions
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
