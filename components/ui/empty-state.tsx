"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  cta?: ReactNode;
  className?: string;
}

export function EmptyState({
  title,
  description,
  icon,
  cta,
  className,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={cn(
        "flex flex-col items-center justify-center text-center",
        "p-10 rounded-2xl border border-white/10",
        "bg-white/5 backdrop-blur-xl",
        className
      )}
    >
      {/* Illustration */}
      {icon && (
        <div className="mb-5 flex items-center justify-center rounded-full p-6 
        bg-gradient-to-br from-purple-500 via-pink-500 to-cyan-500 shadow-lg">
          {icon}
        </div>
      )}

      {/* Title */}
      <h3 className="text-xl font-semibold text-white">{title}</h3>

      {/* Description */}
      {description && (
        <p className="mt-2 max-w-md text-sm text-white/70">
          {description}
        </p>
      )}

      {/* CTA */}
      {cta && <div className="mt-6">{cta}</div>}
    </motion.div>
  );
}