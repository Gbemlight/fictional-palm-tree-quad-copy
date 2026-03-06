"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { dataPlans } from "../../../lib/dummy-data";

const FILTERS = ["All", "Daily", "Weekly", "Monthly"];
const SORTS = [
  { id: "price", label: "Price (Low-High)" },
  { id: "data", label: "Data (High-Low)" },
];

function getValidity(plan) {
  // Extract days from plan name
  const match = plan.name.match(/(\d+)\s*-\s*(\d+)\s*Days|([0-9]+)\s*Days/);
  let days = 0;
  if (match) {
    days = parseInt(match[1] || match[3]);
  } else if (plan.name.includes("7 Days")) {
    days = 7;
  } else if (plan.name.includes("30 Days")) {
    days = 30;
  }
  if (days === 1) return "Daily";
  if (days === 7) return "Weekly";
  if (days === 30) return "Monthly";
  return "Monthly";
}

export default function BuyDataPlansPage() {
  const searchParams = useSearchParams();
  const provider = searchParams.get("provider") || "MTN";
  const [filter, setFilter] = useState("All");
  const [sort, setSort] = useState("price");
  const [selected, setSelected] = useState(null);

  // Filter and sort plans
  const plans = useMemo(() => {
    let filtered = dataPlans.filter((p) => p.provider.toLowerCase() === provider.toLowerCase());
    if (filter !== "All") {
      filtered = filtered.filter((p) => getValidity(p) === filter);
    }
    if (sort === "price") {
      filtered = filtered.sort((a, b) => a.price - b.price);
    } else if (sort === "data") {
      filtered = filtered.sort((a, b) => {
        // Extract GB/MB from name
        const getData = (name) => {
          const match = name.match(/(\d+)(GB|MB)/);
          if (!match) return 0;
          return match[2] === "GB" ? parseInt(match[1]) * 1024 : parseInt(match[1]);
        };
        return getData(b.name) - getData(a.name);
      });
    }
    return filtered;
  }, [provider, filter, sort]);

  return (
    <div className="min-h-screen bg-[#18181b] text-white p-6 pb-24 relative">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-white/70">
        <Link href="/dashboard" className="hover:text-white">Dashboard</Link>
        <span className="mx-2">&gt;</span>
        <Link href="/buy-data" className="hover:text-white">Buy Data</Link>
        <span className="mx-2">&gt;</span>
        <span className="font-semibold">{provider}</span>
        <span className="mx-2">&gt;</span>
        <span className="font-semibold">Select Plan</span>
      </nav>
      <h1 className="text-2xl font-bold mb-2">Select Data Plan</h1>
      <div className="flex flex-wrap gap-3 mb-6">
        {FILTERS.map((f) => (
          <button
            key={f}
            className={`px-4 py-2 rounded-full font-semibold transition ${filter === f ? "bg-indigo-500 text-white" : "bg-white/10 text-white/70 hover:bg-white/20"}`}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
        <div className="ml-auto">
          <select
            className="bg-[#23232a] text-white px-3 py-2 rounded-lg border border-white/10"
            value={sort}
            onChange={e => setSort(e.target.value)}
          >
            {SORTS.map(s => (
              <option key={s.id} value={s.id}>{s.label}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10">
        {plans.map((plan) => (
          <motion.div
            key={plan.id}
            whileHover={{ scale: 1.04, boxShadow: "0 0 24px 4px rgba(255,255,255,0.15)" }}
            className={`relative rounded-2xl p-6 bg-[#23232a] border transition-all duration-200 ${selected === plan.id ? "border-2 border-gradient-to-r from-indigo-500 via-pink-500 to-yellow-400" : "border-white/10"}`}
            onClick={() => setSelected(plan.id)}
            style={{ cursor: "pointer", minHeight: 120 }}
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xl font-bold">{plan.name.split("-")[0].trim()}</span>
              {plan.name.includes("2GB") && (
                <span className="ml-2 px-2 py-1 rounded-full bg-pink-500 text-xs font-semibold">Most Popular</span>
              )}
            </div>
            <div className="mb-2 text-lg">₦{plan.price.toLocaleString()}</div>
            <div className="text-sm text-white/70 mb-2">Validity: {plan.name.match(/(\d+\s*Days)/) ? plan.name.match(/(\d+\s*Days)/)[1] : "30 Days"}</div>
            <button
              className={`mt-2 w-full rounded-lg py-2 font-semibold transition ${selected === plan.id ? "bg-indigo-500 text-white" : "bg-white/10 text-white/70 hover:bg-white/20"}`}
              onClick={e => { e.stopPropagation(); setSelected(plan.id); }}
            >
              Select Plan
            </button>
            {selected === plan.id && (
              <span className="absolute top-3 right-3 bg-indigo-500 rounded-full p-2 text-white text-xs font-bold shadow-lg">✓</span>
            )}
          </motion.div>
        ))}
      </div>
      {/* Sticky Proceed Button */}
      <button
        className={`fixed left-0 right-0 bottom-0 mx-auto w-full max-w-xs rounded-xl py-3 font-semibold text-lg transition z-50 ${selected ? "bg-indigo-500 hover:bg-indigo-600 text-white" : "bg-gray-700 text-gray-400 cursor-not-allowed"}`}
        disabled={!selected}
        onClick={() => selected && window.location.assign(`/buy-data/payment?plan=${selected}`)}
      >
        Proceed to Payment
      </button>
    </div>
  );
}
