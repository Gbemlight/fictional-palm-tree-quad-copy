"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { LayoutDashboard, HelpCircle, Gem, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="relative w-full bg-white dark:bg-neutral-950 transition-colors duration-300">
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-indigo-500/10 blur-[120px]" />
        <div className="absolute bottom-[10%] right-[-5%] w-[50%] h-[50%] rounded-full bg-violet-500/10 blur-[100px]" />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-dvh w-full py-20 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center space-y-8"
        >
          {/* Logo Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400">
            <Gem size={20} className="animate-pulse" />
            <span className="text-xs font-black uppercase tracking-widest">Credixa Premium Fintech</span>
          </div>

          {/* Hero Content */}
          <div className="space-y-4 max-w-3xl">
            <h1 className="text-5xl md:text-7xl font-black text-neutral-900 dark:text-white tracking-tighter leading-tight">
              Manage your finances with{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-600 via-violet-600 to-fuchsia-600">
                ultimate precision.
              </span>
            </h1>
            <p className="text-lg md:text-xl text-neutral-500 dark:text-neutral-400 font-medium max-w-xl mx-auto">
              Experience the next generation of digital payments, data top-ups, and automated bill management in one beautiful interface.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center w-full">
            <Button
              asChild 
              size="xl" 
              className="w-full sm:w-auto px-10 rounded-2xl shadow-2xl shadow-indigo-500/30"
            >
              <Link href="/dashboard" className="flex items-center gap-2">
                <LayoutDashboard className="h-5 w-5" />
                Get Started
                <ArrowRight className="h-4 w-4 opacity-50 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>

          {/* Footer Preview Info */}
          <div className="pt-10">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400 dark:text-neutral-600">
              V1.0.4 PROD • Secure & Encrypted
            </p>
          </div>
        </motion.div>
      </div>
    </main>
  );
}