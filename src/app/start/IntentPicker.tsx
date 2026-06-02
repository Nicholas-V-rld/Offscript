"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { LoadingState } from "@/components/ui/LoadingState";
import { selectIntent } from "./actions";

export interface Intent {
  id: string;
  name: string;
  description: string;
  display_order: number;
}

export function IntentPicker({ intents }: { intents: Intent[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [selectingId, setSelectingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleSelect(intentId: string) {
    if (isPending) return;
    setError(null);
    setSelectingId(intentId);

    startTransition(async () => {
      const result = await selectIntent(intentId);
      if (!result.ok) {
        setError(result.error);
        setSelectingId(null);
        return;
      }
      router.push("/start/archetype");
    });
  }

  return (
    <div className="flex flex-col gap-4">
      {intents.map((intent) => {
        const isSelecting = selectingId === intent.id;
        return (
          <Card
            key={intent.id}
            variant="interactive"
            onClick={() => handleSelect(intent.id)}
            aria-disabled={isPending || undefined}
            className="p-5"
          >
            <div className="flex items-center justify-between gap-4">
              <h2 className="font-display text-lg font-semibold text-text-primary">
                {intent.name}
              </h2>
              {isSelecting ? <LoadingState /> : null}
            </div>
            <p className="mt-1 text-sm text-text-secondary">
              {intent.description}
            </p>
          </Card>
        );
      })}

      {error ? (
        <p
          role="alert"
          className="mt-1 text-sm text-error"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}
