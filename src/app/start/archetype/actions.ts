"use server";

import { redirect } from "next/navigation";

import { getOrCreateAnonToken } from "@/lib/auth/anon-token";
import {
  clearPendingIntent,
  getPendingIntent,
} from "@/lib/auth/pending-intent";
import { createAnonClient } from "@/lib/supabase/server";
import type { TablesInsert } from "@/lib/supabase/types";

type SelectArchetypeResult =
  | { ok: true; sessionId: string }
  | { ok: false; error: string };

export async function selectArchetype(
  archetypeId: string,
): Promise<SelectArchetypeResult> {
  if (typeof archetypeId !== "string" || archetypeId.length === 0) {
    return { ok: false, error: "No archetype provided." };
  }

  // Defense against a stale client: intent must still be pending.
  const intentId = await getPendingIntent();
  if (!intentId) {
    return { ok: false, error: "Your intent selection expired. Start over." };
  }

  const token = await getOrCreateAnonToken();
  const supabase = await createAnonClient(token);

  // Server-side defense: confirm the archetype actually exists.
  const { data: archetype, error: archetypeError } = await supabase
    .from("archetypes")
    .select("id")
    .eq("id", archetypeId)
    .maybeSingle();

  if (archetypeError) {
    return { ok: false, error: "Could not verify that voice. Try again." };
  }

  if (!archetype) {
    return { ok: false, error: "That voice isn't available." };
  }

  // Authenticated users skip the anonymous-first path: every session they
  // create is owned by them from creation. The anon_token path is only for
  // unauthenticated visitors.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const row: TablesInsert<"sessions"> = user
    ? {
        user_id: user.id,
        intent_id: intentId,
        archetype_id: archetype.id,
        content_source: "prompted",
        status: "draft",
      }
    : {
        user_id: null,
        intent_id: intentId,
        archetype_id: archetype.id,
        content_source: "prompted",
        anon_token: token,
        status: "draft",
      };

  const { data: session, error: insertError } = await supabase
    .from("sessions")
    .insert(row)
    .select("id")
    .single();

  if (insertError || !session) {
    return { ok: false, error: "Couldn't start your session. Try again." };
  }

  // The pending-intent cookie has served its purpose now that the draft
  // session row carries both intent and archetype.
  await clearPendingIntent();

  return { ok: true, sessionId: session.id };
}

export async function changeIntent(): Promise<void> {
  await clearPendingIntent();
  redirect("/start");
}
