"use client";

import React, { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ConfirmationModal } from "../../../components/payment/confirmation-modal";
import { dataPlans, mockUser } from "../../../lib/dummy-data";

export default function BuyDataPaymentPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const planId = searchParams.get("plan") || "data_003";
  const phone = searchParams.get("phone") || "08012345678";
  const plan = dataPlans.find(p => p.id === planId) || dataPlans[2];
  const [open, setOpen] = useState(true);

  // Dummy: always MTN for now
  const network = plan.provider;
  const validity = plan.name.match(/(\d+\s*Days)/)?.[1] || "30 Days";

  async function handleConfirm() {
    // Simulate payment
    await new Promise(res => setTimeout(res, 1200));
    // Redirect after short delay
    setTimeout(() => router.push("/dashboard?tab=transactions"), 1200);
    return true;
  }

  return (
    <div className="min-h-screen bg-[#18181b] text-white flex items-center justify-center">
      <ConfirmationModal
        open={open}
        onOpenChange={setOpen}
        summary={{
          network,
          plan: plan.name.split("-")[0].trim(),
          phone,
          amount: plan.price,
          validity,
          walletBalance: mockUser.walletBalance,
        }}
        onConfirm={handleConfirm}
      />
    </div>
  );
}
