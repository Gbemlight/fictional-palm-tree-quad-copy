"use client";

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle2,
  Copy,
  CreditCard,
  Landmark,
  Smartphone,
  Wallet,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toastInfo, toastSuccess } from "@/components/ui/toast";
import { cn } from "@/lib/utils";

function useClipboard(text: string, options?: { successDuration?: number }) {
  const [copied, setCopied] = React.useState(false);

  const copy = React.useCallback(() => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), options?.successDuration ?? 1500);
    });
  }, [text, options?.successDuration]);

  return [copied, copy] as const;
}

type PaymentMethod = "bank" | "card" | "ussd";

interface AddMoneyModalProps {
  currentBalance?: number;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (amount: number) => void;
  open: boolean;
}

const MAX_AMOUNT = 500000;
const MIN_AMOUNT = 100;
const QUICK_AMOUNTS = [1000, 5000, 10000, 20000];

const bankDetails = {
  accountName: "QuickPay Technologies Ltd",
  accountNumber: "1234567890",
  bankName: "Wema Bank",
};

const methods = [
  {
    description: "Transfer to a dedicated account number",
    icon: <Landmark className="h-5 w-5" />,
    id: "bank" as PaymentMethod,
    name: "Bank Transfer",
  },
  {
    description: "Secure payment via Paystack",
    icon: <CreditCard className="h-5 w-5" />,
    id: "card" as PaymentMethod,
    name: "Debit Card",
  },
  {
    description: "Fund with your bank's USSD code",
    icon: <Smartphone className="h-5 w-5" />,
    id: "ussd" as PaymentMethod,
    name: "USSD",
  },
];

function ConfettiBurst() {
  const pieces = Array.from({ length: 18 });

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {pieces.map((_, i) => (
        <motion.span
          key={i}
          className="absolute left-1/2 top-1/2 h-2 w-2 rounded-full"
          style={{
            background:
              i % 4 === 0
                ? "var(--color-primary)"
                : i % 4 === 1
                ? "var(--color-secondary)"
                : i % 4 === 2
                ? "var(--color-accent)"
                : "var(--color-success)",
          }}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{
            opacity: 0,
            scale: 0.2,
            x: (Math.random() - 0.5) * 260,
            y: (Math.random() - 0.5) * 220,
          }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}

export function AddMoneyModal({
  currentBalance = 125000,
  onOpenChange,
  onSuccess,
  open,
}: AddMoneyModalProps) {
  const [amount, setAmount] = React.useState<number | "">("");
  const [balance, setBalance] = React.useState(currentBalance);
  const [loading, setLoading] = React.useState(false);
  const [method, setMethod] = React.useState<PaymentMethod | "">("");
  const [success, setSuccess] = React.useState(false);

  const [copiedAccount, copyAccount] = useClipboard(bankDetails.accountNumber, {
    successDuration: 1500,
  });
  const [copiedName, copyName] = useClipboard(bankDetails.accountName, {
    successDuration: 1500,
  });

  const numericAmount = typeof amount === "number" ? amount : NaN;
  const amountValid =
    Number.isFinite(numericAmount) &&
    numericAmount >= MIN_AMOUNT &&
    numericAmount <= MAX_AMOUNT;

  React.useEffect(() => {
    if (copiedAccount) toastInfo("Account number copied");
  }, [copiedAccount]);

  React.useEffect(() => {
    if (copiedName) toastInfo("Account name copied");
  }, [copiedName]);

  React.useEffect(() => {
    if (!open) {
      setAmount("");
      setLoading(false);
      setMethod("");
      setSuccess(false);
    }
  }, [open]);

  const handleChipClick = (value: number) => {
    setAmount(value);
  };

  const handleProceed = async () => {
    if (!amountValid || !method) return;

    if (method === "card") {
      setLoading(true);

      setTimeout(() => {
        setLoading(false);
        setSuccess(true);
        const newBalance = balance + numericAmount;
        setBalance(newBalance);
        onSuccess?.(numericAmount);
        toastSuccess(`Wallet funded successfully with ₦${numericAmount.toLocaleString()}`);

        setTimeout(() => {
          onOpenChange(false);
        }, 1800);
      }, 2000);

      return;
    }

    if (method === "ussd") {
      toastInfo("USSD funding flow is coming soon");
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" />

        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[92vw] max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-white/15 bg-white/10 p-6 text-white backdrop-blur-xl outline-none md:p-8 max-h-[90vh] overflow-y-auto">
          <AnimatePresence>
            {success && <ConfettiBurst />}
          </AnimatePresence>

          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-white/10 p-3">
                <Wallet className="h-6 w-6" />
              </div>
              <div>
                <Dialog.Title className="text-2xl font-bold">
                  Add Money
                </Dialog.Title>
                <Dialog.Description className="text-sm text-white/65">
                  Fund your wallet securely using your preferred method.
                </Dialog.Description>
              </div>
            </div>

            <Dialog.Close asChild>
              <button
                className="rounded-xl p-2 transition hover:bg-white/10"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
            </Dialog.Close>
          </div>

          {/* Balance */}
          <div className="mb-6 rounded-2xl border border-white/10 bg-black/20 p-4">
            <p className="text-sm text-white/60">Current Balance</p>
            <p className="mt-1 text-2xl font-bold">₦{balance.toLocaleString()}</p>
          </div>

          {/* Amount */}
          <section className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-5">
            <h3 className="mb-4 text-lg font-semibold">1. Enter amount</h3>

            <div className="mb-4 flex flex-wrap gap-3">
              {QUICK_AMOUNTS.map((chip) => {
                const active = amount === chip;
                return (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => handleChipClick(chip)}
                    className={cn(
                      "rounded-full px-4 py-2 text-sm font-medium transition",
                      active
                        ? "bg-[linear-gradient(135deg,var(--color-primary),var(--color-secondary))] shadow-[0_10px_24px_rgba(124,58,237,0.28)]"
                        : "border border-white/15 bg-white/5 hover:bg-white/10"
                    )}
                  >
                    ₦{chip.toLocaleString()}
                  </button>
                );
              })}
            </div>

            <Input
              errorMessage={
                amount === ""
                  ? undefined
                  : !amountValid
                  ? `Enter an amount between ₦${MIN_AMOUNT.toLocaleString()} and ₦${MAX_AMOUNT.toLocaleString()}`
                  : undefined
              }
              helperText={`Minimum ₦${MIN_AMOUNT.toLocaleString()} • Maximum ₦${MAX_AMOUNT.toLocaleString()}`}
              label="Amount"
              onChange={(e) =>
                setAmount(e.target.value === "" ? "" : Number(e.target.value))
              }
              placeholder="Enter amount"
              state={
                amount === ""
                  ? "default"
                  : amountValid
                  ? "success"
                  : "error"
              }
              type="number"
              value={amount}
            />
          </section>

          {/* Methods */}
          {amountValid && (
            <section className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-5">
              <h3 className="mb-4 text-lg font-semibold">2. Choose payment method</h3>

              <div className="space-y-3">
                {methods.map((item) => {
                  const active = method === item.id;

                  return (
                    <button
                      className={cn(
                        "flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition-all",
                        active
                          ? "border-transparent bg-[linear-gradient(135deg,var(--color-primary),var(--color-secondary))] shadow-[0_12px_24px_rgba(236,72,153,0.22)]"
                          : "border-white/10 bg-black/20 hover:bg-white/10"
                      )}
                      key={item.id}
                      onClick={() => setMethod(item.id)}
                      type="button"
                    >
                      <div className="rounded-xl bg-white/10 p-3">
                        {item.icon}
                      </div>

                      <div className="flex-1">
                        <p className="font-semibold">{item.name}</p>
                        <p className="text-sm text-white/70">{item.description}</p>
                      </div>

                      <div
                        className={cn(
                          "h-5 w-5 rounded-full border-2",
                          active ? "border-white bg-white/20" : "border-white/50"
                        )}
                      />
                    </button>
                  );
                })}
              </div>
            </section>
          )}

          {/* Bank transfer details */}
          {amountValid && method === "bank" && (
            <section className="mb-6 rounded-2xl border border-white/10 bg-black/20 p-5">
              <h3 className="mb-4 text-lg font-semibold">Bank transfer details</h3>

              <div className="space-y-4">
                <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm text-white/60">Account Name</p>
                      <p className="mt-1 font-semibold">{bankDetails.accountName}</p>
                    </div>
                    <Button
                      leftIcon={<Copy className="h-4 w-4" />}
                      onClick={copyName}
                      type="button"
                      variant="secondary"
                    >
                      Copy
                    </Button>
                  </div>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm text-white/60">Account Number</p>
                      <p className="mt-1 font-semibold">{bankDetails.accountNumber}</p>
                    </div>
                    <Button
                      leftIcon={<Copy className="h-4 w-4" />}
                      onClick={copyAccount}
                      type="button"
                      variant="secondary"
                    >
                      Copy
                    </Button>
                  </div>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <p className="text-sm text-white/60">Bank Name</p>
                  <p className="mt-1 font-semibold">{bankDetails.bankName}</p>
                </div>
              </div>
            </section>
          )}

          {/* Card proceed */}
          {amountValid && method === "card" && (
            <section className="mb-6 rounded-2xl border border-white/10 bg-black/20 p-5">
              <h3 className="mb-2 text-lg font-semibold">Card payment</h3>
              <p className="mb-4 text-sm text-white/70">
                Your card will be charged instantly for ₦{numericAmount.toLocaleString()}.
              </p>

              <Button
                type="button"
                onClick={handleProceed}
                loading={loading}
                fullWidth
                className="bg-linear-to-r from-indigo-600 to-violet-600 border-none text-white hover:opacity-90"
              >
                Proceed
              </Button>
            </section>
          )}

          {/* USSD */}
          {amountValid && method === "ussd" && (
            <section className="mb-6 rounded-2xl border border-white/10 bg-black/20 p-5">
              <h3 className="mb-2 text-lg font-semibold">USSD Payment</h3>
              <p className="text-sm text-white/70">
                A USSD funding flow can be connected here for supported banks.
              </p>
            </section>
          )}

          {/* Success */}
          {success && (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-2xl border border-white/10 bg-[linear-gradient(135deg,var(--color-success),var(--color-accent))] p-5"
            >
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-6 w-6" />
                <div>
                  <p className="font-semibold">Funding successful</p>
                  <p className="text-sm text-white/90">
                    Your wallet has been updated with ₦{numericAmount.toLocaleString()}.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}