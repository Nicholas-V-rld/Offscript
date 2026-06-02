-- =============================================================
-- OFFSCRIPT  ·  Migration 004  ·  Fix auth_provider CHECK + trigger
-- =============================================================
-- Supabase reports `provider = 'email'` for magic-link and password
-- signups. Our original CHECK only allowed ('google','magic_link','apple'),
-- which blocked all sign-ins. This migration:
--   (1) Replaces the CHECK to allow ('email','google','apple')
--   (2) Replaces the handle_new_user trigger to pass provider through
--       as-is and to log (RAISE WARNING) rather than crash on failure,
--       so a future trigger bug never blocks signup again.
-- =============================================================


-- (1) Update CHECK constraint
ALTER TABLE profiles
  DROP CONSTRAINT IF EXISTS profiles_auth_provider_check;

ALTER TABLE profiles
  ADD CONSTRAINT profiles_auth_provider_check
  CHECK (auth_provider IN ('email','google','apple'));


-- (2) Replace the trigger with a resilient version
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_provider text;
BEGIN
  -- Map Supabase provider value to our enum-like set.
  -- Default to 'email' if missing; pass 'google'/'apple' through.
  v_provider := COALESCE(NEW.raw_app_meta_data->>'provider', 'email');

  -- Normalize anything unexpected to 'email' so signup never blocks
  -- on unknown providers (we can backfill later if we add new ones).
  IF v_provider NOT IN ('email','google','apple') THEN
    RAISE WARNING 'handle_new_user: unexpected provider "%", defaulting to email', v_provider;
    v_provider := 'email';
  END IF;

  BEGIN
    INSERT INTO public.profiles (id, email, name, auth_provider)
    VALUES (
      NEW.id,
      NEW.email,
      COALESCE(NEW.raw_user_meta_data->>'full_name',
               NEW.raw_user_meta_data->>'name'),
      v_provider
    );
  EXCEPTION WHEN OTHERS THEN
    -- Log but do not re-raise: a profile-creation failure must never
    -- block auth.users insert. We can backfill manually if this fires.
    RAISE WARNING 'handle_new_user: failed to create profile for user %: %',
      NEW.id, SQLERRM;
  END;

  RETURN NEW;
END;
$$;
