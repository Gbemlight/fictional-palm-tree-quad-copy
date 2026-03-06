"use client";

import React, { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";
import { mockTransactions, dataPlans, mockUser } from "../../../lib/dummy-data";
export default function BuyDataSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Get transaction details from URL params
  const ref = searchParams.get("ref") || "QKP-982134";
  const network = searchParams.get("network") || "MTN";
  const planName = searchParams.get("plan") ? (dataPlans.find(p => p.id === searchParams.get("plan"))?.name || "2GB - 30 Days") : "2GB - 30 Days";
  const phone = searchParams.get("phone") || "08012345678";
  const amount = searchParams.get("amount") || "1000";
  const validity = searchParams.get("validity") || "30 Days";
  const date = searchParams.get("date") || "2026-02-20";
  const status = searchParams.get("status") || "success";

  useEffect(() => {
    // Use window for confetti, always center of viewport
    import("canvas-confetti").then(mod => {
      const confetti = mod.default || mod;
      if (typeof window !== "undefined" && typeof confetti === "function") {
        confetti({
          particleCount: 180,
          spread: 120,
          startVelocity: 50,
          origin: { x: 0.5, y: 0.5 },
          scalar: 1.2,
          zIndex: 9999
        });
      }
    }).catch(() => {});
  }, []);

  function handleDownloadReceipt() {
    // Dummy: just alert or navigate
    alert("Receipt download coming soon!");
  }

  function handleShare() {
    // Share the current URL with all transaction details
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    alert("Transaction link copied to clipboard!");
  }

  return (
    <div className="min-h-screen bg-[#18181b] text-white flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="flex flex-col items-center mb-4 z-50"
      >
        <CheckCircleIcon className="w-16 h-16 text-green-400 drop-shadow-lg" />
        <h1 className="text-2xl font-bold mt-2 mb-1">Purchase Successful!</h1>
      </motion.div>
      <div className="bg-[#23232a] rounded-xl p-4 w-full max-w-sm shadow-lg mb-6">
        <div className="mb-2 flex justify-between text-sm text-white/70">
          <span>Reference ID</span>
          <span className="font-mono text-white">{ref}</span>
        </div>
        <div className="mb-2 flex justify-between text-sm text-white/70">
          <span>Network</span>
          <span className="font-semibold text-white">{network}</span>
        </div>
        <div className="mb-2 flex justify-between text-sm text-white/70">
          <span>Plan</span>
          <span className="font-semibold text-white">{planName}</span>
        </div>
        <div className="mb-2 flex justify-between text-sm text-white/70">
          <span>Phone Number</span>
          <span className="font-mono text-white">{phone.replace(/(\d{3})(\d{4})(\d{4})/, "$1 $2 $3")}</span>
        </div>
        <div className="mb-2 flex justify-between text-sm text-white/70">
          <span>Amount</span>
          <span className="font-semibold text-white">₦{Number(amount).toLocaleString()}</span>
        </div>
        <div className="mb-2 flex justify-between text-sm text-white/70">
          <span>Date/Time</span>
          <span className="font-mono text-white">{date} 14:23</span>
        </div>
        <div className="mb-2 flex justify-between text-sm text-white/70">
          <span>Status</span>
          <span className="font-semibold text-green-400">{status.charAt(0).toUpperCase() + status.slice(1)}</span>
        </div>
      </div>
      <div className="flex flex-col gap-2 w-full max-w-sm mb-6">
          <button
            className="w-full py-2 rounded-lg font-semibold text-base bg-white/10 text-white hover:bg-white/20 transition border border-white/10"
            onClick={() => router.push(`/transactions/${ref}`)}
          >
            View Transaction
          </button>
          <button
            className="w-full py-2 rounded-lg font-semibold text-base bg-green-500 hover:bg-green-600 text-white"
            onClick={() => router.push(`/transactions/${ref}/receipt`)}
          >
            Download Receipt
          </button>
          <button
            className="w-full py-2 rounded-lg font-semibold text-base bg-blue-500 hover:bg-blue-600 text-white"
            onClick={async () => {
              const url = `${window.location.origin}/transactions/${ref}`;
              await navigator.clipboard.writeText(url);
              alert('Transaction link copied to clipboard!');
            }}
          >
            Share
          </button>
          <button
            className="w-full py-2 rounded-lg font-semibold text-base bg-indigo-500 hover:bg-indigo-600 text-white"
            onClick={() => router.push(`/buy-data?provider=${network}`)}
          >
            Buy Again
          </button>
      </div>
    </div>
  );
}
