"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Smartphone, CheckCircle2, Zap } from "lucide-react";
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
    label: "MTN",
    logo: (
      <svg width="24" height="24" viewBox="0 0 40 40" fill="none">
        <ellipse cx="20" cy="20" rx="20" ry="20" fill="#FFD600" />
        <text x="50%" y="55%" textAnchor="middle" fontWeight="900" fontSize="14" fill="#1A1A1A" dy=".3em">MTN</text>
      </svg>
    ),
    gradient: "from-[#FFD600] to-[#FFB800]",
  },
  {
    id: "airtel",
    label: "Airtel",
    logo: (
      <svg width="24" height="24" viewBox="0 0 40 40" fill="none">
        <ellipse cx="20" cy="20" rx="20" ry="20" fill="#E6002D" />
        <text x="50%" y="55%" textAnchor="middle" fontWeight="900" fontSize="12" fill="#fff" dy=".3em">Airtel</text>
      </svg>
    ),
    gradient: "from-[#E6002D] to-[#B30024]",
  },
  {
    id: "glo",
    label: "Glo",
    logo: (
      <svg width="24" height="24" viewBox="0 0 40 40" fill="none">
        <ellipse cx="20" cy="20" rx="20" ry="20" fill="#1DBF39" />
        <text x="50%" y="55%" textAnchor="middle" fontWeight="900" fontSize="14" fill="#fff" dy=".3em">Glo</text>
      </svg>
    ),
    gradient: "from-[#1DBF39] to-[#158C2A]",
  },
  {
    id: "9mobile",
    label: "9mobile",
    logo: (
      <svg width="24" height="24" viewBox="0 0 40 40" fill="none">
        <ellipse cx="20" cy="20" rx="20" ry="20" fill="#004631" />
        <text x="50%" y="55%" textAnchor="middle" fontWeight="900" fontSize="10" fill="#fff" dy=".3em">9mobile</text>
      </svg>
    ),
    gradient: "from-[#004631] to-[#002E1F]",
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
      <div className="mx-auto max-w-5xl">
        <header className="mb-8">
          <div className="flex items-center gap-4">
            <div className="rounded-2xl bg-white/10 p-3">
              <Smartphone className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Buy Airtime</h1>
              <p className="text-sm text-white/70">
                Select provider, amount, and recipient in one flow.
              </p>
            </div>
          </div>
        </header>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pb-28">
          {/* Section 1 */}
          <Card accent variant="elevated">
            <h2 className="mb-4 text-xl font-semibold text-white">
              1. Choose network
            </h2>

            <Controller
              name="provider"
              control={control}
              render={() => (
                <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                  {PROVIDERS.map((provider) => {
                    const active = selectedProvider === provider.id;

                    return (
                      <button
                        key={provider.id}
                        type="button"
                        onClick={() =>
                          setValue("provider", provider.id, {
                            shouldValidate: true,
                            shouldDirty: true,
                          })
                        }
                        className={cn(
                          "rounded-2xl border px-4 py-4 text-left transition-all duration-200",
                          "focus:outline-none focus:ring-2 focus:ring-accent/50",
                          active
                            ? cn("border-transparent text-white shadow-lg", provider.gradient)
                            : "border-white/15 bg-white/5 text-white/85 hover:bg-white/10"
                        )}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            {provider.logo}
                            <span className="font-bold">{provider.label}</span>
                          </div>
                          {active && (
                            <CheckCircle2 className="h-4 w-4 text-white" />
                          )}
                        </div>
                      </button>
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
          <Card accent variant="elevated">
            <h2 className="mb-4 text-xl font-semibold text-white">
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
                      "rounded-full px-4 py-2 text-sm font-medium transition-all duration-200",
                      "focus:outline-none focus:ring-2 focus:ring-accent/50",
                      active
                        ? "bg-[linear-gradient(135deg,var(--color-primary),var(--color-secondary))] text-white shadow-[0_10px_20px_rgba(124,58,237,0.22)]"
                        : "border border-white/15 bg-white/5 text-white/85 hover:bg-white/10"
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
          <Card accent variant="elevated">
            <h2 className="mb-4 text-xl font-semibold text-white">
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
          <Card variant="elevated">
            <h2 className="mb-4 text-xl font-semibold text-white">
              Purchase summary
            </h2>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-sm text-white/60">Final amount</p>
                <p className="mt-2 text-2xl font-bold text-white">
                  ₦{Number.isFinite(amount) ? amount.toLocaleString() : "0"}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-sm text-white/60">Recipient</p>
                <p className="mt-2 text-2xl font-bold text-white truncate">
                  {phone || "Not selected"}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-sm text-white/60">Wallet after purchase</p>
                <p className="mt-2 text-2xl font-bold text-white">
                  ₦{Number.isFinite(walletAfter) ? walletAfter.toLocaleString() : walletBalance.toLocaleString()}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-sm text-white/60">Cashback earned</p>
                <p className="mt-2 text-2xl font-bold text-white">
                  ₦{cashback.toLocaleString()}
                </p>
              </div>
            </div>
          </Card>

          {/* Sticky CTA */}
          <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-neutral-900/80 px-4 py-4 backdrop-blur-xl md:px-8">
            <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
              <div className="hidden md:block">
                <p className="text-sm font-bold text-white/40 uppercase tracking-widest">Ready to proceed?</p>
                <p className="text-lg font-semibold text-white">
                  ₦{Number.isFinite(amount) ? amount.toLocaleString() : "0"} airtime
                </p>
              </div>

              <Button
                type="submit"
                fullWidth
                disabled={!isValid}
                className="md:w-auto md:min-w-55"
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