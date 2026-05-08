"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Search,
  Download,
  ArrowUpRight,
  ArrowDownLeft,
  Repeat,
  Info,
  Flag
} from "lucide-react";
import { format, isToday, isYesterday, differenceInDays, parseISO } from "date-fns";

import DashboardLayout from "@/components/dashboard/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import type { SelectOption } from "@/components/ui/select";
import { mockTransactions } from "@/lib/dummy-data";
import type { Transaction, TransactionType } from "@/lib/dummy-data";
import { cn } from "@/lib/utils";
import { StatusIndicator } from "./status-indicator";
import { toastInfo } from "@/components/ui/toast";

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
    case "airtime": return <span className="text-lg">📱</span>;
    case "data": return <span className="text-lg">📶</span>;
    case "electricity": return <span className="text-lg">💡</span>;
    case "tv": return <span className="text-lg">📺</span>;
    case "wallet_credit": return <ArrowUpRight className="h-5 w-5 text-emerald-500" />;
    case "wallet_debit": return <ArrowDownLeft className="h-5 w-5 text-rose-500" />;
    default: return <span className="text-lg">💸</span>;
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
      filtered = filtered.filter((tx) => tx.status === statusFilter.toLowerCase());
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
          tx.provider.toLowerCase().includes(lowerCaseSearchTerm)
      );
    }

    // Sort by date descending
    return filtered.sort((a, b) => parseISO(b.date).getTime() - parseISO(a.date).getTime());
  }, [typeFilter, statusFilter, dateFilter, searchTerm]);

  const totalTransactions = filteredTransactions.length;
  const totalSpent = filteredTransactions.reduce((sum, tx) => sum + tx.amount + (tx.fee || 0), 0);
  const successfulTransactions = filteredTransactions.filter(tx => tx.status === "success").length;
  const successRate = totalTransactions > 0 ? ((successfulTransactions / totalTransactions) * 100).toFixed(1) : "0.0";

  // Pagination logic
  const totalPages = Math.ceil(filteredTransactions.length / transactionsPerPage);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * transactionsPerPage,
    currentPage * transactionsPerPage
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
      <div className="space-y-8 pb-10">
        <header>
          <h1 className="text-3xl font-black text-neutral-900 dark:text-white md:text-4xl tracking-tight">
            Transaction History
          </h1>
          <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
            View and manage all your past transactions.
          </p>
        </header>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard label="Total Transactions" value={totalTransactions} />
          <StatCard label="Total Spent" value={formatAmount(totalSpent)} />
          <StatCard label="Success Rate" value={successRate + "%"} />
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <Input
              placeholder="Search by reference, recipient, description..."
              className="pl-9 pr-4 py-2 rounded-xl border border-neutral-200 dark:border-white/10 dark:bg-neutral-900"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Select
              value={typeFilter}
              onValueChange={setTypeFilter}
              options={TRANSACTION_TYPES_OPTIONS}
              placeholder="Type"
              triggerClassName="w-[180px] rounded-xl border border-neutral-200 dark:border-white/10 dark:bg-neutral-900"
            />
            <Select
              value={statusFilter}
              onValueChange={setStatusFilter}
              options={TRANSACTION_STATUSES_OPTIONS}
              placeholder="Status"
              triggerClassName="w-[180px] rounded-xl border border-neutral-200 dark:border-white/10 dark:bg-neutral-900"
            />
            <Select
              value={dateFilter}
              onValueChange={setDateFilter}
              options={DATE_FILTERS}
              placeholder="Date Range"
              triggerClassName="w-[180px] rounded-xl border border-neutral-200 dark:border-white/10 dark:bg-neutral-900"
            />
            
            <Button variant="secondary" className="rounded-xl" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" /> Export CSV
            </Button>
          </div>
        </div>

        {/* Transaction List */}
        <div className="space-y-6">
          {Object.keys(groupedTransactions).length === 0 ? (
            <div className="p-12 text-center text-neutral-500 dark:text-neutral-400">
              No transactions found matching your criteria.
            </div>
          ) : (
            Object.entries(groupedTransactions).map(([group, transactions]) => (
              <div key={group}>
                <h2 className="text-lg font-black text-neutral-900 dark:text-white mb-4">{group}</h2>
                <div className="space-y-3">
                  {transactions.map((tx) => (
                    <div key={tx.id} className="relative group overflow-hidden rounded-3xl">
                      {/* Swipe Actions: Left (Reveals Repeat) */}
                      <div className="absolute inset-0 flex items-center justify-start px-6 bg-emerald-500 text-white">
                        <div className="flex flex-col items-center gap-1">
                          <Repeat size={20} />
                          <span className="text-[10px] font-bold uppercase">Repeat</span>
                        </div>
                      </div>
                      
                      {/* Swipe Actions: Right (Reveals Info/Report) */}
                      <div className="absolute inset-0 flex items-center justify-end px-4 bg-neutral-100 dark:bg-neutral-800 gap-4">
                        <button className="flex flex-col items-center gap-1 text-neutral-500">
                          <Flag size={20} />
                          <span className="text-[10px] font-bold uppercase">Report</span>
                        </button>
                        <button onClick={() => router.push(`/transactions/${tx.id}`)} className="flex flex-col items-center gap-1 text-primary">
                          <Info size={20} />
                          <span className="text-[10px] font-bold uppercase">Details</span>
                        </button>
                      </div>

                      <motion.div
                        drag="x"
                        dragConstraints={{ left: -140, right: 80 }}
                        dragElastic={0.1}
                        dragDirectionLock
                        onDragEnd={(_, info) => {
                          if (info.offset.x > 50) toastInfo("Repeating transaction...");
                        }}
                        className="relative z-10"
                      >
                        <Link href={`/transactions/${tx.id}`} className="flex items-center gap-4 p-4 md:p-6 bg-white dark:bg-neutral-900 border-neutral-200 dark:border-white/5 transition-colors active:bg-neutral-50 dark:active:bg-white/5">
                          <div className="h-10 w-10 shrink-0 rounded-xl bg-neutral-50 dark:bg-white/5 flex items-center justify-center">
                            {getServiceIcon(tx.type)}
                          </div>
                          <div className="flex-1">
                            <p className="truncate text-sm font-bold text-neutral-900 dark:text-white">
                              {tx.description}
                            </p>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400">
                              {tx.recipient ? `To: ${tx.recipient} • ` : ''}
                              {format(parseISO(tx.date), "MMM d, yyyy • h:mm a")}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className={cn(
                              "text-base font-black tracking-tight",
                              tx.type === "wallet_credit" ? "text-emerald-500" : "text-neutral-900 dark:text-white"
                            )}>
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
          <div className="flex justify-center gap-2 mt-8">
            <Button
              variant="secondary"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "primary" : "secondary"}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </Button>
            ))}
            <Button
              variant="secondary"
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
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

const StatCard = ({ label, value }: { label: string; value: string | number }) => {
  return (
    <Card className="p-5 rounded-3xl bg-white dark:bg-neutral-900 border-neutral-200 dark:border-white/5">
      <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">{label}</p>
      <p className="text-2xl font-black text-neutral-900 dark:text-white mt-1">{value}</p>
    </Card>
  );
};