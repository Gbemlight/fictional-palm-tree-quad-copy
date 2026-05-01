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
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
      className={cn(
        "relative flex flex-col items-center justify-center text-center overflow-hidden",
        "p-10 md:p-16 rounded-[2.5rem] border border-neutral-200 dark:border-white/10",
        "bg-white/40 dark:bg-white/5 backdrop-blur-2xl shadow-xl",
        className
      )}
    >
      {/* Decorative abstract blobs for a vibrant look */}
      <div className="absolute -top-24 -left-24 h-64 w-64 bg-primary/10 blur-[80px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 h-64 w-64 bg-accent/10 blur-[80px] rounded-full pointer-events-none" />

      {/* Illustration Container */}
      {icon && (
        <div className="relative mb-8 group">
          {/* Pulsing Glow effect */}
          <motion.div 
            animate={{ 
              scale: [1, 1.15, 1],
              opacity: [0.3, 0.5, 0.3] 
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 bg-linear-to-br from-primary via-secondary to-accent blur-3xl rounded-full" 
            aria-hidden="true" 
          />
          
          <div className="relative flex items-center justify-center rounded-4xl p-10 
          bg-linear-to-br from-primary via-secondary to-accent shadow-2xl shadow-primary/30 ring-8 ring-white/10 dark:ring-white/5">
            <div className="text-white [&>svg]:h-12 [&>svg]:w-12 transition-transform group-hover:scale-110 duration-300">
              {icon}
            </div>
          </div>
        </div>
      )}

      {/* Title */}
      <h3 className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white mb-4">
        {title}
      </h3>

      {/* Description */}
      {description && (
        <p className="max-w-md text-base text-neutral-500 dark:text-neutral-400 leading-relaxed font-medium">
          {description}
        </p>
      )}

      {/* CTA Section */}
      {cta && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-10 w-full flex justify-center"
        >
          {cta}
        </motion.div>
      )}
    </motion.div>
  );
}