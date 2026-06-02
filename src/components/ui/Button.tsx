import { forwardRef } from "react";
import { cva, cx, type VariantProps } from "class-variance-authority";

const button = cva(
  [
    "inline-flex items-center justify-center gap-2",
    "font-sans font-medium text-center whitespace-nowrap select-none",
    "rounded-full border transition-colors",
    "duration-[--duration-base] ease-[--ease-out]",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base",
    "disabled:opacity-50 disabled:pointer-events-none",
  ],
  {
    variants: {
      variant: {
        primary:
          "bg-gold text-bg-base border-transparent hover:bg-gold-hover active:bg-gold-muted",
        secondary:
          "bg-bg-surface text-text-primary border-border-default hover:border-border-strong active:bg-bg-input",
        ghost:
          "bg-transparent text-text-primary border-transparent hover:bg-bg-surface active:bg-bg-input",
      },
      size: {
        sm: "h-9 px-4 text-sm",
        md: "h-11 px-5 text-base",
        lg: "h-13 px-6 text-lg",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

function Spinner() {
  return (
    <svg
      className="h-4 w-4 animate-spin"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeWidth="2.5"
        className="opacity-25"
      />
      <path
        d="M21 12a9 9 0 0 0-9-9"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        className="opacity-90"
      />
    </svg>
  );
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof button> {
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      loading = false,
      disabled,
      type = "button",
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        className={cx(button({ variant, size }), className)}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        {...props}
      >
        {loading && <Spinner />}
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";

export { Button, button };
