"use client";

import * as React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

type SkeletonVariant = "rectangle" | "text" | "avatar" | "card";

export interface SkeletonProps extends HTMLMotionProps<"div"> { // Extend HTMLMotionProps directly
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
    <motion.div
      initial={{ opacity: 0.5 }}
      animate={{ opacity: [0.5, 0.8, 0.5] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      className={cn(
        "relative overflow-hidden",
        "bg-neutral-200 dark:bg-neutral-800",
        variantBase[variant],
        className
      )}
      style={{
        width: toCssSize(width),
        height: toCssSize(height),
        ...style,
      }}
      {...props}
    >
      <motion.div
        className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 dark:via-white/5 to-transparent"
        animate={{ x: ["-100%", "100%"] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
      />
    </motion.div>
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

/** Transaction list skeleton */
export function SkeletonTransactionList() {
  return (
    <div className="space-y-4">
      <Skeleton variant="text" width={120} height={24} className="mb-6" />
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 bg-white/5 rounded-3xl border border-white/5">
          <Skeleton variant="rectangle" width={48} height={48} className="rounded-2xl" />
          <div className="flex-1 space-y-2">
            <Skeleton variant="text" width="60%" height={16} />
            <Skeleton variant="text" width="40%" height={12} />
          </div>
          <div className="text-right space-y-2">
            <Skeleton variant="text" width={60} height={16} className="ml-auto" />
            <Skeleton variant="text" width={40} height={12} className="ml-auto" />
          </div>
        </div>
      ))}
    </div>
  );
}

/** Profile page skeleton */
export function SkeletonProfile() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col items-center gap-4">
        <Skeleton variant="avatar" width={96} height={96} />
        <Skeleton variant="text" width={150} height={12} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton variant="text" width={80} height={10} />
            <Skeleton variant="rectangle" height={48} className="rounded-xl" />
          </div>
        ))}
      </div>
      <div className="space-y-2">
        <Skeleton variant="text" width={80} height={10} />
        <Skeleton variant="rectangle" height={100} className="rounded-xl" />
      </div>
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