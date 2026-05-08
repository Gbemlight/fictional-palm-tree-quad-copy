"use client";
import React, { useEffect } from "react";

// Global utility to apply theme to document root
const applyTheme = (theme: string) => {
  if (typeof window === "undefined") return;
  const root = document.documentElement;
  
  if (theme === "dark") {
    root.classList.add("dark");
  } else if (theme === "light") {
    root.classList.remove("dark");
  } else {
    // Handle Auto (System)
    const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    root.classList.toggle("dark", systemDark);
  }
};

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // 1. Initial Load: Apply theme from localStorage or default
    const syncTheme = () => {
      const saved = localStorage.getItem("prefs");
      let theme = "dark"; // Default
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed?.theme) theme = parsed.theme;
        } catch {}
      }
      applyTheme(theme);
    };

    syncTheme();

    // 2. Cross-tab Sync: Listen for storage changes in other tabs
    window.addEventListener("storage", syncTheme);

    // 3. System Sync: Listen for OS theme changes if user selected 'auto'
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemChange = () => {
      const saved = localStorage.getItem("prefs");
      try {
        const parsed = JSON.parse(saved || "{}");
        if (parsed.theme === "auto") applyTheme("auto");
      } catch {}
    };

    mediaQuery.addEventListener("change", handleSystemChange);

    return () => {
      window.removeEventListener("storage", syncTheme);
      mediaQuery.removeEventListener("change", handleSystemChange);
    };
  }, []);

  return (
    <>{children}</>
  );
}