import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { getOrCreateAnonToken } from "@/lib/auth/anon-token";
import { getPendingIntent } from "@/lib/auth/pending-intent";
import { createAnonClient } from "@/lib/supabase/server";
import { ArchetypePicker, type ArchetypeOption } from "./ArchetypePicker";

export const metadata: Metadata = {
  title: "Choose your voice · Offscript",
};

export default async function ArchetypePage() {
  // Intent must be chosen first.
  const intentId = await getPendingIntent();
  if (!intentId) {
    redirect("/start");
  }

  const token = await getOrCreateAnonToken();
  const supabase = await createAnonClient(token);

  // Confirm the pending intent is real; a stale cookie sends the user back.
  const { data: intent } = await supabase
    .from("intents")
    .select("id, name")
    .eq("id", intentId)
    .maybeSingle();

  if (!intent) {
    redirect("/start");
  }

  const [{ data: archetypes }, { data: signals }] = await Promise.all([
    supabase
      .from("archetypes")
      .select("id, name, description, signal_set, display_order")
      .order("display_order", { ascending: true }),
    supabase.from("signals").select("id, name"),
  ]);

  // Hydrate each archetype's signal ids into readable names.
  const signalNameById = new Map(
    (signals ?? []).map((s) => [s.id, s.name] as const),
  );

  const options: ArchetypeOption[] = (archetypes ?? []).map((a) => ({
    id: a.id,
    name: a.name,
    description: a.description,
    signals: a.signal_set.map((id) => signalNameById.get(id) ?? id),
  }));

  return (
    <main className="min-h-screen bg-bg-base px-5 py-12">
      <div className="mx-auto w-full max-w-md">
        {options.length > 0 ? (
          <ArchetypePicker archetypes={options} intentId={intent.id} />
        ) : (
          <p className="text-sm text-text-muted">
            Voices aren&apos;t available right now. Please refresh in a moment.
          </p>
        )}
      </div>
    </main>
  );
}
