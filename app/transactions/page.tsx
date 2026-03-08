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
