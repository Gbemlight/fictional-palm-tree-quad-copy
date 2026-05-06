"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Zap, CheckCircle2, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/phone-input";
import { Card, CardContent } from "@/components/ui/card";
import { toastSuccess } from "@/components/ui/toast";
import DashboardLayout from "@/components/dashboard/layout";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogFooter,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const providers = [
  { id: "aedc", label: "AEDC" },
  { id: "ekedc", label: "EKEDC" },
  { id: "ikedc", label: "IKEDC" },
  { id: "kedco", label: "KEDCO" },
  { id: "phed", label: "PHED" },
] as const;

const schema = z.object({
  amount: z
    .number({ message: "Enter a valid amount" })
    .min(500, "Minimum amount is ₦500"),
  meterNumber: z
    .string()
    .regex(/^\d{11}$/, "Meter number must be exactly 11 digits"),
  meterType: z.enum(["postpaid", "prepaid"], "Select meter type"),
  phone: z
    .string()
    .regex(/^(070|080|081|090|091)\d{8}$/, "Enter a valid Nigerian number"),
  provider: z.string().min(1, "Select an electricity provider"),
});

type FormValues = z.infer<typeof schema>;

type MeterInfo = {
  customerName: string;
  address: string;
};

function makeDummyMeterInfo(
  meterNumber: string,
  provider: string
): MeterInfo | null {
  if (!/^\d{11}$/.test(meterNumber)) return null;

  const names = [
    "Amina Bello",
    "Usman Lawal",
    "Sadiq Ahmad",
    "Fatima Ali",
    "Ibrahim Musa",
  ];
  const areas = [
    "Gwarinpa, Abuja",
    "Sabon Gari, Kano",
    "Lekki Phase 1, Lagos",
    "Rumuola, Port Harcourt",
    "Maitama, Abuja",
  ];

  const seed = Number(meterNumber.slice(-2)) % names.length;

  return {
    customerName: names[seed],
    address: `${provider.toUpperCase()} Service Area, ${areas[seed]}`,
  };
}

export default function ElectricityBillPage() {
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
      amount: 500,
      meterNumber: "",
      meterType: "prepaid",
      phone: "",
      provider: "",
    },
  });

  const amount = watch("amount");
  const meterNumber = watch("meterNumber");
  const meterType = watch("meterType");
  const phone = watch("phone");
  const selectedProvider = watch("provider");

  const [verifying, setVerifying] = React.useState(false);
  const [meterVerified, setMeterVerified] = React.useState(false);
  const [meterInfo, setMeterInfo] = React.useState<MeterInfo | null>(null);
  const [verifyError, setVerifyError] = React.useState("");
  const [confirmOpen, setConfirmOpen] = React.useState(false);

  React.useEffect(() => {
    setMeterVerified(false);
    setMeterInfo(null);
    setVerifyError("");
  }, [meterNumber, selectedProvider, meterType]);

  const handleVerifyMeter = async () => {
    const providerValid = await trigger("provider");
    const meterValid = await trigger("meterNumber");

    if (!providerValid || !meterValid) return;

    setVerifying(true);
    setVerifyError("");

    setTimeout(() => {
      const info = makeDummyMeterInfo(meterNumber, selectedProvider);

      if (!info) {
        setMeterVerified(false);
        setMeterInfo(null);
        setVerifyError("Unable to verify meter details");
      } else {
        setMeterVerified(true);
        setMeterInfo(info);
      }

      setVerifying(false);
    }, 1200);
  };

  const canProceed = isValid && meterVerified;

  const onSubmit = (data: FormValues) => {
    if (!meterVerified) return;
    setConfirmOpen(true);
  };

  const handleFinalConfirm = () => {
    setConfirmOpen(false);
    toastSuccess(`Payment of ₦${amount.toLocaleString()} for meter ${meterNumber} was successful!`);
  };

  return (
    <DashboardLayout>
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1fr_380px]">
        {/* Main Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <header className="mb-8">
            <div className="mb-2 flex items-center gap-3">
              <div className="rounded-2xl bg-white/10 p-3">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-black text-white md:text-4xl tracking-tight">
                  Pay Electricity Bill
                </h1>
                <p className="text-sm font-medium text-white/70">
                  Verify your meter details and complete payment in one flow.
                </p>
              </div>
            </div>
          </header>

          {/* Step 1 */}
          <Card accent variant="elevated">
            <h2 className="mb-4 text-xl font-semibold text-white">
              1. Select provider
            </h2>

            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
              {providers.map((provider) => {
                const active = selectedProvider === provider.id;

                return (
                  <motion.button
                    key={provider.id}
                    type="button"
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
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
                        ? "border-transparent bg-linear-to-br from-primary to-secondary text-white shadow-lg"
                        : "border-white/15 bg-white/5 text-white/85 hover:bg-white/10"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{provider.label}</span>
                      {active && (
                        <CheckCircle2 className="h-4 w-4 text-white" />
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {errors.provider && (
              <p className="mt-3 text-sm font-semibold text-danger">
                {errors.provider.message}
              </p>
            )}
          </Card>

          {/* Step 2 */}
          <Card accent variant="elevated">
            <h2 className="mb-4 text-xl font-semibold text-white">
              2. Meter type
            </h2>

            <Controller
              name="meterType"
              control={control}
              render={({ field }) => (
                <div className="grid grid-cols-2 gap-3 max-w-sm">
                  {[
                    { value: "postpaid", label: "Postpaid" },
                    { value: "prepaid", label: "Prepaid" },
                  ].map((option) => {
                    const active = field.value === option.value;

                    return (
                      <motion.button
                        key={option.value}
                        type="button"
                        whileTap={{ scale: 0.98 }}
                        onClick={() => field.onChange(option.value)}
                        className={cn(
                          "rounded-2xl border px-5 py-4 text-left transition-all duration-200",
                          active
                            ? "border-transparent bg-linear-to-br from-primary to-secondary text-white shadow-lg"
                            : "border-white/15 bg-white/5 text-white/85 hover:bg-white/10"
                        )}
                      >
                        <span className="font-bold">{option.label}</span>
                      </motion.button>
                    );
                  })}
                </div>
              )}
            />
          </Card>

          {/* Step 3 */}
          <Card accent variant="elevated">
            <h2 className="mb-4 text-xl font-semibold text-white">
              3. Meter number
            </h2>

            <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
              <Controller
                name="meterNumber"
                control={control}
                render={({ field }) => (
                  <Input
                    label="Meter number"
                    inputMode="numeric"
                    maxLength={11}
                    placeholder="Enter 11-digit meter number"
                    value={field.value}
                    onChange={(e) =>
                      field.onChange(e.target.value.replace(/\D/g, "").slice(0, 11))
                    }
                    onBlur={field.onBlur}
                    helperText="Meter number must be exactly 11 digits"
                    state={
                      errors.meterNumber
                        ? "error"
                        : meterVerified
                        ? "success"
                        : "default"
                    }
                    errorMessage={errors.meterNumber?.message}
                  />
                )}
              />

              <Button
                type="button"
                onClick={handleVerifyMeter}
                disabled={verifying}
                className="md:min-w-45 h-11 rounded-xl"
                leftIcon={verifying ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              >
                {verifying ? "Verifying..." : "Verify Meter"}
              </Button>
            </div>

            {verifyError && (
              <p className="mt-3 text-sm font-semibold text-danger">
                {verifyError}
              </p>
            )}

            {meterVerified && meterInfo && (
              <div className="mt-5 rounded-2xl border border-white/10 bg-black/40 p-5 animate-in fade-in slide-in-from-top-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">Customer name</p>
                <p className="text-xl font-black text-white tracking-tight">
                  {meterInfo.customerName}
                </p>

                <p className="mt-4 text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">Address</p>
                <p className="text-sm font-medium text-white/80 leading-relaxed">{meterInfo.address}</p>
              </div>
            )}
          </Card>

          {/* Step 4 */}
          <Card accent variant="elevated">
            <h2 className="mb-4 text-xl font-semibold text-white">
              4. Amount
            </h2>

            <Controller
              name="amount"
              control={control}
              render={({ field }) => (
                <Input
                  label="Payment amount"
                  type="number"
                  min={500}
                  placeholder="Enter amount"
                  value={field.value ?? ""}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value === "" ? NaN : Number(e.target.value)
                    )
                  }
                  onBlur={field.onBlur}
                  helperText="Minimum payment amount is ₦500"
                  state={
                    errors.amount
                      ? "error"
                      : amount >= 500
                      ? "success"
                      : "default"
                  }
                  errorMessage={errors.amount?.message}
                />
              )}
            />
          </Card>

          {/* Step 5 */}
          <Card accent variant="elevated">
            <h2 className="mb-4 text-xl font-semibold text-white">
              5. Notification number
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
                  helperText="You’ll receive payment confirmation on this number"
                  state={
                    errors.phone
                      ? "error"
                      : phone && !errors.phone
                      ? "success"
                      : "default"
                  }
                  errorMessage={errors.phone?.message}
                />
              )}
            />
          </Card>

          <div className="lg:hidden">
            <Button type="submit" fullWidth disabled={!canProceed} size="xl">
              Proceed to Payment
            </Button>
          </div>
        </form>

        {/* Sticky Summary */}
        <aside className="h-fit lg:sticky lg:top-24">
          <Card variant="elevated" className="border-primary/20 bg-primary/5">
            <h2 className="text-2xl font-black text-white tracking-tight">Summary</h2>
            <p className="mt-1 text-sm font-medium text-white/60">
              Updates in real time as you fill the form.
            </p>

            <div className="mt-6 space-y-4">
              <div className="rounded-2xl border border-white/5 bg-black/20 p-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Provider</p>
                <p className="mt-1 text-lg font-bold text-white">
                  {selectedProvider
                    ? providers.find((p) => p.id === selectedProvider)?.label
                    : "Not selected"}
                </p>
              </div>

              <div className="rounded-2xl border border-white/5 bg-black/20 p-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Meter type</p>
                <p className="mt-1 text-lg font-bold capitalize text-white">
                  {meterType || "Not selected"}
                </p>
              </div>

              <div className="rounded-2xl border border-white/5 bg-black/20 p-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Meter number</p>
                <p className="mt-1 text-lg font-bold text-white">
                  {meterNumber || "Not entered"}
                </p>
              </div>

              <div className="rounded-2xl border border-white/5 bg-black/20 p-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Meter info</p>
                {meterVerified && meterInfo ? (
                  <>
                    <p className="mt-1 text-base font-bold text-white">
                      {meterInfo.customerName}
                    </p>
                    <p className="text-xs text-white/50 truncate">
                      {meterInfo.address}
                    </p>
                  </>
                ) : (
                  <p className="mt-1 text-base font-bold text-white/20">Not verified yet</p>
                )}
              </div>

              <div className="rounded-2xl border border-white/5 bg-black/20 p-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Amount</p>
                <p className="mt-1 text-2xl font-black text-white">
                  ₦{Number.isFinite(amount) ? amount.toLocaleString() : "0"}
                </p>
              </div>

              <div className="rounded-2xl border border-white/5 bg-black/20 p-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Notification number</p>
                <p className="mt-1 text-lg font-bold text-white">
                  {phone || "Not entered"}
                </p>
              </div>
            </div>

            <div className="mt-6 hidden lg:block">
              <Button type="button" fullWidth disabled={!canProceed} size="xl" onClick={handleSubmit(onSubmit)}>
                Proceed to Payment
              </Button>
            </div>
          </Card>
        </aside>
      </div>

      {/* Confirmation Modal */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen} size="sm">
        <DialogHeader>
          <DialogTitle className="text-xl font-black tracking-tight">Confirm Electricity Payment</DialogTitle>
          <DialogDescription className="font-medium">
            Please review the details before proceeding.
          </DialogDescription>
        </DialogHeader>

        <DialogBody>
          <div className="space-y-3 text-white/85 font-medium">
            <p className="flex justify-between">
              <span className="text-white/60">Provider:</span>{" "}
              <span className="font-bold">{providers.find((p) => p.id === selectedProvider)?.label}</span>
            </p>
            <p className="flex justify-between">
              <span className="text-white/60">Meter Type:</span> 
              <span className="font-bold capitalize">{meterType}</span>
            </p>
            <p className="flex justify-between">
              <span className="text-white/60">Meter Number:</span> 
              <span className="font-bold">{meterNumber}</span>
            </p>
            <p className="flex justify-between">
              <span className="text-white/60">Customer:</span>{" "}
              <span className="font-bold">{meterInfo?.customerName}</span>
            </p>
            <p>
              <span className="text-white/60 block mb-1">Address:</span> 
              <span className="font-bold text-sm block leading-relaxed">{meterInfo?.address}</span>
            </p>
            <p className="flex justify-between">
              <span className="text-white/60">Amount:</span> 
              <span className="font-black text-lg text-primary">₦{Number.isFinite(amount) ? amount.toLocaleString() : "0"}</span>
            </p>
            <p className="flex justify-between">
              <span className="text-white/60">Phone:</span> 
              <span className="font-bold">{phone}</span>
            </p>
          </div>
        </DialogBody>

        <DialogFooter>
          <Button variant="ghost" className="text-white/40" onClick={() => setConfirmOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleFinalConfirm}>
            Confirm Payment
          </Button>
        </DialogFooter>
      </Dialog>
    </DashboardLayout>
  );
}