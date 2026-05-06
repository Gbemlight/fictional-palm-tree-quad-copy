import React from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ArrowRight, UserPlus, Clock, Users, CheckCircle2 } from "lucide-react";
import { savedBeneficiaries } from "../../../lib/dummy-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/phone-input";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const formSchema = z.object({
  phone: z.string().regex(/^(070|080|081|090|091)\d{8}$/, "Enter a valid Nigerian phone number"),
  saveBeneficiary: z.boolean(),
  beneficiaryName: z.string().optional(),
}).refine((data) => !data.saveBeneficiary || (data.saveBeneficiary && data.beneficiaryName && data.beneficiaryName.length >= 2), {
  message: "Enter a name to save this beneficiary",
  path: ["beneficiaryName"],
});

type FormValues = z.infer<typeof formSchema>;

const recentRecipients = [
  "08012345678",
  "08123456789",
  "09087654321",
];

function autoFormatPhone(val: string) {
  if (!val) return "";
  const digits = val.replace(/\D/g, "");
  let formatted = digits;
  if (digits.length > 3) formatted = digits.slice(0, 3) + " " + digits.slice(3);
  if (digits.length > 7) formatted = formatted.slice(0, 8) + " " + formatted.slice(8);
  return formatted;
}

export function BuyDataRecipientContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planId = searchParams.get("plan");

  const { control, handleSubmit, setValue, watch, formState: { errors, isValid } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { phone: "", saveBeneficiary: false, beneficiaryName: "" },
    mode: "onChange"
  });

  const saveChecked = watch("saveBeneficiary");
  const phoneValue = watch("phone");

  function onSubmit(data: FormValues) {
    const params = new URLSearchParams({
      plan: planId || "",
      phone: data.phone,
      ...(data.saveBeneficiary && { name: data.beneficiaryName || "" })
    });
    router.push(`/buy-data/payment?${params.toString()}`);
  }

  return (
    <main className="min-h-screen bg-neutral-50 dark:bg-neutral-950 p-6 md:p-12 lg:p-16">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/buy-data/plans"
          className="group mb-8 inline-flex items-center gap-2 text-sm font-medium text-neutral-500 hover:text-primary transition-colors"
        >
          <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Plans
        </Link>

        <header className="mb-10">
          <h1 className="text-4xl font-black tracking-tight text-neutral-900 dark:text-white mb-2">
            Recipient Number
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 font-medium">
            Who are you buying data for?
          </p>
        </header>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="rounded-[2.5rem] border border-neutral-200 dark:border-white/10 bg-white/50 dark:bg-white/5 backdrop-blur-xl p-8 shadow-xl">
            <Controller
              name="phone"
              control={control}
              render={({ field }) => (
                <PhoneInput
                  label="Phone Number"
                  placeholder="080 1234 5678"
                  value={autoFormatPhone(field.value)}
                  onChange={(val) => field.onChange(val.replace(/\s/g, ""))}
                  onBlur={field.onBlur}
                  state={errors.phone ? "error" : field.value.length === 11 ? "success" : "default"}
                  errorMessage={errors.phone?.message}
                />
              )}
            />

            <div className="mt-6 flex flex-col gap-4">
              <label className="flex items-center gap-3 cursor-pointer group">
                <Controller
                  name="saveBeneficiary"
                  control={control}
                  render={({ field }) => (
                    <div className="relative flex items-center">
                      <input
                        type="checkbox"
                        className="peer h-6 w-6 cursor-pointer appearance-none rounded-lg border-2 border-neutral-300 dark:border-white/20 transition-all checked:border-primary checked:bg-primary"
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                      />
                      <CheckCircle2 className="pointer-events-none absolute h-6 w-6 scale-0 text-white transition-transform peer-checked:scale-75" />
                    </div>
                  )}
                />
                <span className="text-sm font-bold text-neutral-600 dark:text-neutral-400 group-hover:text-primary transition-colors">
                  Save this number as beneficiary
                </span>
              </label>

              <AnimatePresence>
                {saveChecked && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <Controller
                      name="beneficiaryName"
                      control={control}
                      render={({ field }) => (
                        <Input
                          label="Beneficiary Nickname"
                          placeholder="e.g. Mum, Office, My Second Line"
                          leftIcon={<UserPlus className="h-4 w-4" />}
                          value={field.value}
                          onChange={field.onChange}
                          state={errors.beneficiaryName ? "error" : field.value ? "success" : "default"}
                          errorMessage={errors.beneficiaryName?.message}
                        />
                      )}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Recent Recipients */}
          <section>
            <div className="flex items-center gap-2 mb-4 text-neutral-400 dark:text-neutral-500">
              <Clock className="h-4 w-4" />
              <h2 className="text-xs font-black uppercase tracking-widest">Recent Recipients</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {recentRecipients.map(num => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setValue("phone", num, { shouldValidate: true })}
                  className={cn(
                    "group rounded-2xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-white/5 p-4 text-left transition-all hover:border-primary/50",
                    phoneValue === num && "ring-2 ring-primary border-transparent"
                  )}
                >
                  <span className="block text-xs font-bold text-neutral-400 mb-1">Mobile</span>
                  <span className="block font-black text-neutral-900 dark:text-white group-hover:text-primary transition-colors">
                    {autoFormatPhone(num)}
                  </span>
                </button>
              ))}
            </div>
          </section>

          {/* Saved Beneficiaries */}
          <section>
            <div className="flex items-center gap-2 mb-4 text-neutral-400 dark:text-neutral-500">
              <Users className="h-4 w-4" />
              <h2 className="text-xs font-black uppercase tracking-widest">Saved Beneficiaries</h2>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {savedBeneficiaries.filter(ben => ben.phone).map(ben => (
                <button
                  key={ben.id}
                  type="button"
                  onClick={() => setValue("phone", ben.phone as string, { shouldValidate: true })}
                  className={cn(
                    "flex items-center gap-4 rounded-3xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-white/5 p-4 transition-all hover:border-primary/50",
                    phoneValue === ben.phone && "ring-2 ring-primary border-transparent bg-primary/5"
                  )}
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-primary to-secondary font-black text-white shadow-lg">
                    {ben.name[0]}
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="font-black text-neutral-900 dark:text-white leading-none mb-1">{ben.name}</h3>
                    <p className="text-sm font-bold text-neutral-500">{autoFormatPhone(ben.phone as string)}</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-neutral-300 dark:text-neutral-700" />
                </button>
              ))}
            </div>
          </section>

          <div className="pt-4 flex justify-center">
            <Button
              type="submit"
              size="xl"
              className="min-w-70 rounded-2xl shadow-2xl shadow-primary/30"
              disabled={!isValid}
              rightIcon={<ArrowRight className="h-5 w-5" />}
            >
              Continue to Payment
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}