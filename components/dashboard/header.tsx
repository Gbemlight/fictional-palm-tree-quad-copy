import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
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
  const parts = pathname.split("/").filter(Boolean);
  const crumbs = parts.map((part, idx) => ({
    label: part.charAt(0).toUpperCase() + part.slice(1),
    href: "/" + parts.slice(0, idx + 1).join("/"),
  }));
  return crumbs;
}

function getPageTitle(pathname: string) {
  const crumbs = getBreadcrumbs(pathname);
  if (crumbs.length === 0) return "Dashboard";
  return crumbs[crumbs.length - 1].label;
}

export function DashboardHeader() {
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);
  const [headerSticky, setHeaderSticky] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

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

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full backdrop-blur supports-[backdrop-filter]:bg-[#18181b]/80 border-b border-transparent",
        headerSticky && "bg-[#23232a]/90 border-b border-cyan-400/20",
        "transition-colors duration-200 shadow-lg"
      )}
      style={{ borderImage: "linear-gradient(to right, #6366f1, #06b6d4) 1" }}
    >
      <div className="flex items-center justify-between px-4 py-2 md:px-8">
        {/* Left: Breadcrumbs & Title */}
        <div className="flex items-center gap-2 min-w-0">
          <nav className="flex items-center text-sm text-gray-400 gap-1">
            <Link href="/" className="hover:text-cyan-400 font-medium">Home</Link>
            {getBreadcrumbs(pathname).map((crumb, idx) => (
              <React.Fragment key={crumb.href}>
                <ChevronRight className="w-4 h-4 mx-1 text-gray-600" />
                <Link href={crumb.href} className={cn("hover:text-cyan-400", idx === getBreadcrumbs(pathname).length - 1 && "font-semibold text-white truncate max-w-[120px] md:max-w-xs overflow-hidden text-ellipsis")}>{crumb.label}</Link>
              </React.Fragment>
            ))}
          </nav>
          <span className="ml-4 text-lg font-bold text-white truncate max-w-[160px] md:max-w-md">{getPageTitle(pathname)}</span>
        </div>

        {/* Center: Search bar (hidden on mobile) */}
        <div className="hidden md:flex flex-1 justify-center">
          <button
            className="group flex items-center gap-2 px-4 py-2 bg-[#23232a] border border-cyan-400/20 rounded-full shadow hover:bg-[#23232a]/80 focus:outline-none focus:ring-2 focus:ring-cyan-400/30 text-gray-200 min-w-[260px]"
            onClick={() => setSearchOpen(true)}
            aria-label="Open search"
          >
            <Search className="w-5 h-5 text-gray-400 group-hover:text-cyan-400" />
            <span className="text-gray-400 group-hover:text-cyan-400">Search...</span>
            <span className="ml-auto text-xs text-gray-400 bg-[#18181b] rounded px-2 py-0.5 border border-cyan-400/20">⌘K</span>
          </button>
        </div>

        {/* Right: Notification & User */}
        <div className="flex items-center gap-2">
          {/* Search icon for mobile */}
          <button
            className="md:hidden p-2 rounded-full hover:bg-[#23232a]/80 text-gray-200"
            onClick={() => setSearchOpen(true)}
            aria-label="Open search"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Notification bell */}
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button className="relative p-2 rounded-full hover:bg-[#23232a]/80 text-gray-200 focus:outline-none">
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[20px] flex items-center justify-center font-bold">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content align="end" className="w-80 bg-[#23232a] shadow-lg rounded-xl p-2 mt-2 border border-cyan-400/10">
              <div className="font-semibold text-white px-2 py-1">Notifications</div>
              <div className="divide-y divide-gray-100 max-h-60 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="text-gray-400 px-2 py-4 text-center">No notifications</div>
                ) : (
                  notifications.slice(0, 5).map((n) => (
                    <div key={n.id} className={cn("px-2 py-2 flex items-start gap-2", !n.read && "bg-cyan-900/30") }>
                      <span className={cn("w-2 h-2 rounded-full mt-2", n.read ? "bg-gray-700" : "bg-cyan-400")}></span>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-white truncate">{n.message}</div>
                        <div className="text-xs text-gray-400">{n.time}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <Link href="/notifications" className="block text-center text-cyan-400 font-medium py-2 hover:underline">View All</Link>
            </DropdownMenu.Content>
          </DropdownMenu.Root>

          {/* User avatar & menu */}
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button className="ml-2 p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/30">
                <img src={user.avatar} alt="User avatar" className="w-8 h-8 rounded-full border border-gray-200" />
              </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content align="end" className="w-48 bg-[#23232a] shadow-lg rounded-xl p-2 mt-2 border border-cyan-400/10">
              <div className="px-2 py-2 border-b border-cyan-400/10">
                <div className="font-semibold text-white">{user.name}</div>
                <div className="text-xs text-gray-400 truncate">{user.email}</div>
              </div>
              <DropdownMenu.Item asChild>
                <Link href="/profile" className="flex items-center gap-2 px-2 py-2 rounded hover:bg-cyan-900/30 text-white">
                  <User className="w-4 h-4 text-cyan-400" /> Profile
                </Link>
              </DropdownMenu.Item>
              <DropdownMenu.Item asChild>
                <Link href="/settings" className="flex items-center gap-2 px-2 py-2 rounded hover:bg-cyan-900/30 text-white">
                  <Settings className="w-4 h-4 text-cyan-400" /> Settings
                </Link>
              </DropdownMenu.Item>
              <DropdownMenu.Separator className="my-1" />
              <DropdownMenu.Item asChild>
                <button className="flex items-center gap-2 px-2 py-2 rounded hover:bg-cyan-900/30 w-full text-left text-white">
                  <LogOut className="w-4 h-4 text-cyan-400" /> Logout
                </button>
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        </div>
      </div>

      {/* Search Modal */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-center"
          style={{ paddingTop: '16px' }}
          onClick={e => {
            if (e.target === e.currentTarget) setSearchOpen(false);
          }}
        >
          <div
            className="relative w-full max-w-lg p-0"
            style={{ position: 'relative', marginTop: '8px' }}
          >
            <div className="bg-[#18181b] rounded-2xl shadow-2xl border border-cyan-400/10 p-4 w-full flex flex-col justify-center items-center"
                 style={{ boxSizing: 'border-box', position: 'relative' }}>
              <div className="flex justify-end w-full mb-2">
                <button
                  className="p-2 text-gray-400 hover:text-cyan-400 z-20"
                  onClick={() => setSearchOpen(false)}
                  aria-label="Close search"
                >
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M18 6 6 18M6 6l12 12"/></svg>
                </button>
              </div>
              <div className="flex items-center gap-2 mb-4 w-full mt-2">
                <Search className="w-5 h-5 text-cyan-400" />
                <input
                  ref={searchInputRef}
                  className="flex-1 px-3 py-2 bg-[#23232a] text-white border border-cyan-400/10 rounded focus:outline-none focus:ring-2 focus:ring-cyan-400/30 placeholder:text-gray-400"
                  placeholder="Search..."
                  aria-label="Search"
                />
                <span className="ml-2 text-xs text-cyan-400 bg-[#18181b] rounded px-2 py-0.5 border border-cyan-400/20">⌘K</span>
              </div>
              <div className="text-gray-400 text-sm w-full text-left">Type to search (demo only)</div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
