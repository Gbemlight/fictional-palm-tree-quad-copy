"use client";

import * as React from "react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Clock,
  Download,
  History,
  Plus,
  Send,
  Wallet as WalletIcon,
} from "lucide-react";

import { AddMoneyModal } from "@/components/wallet/add-money-modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import DashboardLayout from "@/components/dashboard/layout";
import { Progress } from "@/components/ui/progress";
import { toastSuccess } from "@/components/ui/toast";
import { mockUser, mockTransactions } from "@/lib/dummy-data";
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
  const [balance, setBalance] = React.useState(0);
  const [customRange, setCustomRange] = React.useState({ from: "", to: "" });
  const [dateRange, setDateRange] = React.useState<number | string>(7);
  const [displayedBalance, setDisplayedBalance] = React.useState(0);
  const [filter, setFilter] = React.useState("All");
  const [showAddMoney, setShowAddMoney] = React.useState(false);
  const [transactions] = React.useState(mockTransactions);

  React.useEffect(() => {
    setBalance(dummyWallet.balance);
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
      <div className="space-y-8 pb-10">
        <header>
          <h1 className="text-3xl font-black text-neutral-900 dark:text-white md:text-4xl tracking-tight">
            My Wallet
          </h1>
          <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
            Manage your funds, track spending, and view transaction history.
          </p>
        </header>

        <motion.div
          className="relative overflow-hidden rounded-[2.5rem] bg-linear-to-br from-indigo-600 via-purple-600 to-pink-500 p-8 shadow-2xl shadow-purple-500/20 md:p-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.div
            animate={{
              x: ["-100%", "200%"],
            }}
            className="absolute inset-0 z-0 bg-linear-to-r from-transparent via-white/20 to-transparent skew-x-12"
            transition={{
              duration: 3,
              ease: "linear",
              repeat: Infinity,
              repeatDelay: 2,
            }}
          />

          <div className="relative z-10 flex flex-col justify-between gap-8 md:flex-row md:items-center text-white">
            <div className="space-y-2">
              <p className="text-sm font-bold uppercase tracking-widest text-white/80">
                Total Wallet Balance
              </p>
              <h2 className="text-5xl font-black tracking-tighter md:text-6xl">
                {formatAmount(displayedBalance)}
              </h2>
              <div className="flex items-center gap-3">
                <Badge
                  className={cn(
                    "px-3 py-1 text-xs font-bold ring-2 ring-white/20",
                    tierColors[dummyWallet.tier]
                  )}
                >
                  {dummyWallet.tier} Tier
                </Badge>
                <div className="w-32">
                  <Progress value={tierProgress} />
                  <p className="mt-1 text-[10px] font-bold text-white/70 uppercase tracking-wider">
                    {tierProgress}% to {dummyWallet.nextTier}
                  </p>
                </div>
              </div>
            </div>

            <Button
              className="rounded-2xl bg-white font-black text-indigo-600 shadow-xl hover:bg-neutral-50 hover:scale-105"
              leftIcon={<Plus className="h-5 w-5" />}
              onClick={() => setShowAddMoney(true)}
              size="xl"
            >
              Add Money
            </Button>
          </div>
        </motion.div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { icon: <Plus className="h-5 w-5" />, label: "Add Money", action: () => setShowAddMoney(true) },
            { icon: <Download className="h-5 w-5" />, label: "Withdraw", action: () => {} },
            { icon: <Send className="h-5 w-5" />, label: "Send Money", action: () => {} },
            { icon: <History className="h-5 w-5" />, label: "History", action: () => {} },
          ].map((item) => (
            <button
              key={item.label}
              className="group flex flex-col items-center justify-center gap-3 rounded-3xl border border-neutral-200 bg-white p-6 transition-all hover:border-primary/50 hover:shadow-lg dark:border-white/10 dark:bg-neutral-900"
              onClick={item.action}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-transform group-hover:scale-110">
                {item.icon}
              </div>
              <span className="text-sm font-bold text-neutral-900 dark:text-white">
                {item.label}
              </span>
            </button>
          ))}
        </div>

        <section className="space-y-6">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide md:pb-0">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  className={cn(
                    "rounded-full px-6 py-2 text-sm font-bold transition-all",
                    filter === f
                      ? "bg-primary text-white shadow-lg shadow-primary/20"
                      : "bg-neutral-100 text-neutral-500 hover:bg-neutral-200 dark:bg-white/5 dark:text-neutral-400"
                  )}
                  onClick={() => setFilter(f)}
                >
                  {f}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <select
                className="rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm font-bold text-neutral-900 outline-none focus:ring-2 focus:ring-primary/20 dark:border-white/10 dark:bg-neutral-900 dark:text-white"
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
                filteredTxs.map((tx: any) => (
                  <motion.div
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-4 p-6 transition-colors hover:bg-neutral-50 dark:hover:bg-white/5"
                    initial={{ opacity: 0 }}
                    key={tx.id}
                  >
                    <div
                      className={cn(
                        "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl",
                        tx.type === "credit"
                          ? "bg-emerald-500/10 text-emerald-500"
                          : "bg-rose-500/10 text-rose-500"
                      )}
                    >
                      {tx.type === "credit" ? (
                        <ArrowUpRight className="h-6 w-6" />
                      ) : (
                        <ArrowDownLeft className="h-6 w-6" />
                      )}
                    </div>

                    <div className="flex-1">
                      <p className="truncate text-sm font-bold text-neutral-900 dark:text-white">
                        {tx.description}
                      </p>
                      <div className="flex items-center gap-2 text-xs font-medium text-neutral-500">
                        <Clock className="h-3 w-3" />
                        {format(new Date(tx.date), "MMM d, yyyy • h:mm a")}
                      </div>
                    </div>

                    <div className="text-right">
                      <p
                        className={cn(
                          "text-lg font-black tracking-tight",
                          tx.type === "credit" ? "text-emerald-500" : "text-rose-500"
                        )}
                      >
                        {tx.type === "credit" ? "+" : "-"}
                        {formatAmount(tx.amount)}
                      </p>
                      <Badge
                        className="mt-1"
                        size="sm"
                        variant={tx.status === "success" ? "success" : "pending"}
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
        onSuccess={(amt) => setBalance((b) => b + amt)}
      />
    </DashboardLayout>
  );
}
