"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { AddMoneyModal } from "@/components/wallet/add-money-modal";

export default function Page() {
  const [open, setOpen] = React.useState(false);
  const [balance, setBalance] = React.useState(125000);

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#0f0f23] p-10">
      <div className="rounded-3xl border border-white/15 bg-white/10 p-8 text-white backdrop-blur-xl">
        <p className="mb-4 text-xl font-semibold">Wallet Balance</p>
        <p className="mb-6 text-4xl font-bold">₦{balance.toLocaleString()}</p>

        <Button onClick={() => setOpen(true)}>Add Money</Button>

        <AddMoneyModal
          open={open}
          onOpenChange={setOpen}
          currentBalance={balance}
          onSuccess={(amount) => setBalance((prev) => prev + amount)}
        />
      </div>
    </main>
  );
}