"use client";

import * as Tabs from "@radix-ui/react-tabs";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import {
  User,
  Shield,
  Bell,
  Settings as SettingsIcon,
  Info,
} from "lucide-react";
import ProfileForm from "./ProfileForm";
import SecurityTab from "./SecurityTab";
import NotificationsTab from "./NotificationsTab"
import PreferencesTab from "./PreferencesTab"

const tabs = [
  { value: "profile", label: "Profile", icon: User },
  { value: "security", label: "Security", icon: Shield },
  { value: "notifications", label: "Notifications", icon: Bell },
  { value: "preferences", label: "Preferences", icon: SettingsIcon },
  { value: "about", label: "About", icon: Info },
];

export default function SettingsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center text-white">Loading...</div>}>
      <SettingsContent />
    </Suspense>
  );
}

function SettingsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeTab = searchParams.get("tab") || "profile";
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const handleTabChange = (value: string) => router.push(`/settings?tab=${value}`);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-white text-black dark:bg-black dark:text-white flex">
      <Tabs.Root
        value={activeTab}
        onValueChange={handleTabChange}
        className="flex w-full"
      >
        {/* SIDEBAR */}
        <Tabs.List className="sticky top-0 h-screen pt-14 hidden md:flex flex-col w-64 gap-2 border-r border-neutral-200 dark:border-neutral-900 bg-neutral-50/80 dark:bg-black/80 backdrop-blur-xl shrink-0 overflow-y-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.value;

            return (
              <Tabs.Trigger
                key={tab.value}
                value={tab.value}
                className={`
                  relative flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm transition-all duration-300 group
                 ${
                   isActive 
                     ? "bg-white dark:bg-neutral-900 text-purple-600 dark:text-purple-400 shadow-sm"
                     : "text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900 hover:text-neutral-900 dark:hover:text-white"
                 }
                `}
              >
                {/* LEFT ACTIVE BAR */}
                <span
                  className={`
                    absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-full transition-all
                    ${
                      isActive // Retain existing gradient for active bar
                        ? "bg-linear-to-b from-purple-500 to-blue-500 opacity-100"
                        : "opacity-0"
                    }
                  `}
                />

                <Icon
                  size={18}
                  className={`transition ${
                    isActive ? "text-purple-600 dark:text-purple-400" : "text-neutral-400 group-hover:text-neutral-900 dark:text-neutral-500 dark:group-hover:text-white"
                  }`}
                />

                {tab.label}
              </Tabs.Trigger>
            );
          })}
        </Tabs.List>

        {/* MAIN */}
        <div className="flex-1 flex flex-col px-4 pt-6 md:pt-0">
          {/* MOBILE DROPDOWN (TOP) */}
          <div className="md:hidden w-full max-w-sm mx-auto mb-6">
            <select
              value={activeTab}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleTabChange(e.target.value)}
              className="w-full bg-white dark:bg-neutral-900 text-black dark:text-white border border-neutral-300 dark:border-neutral-800 rounded-lg p-3 text-sm shadow-sm focus:ring-2 focus:ring-purple-500 outline-none"
            >
              {tabs.map((tab) => (
                <option key={tab.value} value={tab.value}>
                  {tab.label}
                </option>
              ))}
            </select>
          </div>

          {/* CENTERED CONTENT */}
          <div className="flex-1 flex items-center justify-center">
            <div className="relative w-full max-w-2xl py-8">
              {tabs.map((tab) => (
                <Tabs.Content
                  key={tab.value}
                  value={tab.value}
                  className={`
            transition-all duration-500 ease-in-out
            data-state-inactive:opacity-0 data-state-inactive:translate-y-4 data-state-inactive:pointer-events-none
            data-state-active:opacity-100 data-state-active:translate-y-0
          `}
                >
                  <div className="relative rounded-3xl p-6 md:p-10 border border-neutral-200 dark:border-white/10 bg-white dark:bg-white/5 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
                    {/* Glow */}

                    <h2 className="text-2xl font-bold mb-6 text-neutral-900 dark:text-white">
                      {tab.value === "profile" ? "Profile" : tab.value === "security" ? "Settings" : `${tab.label} Settings`}
                    </h2>

                    <div className="text-neutral-600 dark:text-neutral-300">
                     {tab.value === "profile" && <ProfileForm />}
                      {tab.value === "security" && <SecurityTab />}
                      {tab.value === "notifications" && <NotificationsTab />}
                      {tab.value === "preferences" && <PreferencesTab />}
                      {tab.value === "about" &&
                        "Learn more about this platform."}
                    </div>
                  </div>
                </Tabs.Content>
              ))}
            </div>
          </div>
        </div>
      </Tabs.Root>
    </div>
  );
}
