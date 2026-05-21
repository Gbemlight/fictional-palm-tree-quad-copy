"use client";

import * as React from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  format,
  isToday,
  isYesterday,
  differenceInDays,
  parseISO,
} from "date-fns";
import { motion } from "framer-motion";
import {
  Search,
  Download,
  ArrowUpRight,
  ArrowDownLeft,
  Repeat,
  Info,
  Flag,
  Smartphone,
  Wifi,
  Zap,
  Tv,
} from "lucide-react"; // Third-party libraries

// Absolute imports
import DashboardLayout from "@/components/dashboard/layout"; // Line 34 in original file
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import type { SelectOption } from "@/components/ui/select";
import { toastInfo } from "@/components/ui/toast";
import { mockTransactions } from "@/lib/dummy-data";
import type { Transaction, TransactionType } from "@/lib/dummy-data";
import { cn } from "@/lib/utils";

// Relative imports
import { StatusIndicator } from "./status-indicator";


const TRANSACTION_TYPES_OPTIONS: SelectOption[] = [
  { value: "All", label: "All" },
  { value: "Airtime", label: "Airtime" },
  { value: "Data", label: "Data" },
  { value: "Bills", label: "Bills" }, // Assuming "Bills" maps to electricity/tv
  { value: "Wallet", label: "Wallet" }, // Assuming "Wallet" maps to wallet_credit/debit
];
const TRANSACTION_STATUSES_OPTIONS: SelectOption[] = [
  { value: "All", label: "All" },
  { value: "Success", label: "Success" },
  { value: "Failed", label: "Failed" },
  { value: "Pending", label: "Pending" },
  { value: "Processing", label: "Processing" },
  { value: "Cancelled", label: "Cancelled" },
];
const DATE_FILTERS = [
  { label: "All Time", value: "all" },
  { label: "Last 7 Days", value: "7" },
  { label: "Last 30 Days", value: "30" },
  { label: "Custom", value: "custom" },
];

const getServiceIcon = (type: TransactionType) => {
  switch (type) {
    case "airtime":
      return <Smartphone className="h-5 w-5 text-indigo-500" />;
    case "data":
      return <Wifi className="h-5 w-5 text-fuchsia-500" />;
    case "electricity":
      return <Zap className="h-5 w-5 text-orange-400" />;
    case "tv":
      return <Tv className="h-5 w-5 text-sky-500" />;
    case "wallet_credit":
      return <ArrowUpRight className="h-5 w-5 text-emerald-600" />;
    case "wallet_debit":
      return <ArrowDownLeft className="h-5 w-5 text-rose-600" />;
    default:
      return <span className="text-lg">💸</span>;
  }
};

const formatAmount = (amount: number) => {
  return `\u20A6${amount.toLocaleString(undefined, {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  })}`;
};

export default function TransactionsPage() {
  const router = useRouter();
  const [typeFilter, setTypeFilter] = React.useState<string>("All");
  const [statusFilter, setStatusFilter] = React.useState<string>("All");
  const [dateFilter, setDateFilter] = React.useState<string>("all");
  const [searchTerm, setSearchTerm] = React.useState<string>("");
  const [currentPage, setCurrentPage] = React.useState(1);
  const transactionsPerPage = 10;

  const filteredTransactions = React.useMemo(() => {
    let filtered = mockTransactions;

    // Type filter
    if (typeFilter !== "All") {
      filtered = filtered.filter((tx) => {
        if (typeFilter === "Bills") {
          return tx.type === "electricity" || tx.type === "tv";
        }
        if (typeFilter === "Wallet") {
          return tx.type === "wallet_credit" || tx.type === "wallet_debit";
        }
        return tx.type === typeFilter.toLowerCase();
      });
    }

    // Status filter
    if (statusFilter !== "All") {
      filtered = filtered.filter(
        (tx) => tx.status === statusFilter.toLowerCase(),
      );
    }

    // Date filter
    if (dateFilter !== "all") {
      const now = new Date();
      filtered = filtered.filter((tx) => {
        const txDate = parseISO(tx.date);
        if (dateFilter === "7") {
          return differenceInDays(now, txDate) <= 7;
        }
        if (dateFilter === "30") {
          return differenceInDays(now, txDate) <= 30;
        }
        // Custom date range logic would go here if implemented
        return true;
      });
    }

    // Search filter
    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (tx) =>
          tx.reference.toLowerCase().includes(lowerCaseSearchTerm) ||
          tx.recipient?.toLowerCase().includes(lowerCaseSearchTerm) ||
          tx.description.toLowerCase().includes(lowerCaseSearchTerm) ||
          tx.provider.toLowerCase().includes(lowerCaseSearchTerm),
      );
    }

    // Sort by date descending
    return filtered.sort(
      (a, b) => parseISO(b.date).getTime() - parseISO(a.date).getTime(),
    );
  }, [typeFilter, statusFilter, dateFilter, searchTerm]);

  const totalTransactions = filteredTransactions.length;
  const totalSpent = filteredTransactions.reduce(
    (sum, tx) => sum + tx.amount + (tx.fee || 0),
    0,
  );
  const successfulTransactions = filteredTransactions.filter(
    (tx) => tx.status === "success",
  ).length;
  const successRate =
    totalTransactions > 0
      ? ((successfulTransactions / totalTransactions) * 100).toFixed(1)
      : "0.0";

  // Pagination logic
  const totalPages = Math.ceil(
    filteredTransactions.length / transactionsPerPage,
  );
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * transactionsPerPage,
    currentPage * transactionsPerPage,
  );

  const groupedTransactions = React.useMemo(() => {
    const groups: { [key: string]: Transaction[] } = {};
    paginatedTransactions.forEach((tx) => {
      const txDate = parseISO(tx.date);
      let groupKey: string;
      if (isToday(txDate)) {
        groupKey = "Today";
      } else if (isYesterday(txDate)) {
        groupKey = "Yesterday";
      } else if (differenceInDays(new Date(), txDate) <= 7) {
        groupKey = "Last 7 Days";
      } else {
        groupKey = "Older";
      }
      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(tx);
    });
    return groups;
  }, [paginatedTransactions]);

  const handleExport = () => {
    toastInfo("Export to CSV functionality coming soon!");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 md:space-y-10 pb-10 md:pb-20">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-white md:text-3xl tracking-tight">
            Transactions
          </h1>
            <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
              Monitor your financial activity and spending patterns.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="hidden md:flex h-10 rounded-2xl border-none bg-linear-to-r from-indigo-600 to-violet-600 text-white shadow-sm hover:opacity-90 transition-opacity"
            onClick={handleExport}
          >
            <Download className="h-4 w-4 mr-2" /> Export History
          </Button>
        </header>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard 
            label="Activity" 
            value={totalTransactions} 
            description="Processed this period"
            icon={<Repeat className="h-5 w-5 text-indigo-500" />}
          />
          <StatCard 
            label="Volume" 
            value={formatAmount(totalSpent)} 
            description="Total outflow value"
            icon={<ArrowUpRight className="h-5 w-5 text-emerald-500" />}
          />
          <StatCard 
            label="Performance" 
            value={successRate + "%"} 
            description="Transaction reliability"
            icon={<div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />}
          />
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col md:flex-row gap-3 md:gap-4 items-stretch md:items-center justify-between bg-white dark:bg-neutral-950 p-2 md:p-3 rounded-3xl md:rounded-full border border-neutral-200 dark:border-white/10 shadow-sm">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <Input
              placeholder="Search history..."
              className="pl-10 pr-4 h-11 md:h-12 w-full md:max-w-sm rounded-full border-none shadow-none bg-neutral-50/50 dark:bg-neutral-900/50 md:bg-transparent focus-visible:ring-0 text-sm text-neutral-900 dark:text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto md:overflow-visible pb-1 md:pb-0 no-scrollbar px-2">
            <Select
              value={typeFilter}
              onValueChange={setTypeFilter}
              options={TRANSACTION_TYPES_OPTIONS}
              placeholder="Type"
              triggerClassName="min-w-[100px] md:w-[110px] h-10 rounded-full border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-neutral-800 shadow-none hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
            />
            <Select
              value={statusFilter}
              onValueChange={setStatusFilter}
              options={TRANSACTION_STATUSES_OPTIONS}
              placeholder="Status"
              triggerClassName="min-w-[100px] md:w-[110px] h-10 rounded-full border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-neutral-800 shadow-none hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
            />
            <Select
              value={dateFilter}
              onValueChange={setDateFilter}
              options={DATE_FILTERS}
              placeholder="Period"
              triggerClassName="min-w-[110px] md:w-[120px] h-10 rounded-full border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-neutral-800 shadow-none hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
            />
          </div>
        </div>

        {/* Transaction List */}
        <div className="space-y-6">
          {Object.keys(groupedTransactions).length === 0 ? (
            <div className="p-12 text-center text-neutral-500 dark:text-neutral-400 border-2 border-dashed border-neutral-100 dark:border-white/5 rounded-3xl">
              No transactions found matching your criteria.
            </div>
          ) : (
            Object.entries(groupedTransactions).map(([group, transactions]) => (
              <div key={group}>
                <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400 mb-5 px-4">
                  {group}
                </h2>
                <div className="space-y-3">
                  {transactions.map((tx) => (
                    <div
                      key={tx.id}
                      className="relative group overflow-hidden rounded-4xl"
                    >
                      {/* Swipe Background Layer */}
                      <div className="absolute inset-0 flex items-center justify-between rounded-4xl overflow-hidden">
                        {/* Left Action: Repeat (revealed on drag right) */}
                        <div className="h-full w-1/2 flex items-center justify-start px-8 bg-emerald-600 text-white">
                          <div className="flex flex-col items-center gap-1">
                          <Repeat size={20} />
                            <span className="text-[10px] font-bold uppercase tracking-wider">
                            Repeat
                          </span>
                          </div>
                        </div>

                        {/* Right Action: Report (revealed on drag left) */}
                        <div className="h-full w-1/2 flex items-center justify-end px-8 bg-rose-600 text-white">
                          <button className="flex flex-col items-center gap-1 hover:opacity-80 transition-opacity">
                            <Flag size={20} />
                            <span className="text-[10px] font-bold uppercase tracking-wider">
                              Report
                            </span>
                          </button>
                        </div>
                      </div>

                      <motion.div
                        drag="x"
                        dragConstraints={{ left: -80, right: 80 }}
                        dragElastic={0.1}
                        dragDirectionLock
                        onDragEnd={(_: any, info: any) => {
                          if (info.offset.x > 50)
                            toastInfo("Repeating transaction...");
                        }}
                        className="relative z-10"
                      >
                        <Link
                          href={`/transactions/${tx.id}`}
                          className="flex items-center gap-3 md:gap-4 p-4 md:p-5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 shadow-[0_4px_12px_-4px_rgba(0,0,0,0.05)] transition-all hover:border-indigo-500/30 active:scale-[0.995] rounded-4xl"
                        >
                          <div className="h-12 w-12 md:h-14 md:w-14 shrink-0 rounded-2xl bg-neutral-50 dark:bg-white/5 flex items-center justify-center border border-neutral-100 dark:border-white/10 transition-colors group-hover:bg-white dark:group-hover:bg-neutral-800">
                            {getServiceIcon(tx.type)}
                          </div>
                          <div className="flex-1">
                            <p className="truncate text-[15px] md:text-[16px] font-bold text-neutral-900 dark:text-white">
                              {tx.description}
                            </p>
                            <p className="text-[13px] font-medium text-neutral-500 dark:text-neutral-400">
                              {tx.recipient ? `${tx.recipient} • ` : ""}
                              {format(
                                parseISO(tx.date),
                                "h:mm a",
                              )}
                            </p>
                          </div>
                          <div className="text-right">
                            <p
                              className={cn(
                                "text-[16px] md:text-[17px] font-bold tracking-tight",
                                tx.type === "wallet_credit"
                                  ? "text-emerald-600"
                                  : "text-neutral-900 dark:text-white",
                              )}
                            >
                              {tx.type === "wallet_credit" ? "+" : "-"}
                              {formatAmount(tx.amount + (tx.fee || 0))}
                            </p>
                            <StatusIndicator status={tx.status} size="sm" />
                          </div>
                        </Link>
                      </motion.div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-12 pb-10">
            <Button
              variant="ghost"
              className="w-full sm:w-auto rounded-full h-11 sm:h-10 px-6 text-xs font-bold uppercase tracking-[0.15em] text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-white/10 transition-all disabled:opacity-30"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  size="icon"
                  className={cn(
                    "rounded-full h-10 w-10 text-sm font-bold transition-all",
                    currentPage === page
                      ? "bg-linear-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/30 ring-2 ring-indigo-500/20 ring-offset-2 hover:opacity-90"
                      : "bg-white dark:bg-neutral-900 text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-white/10"
                  )}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </Button>
              ))}
            </div>
            <Button
              variant="ghost"
              className="w-full sm:w-auto rounded-full h-11 sm:h-10 px-6 text-xs font-bold uppercase tracking-[0.15em] text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-white/10 transition-all disabled:opacity-30"
              onClick={() =>
                setCurrentPage((prev) => Math.min(totalPages, prev + 1))
              }
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

const StatCard = ({
  label,
  value,
  description,
  icon,
}: {
  label: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
}) => {
  return (
    <div className="p-6 rounded-4xl bg-white dark:bg-neutral-900 border border-neutral-200/60 dark:border-white/5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-2">
        <p className="text-[11px] font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
          {label}
        </p>
        <div className="p-2.5 rounded-2xl bg-neutral-50 dark:bg-white/5 border border-neutral-100 dark:border-white/10">
          {icon}
        </div>
      </div>
      <p className="text-3xl font-bold text-neutral-900 dark:text-white tracking-tight">
        {value}
      </p>
      {description && (
        <p className="text-xs font-medium text-neutral-400 dark:text-neutral-500 mt-1">
          {description}
        </p>
      )}
    </div>
  );
};
