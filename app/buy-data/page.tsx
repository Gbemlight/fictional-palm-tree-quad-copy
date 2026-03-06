"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const PROVIDERS = [
  {
    id: "mtn",
    name: "MTN",
    logo: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none"><ellipse cx="20" cy="20" rx="20" ry="20" fill="#FFD600"/><text x="50%" y="55%" textAnchor="middle" fontWeight="bold" fontSize="18" fill="#1A1A1A" dy=".3em">MTN</text></svg>
    ),
    gradient: "from-yellow-400 via-yellow-300 to-yellow-500",
  },
  {
    id: "airtel",
    name: "Airtel",
    logo: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none"><ellipse cx="20" cy="20" rx="20" ry="20" fill="#E6002D"/><text x="50%" y="55%" textAnchor="middle" fontWeight="bold" fontSize="18" fill="#fff" dy=".3em">Airtel</text></svg>
    ),
    gradient: "from-red-500 via-pink-500 to-red-600",
  },
  {
    id: "glo",
    name: "Glo",
    logo: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none"><ellipse cx="20" cy="20" rx="20" ry="20" fill="#1DBF39"/><text x="50%" y="55%" textAnchor="middle" fontWeight="bold" fontSize="18" fill="#fff" dy=".3em">Glo</text></svg>
    ),
    gradient: "from-green-500 via-lime-500 to-green-600",
  },
  {
    id: "9mobile",
    name: "9mobile",
    logo: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none"><ellipse cx="20" cy="20" rx="20" ry="20" fill="#222F5A"/><text x="50%" y="55%" textAnchor="middle" fontWeight="bold" fontSize="16" fill="#fff" dy=".3em">9mobile</text></svg>
    ),
    gradient: "from-blue-900 via-green-900 to-blue-800",
  },
];

export default function BuyDataPage() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#18181b] text-white p-6">
      <Link href="/dashboard" className="mb-6 inline-block text-sm text-white/70 hover:text-white transition">&larr; Back to Dashboard</Link>
      <h1 className="text-3xl font-bold mb-2">Buy Data</h1>
      <p className="text-white/70 mb-8">Select your network provider</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6 mb-10">
        {PROVIDERS.map((provider) => (
          <motion.button
            key={provider.id}
            type="button"
            onClick={() => setSelected(provider.id)}
            whileHover={{ scale: 1.05, boxShadow: "0 0 24px 4px rgba(255,255,255,0.15)" }}
            className={`relative flex flex-col items-center justify-center min-h-[120px] min-w-[120px] rounded-2xl p-6 transition-all duration-200 bg-gradient-to-br ${provider.gradient} shadow-lg focus:outline-none ${selected === provider.id ? "ring-2 ring-white scale-105 border-2 border-white" : "border border-white/10"}`}
            style={{ fontSize: "1.1rem" }}
          >
            {provider.logo}
            <span className="mt-3 font-semibold text-lg">{provider.name}</span>
            {selected === provider.id && (
              <span className="absolute top-3 right-3 bg-green-500 rounded-full p-2 text-white text-xs font-bold shadow-lg">✓</span>
            )}
          </motion.button>
        ))}
      </div>
      <button
        className={`w-full max-w-xs mx-auto block rounded-xl py-3 font-semibold text-lg transition ${selected ? "bg-indigo-500 hover:bg-indigo-600 text-white" : "bg-gray-700 text-gray-400 cursor-not-allowed"}`}
        disabled={!selected}
        onClick={() => selected && window.location.assign(`/buy-data/plans?provider=${selected}`)}
      >
        Next
      </button>
    </div>
  );
}
