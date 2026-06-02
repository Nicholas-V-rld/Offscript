import { cx } from "class-variance-authority";
import type { Enums } from "@/lib/supabase/types";

export type RatingLabel = Enums<"rating_label">;

// Desaturated (translucent) background + full-saturation text/border so each
// rating reads clearly on the warm dark surface. Literal class strings keep
// them statically visible to Tailwind.
const ratingStyles: Record<RatingLabel, string> = {
  Blocked: "bg-rating-blocked/15 text-rating-blocked border-rating-blocked/40",
  Emerging:
    "bg-rating-emerging/15 text-rating-emerging border-rating-emerging/40",
  Present: "bg-rating-present/15 text-rating-present border-rating-present/40",
  Strong: "bg-rating-strong/15 text-rating-strong border-rating-strong/40",
  Signature:
    "bg-rating-signature/15 text-rating-signature border-rating-signature/40",
};

export interface RatingPillProps {
  label: RatingLabel;
  className?: string;
}

export function RatingPill({ label, className }: RatingPillProps) {
  return (
    <span
      className={cx(
        "inline-flex items-center justify-center rounded-full border px-3 py-1",
        "font-sans text-xs font-semibold uppercase tracking-wider",
        ratingStyles[label],
        className,
      )}
    >
      {label}
    </span>
  );
}
