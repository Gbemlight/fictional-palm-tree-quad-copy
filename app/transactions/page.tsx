"use client";

import * as React from "react";
import {
  Search,
  Download,
  ChevronDown,
  ChevronUp,
  Smartphone,
  Wifi,
  Receipt,
  Wallet,
  CheckCircle2,
  Clock3,
  XCircle,
} from "lucide-react";
import { format, isToday, isYesterday, subDays, isAfter } from "date-fns";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { cn } from "@/lib/utils";

type TxType = "airtime" | "data" | "bills" | "wallet";
type TxStatus = "success" | "failed" | "pending";

type Transaction = {
  id: string;
  reference: string;
  type: TxType;
  status: TxStatus;
  description: string;
  recipient?: string;
  amount: number;
  createdAt: string;
};

const typeOptions = [
  { value: "all", label: "All" },
  { value: "airtime", label: "Airtime" },
  { value: "data", label: "Data" },
  { value: "bills", label: "Bills" },
  { value: "wallet", label: "Wallet" },
];

const statusOptions = [
  { value: "all", label: "All" },
  { value: "success", label: "Success" },
  { value: "failed", label: "Failed" },
  { value: "pending", label: "Pending" },
];

function makeTransactions(): Transaction[] {
  const base: Transaction[] = [];
  const now = new Date();

  const types: TxType[] = ["airtime", "data", "bills", "wallet"];
  const statuses: TxStatus[] = ["success", "pending", "failed"];

  for (let i = 0; i < 56; i++) {
    const type = types[i % types.length];
    const status = statuses[i % statuses.length];
    const daysAgo = i % 16;
    const date = subDays(now, daysAgo);

    base.push({
      id: `tx_${i + 1}`,
      reference: `QKP-${100000 + i}`,
      type,
      status,
      description:
        type === "airtime"
          ? "Airtime Purchase"
          : type === "data"
          ? "Data Bundle Purchase"
          : type === "bills"
          ? "Utility Bill Payment"
          : "Wallet Funding",
      recipient:
        type === "wallet" ? undefined : `080${String(10000000 + i).slice(0, 8)}`,
      amount:
        type === "wallet"
          ? 5000 + i * 100
          : type === "bills"
          ? 3000 + i * 250
          : 500 + i * 100,
      createdAt: date.toISOString(),
    });
  }

  return base.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

const allTransactions = makeTransactions();

function getTypeIcon(type: TxType) {
  if (type === "airtime") return <Smartphone className="h-5 w-5" />;
  if (type === "data") return <Wifi className="h-5 w-5" />;
  if (type === "bills") return <Receipt className="h-5 w-5" />;
  return <Wallet className="h-5 w-5" />;
}

function getStatusBadge(status: TxStatus) {
  if (status === "success") return <Badge variant="success">Success</Badge>;
  if (status === "failed") return <Badge variant="failed">Failed</Badge>;
  return <Badge variant="pending" dot>Pending</Badge>;
}

function groupLabel(date: Date) {
  if (isToday(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";
  if (isAfter(date, subDays(new Date(), 7))) return "Last 7 days";
  return "Older";
}

export default function TransactionsPage() {
  const [typeFilter, setTypeFilter] = React.useState("all");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [dateRange, setDateRange] = React.useState("all");
  const [search, setSearch] = React.useState("");
  const [visibleCount, setVisibleCount] = React.useState(20);
  const [expandedId, setExpandedId] = React.useState<string | null>(null);

  const filtered = React.useMemo(() => {
    const q = search.trim().toLowerCase();

    return allTransactions.filter((tx) => {
      const matchesType = typeFilter === "all" || tx.type === typeFilter;
      const matchesStatus = statusFilter === "all" || tx.status === statusFilter;

      const txDate = new Date(tx.createdAt);
      const matchesDate =
        dateRange === "all" ||
        (dateRange === "7" && isAfter(txDate, subDays(new Date(), 7))) ||
        (dateRange === "30" && isAfter(txDate, subDays(new Date(), 30)));

      const matchesSearch =
        !q ||
        tx.reference.toLowerCase().includes(q) ||
        tx.description.toLowerCase().includes(q) ||
        (tx.recipient ?? "").toLowerCase().includes(q);

      return matchesType && matchesStatus && matchesDate && matchesSearch;
    });
  }, [typeFilter, statusFilter, dateRange, search]);

  const visibleTransactions = filtered.slice(0, visibleCount);

  const grouped = React.useMemo(() => {
    return visibleTransactions.reduce<Record<string, Transaction[]>>((acc, tx) => {
      const label = groupLabel(new Date(tx.createdAt));
      if (!acc[label]) acc[label] = [];
      acc[label].push(tx);
      return acc;
    }, {});
  }, [visibleTransactions]);

  const totalSpent = filtered.reduce((sum, tx) => sum + tx.amount, 0);
  const successCount = filtered.filter((tx) => tx.status === "success").length;
  const successRate = filtered.length
    ? Math.round((successCount / filtered.length) * 100)
    : 0;

  return (
    <main className="min-h-screen bg-[#0f0f14] px-4 py-8 md:px-8 md:py-10">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <section className="rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur-xl md:p-8">
          <h1 className="text-3xl font-bold text-white md:text-4xl">
            Transaction History
          </h1>
          <p className="mt-2 text-sm text-white/70">
            Search, filter, review, and export your transactions.
          </p>
        </section>

        {/* Stats */}
        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-white/15 bg-white/10 p-5 backdrop-blur-xl">
            <p className="text-sm text-white/60">Total Transactions</p>
            <p className="mt-2 text-3xl font-bold text-white">{filtered.length}</p>
          </div>
          <div className="rounded-3xl border border-white/15 bg-white/10 p-5 backdrop-blur-xl">
            <p className="text-sm text-white/60">Total Spent</p>
            <p className="mt-2 text-3xl font-bold text-white">
              ₦{totalSpent.toLocaleString()}
            </p>
          </div>
          <div className="rounded-3xl border border-white/15 bg-white/10 p-5 backdrop-blur-xl">
            <p className="text-sm text-white/60">Success Rate</p>
            <p className="mt-2 text-3xl font-bold text-white">{successRate}%</p>
          </div>
        </section>

        {/* Filters */}
        <section className="rounded-3xl border border-white/15 bg-white/10 p-5 backdrop-blur-xl md:p-6">
          <div className="grid gap-4 md:grid-cols-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/55" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by reference, recipient, or description"
                  className="w-full rounded-2xl border border-white/10 bg-black/20 py-3 pl-10 pr-4 text-white outline-none placeholder:text-white/40"
                />
              </div>
            </div>

            <Select
              label="Type"
              value={typeFilter}
              onValueChange={setTypeFilter}
              options={typeOptions}
            />

            <Select
              label="Status"
              value={statusFilter}
              onValueChange={setStatusFilter}
              options={statusOptions}
            />
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <span className="text-sm text-white/70">Date Range:</span>

            {[
              { label: "All", value: "all" },
              { label: "Last 7 days", value: "7" },
              { label: "Last 30 days", value: "30" },
            ].map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => setDateRange(item.value)}
                className={cn(
                  "rounded-full px-4 py-2 text-sm transition",
                  dateRange === item.value
                    ? "bg-[linear-gradient(135deg,var(--color-primary),var(--color-secondary))] text-white"
                    : "border border-white/10 bg-white/5 text-white/75 hover:bg-white/10"
                )}
              >
                {item.label}
              </button>
            ))}

            <div className="ml-auto">
              <Button
                variant="secondary"
                leftIcon={<Download className="h-4 w-4" />}
                onClick={() => alert("CSV export triggered")}
              >
                Export as CSV
              </Button>
            </div>
          </div>
        </section>

        {/* Transactions */}
        <section className="rounded-3xl border border-white/15 bg-white/10 p-5 backdrop-blur-xl md:p-6">
          {Object.keys(grouped).length === 0 ? (
            <p className="text-white/70">No transactions match the current filters.</p>
          ) : (
            <div className="space-y-8">
              {Object.entries(grouped).map(([group, items]) => (
                <div key={group}>
                  <h2 className="mb-4 text-lg font-semibold text-white">{group}</h2>

                  <div className="space-y-3">
                    {items.map((tx) => {
                      const expanded = expandedId === tx.id;

                      return (
                        <div
                          key={tx.id}
                          className="rounded-2xl border border-white/10 bg-black/20 p-4"
                        >
                          <button
                            type="button"
                            onClick={() =>
                              setExpandedId(expanded ? null : tx.id)
                            }
                            className="flex w-full items-center justify-between gap-4 text-left"
                          >
                            <div className="flex items-center gap-4">
                              <div className="rounded-xl bg-white/10 p-3 text-white">
                                {getTypeIcon(tx.type)}
                              </div>

                              <div>
                                <p className="font-medium text-white">
                                  {tx.description}
                                </p>
                                <p className="text-sm text-white/60">
                                  {tx.recipient ?? tx.reference}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-4">
                              <div className="text-right">
                                <p className="font-semibold text-white">
                                  ₦{tx.amount.toLocaleString()}
                                </p>
                                <p className="text-xs text-white/55">
                                  {format(new Date(tx.createdAt), "p")}
                                </p>
                              </div>

                              {getStatusBadge(tx.status)}

                              {expanded ? (
                                <ChevronUp className="h-4 w-4 text-white/60" />
                              ) : (
                                <ChevronDown className="h-4 w-4 text-white/60" />
                              )}
                            </div>
                          </button>

                          {expanded && (
                            <div className="mt-4 grid gap-3 border-t border-white/10 pt-4 text-sm text-white/75 md:grid-cols-2">
                              <p>
                                <span className="text-white/50">Reference:</span>{" "}
                                {tx.reference}
                              </p>
                              <p>
                                <span className="text-white/50">Type:</span>{" "}
                                {tx.type}
                              </p>
                              <p>
                                <span className="text-white/50">Recipient:</span>{" "}
                                {tx.recipient ?? "N/A"}
                              </p>
                              <p>
                                <span className="text-white/50">Date:</span>{" "}
                                {format(new Date(tx.createdAt), "PPP p")}
                              </p>
                              <p className="md:col-span-2">
                                <span className="text-white/50">Description:</span>{" "}
                                {tx.description}
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {visibleCount < filtered.length && (
            <div className="mt-6 flex justify-center">
              <Button onClick={() => setVisibleCount((v) => v + 20)}>
                Load More
              </Button>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}