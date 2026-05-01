"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Home, 
  CreditCard, 
  Wallet, 
  ArrowLeftRight, 
  User 
} from "lucide-react";
import { cn } from "@/lib/utils";

const TABS = [
  { label: "Home", href: "/dashboard", icon: Home },
  { label: "Payments", href: "/pay-bills", icon: CreditCard },
  { label: "Wallet", href: "/wallet", icon: Wallet },
  { label: "Activity", href: "/transactions", icon: ArrowLeftRight },
  { label: "Profile", href: "/settings?tab=profile", icon: User },
];

interface MobileBottomNavProps {
  scrollContainerRef: React.RefObject<HTMLDivElement | null>;
}

export function MobileBottomNav({ scrollContainerRef }: MobileBottomNavProps) {
  const pathname = usePathname();
  const [hidden, setHidden] = React.useState(false);
  const lastScrollY = React.useRef(0);

  // Handle hide/show on scroll
  React.useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const currentScrollY = container.scrollTop;
      if (currentScrollY > lastScrollY.current && currentScrollY > 80) {
        setHidden(true);
      } else {
        setHidden(false);
      }
      lastScrollY.current = currentScrollY;
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, [scrollContainerRef]);

  const triggerHaptic = () => {
    if (typeof window !== "undefined" && window.navigator.vibrate) {
      window.navigator.vibrate(10); // Short pulse
    }
  };

  return (
    <motion.nav
      variants={{
        visible: { y: 0, opacity: 1 },
        hidden: { y: "100%", opacity: 0 },
      }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
      className={cn(
        "md:hidden fixed bottom-0 left-0 right-0 z-50",
        "bg-white/80 dark:bg-neutral-900/80 backdrop-blur-2xl shadow-[0_-8px_30px_rgba(0,0,0,0.08)]",
        "border-t border-neutral-200 dark:border-white/10",
        "pb-[env(safe-area-inset-bottom)]"
      )}
    >
      <div className="flex items-center justify-around h-16 px-2 max-w-lg mx-auto">
        {TABS.map((tab) => {
          // Simple active state check
          const isActive = pathname === tab.href || (tab.href !== "/dashboard" && pathname?.startsWith(tab.href.split('?')[0]));
          const Icon = tab.icon;

          return (
            <Link
              key={tab.href}
              href={tab.href}
              onClick={triggerHaptic}
              className="relative flex flex-col items-center justify-center w-full h-full transition-transform active:scale-90"
            >
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    layoutId="activeTabPill"
                    className="absolute inset-x-1 inset-y-2 bg-primary/10 dark:bg-primary/20 rounded-2xl z-0"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
              </AnimatePresence>

              <div className={cn(
                "relative z-10 flex flex-col items-center gap-0.5 transition-all duration-300",
                isActive ? "text-primary scale-110" : "text-neutral-500 dark:text-neutral-400"
              )}>
                <Icon className={cn("h-5 w-5", isActive && "stroke-[2.5px]")} />
                {isActive && (
                  <motion.span 
                    initial={{ opacity: 0, y: 2 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-[9px] font-black uppercase tracking-tighter"
                  >
                    {tab.label}
                  </motion.span>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </motion.nav>
  );
}