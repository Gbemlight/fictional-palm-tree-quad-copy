"use client";

import { Sidebar } from "@/components/dashboard/sidebar";

export default function Home() {
  return (
    <div className="flex min-h-screen bg-[#000000]/80">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-10 text-white">
        <h1 className="text-3xl font-bold mb-4">QuickPay Dashboard</h1>

        <p className="text-white/70">
          This is a preview of the dashboard layout.
        </p>

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
  );
}