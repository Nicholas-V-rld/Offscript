import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";

import { clearAnonToken, getAnonToken } from "@/lib/auth/anon-token";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    redirect(
      `/auth/error?message=${encodeURIComponent("Missing authorization code")}`,
    );
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    redirect(`/auth/error?message=${encodeURIComponent(error.message)}`);
  }

  const anonToken = await getAnonToken();
  if (anonToken) {
    try {
      const { data: sessionId, error: claimError } = await supabase.rpc(
        "claim_anonymous_session",
        { p_anon_token: anonToken },
      );

      if (claimError) {
        console.error(
          "Failed to claim anonymous session:",
          claimError.message,
        );
      } else {
        if (!sessionId) {
          console.warn(
            "claim_anonymous_session returned null — no matching anonymous session",
          );
        }
        await clearAnonToken();
      }
    } catch (err) {
      console.error("claim_anonymous_session RPC threw:", err);
    }
  }

  redirect("/");
}
