"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ArrowDownLeft,
  ArrowUpRight,
  Clock,
  Download,
  Eye,
  EyeOff,
  History,
  Plus,
  Send
} from "lucide-react";

import { AddMoneyModal } from "@/components/wallet/add-money-modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import DashboardLayout from "@/components/dashboard/layout";
import { Progress } from "@/components/ui/progress";
import { toastSuccess } from "@/components/ui/toast";
import { mockTransactions, type Transaction } from "@/lib/dummy-data";
import { cn } from "@/lib/utils";

const DATE_RANGES = [
  { label: "Last 7 days", value: 7 },
  { label: "Last 30 days", value: 30 },
  { label: "Custom", value: "custom" },
];

const FILTERS = ["All", "Credit", "Debit", "Pending"];

const tierColors: Record<string, string> = {
  Gold: "bg-yellow-400 text-yellow-900",
  Platinum: "bg-gradient-to-r from-blue-400 to-purple-500 text-white",
  Silver: "bg-gray-300 text-gray-700",
};

const dummyWallet = {
  balance: 15432.5,
  nextTier: "Gold",
  tier: "Silver",
  tierProgress: 40000,
  tierTarget: 100000,
};

function formatAmount(amount: number) {
  return `₦${amount.toLocaleString(undefined, {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  })}`;
}

export default function WalletPage() {
  const router = useRouter();
  const [customRange] = React.useState({ from: "", to: "" });
  const [dateRange, setDateRange] = React.useState<number | string>(7);
  const [displayedBalance, setDisplayedBalance] = React.useState(0);
  const [filter, setFilter] = React.useState("All");
  const [showAddMoney, setShowAddMoney] = React.useState(false);
  const [showBalance, setShowBalance] = React.useState(true);
  const [mounted, setMounted] = React.useState(false);
  const [transactions] = React.useState(mockTransactions);

  React.useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("app_balance_visible");
    if (saved !== null) setShowBalance(saved === "true");

    const start = 0;
    const end = dummyWallet.balance;
    if (start === end) {
      setDisplayedBalance(end);
      return;
    }
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

  const toggleBalance = () => {
    const newState = !showBalance;
    setShowBalance(newState);
    localStorage.setItem("app_balance_visible", String(newState));
  };

  const filteredTxs = transactions.filter((tx: Transaction) => {
    if (filter === "Credit" && tx.type !== "wallet_credit") return false;
    if (filter === "Debit" && tx.type !== "wallet_debit") return false;
    if (filter === "Pending" && tx.status !== "pending") return false;

    if (dateRange !== "custom") {
      const days = typeof dateRange === "number" ? dateRange : 7;
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - days);
      return new Date(tx.date) >= cutoff;
    } else if (customRange.from && customRange.to) {
      return (
        new Date(tx.date) >= new Date(customRange.from) &&
        new Date(tx.date) <= new Date(customRange.to)
      );
    }
    return true;
  });

  const handleExport = () => {
    toastSuccess("Statement exported successfully!");
  };

  const tierProgress = Math.min(
    100,
    Math.round((dummyWallet.tierProgress / dummyWallet.tierTarget) * 100)
  );

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-10 pb-20">
        <header className="space-y-4">
          <Link 
            href="/dashboard" 
            className="group inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-neutral-400 hover:text-indigo-600 transition-colors"
          >
            <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Dashboard
          </Link>
          
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white md:text-4xl">
              My Wallet
            </h1>
            <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
              Manage your funds, track spending, and view transaction history.
            </p>
          </div>
        </header>

        <motion.div
          className="relative overflow-hidden rounded-[3rem] bg-linear-to-br from-indigo-600 to-violet-700 p-8 shadow-2xl shadow-indigo-500/20 md:p-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Glassmorphic decorative elements */}
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 h-48 w-48 rounded-full bg-indigo-400/20 blur-2xl" />

          <div className="relative z-10 flex flex-col justify-between gap-8 md:flex-row md:items-center text-white">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <p className="text-xs font-bold uppercase tracking-widest text-indigo-100/80">
                  Total Wallet Balance
                </p>
                <button
                  type="button"
                  onClick={toggleBalance}
                  className="rounded-full p-1.5 bg-white/10 hover:bg-white/20 transition-colors focus:outline-none"
                  aria-label={showBalance ? "Hide balance" : "Show balance"}
                >
                  {showBalance ? <EyeOff className="h-4 w-4 text-white" /> : <Eye className="h-4 w-4 text-white" />}
                </button>
              </div>
              <h2 className="text-5xl font-bold tracking-tight md:text-6xl">
                {!mounted || showBalance ? formatAmount(displayedBalance) : "₦ • • • •"}
              </h2>
              <div className="flex items-center gap-4 pt-2">
                <Badge
                  className={cn(
                    "px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-full border-none",
                    tierColors[dummyWallet.tier]
                  )}
                >
                  {dummyWallet.tier} Tier
                </Badge>
                <div className="w-32">
                  <Progress value={tierProgress} className="h-1.5 bg-white/20" />
                  <p className="mt-1 text-[10px] font-bold text-white/70 uppercase tracking-wider">
                    {tierProgress}% to {dummyWallet.nextTier}
                  </p>
                </div>
              </div>
            </div>

            <Button
              className="rounded-2xl bg-linear-to-r from-indigo-600 to-violet-600 border border-white/20 font-bold text-white shadow-xl hover:opacity-90 hover:scale-105 transition-all h-14 px-8"
              leftIcon={<Plus className="h-5 w-5" />}
              onClick={() => setShowAddMoney(true)}
              size="xl"
            >
              Add Money
            </Button>
          </div>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: <Plus className="h-5 w-5" />, label: "Add Money", action: () => setShowAddMoney(true) },
            { icon: <Download className="h-5 w-5" />, label: "Withdraw", action: () => {} },
            { icon: <Send className="h-5 w-5" />, label: "Send Money", action: () => {} },
            { icon: <History className="h-5 w-5" />, label: "Activity", action: () => router.push('/transactions') },
          ].map((item) => (
            <button
              key={item.label}
              className="group flex flex-col items-center justify-center gap-3 rounded-[2.5rem] border border-neutral-200 bg-white p-6 transition-all hover:border-indigo-600/50 hover:shadow-xl dark:border-white/10 dark:bg-neutral-900"
              onClick={item.action}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-neutral-50 dark:bg-white/5 text-indigo-600 dark:text-indigo-400 transition-transform group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white">
                {item.icon}
              </div>
              <span className="text-[13px] font-bold text-neutral-600 dark:text-neutral-400">
                {item.label}
              </span>
            </button>
          ))}
        </div>

        <section className="space-y-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 no-scrollbar">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  className={cn(
                    "rounded-full px-6 py-2 text-sm font-bold transition-all",
                    filter === f
                      ? "bg-linear-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/20"
                      : "bg-neutral-100 text-neutral-500 hover:bg-neutral-200 dark:bg-neutral-900 dark:text-neutral-400 border border-transparent dark:border-white/5"
                  )}
                  onClick={() => setFilter(f)}
                >
                  {f}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <select
                className="rounded-full border border-neutral-200 bg-white px-4 py-2 text-xs font-bold text-neutral-500 outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-white/10 dark:bg-neutral-900 dark:text-white h-10"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value === "custom" ? "custom" : Number(e.target.value))}
              >
                {DATE_RANGES.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>

              <Button
                className="rounded-xl"
                leftIcon={<Download className="h-4 w-4" />}
                onClick={handleExport}
                size="sm"
                variant="secondary"
              >
                Export
              </Button>
            </div>
          </div>

          <div className="overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm dark:border-white/10 dark:bg-neutral-900">
            <div className="flex items-center justify-between border-b border-neutral-100 p-6 dark:border-white/5">
              <h3 className="text-lg font-black tracking-wider text-neutral-900 uppercase dark:text-white">
                Recent Transactions
              </h3>
            </div>

            <div className="divide-y divide-neutral-100 dark:divide-white/5">
              <AnimatePresence initial={false}>
              {filteredTxs.length === 0 ? (
                <div className="p-12 text-center">
                  <p className="text-sm font-medium text-neutral-500">
                    No transactions found for the selected criteria.
                  </p>
                </div>
              ) : (
                filteredTxs.map((tx: Transaction) => (
                  <motion.div
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-4 p-6 transition-colors hover:bg-neutral-50 dark:hover:bg-white/5"
                    initial={{ opacity: 0 }}
                    key={tx.id}
                  >
                    <div
                      className={cn(
                        "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl",
                        tx.type === "wallet_credit"
                          ? "bg-emerald-500/10 text-emerald-500"
                          : "bg-rose-500/10 text-rose-500"
                      )}
                    >
                      {tx.type === "wallet_credit" ? (
                        <ArrowUpRight className="h-6 w-6" />
                      ) : (
                        <ArrowDownLeft className="h-6 w-6" />
                      )}
                    </div>

                    <div className="flex-1">
                      <p className="truncate text-[15px] font-bold text-neutral-900 dark:text-white">
                        {tx.description}
                      </p>
                      <div className="flex items-center gap-2 text-[12px] font-medium text-neutral-400">
                        <Clock className="h-3 w-3" />
                        {format(new Date(tx.date), "MMM d, yyyy • h:mm a")}
                      </div>
                    </div>

                    <div className="text-right">
                      <p
                        className={cn(
                          "text-lg font-bold tracking-tight",
                          tx.type === "wallet_credit" ? "text-emerald-600" : "text-neutral-900 dark:text-white"
                        )}
                      >
                        {tx.type === "wallet_credit" ? "+" : "-"}
                        {formatAmount(tx.amount)}
                      </p>
                      <Badge
                        className="mt-1 rounded-full text-[10px] uppercase font-bold tracking-widest"
                        size="sm"
                        variant={tx.status === "success" ? "success" : "neutral"}
                      >
                        {tx.status}
                      </Badge>
                    </div>
                  </motion.div>
                ))
              )}
              </AnimatePresence>
            </div>
          </div>
        </section>
      </div>

      <AddMoneyModal
        open={showAddMoney}
        onOpenChange={setShowAddMoney}
        onSuccess={(amt) => setDisplayedBalance((b) => b + amt)}
      />
    </DashboardLayout>
  );
}
