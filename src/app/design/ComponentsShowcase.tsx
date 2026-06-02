"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { RatingPill, type RatingLabel } from "@/components/ui/RatingPill";
import { PullUpDrawer } from "@/components/ui/PullUpDrawer";
import { LoadingState } from "@/components/ui/LoadingState";

const buttonVariants = ["primary", "secondary", "ghost"] as const;
const buttonSizes = ["sm", "md", "lg"] as const;
const intents = ["Teach", "Sell", "Connect", "Entertain", "Motivate"];
const ratingLabels: RatingLabel[] = [
  "Blocked",
  "Emerging",
  "Present",
  "Strong",
  "Signature",
];

function SubHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-sm uppercase tracking-wide text-text-muted mb-3">
      {children}
    </h3>
  );
}

export function ComponentsShowcase() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showFullscreenLoad, setShowFullscreenLoad] = useState(false);
  const [selectedIntent, setSelectedIntent] = useState("Connect");
  const [cardClicks, setCardClicks] = useState(0);

  return (
    <section className="mb-12">
      <h2 className="font-display text-2xl text-text-primary mb-1">Components</h2>
      <p className="text-sm text-text-muted mb-6">
        The six base building blocks, in every variant and state.
      </p>

      {/* Button */}
      <div className="mb-10">
        <SubHeading>Button</SubHeading>
        <div className="flex flex-col gap-6">
          {buttonVariants.map((variant) => (
            <div key={variant} className="flex flex-col gap-3">
              <p className="text-xs uppercase tracking-wider text-gold">
                {variant}
              </p>
              <div className="flex flex-wrap items-center gap-3">
                {buttonSizes.map((size) => (
                  <Button key={size} variant={variant} size={size}>
                    {size.toUpperCase()}
                  </Button>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Button variant={variant} size="md" disabled>
                  Disabled
                </Button>
                <Button variant={variant} size="md" loading>
                  Loading
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Card */}
      <div className="mb-10">
        <SubHeading>Card</SubHeading>
        <div className="flex flex-col gap-4">
          <Card className="p-5">
            <p className="text-xs uppercase tracking-wider text-gold mb-2">
              Default
            </p>
            <h4 className="font-display text-lg text-text-primary mb-1">
              Rehearsal saved
            </h4>
            <p className="text-sm text-text-secondary">
              A static surface for grouping content — header, body, footer
              compose freely inside.
            </p>
          </Card>

          <Card variant="interactive" onClick={() => setCardClicks((c) => c + 1)} className="p-5">
            <p className="text-xs uppercase tracking-wider text-gold mb-2">
              Interactive
            </p>
            <h4 className="font-display text-lg text-text-primary mb-1">
              Tap to continue
            </h4>
            <p className="text-sm text-text-secondary">
              Renders as a button when given an onClick. Tapped {cardClicks}{" "}
              {cardClicks === 1 ? "time" : "times"}.
            </p>
          </Card>
        </div>
      </div>

      {/* Chip */}
      <div className="mb-10">
        <SubHeading>Chip</SubHeading>
        <div className="flex flex-wrap items-center gap-3 mb-5">
          <Chip>Default</Chip>
          <Chip variant="selected">Selected</Chip>
          <Chip variant="disabled">Disabled</Chip>
        </div>
        <p className="text-xs uppercase tracking-wider text-gold mb-3">
          Intent selection
        </p>
        <div className="flex flex-wrap items-center gap-3">
          {intents.map((intent) => (
            <Chip
              key={intent}
              variant={selectedIntent === intent ? "selected" : "default"}
              onClick={() => setSelectedIntent(intent)}
            >
              {intent}
            </Chip>
          ))}
        </div>
      </div>

      {/* RatingPill */}
      <div className="mb-10">
        <SubHeading>Rating Pill</SubHeading>
        <div className="flex flex-wrap items-center gap-3">
          {ratingLabels.map((label) => (
            <RatingPill key={label} label={label} />
          ))}
        </div>
      </div>

      {/* PullUpDrawer */}
      <div className="mb-10">
        <SubHeading>Pull-Up Drawer</SubHeading>
        <Button variant="secondary" onClick={() => setDrawerOpen(true)}>
          Open drawer
        </Button>
        <PullUpDrawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          title="Sample drawer"
        >
          <div className="flex flex-col gap-4">
            <p className="text-sm text-text-secondary">
              Bottom-sheet pattern — replaces side panels on mobile. Slides up
              calmly, locks page scroll, and scrolls internally when content
              overflows.
            </p>
            {Array.from({ length: 8 }).map((_, i) => (
              <Card key={i} className="p-4">
                <p className="text-sm text-text-primary">Scrollable row {i + 1}</p>
              </Card>
            ))}
            <Button variant="primary" onClick={() => setDrawerOpen(false)}>
              Done
            </Button>
          </div>
        </PullUpDrawer>
      </div>

      {/* LoadingState */}
      <div className="mb-2">
        <SubHeading>Loading State</SubHeading>
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-4">
            <LoadingState />
            <LoadingState label="Preparing your sandbox" />
          </div>
          <div>
            <Button variant="ghost" onClick={() => setShowFullscreenLoad(true)}>
              See fullscreen
            </Button>
          </div>
        </div>
      </div>

      {showFullscreenLoad ? (
        <div onClick={() => setShowFullscreenLoad(false)}>
          <LoadingState variant="fullscreen" label="Analyzing your take…" />
        </div>
      ) : null}
    </section>
  );
}
