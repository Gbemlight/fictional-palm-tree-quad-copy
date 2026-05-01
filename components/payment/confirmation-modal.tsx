"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { motion, AnimatePresence } from "framer-motion";
import * as React from "react";
import { CheckCircle2, Wallet, CreditCard, Landmark, Smartphone, X, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toastError } from "@/components/ui/toast";

interface ConfirmationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  summary: {
    network: string;
    plan: string;
    phone: string;
    amount: number;
    validity: string;
    walletBalance: number;
  };
  onConfirm: () => Promise<boolean>;
}

const methods = [
  { id: "wallet", label: "Wallet", icon: <Wallet className="h-4 w-4" /> },
  { id: "card", label: "Card", icon: <CreditCard className="h-4 w-4" /> },
  { id: "bank", label: "Bank", icon: <Landmark className="h-4 w-4" /> },
];

function ConfettiBurst() {
  const pieces = Array.from({ length: 20 });
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden z-50">
      {pieces.map((_, i) => (
        <motion.span
          key={i}
          className="absolute left-1/2 top-1/2 h-2 w-2 rounded-full"
          style={{
            background: i % 3 === 0 ? "var(--color-primary)" : i % 3 === 1 ? "var(--color-secondary)" : "var(--color-accent)",
          }}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{
            x: (Math.random() - 0.5) * 400,
            y: (Math.random() - 0.5) * 300 - 100,
            opacity: 0,
            scale: 0.2,
          }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}

export function ConfirmationModal({ 
  open, 
  onOpenChange, 
  summary, 
  onConfirm 
}: ConfirmationModalProps) {
  const [method, setMethod] = React.useState("wallet");
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);

  const canAfford = summary.walletBalance >= summary.amount;

  async function handleConfirm() {
    if (method === "wallet" && !canAfford) {
      toastError("Insufficient wallet balance. Please fund your wallet.");
      return;
    }

    setLoading(true);
    const ok = await onConfirm();
    
    if (ok) {
      setSuccess(true);
      setTimeout(() => onOpenChange(false), 2200);
    } else {
      toastError("Transaction failed. Please try again.");
    }
    setLoading(false);
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm" />
        <Dialog.Content asChild onPointerDownOutside={(e) => e.preventDefault()}>
          <div className="fixed inset-0 z-50 overflow-y-auto outline-none">
            <div className="flex min-h-full items-center justify-center p-4 py-8 md:py-16">
              <div className="relative w-full max-w-md rounded-[2.5rem] border border-white/20 bg-neutral-900/90 p-8 shadow-2xl backdrop-blur-2xl focus:outline-none text-white">
          <AnimatePresence>
            {success && <ConfettiBurst />}
          </AnimatePresence>

          <Dialog.Title asChild>
            <h2 className="sr-only">Confirm Purchase</h2>
          </Dialog.Title>

          <AnimatePresence>
            {success ? (
              <motion.div
                key="success"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex flex-col items-center justify-center min-h-75"
              >
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-green-500/30 blur-3xl rounded-full" />
                  <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-green-500 text-white shadow-lg shadow-green-500/20">
                    <CheckCircle2 className="h-14 w-14" />
                  </div>
                </div>
                <h2 className="text-3xl font-black text-center mb-2 tracking-tight">Payment Successful!</h2>
                <p className="text-white/60 font-medium text-center">Finalizing your purchase...</p>
              </motion.div>
            ) : (
              <motion.div
                key="content"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
              >
                <div className="flex items-center gap-4 mb-8">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-primary via-secondary to-accent shadow-lg text-2xl font-black text-white">
                    {summary.network.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-2xl font-black tracking-tight leading-none mb-1">Confirm Purchase</h2>
                    <p className="text-sm font-bold text-white/40 uppercase tracking-widest">{summary.network} Network</p>
                  </div>
                </div>

                <div className="space-y-1 mb-8 rounded-3xl border border-white/5 bg-white/5 p-4">
                  <SummaryRow label="Network" value={summary.network} />
                  <SummaryRow label="Plan" value={summary.plan} />
                  <SummaryRow label="Phone Number" value={summary.phone.replace(/(\d{3})(\d{4})(\d{4})/, "$1 $2 $3")} />
                  <SummaryRow label="Amount" value={`₦${summary.amount.toLocaleString()}`} />
                  <SummaryRow label="Validity" value={summary.validity} />
                </div>

                <div className="mb-8">
                  <div className="text-xs font-black uppercase tracking-widest text-white/40 mb-3 ml-1">Payment Method</div>
                  <div className="grid grid-cols-3 gap-3">
                    {methods.map(pm => (
                      <button
                        key={pm.id}
                        type="button"
                        className={cn(
                          "flex flex-col items-center gap-2 rounded-2xl border p-3 transition-all",
                          method === pm.id
                            ? "border-primary bg-primary/20 text-white shadow-lg shadow-primary/10"
                            : "border-white/10 bg-white/5 text-white/60 hover:border-white/20"
                        )}
                        onClick={() => setMethod(pm.id)}
                      >
                        {pm.icon}
                        {pm.label}
                      </button>
                    ))}
                  </div>
                  
                  {method === "wallet" && (
                    <motion.div 
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 flex items-center justify-between rounded-xl bg-black/40 px-3 py-2 border border-white/5"
                    >
                      <span className="text-xs font-bold text-white/40 uppercase tracking-widest">Balance</span>
                      <span className={cn(
                        "text-sm font-black",
                        canAfford ? "text-green-400" : "text-red-400"
                      )}>
                        ₦{summary.walletBalance.toLocaleString()}
                      </span>
                    </motion.div>
                  )}
                </div>

                <div className="flex flex-col gap-3">
                  <Button
                    fullWidth
                    size="xl"
                    className="rounded-[1.25rem] shadow-xl shadow-primary/20"
                    onClick={handleConfirm}
                    disabled={loading}
                    loading={loading}
                    rightIcon={<Zap className="h-5 w-5 fill-current" />}
                  >
                    Confirm & Pay
                  </Button>
                  
                  <Dialog.Close asChild>
                    <Button
                      variant="ghost"
                      fullWidth
                      disabled={loading}
                      className="text-white/40 hover:text-red-400 transition-colors"
                    >
                      Cancel
                    </Button>
                  </Dialog.Close>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
              </div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">{label}</span>
      <span className="font-bold text-sm text-white text-right max-w-[60%] truncate">
        {value}
      </span>
    </div>
  );
}
