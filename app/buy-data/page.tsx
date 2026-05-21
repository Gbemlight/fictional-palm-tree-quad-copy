"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import DashboardLayout from "@/components/dashboard/layout";
import { cn } from "@/lib/utils";

const PROVIDERS = [
  {
    id: "mtn",
    name: "MTN",
    shortName: "MTN",
    logo: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <ellipse cx="20" cy="20" rx="20" ry="20" fill="#FFD600" />
        <text x="50%" y="55%" textAnchor="middle" fontWeight="900" fontSize="14" fill="#1A1A1A" dy=".3em">MTN</text>
      </svg>
    ),
    accent: "#FFD600",
  },
  {
    id: "airtel",
    name: "Airtel Africa",
    shortName: "Airtel",
    logo: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <ellipse cx="20" cy="20" rx="20" ry="20" fill="#E6002D" />
        <text x="50%" y="55%" textAnchor="middle" fontWeight="900" fontSize="12" fill="#fff" dy=".3em">Airtel</text>
      </svg>
    ),
    accent: "#E6002D",
  },
  {
    id: "glo",
    name: "Globacom Limited",
    shortName: "Glo",
    logo: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <ellipse cx="20" cy="20" rx="20" ry="20" fill="#1DBF39" />
        <text x="50%" y="55%" textAnchor="middle" fontWeight="900" fontSize="14" fill="#fff" dy=".3em">Glo</text>
      </svg>
    ),
    accent: "#1DBF39",
  },
  {
    id: "9mobile",
    name: "9mobile Nigeria",
    shortName: "9mobile",
    logo: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <ellipse cx="20" cy="20" rx="20" ry="20" fill="#004631" />
        <text x="50%" y="55%" textAnchor="middle" fontWeight="900" fontSize="10" fill="#fff" dy=".3em">9mobile</text>
      </svg>
    ),
    accent: "#004631",
  },
];

export default function BuyDataPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const router = useRouter();

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-10 pb-20">
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
              Buy Data
            </h1>
            <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
              Choose your network provider to see available data bundles.
            </p>
          </div>
        </header>

        <div className="grid grid-cols-2 gap-4 md:gap-6">
          {PROVIDERS.map((provider) => {
            const isActive = selected === provider.id;
            
            return (
              <motion.button
                key={provider.id}
                type="button"
                onClick={() => setSelected(provider.id)}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  "group relative flex flex-col items-center justify-center min-h-48 rounded-[2.5rem] p-6 transition-all duration-300",
                  "bg-white dark:bg-neutral-900 border-2 shadow-sm",
                  isActive 
                    ? "border-indigo-600 dark:border-indigo-500 shadow-xl shadow-indigo-500/10" 
                    : "border-neutral-100 dark:border-white/5 hover:border-neutral-200 dark:hover:border-white/10"
                )}
              >
                <div 
                  className="relative z-10 mb-5 rounded-2xl p-4 shadow-sm border border-neutral-50 dark:border-white/5 bg-neutral-50 dark:bg-white/5 transition-transform group-hover:scale-110 duration-500"
                  style={{ backgroundColor: isActive ? `${provider.accent}15` : undefined }}
                >
                  {provider.logo}
                </div>
                
                <div className="text-center space-y-1">
                  <span className={cn(
                    "block font-bold text-lg tracking-tight transition-colors",
                    isActive ? "text-neutral-900 dark:text-white" : "text-neutral-700 dark:text-neutral-300"
                  )}>
                    {provider.shortName}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                    Network
                  </span>
                </div>

                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="absolute top-4 right-4 bg-indigo-600 text-white rounded-full p-1.5 shadow-lg shadow-indigo-500/30"
                    >
                      <Check className="h-3 w-3 stroke-4" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            );
          })}
        </div>

        <div className="pt-8">
          <Button
            size="xl"
            className="w-full h-16 rounded-4xl text-base font-bold shadow-xl shadow-indigo-500/20 bg-linear-to-r from-indigo-600 to-violet-600 border-none text-white hover:opacity-90 transition-opacity"
            disabled={!selected}
            rightIcon={<ArrowRight className="h-5 w-5" />}
            onClick={() => router.push(`/buy-data/plans?provider=${selected}`)}
          >
            Select Plan
          </Button>
          <p className="text-center mt-6 text-[11px] font-bold uppercase tracking-[0.2em] text-neutral-400 dark:text-neutral-600">
            Step 1 of 3: Provider Selection
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
