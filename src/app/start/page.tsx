import type { Metadata } from "next";
import { getOrCreateAnonToken } from "@/lib/auth/anon-token";
import { createAnonClient } from "@/lib/supabase/server";
import { IntentPicker, type Intent } from "./IntentPicker";

export const metadata: Metadata = {
  title: "Choose your intent · Offscript",
};

export default async function StartPage() {
  const token = await getOrCreateAnonToken();
  const supabase = await createAnonClient(token);

  const { data: intents } = await supabase
    .from("intents")
    .select("id, name, description, display_order")
    .order("display_order", { ascending: true });

  const list: Intent[] = intents ?? [];

  return (
    <main className="min-h-screen bg-bg-base px-5 py-12">
      <div className="mx-auto w-full max-w-md">
        <header className="mb-10">
          <p className="mb-3 text-xs font-medium uppercase tracking-widest text-gold">
            Step 1 of 3
          </p>
          <h1 className="font-display text-3xl leading-tight text-text-primary">
            What are you trying to do?
          </h1>
          <p className="mt-3 text-base text-text-secondary">
            Pick the intent that best matches the energy you want for this take.
          </p>
        </header>

        {list.length > 0 ? (
          <IntentPicker intents={list} />
        ) : (
          <p className="text-sm text-text-muted">
            Intents aren&apos;t available right now. Please refresh in a moment.
          </p>
        )}
      </div>
    </main>
  );
}
