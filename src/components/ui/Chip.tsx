import { forwardRef } from "react";
import { cva, cx, type VariantProps } from "class-variance-authority";

const chip = cva(
  [
    "inline-flex items-center justify-center",
    "min-h-11 px-4 py-2 gap-2",
    "font-sans text-sm rounded-full border",
    "transition-colors duration-[--duration-base] ease-[--ease-out]",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base",
  ],
  {
    variants: {
      variant: {
        default:
          "bg-bg-input border-border-subtle text-text-secondary hover:border-border-default hover:text-text-primary",
        selected:
          "bg-gold-muted border-gold text-text-primary",
        disabled:
          "bg-bg-input border-border-subtle text-text-secondary opacity-40 pointer-events-none",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

type ChipVariant = VariantProps<typeof chip>["variant"];

interface ChipBaseProps {
  variant?: ChipVariant;
  className?: string;
  children?: React.ReactNode;
}

type ChipProps = ChipBaseProps &
  (
    | ({ onClick: React.MouseEventHandler<HTMLButtonElement> } & Omit<
        React.ButtonHTMLAttributes<HTMLButtonElement>,
        keyof ChipBaseProps | "onClick"
      >)
    | ({ onClick?: undefined } & Omit<
        React.HTMLAttributes<HTMLSpanElement>,
        keyof ChipBaseProps
      >)
  );

const Chip = forwardRef<HTMLButtonElement | HTMLSpanElement, ChipProps>(
  ({ variant, className, children, onClick, ...props }, ref) => {
    // Render as a button only when an onClick handler is provided; otherwise a span.
    if (onClick) {
      return (
        <button
          ref={ref as React.Ref<HTMLButtonElement>}
          type="button"
          onClick={onClick}
          disabled={variant === "disabled" || undefined}
          className={cx(chip({ variant }), className)}
          {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
        >
          {children}
        </button>
      );
    }

    return (
      <span
        ref={ref as React.Ref<HTMLSpanElement>}
        className={cx(chip({ variant }), className)}
        {...(props as React.HTMLAttributes<HTMLSpanElement>)}
      >
        {children}
      </span>
    );
  },
);

Chip.displayName = "Chip";

export { Chip, chip };
