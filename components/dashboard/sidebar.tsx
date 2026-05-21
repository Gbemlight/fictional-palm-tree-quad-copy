"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import * as Dialog from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";
import { mockUser } from "@/lib/dummy-data";
import { 
  LayoutDashboard, 
  Signal, 
  Smartphone, 
  Zap, 
  History, 
  Wallet, 
  Settings, 
  ChevronLeft, 
  Menu, 
  X, 
  HelpCircle, // Added HelpCircle icon
  LogOut
  ,Gem // Added Gem icon for logo
} from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Buy Data", href: "/buy-data", icon: Signal },
  { label: "Buy Airtime", href: "/buy-airtime", icon: Smartphone },
  { label: "Pay Bills", href: "/pay-bills", icon: Zap },
  { label: "Transactions", href: "/transactions", icon: History },
  { label: "Wallet", href: "/wallet", icon: Wallet },
  { label: "Settings", href: "/settings", icon: Settings },
  { label: "Help", href: "/help", icon: HelpCircle }, // Added Help item
];

export function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);

  // Load and persist sidebar state
  React.useEffect(() => {
    const saved = localStorage.getItem("sidebar-collapsed");
    if (saved !== null) setIsCollapsed(saved === "true");
  }, []);

  const toggleSidebar = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem("sidebar-collapsed", String(newState));
  };

  const NavContent = ({ mobile = false }) => (
    <div className="flex flex-col h-full bg-white dark:bg-neutral-950">
      {/* Logo Section */}
      <div className={cn(
        "p-6 flex items-center gap-3 transition-all duration-300",
        isCollapsed && !mobile ? "justify-center" : "justify-start"
      )}>
        <div className="w-10 h-10 bg-linear-to-tr from-indigo-600 to-violet-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 shrink-0">
          <Gem className="text-white h-6 w-6" />
        </div>
        <AnimatePresence>
          {(!isCollapsed || mobile) && (
            <motion.span 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="text-xl font-black tracking-tighter bg-clip-text text-transparent bg-linear-to-r from-indigo-600 to-violet-600"
            >
              Credixa
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 space-y-2 mt-4">
        {navItems.map((item) => {
          // Professional active check: matches exact path OR sub-paths (except for home)
          const isActive = pathname === item.href || 
            (item.href !== "/dashboard" && pathname?.startsWith(item.href));
            
          return (
            <Link 
              key={item.href} 
              href={item.href}
              onClick={() => mobile && setIsMobileOpen(false)}
              className={cn(
                "relative flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 group overflow-hidden",
                isActive 
                  ? "bg-linear-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/20" 
                  : "text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-white/5 hover:scale-[1.02] hover:shadow-[0_0_15px_rgba(99,102,241,0.1)]",
                isCollapsed && !mobile ? "justify-center" : "justify-start"
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon className={cn(
                  "h-5 w-5 transition-colors duration-300",
                  isActive ? "text-white" : "group-hover:text-indigo-500"
                )} />
                {(!isCollapsed || mobile) && (
                  <span className={cn(
                    "text-sm font-bold tracking-tight",
                    isActive ? "text-white" : "text-neutral-600 dark:text-neutral-300"
                  )}>
                    {item.label}
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* User Profile Section */}
      <div className={cn(
        "p-4 border-t border-neutral-100 dark:border-white/5",
        isCollapsed && !mobile ? "flex justify-center" : ""
      )}>
        <div className={cn(
          "flex items-center gap-3 p-2 rounded-2xl hover:bg-neutral-50 dark:hover:bg-white/5 transition-colors cursor-pointer group",
          isCollapsed && !mobile ? "justify-center" : ""
        )}>
          <div className="h-10 w-10 rounded-xl bg-indigo-100 dark:bg-indigo-500/10 border-2 border-white dark:border-neutral-800 shadow-sm shrink-0 overflow-hidden">
            <img 
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(mockUser.name)}&background=6366f1&color=fff`} 
              alt="Avatar"
              className="h-full w-full object-cover"
            />
          </div>
          {(!isCollapsed || mobile) && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-neutral-900 dark:text-white truncate">{mockUser.name}</p>
              <p className="text-[10px] font-medium text-neutral-500 truncate uppercase tracking-widest">Administrator</p>
            </div>
          )}
          {(!isCollapsed || mobile) && <LogOut className="h-4 w-4 text-neutral-400 group-hover:text-rose-500 transition-colors" />}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        initial={false} // Ensures Framer Motion doesn't animate on initial render
        animate={{ width: isCollapsed ? 80 : 280 }}
        className="hidden md:flex flex-col sticky top-0 h-screen z-40 bg-white dark:bg-neutral-950 border-r border-transparent group overflow-hidden"
      >
        {/* Right edge gradient border */}
        <div className="absolute top-0 right-0 h-full w-px bg-linear-to-b from-transparent via-neutral-200 dark:via-white/10 to-transparent" />
        
        <NavContent />

        {/* Collapse Toggle */}
        <button 
          onClick={toggleSidebar}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="absolute -right-3 top-20 h-6 w-6 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 rounded-full flex items-center justify-center shadow-sm hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors z-50"
        >
          <motion.div
            animate={{ rotate: isCollapsed ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronLeft className="h-4 w-4 text-neutral-500" />
          </motion.div>
        </button>
      </motion.aside>

      {/* Mobile Trigger - This would typically be in the Header component, 
          but we'll include it here or assume layout handles it */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Button 
          variant="outline" 
          size="icon" 
          className="rounded-xl bg-linear-to-r from-indigo-600 to-violet-600 border-none shadow-lg text-white hover:opacity-90 transition-opacity"
          onClick={() => setIsMobileOpen(true)}
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      {/* Mobile Drawer (Radix Dialog) */}
      <Dialog.Root open={isMobileOpen} onOpenChange={setIsMobileOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50" />
          <Dialog.Content 
            className="fixed top-0 left-0 bottom-0 w-75 bg-white dark:bg-neutral-950 z-50 shadow-2xl focus:outline-none"
            asChild
          >
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
            >
              <div className="relative h-full">
                <Dialog.Title className="sr-only">Navigation Menu</Dialog.Title>
                <Dialog.Description className="sr-only">
                  Access your dashboard, buy data, airtime, and manage your wallet.
                </Dialog.Description>
                <Dialog.Close asChild>
                  <button 
                    className="absolute top-5 right-5 p-2 rounded-xl bg-neutral-100 dark:bg-white/5 text-neutral-500 hover:bg-neutral-200 transition-colors"
                    aria-label="Close menu"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </Dialog.Close>
                <NavContent mobile />
              </div>
            </motion.div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}

export function MobileSidebarTrigger({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="p-2 rounded-xl bg-white dark:bg-white/5 border border-neutral-200 dark:border-white/10 md:hidden"
    >
      <Menu className="h-5 w-5 text-neutral-600 dark:text-neutral-400" />
    </button>
  );
}