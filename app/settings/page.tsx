"use client";

import * as Tabs from "@radix-ui/react-tabs";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import {
  User,
  Shield,
  Bell,
  Settings as SettingsIcon,
  Info,
  ChevronLeft,
} from "lucide-react";
import ProfileForm from "./ProfileForm";
import SecurityTab from "./SecurityTab";
import NotificationsTab from "./NotificationsTab"
import PreferencesTab from "./PreferencesTab"
import DashboardLayout from "@/components/dashboard/layout";

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

  const handleTabChange = (value: string) => router.push(`/settings?tab=${value}`);

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-10 pb-20">
        {/* Header Section */}
        <header className="space-y-4">
          <Link 
            href="/dashboard" 
            className="group inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-neutral-400 hover:text-indigo-600 transition-colors"
          >
            <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Dashboard
          </Link>
          
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white md:text-4xl">
              Settings
            </h1>
            <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
              Configure your profile, security, and application preferences.
            </p>
          </div>
        </header>

      <Tabs.Root
        value={activeTab}
        onValueChange={handleTabChange}
        className="flex flex-col lg:flex-row gap-8 lg:items-start"
      >
        {/* Tab List: Mobile (Horizontal) & Desktop (Vertical) */}
        <Tabs.List className="flex lg:flex-col overflow-x-auto no-scrollbar lg:overflow-visible gap-2 p-1 lg:w-64 bg-neutral-100/50 dark:bg-white/5 rounded-3xl lg:rounded-4xl border border-neutral-200 dark:border-white/10 shrink-0">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.value;

            return (
              <Tabs.Trigger
                key={tab.value}
                value={tab.value}
                className="relative flex items-center gap-3 px-5 py-3.5 lg:py-4 rounded-2xl lg:rounded-3xl text-sm font-bold transition-all duration-300 group whitespace-nowrap lg:whitespace-normal flex-1 lg:flex-none justify-center lg:justify-start data-[state=active]:bg-linear-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-violet-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-indigo-500/20 text-neutral-500 dark:text-neutral-400 hover:bg-white dark:hover:bg-white/10"
              >
                <Icon
                  size={18}
                  className={`transition-colors ${
                    isActive ? "text-white" : "text-neutral-400 group-hover:text-indigo-500"
                  }`}
                />
                {tab.label}
              </Tabs.Trigger>
            );
          })}
        </Tabs.List>

        {/* Main Content Area */}
        <div className="flex-1">
          <div className="relative w-full">
              {tabs.map((tab) => (
                <Tabs.Content
                  key={tab.value}
                  value={tab.value}
                  className={`
                    transition-all duration-500 ease-in-out outline-none
                    data-state-inactive:opacity-0 data-state-inactive:translate-y-4 data-state-inactive:pointer-events-none
                    data-state-active:opacity-100 data-state-active:translate-y-0
                  `}
                >
                  <div className="relative rounded-4xl p-6 md:p-10 border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900 shadow-xl shadow-neutral-200/50 dark:shadow-none">
                    <h2 className="text-2xl font-bold mb-8 text-neutral-900 dark:text-white flex items-center gap-3">
                      <div className="h-10 w-10 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-500/20">
                        <tab.icon size={20} />
                      </div>
                      {tab.value === "profile" 
                        ? "Personal Information" 
                        : tab.value === "security" 
                        ? "Security & Privacy" 
                        : `${tab.label} Settings`}
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
      </Tabs.Root>
      </div>
    </DashboardLayout>
  );
}
