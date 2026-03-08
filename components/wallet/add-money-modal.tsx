"use client";

import { useState } from "react";
import { Dialog } from "@radix-ui/react-dialog";
import { motion } from "framer-motion";
import { toastSuccess } from "@/components/ui/toast";
import { useClipboard } from "react-use-clipboard";

const QUICK_AMOUNTS = [1000, 5000, 10000, 20000];
const MIN_AMOUNT = 100;
const MAX_AMOUNT = 500000;

const PAYMENT_METHODS = [
  {
    id: "card",
    name: "Debit Card",
    description: "Pay securely with your debit card",
    icon: (
      <img src="/paystack-logo.png" alt="Paystack" className="w-8 h-8" />
    ),
  },
  {
    id: "bank",
    name: "Bank Transfer",
    description: "Transfer to our account and get instant credit",
    icon: (
      <svg className="w-8 h-8 text-blue-500" fill="none" viewBox="0 0 24 24"><rect width="24" height="24" rx="4" fill="#e0e7ff"/><path d="M6 19V9l6-4 6 4v10" stroke="#3b82f6" strokeWidth="2"/></svg>
    ),
  },
  {
    id: "ussd",
    name: "USSD",
    description: "Dial USSD code to pay from your phone",
    icon: (
      <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24"><rect width="24" height="24" rx="4" fill="#dcfce7"/><path d="M7 17l10-10M7 7h10v10" stroke="#22c55e" strokeWidth="2"/></svg>
    ),
  },
];

const DUMMY_ACCOUNT = {
  bank: "Fictional Bank",
  accountNumber: "1234567890",
  accountName: "Palm Tree Quad Ltd",
};

export function AddMoneyModal({ open, onOpenChange, onSuccess }: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (amount: number) => void;
}) {
  const [amount, setAmount] = useState(0);
  const [step, setStep] = useState<"amount" | "method" | "success">("amount");
  const [selectedMethod, setSelectedMethod] = useState<string>("");
  const [copyAccount, setCopyAccount] = useClipboard(DUMMY_ACCOUNT.accountNumber, { successDuration: 2000 });
  const [copyName, setCopyName] = useClipboard(DUMMY_ACCOUNT.accountName, { successDuration: 2000 });
  const [loading, setLoading] = useState(false);

  function handleAmountChange(val: number) {
    setAmount(val);
  }

  function handleProceed() {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep("success");
      onSuccess?.(amount);
      toastSuccess("Wallet funded successfully!");
    }, 2000);
  }

  function handleCopy(type: "account" | "name") {
    if (type === "account") {
      setCopyAccount();
      toastSuccess("Account number copied!");
    } else {
      setCopyName();
      toastSuccess("Account name copied!");
    }
  }

  function reset() {
    setAmount(0);
    setStep("amount");
    setSelectedMethod("");
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={reset}>
      <Dialog.Content className="bg-white dark:bg-[#18181b] rounded-xl p-6 w-full max-w-md mx-auto shadow-xl">
        {step === "amount" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="text-xl font-bold mb-4">Add Money</h2>
            <input
              type="number"
              min={MIN_AMOUNT}
              max={MAX_AMOUNT}
              value={amount || ""}
              onChange={e => handleAmountChange(Number(e.target.value))}
              className="w-full border rounded-lg px-4 py-2 text-lg mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-100 dark:bg-[#23232a] text-black dark:text-white"
              placeholder="Enter amount (₦)"
            />
            <div className="flex gap-2 mb-4">
              {QUICK_AMOUNTS.map(val => (
                <button
                  key={val}
                  className="px-4 py-2 rounded-lg bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 font-semibold"
                  onClick={() => handleAmountChange(val)}
                >₦{val.toLocaleString()}</button>
              ))}
            </div>
            <div className="text-xs text-gray-500 mb-2">Min ₦{MIN_AMOUNT}, Max ₦{MAX_AMOUNT}</div>
            <button
              className="w-full mt-2 py-3 rounded-lg bg-indigo-500 text-white font-bold text-lg disabled:bg-gray-300 disabled:text-gray-500"
              disabled={amount < MIN_AMOUNT || amount > MAX_AMOUNT}
              onClick={() => setStep("method")}
            >Continue</button>
          </motion.div>
        )}
        {step === "method" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="text-xl font-bold mb-4">Choose Payment Method</h2>
            <div className="flex flex-col gap-4 mb-4">
              {PAYMENT_METHODS.map(method => (
                <label key={method.id} className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer ${selectedMethod === method.id ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900" : "border-gray-200 dark:border-gray-700 bg-white dark:bg-[#23232a]"}`}>
                  {method.icon}
                  <div className="flex-1">
                    <div className="font-semibold text-lg">{method.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{method.description}</div>
                  </div>
                  <input
                    type="radio"
                    name="payment-method"
                    checked={selectedMethod === method.id}
                    onChange={() => setSelectedMethod(method.id)}
                    className="accent-indigo-500"
                  />
                </label>
              ))}
            </div>
            {selectedMethod === "bank" && (
              <div className="bg-gray-100 dark:bg-[#23232a] rounded-lg p-4 mb-4">
                <div className="font-semibold mb-2">Bank Transfer Details</div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm">Bank:</span>
                  <span className="font-bold">{DUMMY_ACCOUNT.bank}</span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm">Account Number:</span>
                  <span className="font-bold">{DUMMY_ACCOUNT.accountNumber}</span>
                  <button className="ml-2 px-2 py-1 rounded bg-indigo-500 text-white text-xs" onClick={() => handleCopy("account")}>Copy</button>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm">Account Name:</span>
                  <span className="font-bold">{DUMMY_ACCOUNT.accountName}</span>
                  <button className="ml-2 px-2 py-1 rounded bg-indigo-500 text-white text-xs" onClick={() => handleCopy("name")}>Copy</button>
                </div>
              </div>
            )}
            {selectedMethod === "card" && (
              <button
                className="w-full py-3 rounded-lg bg-indigo-500 text-white font-bold text-lg mt-2 disabled:bg-gray-300 disabled:text-gray-500"
                disabled={loading}
                onClick={handleProceed}
              >{loading ? "Processing..." : "Proceed"}</button>
            )}
            <button className="w-full mt-2 py-3 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold text-lg" onClick={reset}>Cancel</button>
          </motion.div>
        )}
        {step === "success" && (
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
            <div className="flex flex-col items-center justify-center py-8">
              {/* Confetti animation placeholder */}
              <div className="mb-4">
                <svg width="64" height="64" fill="none" viewBox="0 0 64 64">
                  <circle cx="32" cy="32" r="32" fill="#a5b4fc" />
                  <path d="M32 16v32M16 32h32" stroke="#6366f1" strokeWidth="4" strokeLinecap="round" />
                </svg>
              </div>
              <div className="text-2xl font-bold text-indigo-600 mb-2">Success!</div>
              <div className="text-gray-500 mb-4">Your wallet has been funded.</div>
              <button className="mt-4 px-6 py-3 rounded-lg bg-indigo-500 text-white font-bold text-lg" onClick={reset}>Close</button>
            </div>
          </motion.div>
        )}
      </Dialog.Content>
    </Dialog>
  );
}
