"use server";

import { getOrCreateAnonToken } from "@/lib/auth/anon-token";
import { setPendingIntent } from "@/lib/auth/pending-intent";
import { createAnonClient } from "@/lib/supabase/server";

type SelectIntentResult =
  | { ok: true }
  | { ok: false; error: string };

export async function selectIntent(
  intentId: string,
): Promise<SelectIntentResult> {
  if (typeof intentId !== "string" || intentId.length === 0) {
    return { ok: false, error: "No intent provided." };
  }

  const token = await getOrCreateAnonToken();
  const supabase = await createAnonClient(token);

  // Server-side defense: confirm the intent actually exists before stashing it.
  const { data, error } = await supabase
    .from("intents")
    .select("id")
    .eq("id", intentId)
    .maybeSingle();

  if (error) {
    return { ok: false, error: "Could not verify that intent. Try again." };
  }

  if (!data) {
    return { ok: false, error: "That intent isn't available." };
  }

  await setPendingIntent(data.id);

  return { ok: true };
}
