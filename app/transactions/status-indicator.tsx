"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Loader2, 
  Ban 
} from "lucide-react";
import { cn } from "@/lib/utils";

export type TransactionStatus = "pending" | "success" | "failed" | "processing" | "cancelled";

interface StatusIndicatorProps {
  status: TransactionStatus;
  subStatus?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const statusConfig = {
  pending: {
    icon: Clock,
    label: "Pending",
    bg: "bg-amber-500/10 dark:bg-amber-500/20",
    text: "text-amber-600 dark:text-amber-400",
    border: "border-amber-500/20",
  },
  success: {
    icon: CheckCircle2,
    label: "Success",
    bg: "bg-green-500/10 dark:bg-green-500/20",
    text: "text-green-600 dark:text-green-400",
    border: "border-green-500/20",
  },
  failed: {
    icon: XCircle,
    label: "Failed",
    bg: "bg-rose-500/10 dark:bg-rose-500/20",
    text: "text-rose-600 dark:text-rose-400",
    border: "border-rose-500/20",
  },
  processing: {
    icon: Loader2,
    label: "Processing",
    bg: "bg-cyan-500/10 dark:bg-cyan-500/20",
    text: "text-cyan-600 dark:text-cyan-400",
    border: "border-cyan-500/20",
  },
  cancelled: {
    icon: Ban,
    label: "Cancelled",
    bg: "bg-neutral-500/10 dark:bg-neutral-500/20",
    text: "text-neutral-600 dark:text-neutral-400",
    border: "border-neutral-500/20",
  },
};

export function StatusIndicator({ 
  status, 
  subStatus, 
  className,
  size = "md"
}: StatusIndicatorProps) {
  const config = statusConfig[status] || statusConfig.pending;
  const Icon = config.icon;

  const iconSizes = { sm: "h-3.5 w-3.5", md: "h-4 w-4", lg: "h-6 w-6" };
  const containerPadding = { sm: "px-2 py-0.5 gap-1.5", md: "px-3 py-1.5 gap-2", lg: "px-5 py-3 gap-3" };
  const textSizes = { sm: "text-[10px]", md: "text-xs", lg: "text-base" };

  return (
    <div className={cn("inline-flex flex-col items-start gap-1.5", className)}>
      <div className={cn(
        "flex items-center rounded-full border transition-all duration-300",
        config.bg, config.text, config.border, containerPadding[size]
      )}>
        <div className="flex items-center gap-1">
          <motion.div
            initial={status === 'success' ? { scale: 0.5, opacity: 0 } : {}}
            animate={
              status === 'success' ? { scale: 1, opacity: 1 } :
              status === 'failed' ? { x: [-2, 2, -2, 2, 0] } :
              status === 'processing' ? { rotate: 360 } :
              status === 'pending' ? { opacity: [1, 0.4, 1] } : {}
            }
            transition={
              status === 'processing' ? { repeat: Infinity, duration: 1, ease: "linear" } :
              status === 'pending' ? { repeat: Infinity, duration: 1.5, ease: "easeInOut" } :
              status === 'failed' ? { duration: 0.4 } :
              { type: "spring", stiffness: 300, damping: 20 }
            }
          >
            <Icon className={iconSizes[size]} />
          </motion.div>
          {status === 'pending' && (
            <div className="flex gap-0.5">
              {[0, 1, 2].map((i) => (
                <motion.div key={i} className={cn("rounded-full bg-current", size === "lg" ? "h-1.5 w-1.5" : "h-1 w-1")} animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }} />
              ))}
            </div>
          )}
        </div>
        <span className={cn("font-black uppercase tracking-widest", textSizes[size])}>{config.label}</span>
      </div>
      <AnimatePresence>
        {subStatus && (
          <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="text-[10px] font-bold text-neutral-400 uppercase tracking-tight px-3">{subStatus}</motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}