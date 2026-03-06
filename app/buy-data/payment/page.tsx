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
    // Redirect to success page with transaction details
    setTimeout(() => {
      router.push(`/buy-data/success?plan=${plan.id}&phone=${phone}&amount=${plan.price}&network=${network}&validity=${encodeURIComponent(validity)}&ref=QKP-982134&date=2026-02-20&status=success`);
    }, 1200);
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
