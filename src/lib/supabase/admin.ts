// SERVICE ROLE — server-only. Never import into client components.
// Bypasses Row Level Security.

import { createClient as createSupabaseClient } from "@supabase/supabase-js";

import type { Database } from "./types";

export function createClient() {
  if (typeof window !== "undefined") {
    throw new Error(
      "Supabase admin client must not run in the browser. Use @/lib/supabase/client instead.",
    );
  }

  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
}
