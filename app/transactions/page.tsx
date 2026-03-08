"use client";
import React from "react";
import { Button } from "../../components/ui/button";

import { mockTransactions } from "../../lib/dummy-data";
import { format } from "date-fns";
const TransactionsPage = () => {
  // Filters state
  const [type, setType] = React.useState("all");
  const [status, setStatus] = React.useState("all");
  const [dateFrom, setDateFrom] = React.useState("");
  const [dateTo, setDateTo] = React.useState("");
  const [search, setSearch] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [expandedRows, setExpandedRows] = React.useState<{ [id: string]: boolean }>({});
  const pageSize = 10;

  // Compound filtering
  const filteredTxns = mockTransactions.filter((txn) => {
    let match = true;
    if (type !== "all") match = match && txn.type === type;
    if (status !== "all") match = match && txn.status === status;
    if (dateFrom) match = match && txn.date >= dateFrom;
    if (dateTo) match = match && txn.date <= dateTo;
    if (search) {
      const s = search.toLowerCase();
      match =
        match &&
        (txn.reference.toLowerCase().includes(s) ||
          (txn.provider && txn.provider.toLowerCase().includes(s)) ||
          (txn.description && txn.description.toLowerCase().includes(s)));
    }
    return match;
  });
  const totalTransactions = filteredTxns.length;
  const totalSpent = filteredTxns.reduce((sum, txn) => sum + txn.amount, 0);
  const successCount = filteredTxns.filter((txn) => txn.status === "success").length;
  const successRate = totalTransactions > 0 ? Math.round((successCount / totalTransactions) * 100) : 0;
  const pagedTxns = filteredTxns.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#000000] p-6">
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-purple-500/30 blur-[140px]" />
      <h1 className="text-2xl font-bold mb-4 text-white">Transaction History</h1>
      {/* Stats summary */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl shadow-lg p-4 min-w-[180px]">
          <div className="text-sm text-white/70">Total Transactions</div>
          <div className="text-2xl font-bold text-white">{totalTransactions}</div>
        </div>
        <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl shadow-lg p-4 min-w-[180px]">
          <div className="text-sm text-white/70">Total Spent</div>
          <div className="text-2xl font-bold text-white">₦{totalSpent.toLocaleString('en-US')}</div>
        </div>
        <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl shadow-lg p-4 min-w-[180px]">
          <div className="text-sm text-white/70">Success Rate</div>
          <div className="text-2xl font-bold text-white">{successRate}%</div>
        </div>
      </div>
      {/* Filter bar */}
      <div className="flex flex-wrap gap-4 mb-6 items-center bg-[#23232a]/60 rounded-xl p-4 shadow-md">
        {/* Type filter */}
        <select className="border rounded px-3 py-2 bg-[#23232a] text-cyan-400 border-cyan-400/20" value={type} onChange={e => { setType(e.target.value); setPage(1); }}>
          <option value="all">All Types</option>
          <option value="airtime">Airtime</option>
          <option value="data">Data</option>
          <option value="bills">Bills</option>
          <option value="wallet">Wallet</option>
        </select>
        {/* Status filter */}
        <select className="border rounded px-3 py-2 bg-[#23232a] text-cyan-400 border-cyan-400/20" value={status} onChange={e => { setStatus(e.target.value); setPage(1); }}>
          <option value="all">All Status</option>
          <option value="success">Success</option>
          <option value="failed">Failed</option>
          <option value="pending">Pending</option>
        </select>
        {/* Date range picker */}
        <input type="date" className="border rounded px-3 py-2 bg-[#23232a] text-cyan-400 border-cyan-400/20" value={dateFrom} onChange={e => { setDateFrom(e.target.value); setPage(1); }} />
        <span className="mx-2 text-white/70">to</span>
        <input type="date" className="border rounded px-3 py-2 bg-[#23232a] text-cyan-400 border-cyan-400/20" value={dateTo} onChange={e => { setDateTo(e.target.value); setPage(1); }} />
      </div>
      {/* Search bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by reference, recipient, or description"
          className="border rounded px-3 py-2 w-full max-w-md bg-[#23232a] text-cyan-400 border-cyan-400/20 placeholder:text-cyan-400 shadow-md"
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
        />
      </div>
      {/* Export as CSV button */}
      <div className="mb-6 flex justify-end">
        <Button variant="primary" size="md" onClick={() => alert("Exported as CSV (dummy action)")}>
          Export as CSV
        </Button>
      </div>
      {/* Transaction list grouped by date */}
      <div>
        {/* Group transactions by date */}
        {(() => {
          const now = new Date();
          const today = format(now, "yyyy-MM-dd");
          const yesterday = format(new Date(now.setDate(now.getDate() - 1)), "yyyy-MM-dd");
          const last7 = Array.from({ length: 7 }, (_, i) => format(new Date(Date.now() - i * 86400000), "yyyy-MM-dd"));
          const groups = {
            Today: [],
            Yesterday: [],
            "Last 7 days": [],
            Older: [],
          };
          pagedTxns.forEach((txn) => {
            if (txn.date === today) groups.Today.push(txn);
            else if (txn.date === yesterday) groups.Yesterday.push(txn);
            else if (last7.includes(txn.date)) groups["Last 7 days"].push(txn);
            else groups.Older.push(txn);
          });
          return (
            <>
              {Object.entries(groups).map(([label, txns]) =>
                txns.length > 0 ? (
                  <div key={label} className="mb-8">
                    <div className="text-lg font-semibold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-cyan-400 to-pink-400 drop-shadow">{label}</div>
                    <div className="divide-y divide-cyan-400/10 rounded-xl overflow-hidden shadow-md">
                      {txns.map((txn) => {
                        const expanded = !!expandedRows[txn.id];
                        return (
                          <div key={txn.id}>
                            <div
                              className="flex items-center py-3 cursor-pointer hover:bg-[#23232a]/80 transition-colors group"
                              onClick={() => setExpandedRows((prev) => ({ ...prev, [txn.id]: !prev[txn.id] }))}
                            >
                              {/* Service icon placeholder */}
                              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full flex items-center justify-center mr-4 shadow-lg group-hover:scale-105 transition-transform">
                                <span className="text-xs capitalize text-white font-bold drop-shadow">{txn.type}</span>
                              </div>
                              {/* Description */}
                              <div className="flex-1">
                                <div className="font-medium text-white drop-shadow">{txn.provider} {txn.type}</div>
                                <div className="text-xs text-cyan-400">Ref: {txn.reference}</div>
                              </div>
                              {/* Amount */}
                              <div className="font-semibold mr-4 text-white drop-shadow">₦{txn.amount.toLocaleString('en-US')}</div>
                              {/* Status badge */}
                              <span className={
                                txn.status === "success"
                                  ? "bg-lime-400/20 text-lime-400 px-2 py-1 rounded text-xs font-semibold"
                                  : txn.status === "failed"
                                  ? "bg-red-400/20 text-red-400 px-2 py-1 rounded text-xs font-semibold"
                                  : "bg-amber-400/20 text-amber-400 px-2 py-1 rounded text-xs font-semibold"
                              }>
                                {txn.status.charAt(0).toUpperCase() + txn.status.slice(1)}
                              </span>
                              {/* Timestamp */}
                              <div className="ml-4 text-xs text-cyan-400">{txn.date}</div>
                            </div>
                            {expanded && (
                              <div className="bg-gradient-to-r from-[#23232a] via-[#18181b] to-[#7c3aed] p-4 rounded-xl mt-2 mb-2 border border-cyan-400/10 shadow-lg">
                                <div className="mb-2 font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-cyan-400 to-pink-400">Transaction Details</div>
                                <div className="grid grid-cols-2 gap-2 text-sm text-white">
                                  <div>Reference: {txn.reference}</div>
                                  <div>Provider: {txn.provider}</div>
                                  <div>Type: {txn.type}</div>
                                  <div>Status: {txn.status}</div>
                                  <div>Amount: ₦{txn.amount.toLocaleString('en-US')}</div>
                                  <div>Date: {txn.date}</div>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : null
              )}
              {/* Pagination controls */}
              <div className="flex justify-center mt-6">
                <Button variant="primary" size="md" className="mr-2" disabled={page === 1} onClick={() => setPage(page - 1)}>
                  Previous
                </Button>
                <Button variant="primary" size="md" disabled={page * pageSize >= filteredTxns.length} onClick={() => setPage(page + 1)}>
                  Next
                </Button>
              </div>
            </>
          );
        })()}
      </div>
    </div>
  );
};

export default TransactionsPage;

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