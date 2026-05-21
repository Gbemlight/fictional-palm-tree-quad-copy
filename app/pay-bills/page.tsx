"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ArrowRight,
  Zap,
  Tv,
  Wifi,
  Droplets,
  Trash2,
  GraduationCap,
  Bell,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import DashboardLayout from "@/components/dashboard/layout";
import { cn } from "@/lib/utils";

const billCategories = [
  {
    name: "Electricity",
    sub: "Utility",
    href: "/pay-bills/electricity",
    icon: Zap,
    accent: "#F59E0B",
  },
  {
    name: "Cable TV",
    sub: "Entertainment",
    href: "/pay-bills/cable",
    icon: Tv,
    accent: "#3B82F6",
  },
  {
    name: "Internet",
    sub: "Connectivity",
    href: "/pay-bills/internet",
    icon: Wifi,
    accent: "#D946EF",
  },
  {
    name: "Water",
    sub: "Utility",
    href: "/pay-bills/water",
    icon: Droplets,
    accent: "#06B6D4",
  },
  {
    name: "Waste",
    sub: "Utility",
    href: "/pay-bills/waste",
    icon: Trash2,
    accent: "#F43F5E",
  },
  {
    name: "Education",
    sub: "Institution",
    href: "/pay-bills/education",
    icon: GraduationCap,
    accent: "#10B981",
  },
];

const recentBills = [
  {
    id: "bill_001",
    title: "Ikeja Electric",
    category: "Electricity",
    amount: 15000,
  },
  {
    id: "bill_002",
    title: "DSTV Premium",
    category: "Cable TV",
    amount: 24500,
  },
  {
    id: "bill_003",
    title: "Spectranet Monthly",
    category: "Internet",
    amount: 12000,
  },
];

export default function PayBillsPage() {
  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-10 pb-20">
        {/* Header */}
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
              Pay Bills
            </h1>
            <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
              Settle utilities, subscriptions, and services instantly.
            </p>
          </div>
        </header>

        {/* Banner */}
        <section className="relative overflow-hidden rounded-[2.5rem] bg-indigo-600 p-8 md:p-10 text-white shadow-2xl shadow-indigo-500/20">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-lg">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-[10px] font-bold uppercase tracking-widest">
                <Bell size={12} className="animate-bounce" /> Coming Soon
              </div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                Automate your bills
              </h2>
              <p className="text-indigo-100 text-sm md:text-base font-medium opacity-90">
                Set recurring payments for utilities and subscriptions so you never miss a deadline again.
              </p>
            </div>
            <Button variant="secondary" className="h-14 px-8 rounded-2xl shadow-lg hover:scale-105 transition-transform">
              Get Notified
            </Button>
          </div>
          {/* Abstract Background Element */}
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        </section>

        {/* Categories */}
        <section className="space-y-6">
          <div className="mb-5">
            <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
              Service Categories
            </h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {billCategories.map((category) => {
              const Icon = category.icon;

              return (
                <motion.div 
                  key={category.name}
                  whileHover={{ y: -5 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link
                    href={category.href}
                    className="group relative flex flex-col items-center justify-center min-h-48 rounded-[2.5rem] p-6 bg-white dark:bg-neutral-900 border-2 border-neutral-100 dark:border-white/5 hover:border-indigo-600 dark:hover:border-indigo-500 shadow-sm transition-all duration-300"
                  >
                    <div 
                      className="relative z-10 mb-5 rounded-2xl p-4 shadow-sm border border-neutral-50 dark:border-white/5 bg-neutral-50 dark:bg-white/5 transition-transform group-hover:scale-110 duration-500"
                      style={{ color: category.accent }}
                    >
                      <Icon size={32} />
                    </div>

                    <div className="text-center space-y-1">
                      <span className="block font-bold text-lg tracking-tight text-neutral-900 dark:text-white">
                        {category.name}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                        {category.sub}
                      </span>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Recent bills */}
        <section className="space-y-6">
          <div className="mb-5">
            <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
              Recent Activity
            </h2>
          </div>

          <div className="space-y-3">
            {recentBills.map((bill) => (
              <motion.div
                key={bill.id}
                whileHover={{ x: 5 }}
                className="flex items-center gap-4 p-4 md:p-5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 shadow-sm rounded-3xl"
              >
                <div className="h-12 w-12 shrink-0 rounded-2xl bg-neutral-50 dark:bg-white/5 flex items-center justify-center border border-neutral-100 dark:border-white/10">
                  <Calendar className="h-5 w-5 text-indigo-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-base font-bold text-neutral-900 dark:text-white">
                    {bill.title}
                  </p>
                  <p className="text-xs font-bold uppercase tracking-widest text-neutral-400">
                    {bill.category}
                  </p>
                </div>

                <div className="flex items-center gap-6">
                  <p className="text-lg font-bold text-neutral-900 dark:text-white tracking-tight">
                    ₦{bill.amount.toLocaleString()}
                  </p>

                  <button className="h-10 w-10 rounded-full flex items-center justify-center bg-neutral-50 dark:bg-white/5 hover:bg-linear-to-r hover:from-indigo-600 hover:to-violet-600 hover:text-white transition-all">
                    <ArrowRight size={18} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}