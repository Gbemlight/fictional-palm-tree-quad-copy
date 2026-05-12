import * as React from "react";
import { cn } from "@/lib/utils";

type CardVariant = "default" | "elevated" | "interactive" | "outline";
type CardPadding = "none" | "sm" | "md" | "lg";
type AccentPosition = "left" | "top";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  padding?: CardPadding;
  accent?: boolean;
  accentPosition?: AccentPosition;
}

const paddingMap: Record<CardPadding, string> = {
  none: "p-0",
  sm: "p-3",
  md: "p-5",
  lg: "p-7",
};

const variantMap: Record<CardVariant, string> = {
  default:
    "backdrop-blur-lg bg-white/10 border border-white/20",
  elevated:
    "backdrop-blur-lg bg-white/10 border border-white/20 shadow-[0_20px_40px_rgba(124,58,237,0.15)]",
  interactive:
    "backdrop-blur-lg bg-white/10 border border-white/20 transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(236,72,153,0.18)] hover:border-white/30",
  outline:
    "bg-transparent border border-white/25",
};

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      variant = "default",
      padding = "md",
      accent = false,
      accentPosition = "left",
      children,
      ...props
    },
    ref
  ) => {
    return (
      <section
        ref={ref}
        className={cn(
          "relative overflow-hidden rounded-2xl",
          variantMap[variant as CardVariant],
          paddingMap[padding as CardPadding],
          className
        )}
        {...props}
      >
        {/* Gradient Accent */}
        {accent && (
          <span
            aria-hidden="true"
            className={cn(
              "pointer-events-none absolute",
              accentPosition === "left"
                ? "left-0 top-0 h-full w-1"
                : "left-0 top-0 h-1 w-full",
              "bg-[linear-gradient(180deg,var(--color-primary),var(--color-secondary),var(--color-accent))]"
            )}
          />
        )}

        {/* subtle gradient wash */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-60 bg-[radial-gradient(circle_at_top_left,rgba(124,58,237,0.20),transparent_55%),radial-gradient(circle_at_bottom_right,rgba(236,72,153,0.18),transparent_55%)]"
        />

        <div className="relative">{children}</div>
      </section>
    );
  }
);

Card.displayName = "Card";

export const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <header
    ref={ref}
    className={cn("mb-3 space-y-1", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

export const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("text-lg font-semibold text-white", className)}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

export const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-white/70", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

export const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("space-y-3", className)} {...props} />
));
CardContent.displayName = "CardContent";

export const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <footer
    ref={ref}
    className={cn("mt-4 flex items-center justify-between", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";