"use client";

import { useEffect, useState } from "react";

export interface PullUpDrawerProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children?: React.ReactNode;
}

const EXIT_MS = 240; // mirrors --duration-base

export function PullUpDrawer({
  open,
  onClose,
  title,
  children,
}: PullUpDrawerProps) {
  const [mounted, setMounted] = useState(open);
  const [entered, setEntered] = useState(false);

  // Mount on open, then transition in on the next frame. On close, transition
  // out first and unmount after the animation completes.
  useEffect(() => {
    if (open) {
      setMounted(true);
      const raf = requestAnimationFrame(() => setEntered(true));
      return () => cancelAnimationFrame(raf);
    }
    setEntered(false);
    const timer = setTimeout(() => setMounted(false), EXIT_MS);
    return () => clearTimeout(timer);
  }, [open]);

  // Lock page scroll while open.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  // Close on Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div
        onClick={onClose}
        aria-hidden="true"
        className="absolute inset-0 bg-black/60 transition-opacity ease-[--ease-out] duration-[--duration-base]"
        style={{ opacity: entered ? 1 : 0 }}
      />

      {/* Sheet */}
      <div
        className="absolute inset-x-0 bottom-0 flex max-h-[70vh] flex-col rounded-t-2xl border-t border-border-default bg-bg-elevated shadow-elevated transition-transform ease-[--ease-out] duration-[--duration-base]"
        style={{ transform: entered ? "translateY(0)" : "translateY(100%)" }}
      >
        {/* Grab handle */}
        <div className="flex shrink-0 justify-center pt-3 pb-1">
          <span className="h-1.5 w-10 rounded-full bg-border-strong" />
        </div>

        {title ? (
          <div className="shrink-0 px-5 pt-2 pb-3">
            <h2 className="font-display text-xl text-text-primary">{title}</h2>
          </div>
        ) : null}

        {/* Internally scrolling body */}
        <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-8 pt-2">
          {children}
        </div>
      </div>
    </div>
  );
}
