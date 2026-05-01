"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Repeat2,
  Zap,
  Tv,
  Wifi,
  Droplets,
  Trash2,
  GraduationCap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import DashboardLayout from "@/components/dashboard/layout";
import { cn } from "@/lib/utils";

const billCategories = [
  {
    name: "Electricity",
    href: "/pay-bills/electricity",
    icon: Zap,
    gradient:
      "bg-[linear-gradient(135deg,var(--color-warning),var(--color-secondary))]",
  },
  {
    name: "Cable TV",
    href: "/pay-bills/cable",
    icon: Tv,
    gradient:
      "bg-[linear-gradient(135deg,var(--color-primary),var(--color-secondary))]",
  },
  {
    name: "Internet",
    href: "/pay-bills/internet",
    icon: Wifi,
    gradient:
      "bg-[linear-gradient(135deg,var(--color-accent),var(--color-primary))]",
  },
  {
    name: "Water",
    href: "/pay-bills/water",
    icon: Droplets,
    gradient:
      "bg-[linear-gradient(135deg,var(--color-accent),var(--color-success))]",
  },
  {
    name: "Waste",
    href: "/pay-bills/waste",
    icon: Trash2,
    gradient:
      "bg-[linear-gradient(135deg,var(--color-danger),var(--color-warning))]",
  },
  {
    name: "Education",
    href: "/pay-bills/education",
    icon: GraduationCap,
    gradient:
      "bg-[linear-gradient(135deg,var(--color-success),var(--color-accent))]",
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
    <main className="relative min-h-screen overflow-hidden bg-[#000000] px-4 py-8 md:px-8 md:py-10">
      <div className="pointer-events-none absolute -top-40 left-1/2 h-125 w-125 -translate-x-1/2 rounded-full bg-purple-500/30 blur-[140px]" />

      <div className="relative mx-auto max-w-6xl space-y-8">
        {/* Header */}
        <section className="rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur-xl md:p-8">
          <h1 className="text-3xl font-bold text-white md:text-4xl">
            Pay Bills
          </h1>
          <p className="mt-2 text-sm text-white/70 md:text-base">
            Choose a bill category and complete payment in seconds.
          </p>
        </section>

        {/* Banner */}
        <section className="rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur-xl shadow-[0_10px_40px_rgba(124,58,237,0.18)] md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-wide text-white/60">
                Coming soon
              </p>
              <h2 className="mt-1 text-2xl font-bold text-white">
                Automate your bills
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-white/70">
                Set recurring payments for utility bills and subscriptions so
                you never miss a due date.
              </p>
            </div>

            <Button className="md:w-auto">Get Notified</Button>
          </div>
        </section>

        {/* Categories */}
        <section className="rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur-xl md:p-8">
          <div className="mb-5">
            <h2 className="text-2xl font-semibold text-white">
              Bill categories
            </h2>
            <p className="mt-1 text-sm text-white/70">
              Pick a category to continue to provider selection.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {billCategories.map((category) => {
              const Icon = category.icon;

              return (
                <motion.div
                  key={category.name}
                  whileHover={{ y: -6, scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link
                    href={category.href}
                    className="group block rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl shadow-[0_10px_30px_rgba(124,58,237,0.14)] transition hover:shadow-[0_18px_45px_rgba(124,58,237,0.24)] focus:outline-none focus:ring-2 focus:ring-accent/50"
                  >
                    <div
                      className={`mb-5 flex h-16 w-16 items-center justify-center rounded-2xl text-white shadow-lg ${category.gradient}`}
                    >
                      <motion.div
                        whileHover={{ rotate: -8 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Icon className="h-8 w-8" />
                      </motion.div>
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <h3 className="text-base font-semibold text-white md:text-lg">
                          {category.name}
                        </h3>
                      </div>

                      <ArrowRight className="h-5 w-5 text-white/75 transition group-hover:translate-x-1 group-hover:text-white" />
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Recent bills */}
        <section className="rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur-xl md:p-8">
          <div className="mb-5">
            <h2 className="text-2xl font-semibold text-white">
              Recent bills
            </h2>
            <p className="mt-1 text-sm text-white/70">
              Quickly repeat your recent bill payments.
            </p>
          </div>

          <div className="space-y-4">
            {recentBills.map((bill) => (
              <div
                key={bill.id}
                className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-black/20 p-4 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <p className="text-base font-semibold text-white">
                    {bill.title}
                  </p>
                  <p className="text-sm text-white/60">{bill.category}</p>
                </div>

                <div className="flex items-center gap-4">
                  <p className="text-lg font-bold text-white">
                    ₦{bill.amount.toLocaleString()}
                  </p>

                  <Button
                    variant="secondary"
                    leftIcon={<Repeat2 className="h-4 w-4" />}
                  >
                    Pay Again
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}