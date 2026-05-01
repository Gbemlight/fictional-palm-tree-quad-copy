"use client";

import * as Select from "@radix-ui/react-select";
import { useEffect, useState } from "react";
import { ChevronDown, Sun, Moon, Monitor, RotateCcw, Languages } from "lucide-react";

// ---------------- TYPES ----------------
type Preferences = {
  theme: "light" | "dark" | "auto";
  language: string;
  currency: string;
  format: "us" | "eu";
  service: string;
};

// ---------------- DEFAULT ----------------
const defaultPrefs: Preferences = {
  theme: "dark",
  language: "English",
  currency: "NGN (₦)",
  format: "us",
  service: "Data",
};

// ---------------- UTILS ----------------
const applyTheme = (theme: Preferences["theme"]) => {
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

// ---------------- COMPONENT ----------------
export default function PreferencesTab() {
  const [prefs, setPrefs] = useState<Preferences>(defaultPrefs);

  // 1. Initial Load & Multi-tab Sync
  useEffect(() => {
    const handleSync = () => {
      const saved = localStorage.getItem("prefs");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed && typeof parsed === "object") {
            setPrefs(parsed);
            applyTheme(parsed.theme);
          }
        } catch (e) {
          console.error("Failed to sync preferences", e);
        }
      }
    };

    handleSync();
    window.addEventListener("storage", handleSync);
    return () => window.removeEventListener("storage", handleSync);
  }, []);

  // 2. Real-time System Theme Listener (for "Auto" mode)
  useEffect(() => {
    if (prefs.theme !== "auto") return;
    
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => applyTheme("auto");
    
    // Use addEventListener for modern browsers
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [prefs.theme]);

  // Save + Apply instantly
  const update = <K extends keyof Preferences>(key: K, value: Preferences[K]) => {
    const updated = { ...prefs, [key]: value };
    setPrefs(updated);
    localStorage.setItem("prefs", JSON.stringify(updated));
    if (key === "theme") applyTheme(value as Preferences["theme"]);
  };

  // Reset
  const reset = () => {
    setPrefs(defaultPrefs);
    localStorage.setItem("prefs", JSON.stringify(defaultPrefs));
    applyTheme(defaultPrefs.theme);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      {/* ---------------- THEME ---------------- */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">App Appearance</h3>

        <div className="grid grid-cols-3 gap-4">
          {(["light", "dark", "auto"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => update("theme", t)}
              className={`
                group relative flex flex-col cursor-pointer rounded-2xl border-2 transition-all duration-300 overflow-hidden outline-none focus:ring-2 focus:ring-purple-500/50
                ${prefs.theme === t
                  ? "border-purple-500 bg-purple-500/5 ring-4 ring-purple-500/10"
                  : "border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900/50 hover:border-neutral-300 dark:hover:border-neutral-700"}
              `}
            >
              {/* Thumbnail Preview */}
              <div className={`h-20 w-full p-2 flex flex-col gap-1.5 ${
                t === "light" ? "bg-white" : t === "dark" ? "bg-black" : "bg-linear-to-br from-white to-black"
              }`}>
                <div className={`h-2 w-1/2 rounded-full ${t === "light" ? "bg-neutral-200" : "bg-neutral-800"}`} />
                <div className="grid grid-cols-2 gap-1.5">
                  <div className={`h-8 rounded-lg ${t === "light" ? "bg-neutral-100" : "bg-neutral-900"}`} />
                  <div className={`h-8 rounded-lg ${t === "light" ? "bg-neutral-100" : "bg-neutral-900"}`} />
                </div>
              </div>
              
              {/* Label */}
              <div className="p-3 w-full flex items-center justify-between bg-white/5 dark:bg-black/20">
                <span className={`text-xs font-bold uppercase tracking-wider transition-colors ${
                  prefs.theme === t ? "text-purple-600 dark:text-purple-400" : "text-neutral-500 dark:text-neutral-400"
                }`}>
                  {t}
                </span>
                {t === "light" && <Sun size={14} className={prefs.theme === t ? "text-purple-600 dark:text-purple-400" : "text-neutral-500"} />}
                {t === "dark" && <Moon size={14} className={prefs.theme === t ? "text-purple-600 dark:text-purple-400" : "text-neutral-500"} />}
                {t === "auto" && <Monitor size={14} className={prefs.theme === t ? "text-purple-600 dark:text-purple-400" : "text-neutral-500"} />}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="h-px bg-neutral-200 dark:bg-neutral-800/50" />

      {/* ---------------- LOCALIZATION ---------------- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <SelectField
          label="Language"
          value={prefs.language}
          onChange={(v) => update("language", v)}
          options={["English", "French", "Yoruba", "Hausa", "Igbo"]}
          description="Visual updates (dummy translations)"
        />

        <SelectField
          label="Currency"
          value={prefs.currency}
          onChange={(v) => update("currency", v)}
          options={["NGN (₦)", "USD ($)", "EUR (€)"]}
          description="Updates all money displays"
        />
      </div>

      {/* ---------------- NUMBER FORMAT ---------------- */}
      <div className="space-y-4">
        <div className="space-y-1">
          <h4 className="text-sm font-medium text-neutral-900 dark:text-white">Number Localization</h4>
          <p className="text-xs text-neutral-500">Choose how numbers and decimals are displayed.</p>
        </div>
        <div className="flex p-1 bg-neutral-100 dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 w-fit">
          {(["us", "eu"] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => update("format", f)}
              className={`
                px-6 py-2 rounded-lg text-sm font-medium transition-all
                ${prefs.format === f
                  ? "bg-purple-600 text-white shadow-lg shadow-purple-900/20"
                  : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white"}
              `}
            >
              {f === "us" ? "1,234.56" : "1.234,56"}
            </button>
          ))}
        </div>
      </div>

      <div className="h-px bg-neutral-200 dark:bg-neutral-800/50" />

      {/* ---------------- SERVICE ---------------- */}
      <SelectField
        label="Default Quick Action"
        value={prefs.service}
        onChange={(v) => update("service", v)}
        options={["Data", "Airtime", "Bills"]}
        description="Sets priority on the homepage"
      />

      {/* ---------------- RESET ---------------- */}
      <div className="pt-4 flex flex-col items-start gap-4">
        <div className="flex items-center gap-2 p-3 rounded-xl bg-purple-500/5 border border-purple-500/20">
          <Languages size={16} className="text-purple-400" />
          <p className="text-xs text-neutral-400">
             Current settings for <span className="text-purple-400 font-medium">{prefs.language}</span> & <span className="text-purple-400 font-medium">{prefs.currency}</span> are active.
          </p>
        </div>

        <button
          onClick={reset}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-400/5 rounded-lg transition-all"
        >
          <RotateCcw size={14} />
          Reset to Defaults
        </button>
      </div>
    </div>
  );
}

// ---------------- REUSABLE SELECT ----------------
function SelectField({
  label,
  value,
  onChange,
  options,
  description
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  description?: string;
}) {
  return (
    <div className="space-y-2">
      <div className="space-y-1">
        <h4 className="text-sm font-medium text-neutral-900 dark:text-white">{label}</h4>
        {description && <p className="text-xs text-neutral-500">{description}</p>}
      </div>

      <Select.Root value={value} onValueChange={onChange}>
        <Select.Trigger className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-3 rounded-xl flex justify-between items-center outline-none focus:ring-2 focus:ring-purple-500/50 transition-all text-sm text-neutral-700 dark:text-neutral-300">
          <Select.Value />
          <Select.Icon>
            <ChevronDown size={16} className="text-neutral-500" />
          </Select.Icon>
        </Select.Trigger>

        <Select.Portal>
          <Select.Content
            className="z-50 min-w-(--radix-select-trigger-width) bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200"
            position="popper"
            sideOffset={5}
          >
            <Select.Viewport className="p-1">
              {options.map((opt) => (
                <Select.Item
                  key={opt}
                  value={opt}
                  className="px-3 py-3 text-sm text-neutral-600 dark:text-neutral-300 rounded-xl mx-1 my-0.5 cursor-pointer outline-none data-highlighted:bg-purple-600 data-highlighted:text-white transition-colors"
                >
                  <Select.ItemText>{opt}</Select.ItemText>
                </Select.Item>
              ))}
            </Select.Viewport>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    </div>
  );
}