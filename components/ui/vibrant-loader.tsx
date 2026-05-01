"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const LOADING_MESSAGES = [
  "Fetching your data...",
  "Almost there!",
  "Working our magic...",
  "Securing your connection...",
  "Preparing your dashboard...",
];

export function VibrantSpinner({ className }: { className?: string }) {
  return (
    <div className={cn("relative h-10 w-10 flex items-center justify-center", className)}>
      <motion.div
        className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary border-r-secondary"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute inset-0 rounded-full border-2 border-transparent border-b-accent border-l-pink-500 opacity-50"
        animate={{ rotate: -360 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="h-2 w-2 rounded-full bg-linear-to-br from-primary to-secondary"
        animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

export function LoadingScreen({ message }: { message?: string }) {
  const [displayMessage, setDisplayMessage] = React.useState(message || LOADING_MESSAGES[0]);

  React.useEffect(() => {
    if (message) return;
    const interval = setInterval(() => {
      setDisplayMessage(prev => {
        const idx = LOADING_MESSAGES.indexOf(prev);
        return LOADING_MESSAGES[(idx + 1) % LOADING_MESSAGES.length];
      });
    }, 2000);
    return () => clearInterval(interval);
  }, [message]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-6">
      <VibrantSpinner className="h-16 w-16" />
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        key={displayMessage}
        className="text-sm font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest"
      >
        {displayMessage}
      </motion.p>
    </div>
  );
}