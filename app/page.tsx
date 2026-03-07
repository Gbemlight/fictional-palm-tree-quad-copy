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

    <main className="min-h-screen bg-[#1a1a1a] p-10">
      <div className="mx-auto max-w-6xl space-y-12">

        <h1 className="text-4xl font-bold text-white text-center">
          Empty State Component Demo
        </h1>

        {/* Transactions */}
        <EmptyState
          icon={<Receipt className="h-10 w-10 text-white" />}
          title="No transactions yet"
          description="Once you start buying data, airtime, or paying bills, your transactions will appear here."
          cta={<Button>Make Your First Transaction</Button>}
        />

        {/* Beneficiaries */}
        <EmptyState
          icon={<Users className="h-10 w-10 text-white" />}
          title="No saved beneficiaries"
          description="Save frequently used numbers to make future payments faster."
          cta={<Button>Add Beneficiary</Button>}
        />

        {/* Wallet */}
        <EmptyState
          icon={<Wallet className="h-10 w-10 text-white" />}
          title="Your wallet is empty"
          description="Add funds to your wallet to start buying data, airtime, and paying bills."
          cta={<Button>Add Money</Button>}
        />

        {/* Cards */}
        <EmptyState
          icon={<CreditCard className="h-10 w-10 text-white" />}
          title="No payment methods added"
          description="Add a payment method to make transactions easier."
          cta={<Button>Add Payment Method</Button>}
        />

      </div>
    </main>
  );
}