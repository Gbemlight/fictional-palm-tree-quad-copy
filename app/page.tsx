"use client";

import { Sidebar } from "@/components/dashboard/sidebar";
import { DashboardHeader } from "@/components/dashboard/header";

import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { Wallet, Users, Receipt, CreditCard } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen bg-[#000000]/80">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        <DashboardHeader />
        <main className="flex-1 p-10 text-white">
          <div className="mt-8 grid grid-cols-3 gap-6">
            <div className="rounded-2xl bg-white/10 backdrop-blur border border-white/15 p-6">
              Card 1
            </div>

            <div className="rounded-2xl bg-white/10 backdrop-blur border border-white/15 p-6">
              Card 2
            </div>

            <div className="rounded-2xl bg-white/10 backdrop-blur border border-white/15 p-6">
              Card 3
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}