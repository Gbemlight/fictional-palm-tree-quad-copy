"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { toastSuccess } from "@/components/ui/toast";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { mockUser, mockTransactions } from "@/lib/dummy-data";
import { AddMoneyModal } from "@/components/wallet/add-money-modal";

const FILTERS = ["All", "Credit", "Debit", "Pending"];
const DATE_RANGES = [
  { label: "Last 7 days", value: 7 },
  { label: "Last 30 days", value: 30 },
  { label: "Custom", value: "custom" },
];

function formatAmount(amount: number) {
  return `₦${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
// ...existing code...

const tierColors: Record<string, string> = {
  Silver: "bg-gray-300 text-gray-700",
  Gold: "bg-yellow-400 text-yellow-900",
  Platinum: "bg-gradient-to-r from-blue-400 to-purple-500 text-white",
};

const dummyWallet = {
  balance: mockUser.walletBalance,
  tier: "Silver",
  tierProgress: 40000,
  tierTarget: 100000,
  nextTier: "Gold",
};

export default function WalletPage() {
  const [balance, setBalance] = useState(0);
  const [displayedBalance, setDisplayedBalance] = useState(0);
  const [filter, setFilter] = useState("All");
  const [dateRange, setDateRange] = useState(DATE_RANGES[0].value);
  const [transactions, setTransactions] = useState(mockTransactions);
  const [customRange, setCustomRange] = useState({ from: "", to: "" });
  const [showAddMoney, setShowAddMoney] = useState(false);

  useEffect(() => {
    setBalance(dummyWallet.balance);
    let start = 0;
    const end = dummyWallet.balance;
    if (start === end) return;
    let current = start;
    const increment = (end - start) / 40;
    const timer = setInterval(() => {
      current += increment;
      if (current >= end) {
        setDisplayedBalance(end);
        clearInterval(timer);
      } else {
        setDisplayedBalance(current);
      }
    }, 20);
    return () => clearInterval(timer);
  }, []);

  const filteredTxs = transactions.filter((tx: any) => {
    if (filter === "Credit" && tx.type !== "credit") return false;
    if (filter === "Debit" && tx.type !== "debit") return false;
    if (filter === "Pending" && tx.status !== "pending") return false;
    if (dateRange !== "custom") {
      const days = typeof dateRange === "number" ? dateRange : 7;
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - days);
      return new Date(tx.date) >= cutoff;
    } else if (customRange.from && customRange.to) {
      return new Date(tx.date) >= new Date(customRange.from) && new Date(tx.date) <= new Date(customRange.to);
    }
    return true;
  });

  function handleExport() {
    toastSuccess("Statement exported successfully!");
  }

  const tierProgress = Math.min(100, Math.round((dummyWallet.tierProgress / dummyWallet.tierTarget) * 100));

  return (
    <div className="w-full min-h-screen bg-[#000000]/80 text-white px-2 sm:px-4 md:px-8 py-4 flex flex-col gap-6">
      <motion.div className="rounded-2xl p-6 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-lg w-full text-white">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex-1">
            <div className="text-white text-lg font-medium mb-1">Wallet Balance</div>
            <div className="text-4xl font-bold text-white">{formatAmount(displayedBalance)}</div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge className={tierColors[dummyWallet.tier as keyof typeof tierColors] + " px-3 py-1 text-sm font-semibold"}>{dummyWallet.tier} Tier</Badge>
            <div className="w-28 mt-2">
              <Progress value={tierProgress} />
              <div className="text-xs text-white/80 mt-1">{tierProgress}% to {dummyWallet.nextTier}</div>
            </div>
            <button className="mt-2 px-4 py-2 rounded-lg bg-white text-indigo-600 font-semibold shadow hover:bg-indigo-100 transition" onClick={() => setShowAddMoney(true)}>Add Money</button>
          </div>
        </div>
        <AddMoneyModal open={showAddMoney} onOpenChange={setShowAddMoney} onSuccess={amt => setBalance(b => b + amt)} />
      </motion.div>
    </div>
  );
}

// ...existing code...
  const [filter, setFilter] = useState("All");
  const [dateRange, setDateRange] = useState(DATE_RANGES[0].value);
  const [transactions, setTransactions] = useState(mockTransactions);
  const [customRange, setCustomRange] = useState({ from: "", to: "" });

  // Animate balance count up
  useEffect(() => {
    setBalance(dummyWallet.balance);
    let start = 0;
    const end = dummyWallet.balance;
    if (start === end) return;
    let current = start;
    const increment = (end - start) / 40;
    const timer = setInterval(() => {
      current += increment;
      if (current >= end) {
        setDisplayedBalance(end);
        clearInterval(timer);
      } else {
        setDisplayedBalance(current);
      }
    }, 20);
    return () => clearInterval(timer);
  }, []);

  // Filter transactions
  const filteredTxs = transactions.filter((tx: any) => {
    if (filter === "Credit" && tx.type !== "credit") return false;
    if (filter === "Debit" && tx.type !== "debit") return false;
    if (filter === "Pending" && tx.status !== "pending") return false;
    // Date range filter
    if (dateRange !== "custom") {
      const days = typeof dateRange === "number" ? dateRange : 7;
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - days);
      return new Date(tx.date) >= cutoff;
    } else if (customRange.from && customRange.to) {
      return new Date(tx.date) >= new Date(customRange.from) && new Date(tx.date) <= new Date(customRange.to);
    }
    return true;
  });

  // Dummy export statement
  function handleExport() {
    toastSuccess("Statement exported successfully!");
  }

  // Tier progress
  const tierProgress = Math.min(100, Math.round((dummyWallet.tierProgress / dummyWallet.tierTarget) * 100));

  return (
    <div className="w-full min-h-screen bg-[#000000]/80 text-white px-2 sm:px-4 md:px-8 py-4 flex flex-col gap-6">
      {/* Balance Card */}
      <motion.div
        className="relative rounded-2xl p-6 sm:p-8 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-lg overflow-hidden w-full text-white"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Sparkle Animation */}
        <motion.div
          className="absolute top-0 right-0 w-24 h-24 pointer-events-none"
          animate={{ rotate: [0, 360] }}
          transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
        >
          <svg width="100%" height="100%" viewBox="0 0 96 96" fill="none">
            <g filter="url(#glow)">
              <circle cx="48" cy="48" r="20" fill="#fff" fillOpacity="0.15" />
              <circle cx="48" cy="48" r="8" fill="#fff" fillOpacity="0.4" />
            </g>
            <defs>
              <filter id="glow" x="0" y="0" width="96" height="96" filterUnits="userSpaceOnUse">
                <feGaussianBlur stdDeviation="8" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
          </svg>
        </motion.div>
        <div className="flex items-center gap-4">
          <div>
            <div className="text-white text-lg font-medium mb-1">Wallet Balance</div>
            <div className="text-4xl font-bold text-white">
              {formatAmount(displayedBalance)}
            </div>
          </div>
          <div className="ml-auto flex flex-col items-end">
            <Badge className={tierColors[dummyWallet.tier as keyof typeof tierColors] + " px-3 py-1 text-sm font-semibold"}>
              {dummyWallet.tier} Tier
            </Badge>
            <div className="w-28 mt-2">
              <Progress value={tierProgress} />
              <div className="text-xs text-white/80 mt-1">{tierProgress}% to {dummyWallet.nextTier}</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full text-white">
        <button className="bg-[var(--color-accent)]/10 text-[var(--color-accent)] rounded-lg py-3 font-semibold hover:bg-[var(--color-accent)]/20 transition">Add Money</button>
        <button className="bg-[var(--color-success)]/10 text-[var(--color-success)] rounded-lg py-3 font-semibold hover:bg-[var(--color-success)]/20 transition">Withdraw</button>
        <button className="bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-lg py-3 font-semibold hover:bg-[var(--color-primary)]/20 transition">Send Money</button>
        <button className="bg-[var(--color-secondary)]/10 text-[var(--color-secondary)] rounded-lg py-3 font-semibold hover:bg-[var(--color-secondary)]/20 transition">Transaction History</button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2 w-full text-white">
        {FILTERS.map((f) => (
          <button
            key={f}
            className={`px-4 py-1 rounded-full font-medium border transition ${filter === f ? "bg-indigo-500 text-white border-indigo-500" : "bg-white text-gray-700 border-gray-200 hover:bg-gray-100"}`}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-2">
          <select
            className="border rounded px-2 py-1 text-sm bg-[#23232a] text-white border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={dateRange}
            onChange={e => setDateRange(e.target.value === "custom" ? "custom" : Number(e.target.value))}
          >
            {DATE_RANGES.map(r => (
              <option key={r.value} value={r.value}>{r.label}</option>
            ))}
          </select>
          {dateRange === "custom" && (
            <>
              <input
                type="date"
                className="border rounded px-2 py-1 text-sm bg-[#23232a] text-white border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={customRange.from}
                onChange={e => setCustomRange(cr => ({ ...cr, from: e.target.value }))}
              />
              <span className="text-gray-400">-</span>
              <input
                type="date"
                className="border rounded px-2 py-1 text-sm bg-[#23232a] text-white border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={customRange.to}
                onChange={e => setCustomRange(cr => ({ ...cr, to: e.target.value }))}
              />
            </>
          )}
          <button
            className="ml-2 px-3 py-1 rounded bg-indigo-500 text-white font-semibold hover:bg-indigo-600 transition"
            onClick={handleExport}
          >
            Export Statement
          </button>
        </div>
      </div>

      {/* Transactions List */}
      <div className="bg-[#18181b] rounded-xl shadow divide-y border border-white/10 w-full text-white">
        <AnimatePresence>
          {filteredTxs.length === 0 ? (
            <motion.div
              className="p-8 text-center text-gray-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              No transactions found.
            </motion.div>
          ) : (
            filteredTxs.map((tx: any) => (
              <motion.div
                key={tx.id}
                className="flex items-center gap-4 px-4 py-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex-shrink-0">
                  {tx.type === "credit" ? (
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-600">
                      <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><path d="M10 2v16m8-8H2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                    </span>
                  ) : tx.type === "debit" ? (
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-100 text-red-600">
                      <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><path d="M2 10h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                    </span>
                  ) : (
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-yellow-100 text-yellow-600">
                      <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="2"/><circle cx="10" cy="10" r="2" fill="currentColor"/></svg>
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-white">{tx.description}</div>
                  <div className="text-xs text-gray-400">{format(new Date(tx.date), "MMM d, yyyy h:mm a")}</div>
                </div>
                <div className={`font-semibold text-lg ${tx.type === "credit" ? "text-green-600" : tx.type === "debit" ? "text-red-600" : "text-yellow-600"}`}>
                  {tx.type === "debit" ? "-" : "+"}{formatAmount(tx.amount)}
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
