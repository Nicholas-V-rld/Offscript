import { forwardRef } from "react";
import { cva, cx, type VariantProps } from "class-variance-authority";

const card = cva(
  [
    "block w-full text-left",
    "bg-bg-surface rounded-xl border border-border-subtle shadow-card",
    "transition-[transform,border-color] duration-[--duration-base] ease-[--ease-out]",
  ],
  {
    variants: {
      variant: {
        default: "",
        interactive:
          "cursor-pointer hover:border-border-strong hover:scale-[1.01] active:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

type CardVariant = VariantProps<typeof card>["variant"];

interface CardBaseProps {
  variant?: CardVariant;
  className?: string;
  children?: React.ReactNode;
}

type CardProps = CardBaseProps &
  (
    | ({ onClick: React.MouseEventHandler<HTMLButtonElement> } & Omit<
        React.ButtonHTMLAttributes<HTMLButtonElement>,
        keyof CardBaseProps | "onClick"
      >)
    | ({ onClick?: undefined } & Omit<
        React.HTMLAttributes<HTMLDivElement>,
        keyof CardBaseProps
      >)
  );

const Card = forwardRef<HTMLButtonElement | HTMLDivElement, CardProps>(
  ({ variant, className, children, onClick, ...props }, ref) => {
    // Render as a button only when an onClick handler is provided; otherwise a div.
    if (onClick) {
      const resolvedVariant = variant ?? "interactive";
      return (
        <button
          ref={ref as React.Ref<HTMLButtonElement>}
          type="button"
          onClick={onClick}
          className={cx(card({ variant: resolvedVariant }), className)}
          {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
        >
          {children}
        </button>
      );
    }

    return (
      <div
        ref={ref as React.Ref<HTMLDivElement>}
        className={cx(card({ variant }), className)}
        {...(props as React.HTMLAttributes<HTMLDivElement>)}
      >
        {children}
      </div>
    );
  },
);

Card.displayName = "Card";

export { Card, card };
