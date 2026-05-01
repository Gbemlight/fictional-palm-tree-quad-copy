"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const PROVIDERS = [
  {
    id: "mtn",
    name: "MTN",
    logo: (
      <svg width="48" height="48" viewBox="0 0 40 40" fill="none">
        <ellipse cx="20" cy="20" rx="20" ry="20" fill="#FFD600" />
        <text x="50%" y="55%" textAnchor="middle" fontWeight="900" fontSize="14" fill="#1A1A1A" dy=".3em">MTN</text>
      </svg>
    ),
    gradient: "from-[#FFD600] to-[#FFB800]",
    glow: "group-hover:shadow-[#FFD600]/30",
  },
  {
    id: "airtel",
    name: "Airtel",
    logo: (
      <svg width="48" height="48" viewBox="0 0 40 40" fill="none">
        <ellipse cx="20" cy="20" rx="20" ry="20" fill="#E6002D" />
        <text x="50%" y="55%" textAnchor="middle" fontWeight="900" fontSize="12" fill="#fff" dy=".3em">Airtel</text>
      </svg>
    ),
    gradient: "from-[#E6002D] to-[#B30024]",
    glow: "group-hover:shadow-[#E6002D]/30",
  },
  {
    id: "glo",
    name: "Glo",
    logo: (
      <svg width="48" height="48" viewBox="0 0 40 40" fill="none">
        <ellipse cx="20" cy="20" rx="20" ry="20" fill="#1DBF39" />
        <text x="50%" y="55%" textAnchor="middle" fontWeight="900" fontSize="14" fill="#fff" dy=".3em">Glo</text>
      </svg>
    ),
    gradient: "from-[#1DBF39] to-[#158C2A]",
    glow: "group-hover:shadow-[#1DBF39]/30",
  },
  {
    id: "9mobile",
    name: "9mobile",
    logo: (
      <svg width="48" height="48" viewBox="0 0 40 40" fill="none">
        <ellipse cx="20" cy="20" rx="20" ry="20" fill="#004631" />
        <text x="50%" y="55%" textAnchor="middle" fontWeight="900" fontSize="10" fill="#fff" dy=".3em">9mobile</text>
      </svg>
    ),
    gradient: "from-[#004631] to-[#002E1F]",
    glow: "group-hover:shadow-[#004631]/30",
  },
];

export default function BuyDataPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const router = useRouter();

  return (
    <main className="min-h-screen bg-neutral-50 dark:bg-neutral-950 p-6 md:p-12 lg:p-16">
      <div className="max-w-3xl mx-auto">
        <Link 
          href="/dashboard" 
          className="group mb-8 inline-flex items-center gap-2 text-sm font-medium text-neutral-500 hover:text-primary transition-colors"
        >
          <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Dashboard
        </Link>

        <header className="mb-12">
          <h1 className="text-4xl font-black tracking-tight text-neutral-900 dark:text-white mb-2">
            Buy Data
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 font-medium">
            Select your network provider to see available plans
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
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
                  "group relative flex flex-col items-center justify-center min-h-45 rounded-[2.5rem] p-8 transition-all duration-300",
                  "bg-linear-to-br shadow-xl overflow-hidden",
                  provider.gradient,
                  provider.glow,
                  isActive ? "ring-4 ring-white dark:ring-primary scale-[1.02] z-10" : "opacity-90 hover:opacity-100"
                )}
              >
                <div className="relative z-10 mb-4 bg-white/20 backdrop-blur-md rounded-2xl p-4 shadow-inner">
                  {provider.logo}
                </div>
                <span className="relative z-10 font-black text-xl text-white tracking-tight">
                  {provider.name}
                </span>

                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="absolute top-4 right-4 bg-white text-neutral-900 rounded-full p-1.5 shadow-lg"
                    >
                      <Check className="h-4 w-4 stroke-3" />
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {/* Subtle shine effect on hover */}
                <div className="absolute inset-0 bg-linear-to-tr from-white/0 via-white/5 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </motion.button>
            );
          })}
        </div>

        <footer className="flex justify-center">
          <Button
            size="xl"
            className="min-w-60 rounded-2xl"
            disabled={!selected}
            rightIcon={<ArrowRight className="h-5 w-5" />}
            onClick={() => router.push(`/buy-data/plans?provider=${selected}`)}
          >
            Next: Select Plan
          </Button>
        </footer>
      </div>
    </main>
  );
}
