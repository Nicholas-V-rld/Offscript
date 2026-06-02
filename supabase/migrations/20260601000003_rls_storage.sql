-- =============================================================
-- OFFSCRIPT  ·  Migration 003  ·  RLS, Storage, Anonymous Claim
-- Phase 1 MVP  ·  Chunk 3 of 3 (final M1 schema migration)
-- =============================================================
-- This chunk creates:
--   (1) RLS enabled on every public table
--   (2) Public-read policies on reference tables (anyone can read)
--   (3) User-scoped policies on profiles, sessions, results, snapshots
--   (4) Anonymous-session access via anon_token
--   (5) claim_anonymous_session() RPC for the auth handoff
--   (6) recordings storage bucket with signed-URL access
-- =============================================================


-- ============================================================
-- (1)  Enable RLS on every public table
-- ============================================================
ALTER TABLE intents             ENABLE ROW LEVEL SECURITY;
ALTER TABLE signals             ENABLE ROW LEVEL SECURITY;
ALTER TABLE archetypes          ENABLE ROW LEVEL SECURITY;
ALTER TABLE practice_prompts    ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles            ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions            ENABLE ROW LEVEL SECURITY;
ALTER TABLE analysis_results    ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress_snapshots  ENABLE ROW LEVEL SECURITY;


-- ============================================================
-- (2)  Reference tables — public read, no write via anon/auth keys
--      (service_role bypasses RLS, so seeding/admin still works)
-- ============================================================
CREATE POLICY "Reference: intents readable by anyone"
  ON intents FOR SELECT USING (true);

CREATE POLICY "Reference: signals readable by anyone"
  ON signals FOR SELECT USING (true);

CREATE POLICY "Reference: archetypes readable by anyone"
  ON archetypes FOR SELECT USING (true);

CREATE POLICY "Reference: practice_prompts readable by anyone"
  ON practice_prompts FOR SELECT USING (true);


-- ============================================================
-- (3)  profiles — user can read/update only their own row
-- ============================================================
CREATE POLICY "Profiles: read own"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Profiles: update own"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);
-- No INSERT/DELETE policies: the trigger handles inserts;
-- deletion happens via auth.users cascade.


-- ============================================================
-- (4)  sessions — owned-or-anonymous-with-token access
--      Two cases:
--        a) authenticated user owns the session (user_id = auth.uid())
--        b) anonymous session: user_id IS NULL AND
--           the request supplies the matching anon_token via
--           request.headers (set by client when creating/reading)
-- ============================================================

-- Helper: read the anon_token header from the current request
CREATE OR REPLACE FUNCTION current_anon_token()
RETURNS text
LANGUAGE plpgsql STABLE
AS $$
DECLARE
  hdrs json;
BEGIN
  hdrs := current_setting('request.headers', true)::json;
  RETURN hdrs->>'x-anon-token';
EXCEPTION WHEN OTHERS THEN
  RETURN NULL;
END;
$$;

CREATE POLICY "Sessions: read own or anon-with-token"
  ON sessions FOR SELECT
  USING (
    (auth.uid() IS NOT NULL AND user_id = auth.uid())
    OR
    (user_id IS NULL AND anon_token IS NOT NULL
     AND anon_token = current_anon_token())
  );

CREATE POLICY "Sessions: insert as self or anonymous"
  ON sessions FOR INSERT
  WITH CHECK (
    (auth.uid() IS NOT NULL AND user_id = auth.uid())
    OR
    (auth.uid() IS NULL AND user_id IS NULL AND anon_token IS NOT NULL)
  );

CREATE POLICY "Sessions: update own or anon-with-token"
  ON sessions FOR UPDATE
  USING (
    (auth.uid() IS NOT NULL AND user_id = auth.uid())
    OR
    (user_id IS NULL AND anon_token IS NOT NULL
     AND anon_token = current_anon_token())
  )
  WITH CHECK (
    (auth.uid() IS NOT NULL AND user_id = auth.uid())
    OR
    (user_id IS NULL AND anon_token IS NOT NULL
     AND anon_token = current_anon_token())
  );

CREATE POLICY "Sessions: delete own"
  ON sessions FOR DELETE
  USING (auth.uid() IS NOT NULL AND user_id = auth.uid());


-- ============================================================
-- (5)  analysis_results — readable if the user owns the parent session
-- ============================================================
CREATE POLICY "Analysis: read own via session"
  ON analysis_results FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM sessions s
      WHERE s.id = analysis_results.session_id
        AND s.user_id = auth.uid()
    )
  );
-- INSERT happens server-side (admin client / scoring job), so no
-- user-facing INSERT/UPDATE/DELETE policies. service_role bypasses RLS.


-- ============================================================
-- (6)  progress_snapshots — user can read their own
-- ============================================================
CREATE POLICY "Progress: read own"
  ON progress_snapshots FOR SELECT
  USING (user_id = auth.uid());


-- ============================================================
-- (7)  claim_anonymous_session() RPC
--      Called at sign-in to atomically link an anonymous session
--      to the now-authenticated user.
-- ============================================================
CREATE OR REPLACE FUNCTION claim_anonymous_session(p_anon_token text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_session_id uuid;
  v_user_id    uuid;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'claim_anonymous_session must be called by an authenticated user';
  END IF;

  UPDATE sessions
  SET user_id    = v_user_id,
      anon_token = NULL,
      updated_at = now()
  WHERE anon_token = p_anon_token
    AND user_id IS NULL
  RETURNING id INTO v_session_id;

  RETURN v_session_id;  -- NULL if no matching session was found
END;
$$;

REVOKE ALL ON FUNCTION claim_anonymous_session(text) FROM public, anon;
GRANT EXECUTE ON FUNCTION claim_anonymous_session(text) TO authenticated;


-- ============================================================
-- (8)  recordings storage bucket — private, signed URLs only
--      Folder convention: user_id/session_id/audio.webm
-- ============================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'recordings',
  'recordings',
  false,
  52428800,  -- 50 MB cap per file
  ARRAY['audio/webm','audio/mp4','audio/mpeg','audio/wav','audio/ogg']
)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS — users can manage objects only in their own user_id folder
CREATE POLICY "Recordings: read own"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'recordings'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Recordings: upload own"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'recordings'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Recordings: delete own"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'recordings'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
