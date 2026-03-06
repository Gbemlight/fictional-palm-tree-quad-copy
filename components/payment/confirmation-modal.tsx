"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { cn } from "../../lib/utils";

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

const paymentMethods = [
  { key: "wallet", label: "Wallet Balance" },
  { key: "card", label: "Card" },
  { key: "bank", label: "Bank Transfer" },
];

export function ConfirmationModal({ open, onOpenChange, summary, onConfirm }: ConfirmationModalProps) {
  const [method, setMethod] = useState("wallet");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false);

  const canAfford = summary.walletBalance >= summary.amount;

  async function handleConfirm() {
    setLoading(true);
    setError("");
    if (method === "wallet" && !canAfford) {
      setError("Insufficient wallet balance");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2500);
      setLoading(false);
      return;
    }
    const ok = await onConfirm();
    if (ok) {
      setSuccess(true);
      setTimeout(() => {
        onOpenChange(false);
        setSuccess(false);
      }, 1800);
    } else {
      setError("Payment failed. Try again.");
    }
    setLoading(false);
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 z-40" />
        <Dialog.Content
          className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-[#23232a] p-6 shadow-xl focus:outline-none text-white"
          onPointerDownOutside={e => e.preventDefault()}
        >
          {/* Accessibility: Dialog.Title required by Radix UI */}
          <Dialog.Title asChild>
            <h2 className="sr-only">Confirm Purchase</h2>
          </Dialog.Title>
          {/* Toast for insufficient balance */}
          {showToast && (
            <div className="fixed left-1/2 top-8 z-[100] -translate-x-1/2 bg-red-600 text-white px-6 py-3 rounded-xl shadow-lg font-semibold animate-fade-in-out">
              Insufficient wallet balance
            </div>
          )}
          <AnimatePresence>
            {success ? (
              <motion.div
                key="success"
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.7, opacity: 0 }}
                className="flex flex-col items-center justify-center min-h-[300px]"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="mb-4"
                >
                  <CheckCircleIcon className="w-20 h-20 text-green-400" />
                </motion.div>
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-2xl font-bold mb-2"
                >
                  Payment Successful!
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-lg text-white/80"
                >
                  Redirecting to transactions...
                </motion.p>
                {/* Confetti animation could be added here with a library if desired */}
              </motion.div>
            ) : (
              <motion.div
                key="content"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  {/* Service icon placeholder */}
                  <div className="w-12 h-12 rounded-full bg-indigo-500 flex items-center justify-center text-2xl font-bold text-white">
                    {summary.network[0]}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Confirm Purchase</h2>
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <SummaryRow label="Network" value={summary.network} />
                  <SummaryRow label="Plan" value={summary.plan} />
                  <SummaryRow label="Phone Number" value={summary.phone.replace(/(\d{3})(\d{4})(\d{4})/, "$1 $2 $3")} />
                  <SummaryRow label="Amount" value={`₦${summary.amount.toLocaleString()}`} />
                  <SummaryRow label="Validity" value={summary.validity} />
                </div>
                <div className="mb-4">
                  <div className="font-semibold mb-1">Payment Method</div>
                  <div className="flex gap-2">
                    {paymentMethods.map(pm => (
                      <button
                        key={pm.key}
                        className={cn(
                          "px-3 py-2 rounded-lg border text-sm font-semibold transition",
                          method === pm.key
                            ? "bg-indigo-500 text-white border-indigo-500"
                            : "bg-[#18181b] text-white/80 border-white/10 hover:bg-indigo-600/30"
                        )}
                        onClick={() => setMethod(pm.key)}
                        type="button"
                        tabIndex={0}
                      >
                        {pm.label}
                      </button>
                    ))}
                  </div>
                  {method === "wallet" && (
                    <div className="mt-2 text-sm text-white/70">
                      Wallet Balance: <span className={canAfford ? "text-green-400" : "text-red-400"}>₦{summary.walletBalance.toLocaleString()}</span>
                    </div>
                  )}
                </div>
                {error && <div className="mb-2 text-red-500 text-sm">{error}</div>}
                <div className="flex gap-3 mt-6">
                  <button
                    className="flex-1 py-3 rounded-xl font-semibold text-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg hover:from-indigo-600 hover:to-purple-600 transition"
                    onClick={handleConfirm}
                    disabled={loading}
                    type="button"
                  >
                    {loading ? "Processing..." : "Confirm Payment"}
                  </button>
                  <Dialog.Close asChild>
                    <button
                      className="flex-1 py-3 rounded-xl font-semibold text-lg bg-white/10 text-white hover:bg-white/20 transition border border-white/10"
                      type="button"
                      disabled={loading}
                    >
                      Cancel
                    </button>
                  </Dialog.Close>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center text-base">
      <span className="text-gray-300">{label}</span>
      <span className="font-semibold text-white drop-shadow-sm break-all text-right max-w-[60%]">{value}</span>
    </div>
  );
}
