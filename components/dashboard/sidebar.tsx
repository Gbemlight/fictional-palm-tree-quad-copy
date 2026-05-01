"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as Dialog from "@radix-ui/react-dialog";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Smartphone,
  Phone,
  Receipt,
  ArrowLeftRight,
  Wallet,
  Settings,
  HelpCircle,
  Menu,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

type NavItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
};

const NAV: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
  { label: "Buy Data", href: "/buy-data", icon: <Smartphone className="h-5 w-5" /> },
  { label: "Buy Airtime", href: "/buy-airtime", icon: <Phone className="h-5 w-5" /> },
  { label: "Pay Bills", href: "/pay-bills", icon: <Receipt className="h-5 w-5" /> },
  { label: "Transactions", href: "/transactions", icon: <ArrowLeftRight className="h-5 w-5" /> },
  { label: "Wallet", href: "/wallet", icon: <Wallet className="h-5 w-5" /> },
  { label: "Settings", href: "/settings", icon: <Settings className="h-5 w-5" /> },
  { label: "Help Center", href: "/help", icon: <HelpCircle className="h-5 w-5" /> },
];

const STORAGE_KEY = "quickpay_sidebar_collapsed";

type SidebarUser = {
  name: string;
  email: string;
  avatarUrl?: string;
};

export function Sidebar({
  user = { name: "Sadiq Ahmad", email: "sadiq@quickpay.app" },
}: {
  user?: SidebarUser;
}) {
  const pathname = usePathname();

  const [collapsed, setCollapsed] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  // Persist collapsed state
  React.useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "1") setCollapsed(true);
    } catch (e) {
      console.warn("Failed to load sidebar state", e);
    }
  }, []);

  React.useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, collapsed ? "1" : "0");
    } catch (e) {
      console.warn("Failed to save sidebar state", e);
    }
  }, [collapsed]);

  // Sidebar Inner Content - Shared between Mobile and Desktop
  const SidebarInner = ({ onNavigate }: { onNavigate?: () => void }) => (
    <aside
      className={cn(
        "relative h-full transition-all duration-300",
        "bg-white/95 dark:bg-neutral-900/95 backdrop-blur-2xl border-r border-neutral-200 dark:border-white/10",
        "text-neutral-900 dark:text-white shadow-xl overflow-hidden",
        collapsed ? "w-20" : "w-64"
      )}
      aria-label="Sidebar"
    >
      {/* Gradient border on right edge */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-0 h-full w-0.5 bg-linear-to-b from-primary via-secondary to-accent opacity-50 dark:opacity-80"
      />

      <div className="flex h-full flex-col">
        {/* Top branding */}
        <div className={cn("flex items-center justify-between px-4 py-4", collapsed && "px-3")}>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-linear-to-br from-primary to-secondary shadow-lg shadow-primary/20" />
            {!collapsed && (
              <div className="leading-tight">
                <div className="text-lg font-black tracking-tighter bg-linear-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                  QuickPay
                </div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 dark:text-white/40">Hub</div>
              </div>
            )}
          </div>

          {/* Collapse toggle */}
          <button
            type="button"
            className={cn(
              "hidden md:inline-flex items-center justify-center rounded-xl p-2",
              "hover:bg-neutral-100 dark:hover:bg-white/10 transition-colors"
            )}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            onClick={() => setCollapsed((v) => !v)}
          >
            {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </button>
        </div>

        {/* Nav */}
        <nav className={cn("flex-1 px-3 py-2", collapsed && "px-2")} aria-label="Main navigation">
          <ul className="space-y-2">
            {NAV.map((item) => {
              const active = pathname === item.href || pathname?.startsWith(item.href + "/");

              return (
                <li key={item.href}>
                  <motion.div whileHover={{ scale: 1.02, filter: "drop-shadow(0 0 8px rgba(124, 58, 237, 0.4))" }} transition={{ duration: 0.2 }}>
                    <Link
                      href={item.href}
                      onClick={onNavigate}
                      className={cn(
                        "group flex items-center gap-3 rounded-xl px-3 py-3 outline-none",
                        "transition-all duration-300",
                        "focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-0",
                        active
                          ? "bg-linear-to-br from-primary to-secondary text-white shadow-lg shadow-primary/30"
                          : "text-neutral-500 dark:text-white/60 hover:bg-neutral-100 dark:hover:bg-white/10 hover:text-neutral-900 dark:hover:text-white"
                      )}
                      aria-current={active ? "page" : undefined}
                    >
                      <span
                        className={cn(
                          "transition-colors",
                          active ? "text-white" : "text-white/70 group-hover:text-white"
                        )}
                      >
                        {item.icon}
                      </span>

                      {!collapsed && (
                        <span className={cn("font-medium", active && "font-bold")}>
                          {item.label}
                        </span>
                      )}
                    </Link>
                  </motion.div>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User section */}
        <div className={cn("mt-auto px-4 py-4", collapsed && "px-3")}>
          <div className={cn("flex items-center gap-3 rounded-2xl bg-neutral-100 dark:bg-white/5 border border-neutral-200 dark:border-white/10 p-3 shadow-sm")}>
            <div className="h-10 w-10 overflow-hidden rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/20">
              {/* simple avatar */}
              {user.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={user.avatarUrl} alt={user.name} className="h-full w-full object-cover" />
              ) : (
                <span className="text-sm font-bold text-primary dark:text-white/80">
                  {user.name.split(" ").map((s) => s[0]).slice(0, 2).join("")}
                </span>
              )}
            </div>

            {!collapsed && (
              <div className="min-w-0">
                <div className="truncate text-sm font-bold text-neutral-900 dark:text-white">{user.name}</div>
                <div className="truncate text-[10px] font-medium text-neutral-500 dark:text-white/50">{user.email}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );

  return (
    <>
      {/* Mobile top-left hamburger */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="inline-flex items-center justify-center rounded-xl bg-white/90 dark:bg-neutral-900/90 backdrop-blur border border-neutral-200 dark:border-white/15 p-3 text-neutral-900 dark:text-white shadow-xl"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:block h-screen sticky top-0">
        <SidebarInner />
      </div>

      {/* Mobile Drawer (Radix Dialog) */}
      <Dialog.Root open={mobileOpen} onOpenChange={setMobileOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" />
          <Dialog.Content className="fixed inset-y-0 left-0 z-50 outline-none">
            <Dialog.Title className="sr-only">Navigation Menu</Dialog.Title>
            <Dialog.Description className="sr-only">QuickPay Hub navigation links for mobile devices.</Dialog.Description>
            
            <motion.div
              initial={{ x: -40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -40, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 24 }}
              className="h-full w-[86%] max-w-[320px]"
            >
              <div className="h-full">
                <div className="absolute top-4 right-4 z-50">
                  <Dialog.Close asChild>
                    <button
                      className="rounded-xl bg-neutral-100 dark:bg-white/10 backdrop-blur border border-neutral-200 dark:border-white/15 p-3 text-neutral-900 dark:text-white"
                      aria-label="Close menu"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </Dialog.Close>
                </div>

                <SidebarInner onNavigate={() => setMobileOpen(false)} />
              </div>
            </motion.div>

            {/* click outside closes */}
            <Dialog.Close asChild>
              <button
                aria-label="Close drawer overlay"
                className="fixed inset-0 -z-10"
              />
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}