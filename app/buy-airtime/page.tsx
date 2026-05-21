"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Smartphone, CheckCircle2, Zap, ChevronLeft } from "lucide-react";
import { ContactPicker } from "@/components/payment/contact-picker";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/phone-input";
import { Card } from "@/components/ui/card";
import { toastSuccess } from "@/components/ui/toast";
import DashboardLayout from "@/components/dashboard/layout";
import { cn } from "@/lib/utils";

const PROVIDERS = [
  {
    id: "mtn",
    shortName: "MTN",
    fullName: "MTN Nigeria",
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
    shortName: "Airtel",
    fullName: "Airtel Africa",
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
    shortName: "Glo",
    fullName: "Globacom Limited",
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
    shortName: "9mobile",
    fullName: "9mobile Nigeria",
    logo: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <ellipse cx="20" cy="20" rx="20" ry="20" fill="#004631" />
        <text x="50%" y="55%" textAnchor="middle" fontWeight="900" fontSize="10" fill="#fff" dy=".3em">9mobile</text>
      </svg>
    ),
    accent: "#004631",
  },
];

const quickAmounts = [100, 200, 500, 1000, 2000, 5000];
const walletBalance = 125000;
const cashbackRate = 0.02;

const schema = z.object({
  provider: z.string().min(1, "Select a network provider"),
  amount: z
    .number({ message: "Enter a valid amount" })
    .min(50, "Minimum airtime amount is ₦50")
    .max(10000, "Maximum airtime amount is ₦10,000"),
  phone: z
    .string()
    .regex(/^(070|080|081|090|091)\d{8}$/, "Enter a valid Nigerian number"),
});

type FormValues = z.infer<typeof schema>;

export default function BuyAirtimePage() {
  const {
    control,
    watch,
    setValue,
    trigger,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      provider: "",
      amount: 100,
      phone: "",
    },
  });

  const selectedProvider = watch("provider");
  const amount = watch("amount");
  const phone = watch("phone");

  const cashback = amount ? Math.floor(amount * cashbackRate) : 0;
  const walletAfter = amount ? walletBalance - amount : walletBalance;

  const onSelectChip = async (value: number) => {
    setValue("amount", value, { shouldValidate: true, shouldDirty: true });
    await trigger("amount");
  };

  const onSubmit = (data: FormValues) => {
    toastSuccess(`Successfully purchased ₦${data.amount.toLocaleString()} airtime for ${data.phone}`);
  };

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
              Buy Airtime
            </h1>
            <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
              Select provider, amount, and recipient in one flow.
            </p>
          </div>
        </header>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 md:space-y-8 pb-28">
          {/* Section 1 */}
          <Card className="p-6 md:p-8">
            <h2 className="mb-4 text-xl font-bold text-neutral-900 dark:text-white">
              1. Choose network
            </h2>

            <Controller
              name="provider"
              control={control}
              render={({ field }) => (
                <div className="grid grid-cols-2 gap-4 md:grid-cols-2">
                  {PROVIDERS.map((provider) => {
                    const active = selectedProvider === provider.id;

                    return (
                      <motion.button
                        key={provider.id}
                        type="button"
                        onClick={() => field.onChange(provider.id)}
                        whileHover={{ y: -4 }}
                        whileTap={{ scale: 0.98 }}
                        className={cn(
                          "group relative flex flex-col items-center justify-center min-h-48 rounded-[2.5rem] p-6 transition-all duration-300",
                          "bg-white dark:bg-neutral-900 border-2 shadow-sm",
                          active 
                            ? "border-indigo-600 dark:border-indigo-500 shadow-xl shadow-indigo-500/10" 
                            : "border-neutral-100 dark:border-white/5 hover:border-neutral-200 dark:hover:border-white/10"
                        )}
                      >
                        <div 
                          className="relative z-10 mb-5 rounded-2xl p-4 shadow-sm border border-neutral-50 dark:border-white/5 bg-white dark:bg-neutral-950 transition-transform group-hover:scale-110 duration-500"
                          style={{ backgroundColor: active ? `${provider.accent}15` : undefined }}
                        >
                          {provider.logo}
                        </div>
                        
                        <div className="text-center space-y-1">
                          <span className={cn(
                            "block font-bold text-lg tracking-tight transition-colors",
                            active ? "text-neutral-900 dark:text-white" : "text-neutral-700 dark:text-neutral-300"
                          )}>
                            {provider.shortName}
                          </span>
                          <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                            Network
                          </span>
                        </div>

                        <AnimatePresence>
                          {active && (
                            <motion.div
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0, opacity: 0 }}
                              className="absolute top-4 right-4 bg-indigo-600 text-white rounded-full p-1.5 shadow-lg shadow-indigo-500/30"
                            >
                              <CheckCircle2 className="h-3 w-3 stroke-4" />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.button>
                    );
                  })}
                </div>
              )}
            />
            {errors.provider && (
              <p className="mt-3 text-sm text-danger">
                {errors.provider.message}
              </p>
            )}
          </Card>

          {/* Section 2 */}
          <Card className="p-6 md:p-8">
            <h2 className="mb-4 text-xl font-bold text-neutral-900 dark:text-white">
              2. Enter amount
            </h2>

            <div className="mb-4 flex flex-wrap gap-3">
              {quickAmounts.map((chip) => {
                const active = amount === chip;
                return (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => onSelectChip(chip)}
                    className={cn(
                      "rounded-full px-4 py-2 text-sm font-bold transition-all duration-200",
                      "focus:outline-none focus:ring-2 focus:ring-indigo-500/50",
                      active
                        ? "bg-linear-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/20 border-none"
                        : "bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-white/10 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                    )}
                  >
                    ₦{chip.toLocaleString()}
                  </button>
                );
              })}
            </div>

            <Controller
              name="amount"
              control={control}
              render={({ field }) => (
                <Input
                  label="Custom amount"
                  type="number"
                  min={50}
                  max={10000}
                  placeholder="Enter airtime amount"
                  value={field.value ?? ""}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value === "" ? NaN : Number(e.target.value)
                    )
                  }
                  onBlur={field.onBlur}
                  helperText="Minimum ₦50 • Maximum ₦10,000"
                  state={errors.amount ? "error" : amount >= 50 && amount <= 10000 ? "success" : "default"}
                  errorMessage={errors.amount?.message}
                />
              )}
            />
          </Card>

          {/* Section 3 */}
          <Card className="p-6 md:p-8">
            <h2 className="mb-4 text-xl font-bold text-neutral-900 dark:text-white">
              3. Recipient number
            </h2>

            <Controller
              name="phone"
              control={control}
              render={({ field }) => (
                <PhoneInput
                  label="Phone number"
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  helperText="Supported prefixes: 070, 080, 081, 090, 091"
                  state={errors.phone ? "error" : phone && !errors.phone ? "success" : "default"}
                  errorMessage={errors.phone?.message}
                />
              )}
            />

            <div className="mt-4">
              <ContactPicker 
                onSelect={(val) => setValue("phone", val, { shouldValidate: true })} 
              />
            </div>
          </Card>

          {/* Summary */}
          <Card className="p-6 md:p-8">
            <h2 className="mb-4 text-xl font-bold text-neutral-900 dark:text-white">
              Purchase summary
            </h2>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-neutral-900 p-4">
                <p className="text-sm text-neutral-500 dark:text-neutral-400">Final amount</p>
                <p className="mt-2 text-2xl font-bold text-neutral-900 dark:text-white">
                  ₦{Number.isFinite(amount) ? amount.toLocaleString() : "0"}
                </p>
              </div>

              <div className="rounded-2xl border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-neutral-900 p-4">
                <p className="text-sm text-neutral-500 dark:text-neutral-400">Recipient</p>
                <p className="mt-2 text-2xl font-bold text-neutral-900 dark:text-white truncate">
                  {phone || "Not selected"}
                </p>
              </div>

              <div className="rounded-2xl border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-neutral-900 p-4">
                <p className="text-sm text-neutral-500 dark:text-neutral-400">Wallet after purchase</p>
                <p className="mt-2 text-2xl font-bold text-neutral-900 dark:text-white">
                  ₦{Number.isFinite(walletAfter) ? walletAfter.toLocaleString() : walletBalance.toLocaleString()}
                </p>
              </div>

              <div className="rounded-2xl border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-neutral-900 p-4">
                <p className="text-sm text-neutral-500 dark:text-neutral-400">Cashback earned</p>
                <p className="mt-2 text-2xl font-bold text-neutral-900 dark:text-white">
                  ₦{cashback.toLocaleString()}
                </p>
              </div>
            </div>
          </Card>

          {/* Sticky CTA */} 
          <div className="fixed inset-x-0 bottom-0 z-40 border-t border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-950 px-4 py-4 backdrop-blur-xl md:px-8 shadow-[0_-8px_30px_rgba(0,0,0,0.08)]">
            <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
              <div className="hidden md:block">
                <p className="text-sm font-bold text-white/40 uppercase tracking-widest">Ready to proceed?</p>
                <p className="text-lg font-semibold text-white">
                  ₦{Number.isFinite(amount) ? amount.toLocaleString() : "0"} airtime
                </p>
              </div>

              <Button
                type="submit"
                size="xl"
                disabled={!isValid}
                className="md:w-auto md:min-w-55 bg-linear-to-r from-indigo-600 to-violet-600 border-none text-white hover:opacity-90 transition-opacity"
                rightIcon={<Zap className="h-5 w-5 fill-current" />}
              >
                Buy Airtime
              </Button>
            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}