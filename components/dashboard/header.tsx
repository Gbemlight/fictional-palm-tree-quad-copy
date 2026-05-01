"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as Dialog from "@radix-ui/react-dialog";
import { Bell, User, LogOut, Settings, Search, ChevronRight, ChevronLeft, Menu } from "lucide-react";
import { cn } from "@/lib/utils";

// Dummy data for notifications
const notifications = [
  { id: 1, message: "Payment received", time: "2m ago", read: false },
  { id: 2, message: "New user registered", time: "10m ago", read: false },
  { id: 3, message: "Server restarted", time: "1h ago", read: true },
  { id: 4, message: "Invoice #123 paid", time: "2h ago", read: true },
];

const user = {
  name: "Sadiq Ahmad",
  email: "sadiq@quickpay.app",
  avatar: "https://ui-avatars.com/api/?name=Sadiq+Ahmad&background=0D8ABC&color=fff",
};

function getBreadcrumbs(pathname: string) {
  if (!pathname) return [];
  const parts = pathname.split("/").filter(Boolean);
  const crumbs = parts.map((part, idx) => ({
    label: part.charAt(0).toUpperCase() + part.slice(1),
    href: "/" + parts.slice(0, idx + 1).join("/"),
  }));
  return crumbs;
}

export function DashboardHeader() {
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);
  const [headerSticky, setHeaderSticky] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Keyboard shortcut for search
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  // Sticky header effect
  useEffect(() => {
    function onScroll() {
      setHeaderSticky(window.scrollY > 8);
    }
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Focus search input when modal opens
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const displayUnreadCount = unreadCount > 99 ? "99+" : unreadCount;

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full backdrop-blur transition-all duration-300",
        headerSticky 
          ? "bg-white/80 dark:bg-neutral-900/80 shadow-lg" 
          : "bg-transparent",
        "px-4 py-2 md:px-8"
      )}
    >
      {/* Gradient bottom border line */}
      <div className="absolute bottom-0 left-0 h-px w-full bg-linear-to-r from-transparent via-primary/30 to-transparent" />

      <div className="flex items-center justify-between h-12">
        {/* Left: Breadcrumbs & Title */}
        <div className="flex items-center gap-2 min-w-0">
          <nav className="flex items-center text-sm text-neutral-500 dark:text-neutral-400 gap-1">
            <Link href="/dashboard" className="hover:text-primary transition-colors font-medium">Home</Link>
            {isMounted && getBreadcrumbs(pathname || "").map((crumb, idx, array) => (
              <React.Fragment key={crumb.href}>
                <ChevronRight className="w-4 h-4 mx-1 text-neutral-300 dark:text-neutral-600" />
                <Link href={crumb.href} className={cn("hover:text-primary transition-colors", idx === array.length - 1 && "font-semibold text-neutral-900 dark:text-white truncate max-w-30 md:max-w-xs overflow-hidden text-ellipsis")}>{crumb.label}</Link>
              </React.Fragment>
            ))}
          </nav>
        </div>

        {/* Center: Search bar (hidden on mobile) */}
        <div className="hidden md:flex flex-1 justify-center">
          <button
            className="group flex items-center gap-2 px-4 py-2 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-white/10 rounded-full shadow-sm hover:border-primary/50 transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 text-neutral-600 dark:text-neutral-200 min-w-65"
            onClick={() => setSearchOpen(true)}
            aria-label="Open search"
          >
            <Search className="w-4 h-4 text-neutral-400 group-hover:text-primary transition-colors" />
            <span className="text-neutral-400 group-hover:text-neutral-600 dark:group-hover:text-neutral-300 transition-colors">Search...</span>
            <span className="ml-auto text-[10px] font-bold text-neutral-400 bg-white dark:bg-neutral-900 rounded px-1.5 py-0.5 border border-neutral-200 dark:border-white/10">⌘K</span>
          </button>
        </div>

        {/* Right: Notification & User */}
        <div className="flex items-center gap-2">
          {/* Search icon for mobile */}
          <button
            className="md:hidden p-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400 transition-colors"
            onClick={() => setSearchOpen(true)}
            aria-label="Open search"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Notification bell */}
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button className="relative p-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400 transition-colors focus:outline-none">
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white border-2 border-white dark:border-neutral-900">
                    {displayUnreadCount}
                  </span>
                )}
              </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content align="end" sideOffset={8} className="w-80 bg-white dark:bg-neutral-900 shadow-2xl rounded-2xl p-2 border border-neutral-200 dark:border-white/10 z-50 animate-in fade-in zoom-in duration-200">
                <div className="font-bold text-neutral-900 dark:text-white px-3 py-2 text-sm">Notifications</div>
                <div className="max-h-64 overflow-y-auto scrollbar-hide">
                {notifications.length === 0 ? (
                  <div className="text-neutral-400 px-2 py-8 text-center text-sm">No notifications</div>
                ) : (
                  notifications.slice(0, 5).map((n) => (
                    <div key={n.id} className={cn("px-3 py-3 rounded-xl flex items-start gap-3 transition-colors hover:bg-neutral-50 dark:hover:bg-white/5", !n.read && "bg-primary/5") }>
                      <span className={cn("w-2 h-2 rounded-full mt-1.5 shrink-0", n.read ? "bg-neutral-200 dark:bg-neutral-700" : "bg-primary shadow-[0_0_8px_rgba(124,58,237,0.5)]")}></span>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-neutral-900 dark:text-neutral-200 truncate">{n.message}</div>
                        <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">{n.time}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
                <Link href="/settings?tab=notifications" className="block text-center text-primary text-xs font-bold py-3 hover:bg-neutral-50 dark:hover:bg-white/5 rounded-xl transition-colors mt-1">View All Notifications</Link>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>

          {/* User avatar & menu */}
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button className="ml-2 p-0.5 rounded-full border-2 border-transparent hover:border-primary/30 transition-all focus:outline-none focus:ring-2 focus:ring-primary/30 active:scale-95">
                <img src={user.avatar} alt="User avatar" className="w-8 h-8 rounded-full shadow-sm" />
              </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content align="end" sideOffset={8} className="w-56 bg-white dark:bg-neutral-900 shadow-2xl rounded-2xl p-2 border border-neutral-200 dark:border-white/10 z-50 animate-in fade-in zoom-in duration-200">
                <div className="px-3 py-3 mb-2 bg-neutral-50 dark:bg-white/5 rounded-xl">
                  <div className="font-bold text-neutral-900 dark:text-white text-sm">{user.name}</div>
                  <div className="text-[10px] font-medium text-neutral-500 truncate uppercase tracking-widest">{user.email}</div>
              </div>
              <DropdownMenu.Item asChild>
                <Link href="/settings?tab=profile" className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-white/5 hover:text-primary transition-colors outline-none cursor-pointer">
                  <User className="w-4 h-4" /> Profile
                </Link>
              </DropdownMenu.Item>
              <DropdownMenu.Item asChild>
                <Link href="/settings" className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-white/5 hover:text-primary transition-colors outline-none cursor-pointer">
                  <Settings className="w-4 h-4" /> Settings
                </Link>
              </DropdownMenu.Item>
              <DropdownMenu.Separator className="h-px bg-neutral-200 dark:bg-neutral-800 my-1 mx-2" />
              <DropdownMenu.Item asChild>
                <button className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 w-full text-left transition-colors outline-none cursor-pointer">
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </div>
      </div>

      {/* Search Modal */}
      <Dialog.Root open={searchOpen} onOpenChange={setSearchOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300" />
          <Dialog.Content 
            className="fixed left-1/2 top-[15%] z-50 w-full max-w-lg -translate-x-1/2 outline-none animate-in fade-in zoom-in-95 duration-200 px-4"
          >
            <Dialog.Title className="sr-only">Search</Dialog.Title>
            <Dialog.Description className="sr-only">Search for transactions, bills, or help.</Dialog.Description>
            
            <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 dark:border-white/10 p-4 flex flex-col items-center">
              <div className="flex justify-end w-full mb-2">
                <Dialog.Close asChild>
                  <button className="p-2 text-neutral-400 hover:text-neutral-600 dark:hover:text-white transition-colors" aria-label="Close search">
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M18 6 6 18M6 6l12 12"/></svg>
                  </button>
                </Dialog.Close>
              </div>
              
              <div className="flex items-center gap-3 mb-4 w-full px-2 py-1 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-white/10 rounded-xl focus-within:ring-2 focus-within:ring-primary/30 transition-all">
                <Search className="w-5 h-5 text-neutral-400" />
                <input
                  ref={searchInputRef}
                  className="flex-1 bg-transparent py-2 text-neutral-900 dark:text-white outline-none placeholder:text-neutral-400 text-sm"
                  placeholder="Search transactions, bills, or help..."
                  aria-label="Search"
                />
                <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-white dark:bg-neutral-900 px-1.5 font-mono text-[10px] font-medium text-neutral-400">
                  <span className="text-xs">⌘</span>K
                </kbd>
              </div>
              <div className="text-neutral-400 text-[10px] w-full text-left font-bold uppercase tracking-widest px-1">Quick results</div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </header>
  );
}
