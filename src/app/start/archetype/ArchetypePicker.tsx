"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { LoadingState } from "@/components/ui/LoadingState";
import { changeIntent, selectArchetype } from "./actions";

export interface ArchetypeOption {
  id: string;
  name: string;
  description: string;
  signals: string[];
}

// Verb per intent, used in the subheadline. Falls back to a neutral phrasing.
const intentVerb: Record<string, string> = {
  teach: "teach",
  sell: "sell",
  connect: "connect",
  entertain: "entertain",
  motivate: "motivate",
};

export function ArchetypePicker({
  archetypes,
  intentId,
}: {
  archetypes: ArchetypeOption[];
  intentId: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [selectingId, setSelectingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const verb = intentVerb[intentId] ?? "show up";
  const subheadline = `You're here to ${verb}. Pick the voice that fits how you want to land.`;

  function handleSelect(archetypeId: string) {
    if (isPending) return;
    setError(null);
    setSelectingId(archetypeId);

    startTransition(async () => {
      const result = await selectArchetype(archetypeId);
      if (!result.ok) {
        setError(result.error);
        setSelectingId(null);
        return;
      }
      router.push(`/start/sandbox?session=${result.sessionId}`);
    });
  }

  function handleChangeIntent() {
    if (isPending) return;
    startTransition(async () => {
      await changeIntent();
    });
  }

  return (
    <div>
      <div className="mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleChangeIntent}
          className="-ml-2"
        >
          ← Change intent
        </Button>
      </div>

      <header className="mb-10">
        <p className="mb-3 text-xs font-medium uppercase tracking-widest text-gold">
          Step 2 of 3
        </p>
        <h1 className="font-display text-3xl leading-tight text-text-primary">
          Which voice feels most like you?
        </h1>
        <p className="mt-3 text-base text-text-secondary">{subheadline}</p>
      </header>

      <div className="flex flex-col gap-4">
        {archetypes.map((archetype) => {
          const isSelecting = selectingId === archetype.id;
          return (
            <Card
              key={archetype.id}
              variant="interactive"
              onClick={() => handleSelect(archetype.id)}
              aria-disabled={isPending || undefined}
              className="p-5"
            >
              <div className="flex items-center justify-between gap-4">
                <h2 className="font-display text-lg font-semibold text-text-primary">
                  {archetype.name}
                </h2>
                {isSelecting ? <LoadingState /> : null}
              </div>
              <p className="mt-1 text-sm text-text-secondary">
                {archetype.description}
              </p>

              <hr className="my-4 border-t border-border-subtle" />

              <p className="mb-3 text-xs uppercase tracking-widest text-text-muted">
                Scored on
              </p>
              <div className="flex flex-wrap gap-2">
                {archetype.signals.map((signal) => (
                  <Chip key={signal}>{signal}</Chip>
                ))}
              </div>
            </Card>
          );
        })}
      </div>

      {error ? (
        <p role="alert" className="mt-4 text-sm text-error">
          {error}
        </p>
      ) : null}
    </div>
  );
}
