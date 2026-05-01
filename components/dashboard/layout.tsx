"use client";

import * as React from "react";
import { motion, useMotionValue, useTransform, AnimatePresence } from "framer-motion";
import { Sidebar } from "./sidebar";
import { DashboardHeader } from "./header";
import { ToastProvider } from "@/components/ui/toast";
import { Toaster } from "@/components/ui/toaster";
import { MobileBottomNav } from "../dashboard/bottom-nav";
import { usePathname } from "next/navigation";
import { VibrantSpinner } from "../ui/vibrant-loader";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [refreshing, setRefreshing] = React.useState(false);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const y = useMotionValue(0);
  const pullThreshold = 80;
  const pathname = usePathname();
  
  // Map the drag distance to opacity and rotation for the loading icon
  const opacity = useTransform(y, [0, pullThreshold], [0, 1]);
  const rotate = useTransform(y, [0, pullThreshold], [0, 360]);

  const handleDragEnd = () => {
    if (y.get() >= pullThreshold) {
      setRefreshing(true);
      // Simulate a data fetch
      setTimeout(() => {
        setRefreshing(false);
        window.location.reload(); 
      }, 1500);
    }
  };

  return (
    <ToastProvider>
      <div className="flex min-h-screen bg-neutral-50 dark:bg-neutral-950 transition-colors duration-300">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
          {/* Pull-to-refresh Indicator */}
          <motion.div 
            style={{ y, opacity, height: pullThreshold, marginTop: -pullThreshold }}
            className="absolute top-0 left-0 right-0 flex items-center justify-center z-50 pointer-events-none"
          >
            <motion.div style={{ rotate }} className="p-1 rounded-full bg-white dark:bg-neutral-800 shadow-lg border border-neutral-200 dark:border-white/10">
              <VibrantSpinner className="h-8 w-8" />
            </motion.div>
          </motion.div>

          <DashboardHeader />
          <motion.main 
            ref={scrollContainerRef}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.5}
            onDragEnd={handleDragEnd}
            style={{ y }}
            className="flex-1 px-4 py-8 md:px-8 lg:px-12 overflow-y-auto scrollbar-hide pb-24 md:pb-8"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                className="max-w-7xl mx-auto relative"
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </motion.main>
          <MobileBottomNav scrollContainerRef={scrollContainerRef} />
        </div>
      </div>
      <Toaster />
    </ToastProvider>
  );
}