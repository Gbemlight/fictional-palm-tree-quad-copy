"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type SkeletonVariant = "rectangle" | "text" | "avatar" | "card";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: SkeletonVariant;
  width?: string | number;
  height?: string | number;
}

function toCssSize(v?: string | number) {
  if (v === undefined) return undefined;
  return typeof v === "number" ? `${v}px` : v;
}

const variantBase: Record<SkeletonVariant, string> = {
  rectangle: "rounded-xl",
  text: "rounded-md",
  avatar: "rounded-full",
  card: "rounded-2xl",
};

export function Skeleton({
  className,
  variant = "rectangle",
  width,
  height,
  style,
  ...props
}: SkeletonProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden",
        "bg-[linear-gradient(90deg,rgba(229,231,235,0.55),rgba(243,244,246,0.85),rgba(229,231,235,0.55))]",
        "dark:bg-[linear-gradient(90deg,rgba(55,65,81,0.55),rgba(75,85,99,0.8),rgba(55,65,81,0.55))]",
        variantBase[variant],
        "skeleton-shimmer",
        className
      )}
      style={{
        width: toCssSize(width),
        height: toCssSize(height),
        ...style,
      }}
      {...props}
    />
  );
}

/** Text skeleton lines: matches typography sizing better */
export function SkeletonText({
  lines = 3,
  className,
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          variant="text"
          height={14}
          className={cn(
            "w-full",
            i === lines - 1 ? "w-2/3" : "w-full"
          )}
        />
      ))}
    </div>
  );
}

/** Card skeleton for dashboards */
export function SkeletonCard({
  className,
}: {
  className?: string;
}) {
  return (
    <div className={cn("rounded-2xl border border-white/15 bg-white/5 p-6 backdrop-blur", className)}>
      <div className="flex items-center gap-4">
        <Skeleton variant="avatar" width={44} height={44} />
        <div className="flex-1">
          <Skeleton variant="text" height={14} className="w-1/3" />
          <div className="mt-2">
            <Skeleton variant="text" height={12} className="w-1/2" />
          </div>
        </div>
      </div>

      <div className="mt-6">
        <SkeletonText lines={3} />
      </div>

      <div className="mt-6 flex gap-3">
        <Skeleton variant="rectangle" height={40} className="w-1/2 rounded-xl" />
        <Skeleton variant="rectangle" height={40} className="w-1/2 rounded-xl" />
      </div>
    </div>
  );
}