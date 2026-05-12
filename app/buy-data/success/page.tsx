"use client";

import React, { useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle2, Download, Share2, LayoutDashboard, RefreshCcw, Eye } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { dataPlans } from "../../../lib/dummy-data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Get transaction details from URL params
  const ref = searchParams.get("ref") || "QKP-982134";
  const network = searchParams.get("network") || "MTN";
  const planName = searchParams.get("plan") ? (dataPlans.find(p => p.id === searchParams.get("plan"))?.name || "2GB - 30 Days") : "2GB - 30 Days";
  const phone = searchParams.get("phone") || "08012345678";
  const amount = searchParams.get("amount") || "1000";
  const date = searchParams.get("date") || "2026-02-20";

  useEffect(() => {
    // Use window for confetti, always center of viewport
    import("canvas-confetti").then((mod) => {
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
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    alert("Transaction link copied to clipboard!");
  }

  return (
    <main className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex flex-col items-center justify-center p-6 md:p-12">
      {/* Success Animation Section */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="flex flex-col items-center mb-8 z-50 text-center"
      >
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-green-500/30 blur-3xl rounded-full" />
          <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-green-500 text-white shadow-xl shadow-green-500/20">
            <CheckCircle2 className="h-14 w-14" />
          </div>
        </div>
        <h1 className="text-4xl font-black tracking-tight text-neutral-900 dark:text-white mb-2">
          Purchase Successful!
        </h1>
        <p className="text-neutral-500 dark:text-neutral-400 font-medium max-w-xs">
          Your data bundle has been successfully credited to <span className="text-primary font-bold">{phone}</span>
        </p>
      </motion.div>

      {/* Transaction Receipt Card */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="w-full max-w-md rounded-[2.5rem] border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900/50 backdrop-blur-2xl p-8 shadow-2xl mb-10 overflow-hidden relative"
      >
        <div className="absolute top-0 left-0 h-1.5 w-full bg-linear-to-r from-primary via-secondary to-accent" />
        
        <div className="space-y-4">
          <DetailRow label="Reference ID" value={ref} isMono />
          <DetailRow label="Network" value={network} />
          <DetailRow label="Plan" value={planName} />
          <DetailRow label="Phone Number" value={phone.replace(/(\d{3})(\d{4})(\d{4})/, "$1 $2 $3")} isMono />
          <DetailRow label="Amount" value={`₦${Number(amount).toLocaleString()}`} />
          <DetailRow label="Date/Time" value={`${date} 14:23`} isMono />
          <div className="flex justify-between items-center py-3">
            <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400 dark:text-neutral-500">Status</span>
            <Badge variant="success" size="sm">Success</Badge>
          </div>
        </div>
      </motion.div>

      {/* Action Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-md">
        <Button
          variant="primary"
          size="lg"
          fullWidth
          leftIcon={<Download className="h-4 w-4" />}
          onClick={handleDownloadReceipt}
          className="rounded-2xl"
        >
          Download Receipt
        </Button>
        <Button
          variant="secondary"
          size="lg"
          fullWidth
          leftIcon={<Share2 className="h-4 w-4" />}
          onClick={handleShare}
          className="rounded-2xl dark:bg-white/5 dark:text-white dark:border-white/10 hover:dark:bg-white/10"
        >
          Share Receipt
        </Button>
        <Button
          variant="secondary"
          size="lg"
          fullWidth
          leftIcon={<Eye className="h-4 w-4" />}
          onClick={() => router.push(`/transactions`)}
          className="rounded-2xl dark:bg-white/5 dark:text-white dark:border-white/10 hover:dark:bg-white/10"
        >
          View Transactions
        </Button>
        <Button
          variant="secondary"
          size="lg"
          fullWidth
          leftIcon={<RefreshCcw className="h-4 w-4" />}
          onClick={() => router.push(`/buy-data?provider=${network.toLowerCase()}`)}
          className="rounded-2xl dark:bg-white/5 dark:text-white dark:border-white/10 hover:dark:bg-white/10"
        >
          Buy Again
        </Button>
      </div>

      <Link 
        href="/dashboard" 
        className="mt-10 flex items-center gap-2 text-sm font-bold text-neutral-500 hover:text-primary transition-colors"
      >
        <LayoutDashboard className="h-4 w-4" />
        Go to Dashboard
      </Link>
    </main>
  );
}

export default function BuyDataSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-neutral-50 dark:bg-neutral-950" />}>
      <SuccessContent />
    </Suspense>
  );
}

function DetailRow({ label, value, isMono }: { label: string; value: string; isMono?: boolean }) {
  return (
    <div className="flex justify-between items-center py-3 border-b border-neutral-100 dark:border-white/5 last:border-0">
      <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400 dark:text-neutral-500">{label}</span>
      <span className={cn(
        "font-bold text-sm text-neutral-900 dark:text-white",
        isMono && "font-mono tracking-tighter"
      )}>
        {value}
      </span>
    </div>
  );
}
