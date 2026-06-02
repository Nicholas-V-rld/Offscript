import { cx } from "class-variance-authority";

export interface LoadingStateProps {
  variant?: "default" | "fullscreen";
  label?: string;
  className?: string;
}

function DotTrio() {
  // Three warm dots that pulse gently and in sequence — calm, never spinning.
  return (
    <span className="inline-flex items-center gap-1.5" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-2 w-2 rounded-full bg-gold"
          style={{
            animation: "offscript-dot-pulse 1400ms var(--ease-out) infinite",
            animationDelay: `${i * 200}ms`,
          }}
        />
      ))}
    </span>
  );
}

export function LoadingState({
  variant = "default",
  label,
  className,
}: LoadingStateProps) {
  if (variant === "fullscreen") {
    return (
      <div
        role="status"
        aria-live="polite"
        aria-label={label ?? "Loading"}
        className={cx(
          "fixed inset-0 z-40 flex flex-col items-center justify-center gap-4 bg-bg-base",
          className,
        )}
      >
        <DotTrio />
        {label ? (
          <p className="text-sm text-text-secondary">{label}</p>
        ) : null}
      </div>
    );
  }

  return (
    <span
      role="status"
      aria-live="polite"
      aria-label={label ?? "Loading"}
      className={cx("inline-flex items-center gap-3", className)}
    >
      <DotTrio />
      {label ? <span className="text-sm text-text-secondary">{label}</span> : null}
    </span>
  );
}
