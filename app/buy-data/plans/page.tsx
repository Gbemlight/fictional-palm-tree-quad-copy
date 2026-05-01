"use client";

import { useState, useMemo, Suspense } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams, useRouter } from "next/navigation";
import { ChevronRight, ArrowRight, Check, Zap, Filter, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { dataPlans } from "../../../lib/dummy-data";

const FILTERS = ["All", "Daily", "Weekly", "Monthly"];
const SORTS = [
  { id: "price", label: "Price (Low-High)" },
  { id: "data", label: "Data (High-Low)" },
];

function getValidity(plan: any) {
  // Extract days from plan name
  const match = plan.name.match(/(\d+)\s*-\s*(\d+)\s*Days|([0-9]+)\s*Days/);
  let days = 0;
  if (match) {
    days = parseInt(match[1] || match[2] || match[3]);
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

function BuyDataPlansContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const provider = searchParams.get("provider") || "mtn";
  const [filter, setFilter] = useState("All");
  const [sort, setSort] = useState("price");
  const [selected, setSelected] = useState<string | null>(null);

  // Filter and sort plans based on provider and user choice
  const plans = useMemo(() => {
    let filtered = dataPlans.filter((p) => p.provider.toLowerCase() === provider.toLowerCase());
    if (filter !== "All") {
      filtered = filtered.filter((p) => getValidity(p) === filter);
    }
    if (sort === "price") {
      filtered = filtered.sort((a, b) => a.price - b.price);
    } else if (sort === "data") {
      filtered = filtered.sort((a, b) => {
        // Extract GB/MB from name for comparison
        const getData = (name: string) => {
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
    <main className="min-h-screen bg-neutral-50 dark:bg-neutral-950 p-6 md:p-12 lg:p-16 pb-32">
      <div className="max-w-6xl mx-auto">
      {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 text-sm font-medium text-neutral-500 overflow-x-auto whitespace-nowrap scrollbar-hide">
          <Link href="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link>
          <ChevronRight className="h-4 w-4 shrink-0" />
          <Link href="/buy-data" className="hover:text-primary transition-colors">Buy Data</Link>
          <ChevronRight className="h-4 w-4 shrink-0" />
          <span className="text-neutral-900 dark:text-white font-bold uppercase">{provider}</span>
          <ChevronRight className="h-4 w-4 shrink-0" />
          <span className="text-primary font-bold">Select Plan</span>
        </nav>

        <header className="mb-10">
          <h1 className="text-4xl font-black tracking-tight text-neutral-900 dark:text-white mb-2">
            Select Data Plan
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 font-medium uppercase tracking-wider text-xs">
            Available plans for {provider} network
          </p>
        </header>

        {/* Controls: Filter & Sort */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "px-6 py-2.5 rounded-2xl text-sm font-bold transition-all duration-300",
                  filter === f 
                    ? "bg-primary text-white shadow-lg shadow-primary/25 scale-105" 
                    : "bg-white dark:bg-white/5 text-neutral-500 dark:text-white/60 border border-neutral-200 dark:border-white/10 hover:border-primary/50"
                )}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 bg-white dark:bg-white/5 p-1.5 rounded-2xl border border-neutral-200 dark:border-white/10 self-start md:self-auto">
            <ArrowUpDown className="h-4 w-4 ml-3 text-neutral-400" />
            <select
              className="bg-transparent text-sm font-bold text-neutral-900 dark:text-white pr-8 py-2 outline-none cursor-pointer"
              value={sort}
              onChange={e => setSort(e.target.value)}
            >
              {SORTS.map(s => (
                <option key={s.id} value={s.id} className="dark:bg-neutral-900">{s.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Plan Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <AnimatePresence mode="popLayout">
            {plans.map((plan) => {
              const isActive = selected === plan.id;
              const isPopular = plan.name.includes("2GB"); // Example logic for popular badge

              return (
                <motion.div
                  key={plan.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileHover={{ y: -4 }}
                  className={cn(
                    "group relative rounded-4xl p-8 transition-all duration-300 cursor-pointer overflow-hidden",
                    "bg-white dark:bg-white/5 border-2 shadow-xl",
                    isActive 
                      ? "border-primary bg-primary/5 dark:bg-primary/10 ring-4 ring-primary/20" 
                      : "border-neutral-200 dark:border-white/10 hover:border-primary/40"
                  )}
                  onClick={() => setSelected(plan.id)}
                >
                  {isPopular && (
                    <div className="absolute top-6 right-6">
                      <Badge variant="info" size="sm" icon={<Zap className="h-3 w-3 fill-current" />} pulse>
                        Popular
                      </Badge>
                    </div>
                  )}

                  <div className="mb-6">
                    <div className="text-sm font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-1">Data Amount</div>
                    <div className="text-3xl font-black text-neutral-900 dark:text-white">
                      {plan.name.split("-")[0].trim()}
                    </div>
                  </div>

                  <div className="mb-8 space-y-2">
                    <div className="flex items-baseline gap-1">
                      <span className="text-sm font-bold text-neutral-400">₦</span>
                      <span className="text-4xl font-black text-primary">{plan.price.toLocaleString()}</span>
                    </div>
                    <div className="text-sm font-bold text-neutral-500 flex items-center gap-1.5">
                      Validity: <span className="text-neutral-900 dark:text-neutral-300">{plan.name.match(/(\d+\s*Days)/)?.[0] || "30 Days"}</span>
                    </div>
                  </div>

                  <Button
                    fullWidth
                    variant={isActive ? "primary" : "secondary"}
                    className={cn(
                      "rounded-2xl h-12",
                      !isActive && "bg-neutral-100 dark:bg-white/10 border border-neutral-200 dark:border-white/20"
                    )}
                    onClick={(e) => { e.stopPropagation(); setSelected(plan.id); }}
                  >
                    {isActive ? "Selected" : "Select Plan"}
                    {isActive && <Check className="ml-2 h-4 w-4" />}
                  </Button>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Sticky Footer for Proceed Button */}
        <div className="fixed inset-x-0 bottom-0 z-40 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border-t border-neutral-200 dark:border-white/10 p-6 md:p-8 flex justify-center shadow-2xl">
          <Button
            size="xl"
            className="w-full max-w-lg rounded-2xl shadow-2xl shadow-primary/30"
            disabled={!selected}
            rightIcon={<ArrowRight className="h-5 w-5" />}
            onClick={() => router.push(`/buy-data/payment?plan=${selected}`)}
          >
            Proceed to Payment
          </Button>
        </div>
      </div>
    </main>
  );
}

export default function BuyDataPlansPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-neutral-950 flex items-center justify-center font-bold">Loading plans...</div>}>
      <BuyDataPlansContent />
    </Suspense>
  );
}
