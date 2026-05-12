"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type BadgeVariant = "success" | "pending" | "failed" | "info" | "neutral";
type BadgeSize = "sm" | "md";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
  pulse?: boolean; // for pending
  icon?: React.ReactNode;
}

const sizeMap: Record<BadgeSize, string> = {
  sm: "text-xs px-2.5 py-1 gap-1.5",
  md: "text-sm px-3 py-1.5 gap-2",
};

const variantMap: Record<
  BadgeVariant,
  { text: string; bg: string; ring: string; dot: string }
> = {
  success: {
    text: "text-white",
    bg: "bg-[linear-gradient(135deg,rgba(132,204,22,0.95),rgba(6,182,212,0.35))]",
    ring: "ring-1 ring-white/15",
    dot: "bg-[var(--color-success)]",
  },
  pending: {
    text: "text-white",
    bg: "bg-[linear-gradient(135deg,rgba(245,158,11,0.95),rgba(236,72,153,0.35))]",
    ring: "ring-1 ring-white/15",
    dot: "bg-[var(--color-warning)]",
  },
  failed: {
    text: "text-white",
    bg: "bg-[linear-gradient(135deg,rgba(239,68,68,0.95),rgba(124,58,237,0.35))]",
    ring: "ring-1 ring-white/15",
    dot: "bg-[var(--color-danger)]",
  },
  info: {
    text: "text-white",
    bg: "bg-[linear-gradient(135deg,rgba(6,182,212,0.95),rgba(124,58,237,0.35))]",
    ring: "ring-1 ring-white/15",
    dot: "bg-[var(--color-accent)]",
  },
  neutral: {
    text: "text-gray-800",
    bg: "bg-[linear-gradient(135deg,rgba(243,244,246,0.95),rgba(229,231,235,0.9))]",
    ring: "ring-1 ring-black/10",
    dot: "bg-gray-500",
  },
};

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      className,
      variant = "neutral",
      size = "md",
      dot = false,
      pulse = variant === "pending",
      icon,
      children,
      ...props
    },
    ref
  ) => {
    const styles = variantMap[variant as BadgeVariant];

    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center rounded-full font-medium leading-none whitespace-nowrap",
          sizeMap[size],
          styles.text,
          styles.bg,
          styles.ring,
          className
        )}
        {...props}
      >
        {dot && (
          <span className="relative flex h-2.5 w-2.5 items-center justify-center">
            {pulse ? (
              <motion.span
                className={cn("absolute inline-flex h-2.5 w-2.5 rounded-full opacity-60", styles.dot)}
                animate={{ scale: [1, 1.6, 1], opacity: [0.6, 0, 0.6] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
              />
            ) : null}
            <span className={cn("inline-flex h-2 w-2 rounded-full", styles.dot)} />
          </span>
        )}

        {icon ? <span className="flex items-center">{icon}</span> : null}

        <span>{children}</span>
      </span>
    );
  }
);

Badge.displayName = "Badge";