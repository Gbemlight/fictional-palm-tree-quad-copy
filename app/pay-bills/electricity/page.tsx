"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Zap, CheckCircle2, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/phone-input";
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
  { id: "ikedc", label: "IKEDC" },
  { id: "ekedc", label: "EKEDC" },
  { id: "aedc", label: "AEDC" },
  { id: "kedco", label: "KEDCO" },
  { id: "phed", label: "PHED" },
] as const;

const schema = z.object({
  provider: z.string().min(1, "Select an electricity provider"),
  meterType: z.enum(["prepaid", "postpaid"], {
    errorMap: () => ({ message: "Select meter type" }),
  }),
  meterNumber: z
    .string()
    .regex(/^\d{11}$/, "Meter number must be exactly 11 digits"),
  amount: z
    .number({ message: "Enter a valid amount" })
    .min(500, "Minimum amount is ₦500"),
  phone: z
    .string()
    .regex(/^(070|080|081|090|091)\d{8}$/, "Enter a valid Nigerian number"),
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
      provider: "",
      meterType: "prepaid",
      meterNumber: "",
      amount: 500,
      phone: "",
    },
  });

  const selectedProvider = watch("provider");
  const meterType = watch("meterType");
  const meterNumber = watch("meterNumber");
  const amount = watch("amount");
  const phone = watch("phone");

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
    const meterValid = await trigger("meterNumber");
    const providerValid = await trigger("provider");

    if (!meterValid || !providerValid) return;

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

  const onSubmit = () => {
    if (!meterVerified) return;
    setConfirmOpen(true);
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#000000] px-4 py-8 md:px-8 md:py-10">
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-purple-500/30 blur-[140px]" />

      <div className="relative mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1fr_360px]">
        {/* Main Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <section className="rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur-xl md:p-8">
            <div className="mb-2 flex items-center gap-3">
              <div className="rounded-2xl bg-white/10 p-3">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white md:text-4xl">
                  Pay Electricity Bill
                </h1>
                <p className="text-sm text-white/70">
                  Verify your meter details and complete payment in one flow.
                </p>
              </div>
            </div>
          </section>

          {/* Step 1 */}
          <section className="rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur-xl md:p-8">
            <h2 className="mb-4 text-xl font-semibold text-white">
              1. Select provider
            </h2>

            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
              {providers.map((provider) => {
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
                      "focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/50",
                      active
                        ? "border-transparent bg-[linear-gradient(135deg,var(--color-primary),var(--color-secondary))] text-white shadow-[0_12px_24px_rgba(236,72,153,0.18)]"
                        : "border-white/15 bg-white/5 text-white/85 hover:bg-white/10"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{provider.label}</span>
                      {active && (
                        <CheckCircle2 className="h-4 w-4 text-white" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {errors.provider && (
              <p className="mt-3 text-sm text-[var(--color-danger)]">
                {errors.provider.message}
              </p>
            )}
          </section>

          {/* Step 2 */}
          <section className="rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur-xl md:p-8">
            <h2 className="mb-4 text-xl font-semibold text-white">
              2. Meter type
            </h2>

            <Controller
              name="meterType"
              control={control}
              render={({ field }) => (
                <div className="flex flex-col gap-3 md:flex-row">
                  {[
                    { value: "prepaid", label: "Prepaid" },
                    { value: "postpaid", label: "Postpaid" },
                  ].map((option) => {
                    const active = field.value === option.value;

                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => field.onChange(option.value)}
                        className={cn(
                          "rounded-2xl border px-5 py-4 text-left transition-all duration-200",
                          active
                            ? "border-transparent bg-[linear-gradient(135deg,var(--color-primary),var(--color-secondary))] text-white shadow-[0_12px_24px_rgba(124,58,237,0.22)]"
                            : "border-white/15 bg-white/5 text-white/85 hover:bg-white/10"
                        )}
                      >
                        <span className="font-medium">{option.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            />
          </section>

          {/* Step 3 */}
          <section className="rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur-xl md:p-8">
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
                className="md:min-w-[180px]"
              >
                {verifying ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify Meter"
                )}
              </Button>
            </div>

            {verifyError && (
              <p className="mt-3 text-sm text-[var(--color-danger)]">
                {verifyError}
              </p>
            )}

            {meterVerified && meterInfo && (
              <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-sm text-white/60">Customer name</p>
                <p className="text-lg font-semibold text-white">
                  {meterInfo.customerName}
                </p>

                <p className="mt-3 text-sm text-white/60">Address</p>
                <p className="text-white">{meterInfo.address}</p>
              </div>
            )}
          </section>

          {/* Step 4 */}
          <section className="rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur-xl md:p-8">
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
          </section>

          {/* Step 5 */}
          <section className="rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur-xl md:p-8">
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
          </section>

          <div className="lg:hidden">
            <Button type="submit" fullWidth disabled={!canProceed}>
              Proceed to Payment
            </Button>
          </div>
        </form>

        {/* Sticky Summary */}
        <aside className="h-fit lg:sticky lg:top-8">
          <div className="rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur-xl">
            <h2 className="text-2xl font-semibold text-white">Summary</h2>
            <p className="mt-1 text-sm text-white/60">
              Updates in real time as you fill the form.
            </p>

            <div className="mt-6 space-y-4">
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-sm text-white/60">Provider</p>
                <p className="mt-1 text-white font-medium">
                  {selectedProvider
                    ? providers.find((p) => p.id === selectedProvider)?.label
                    : "Not selected"}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-sm text-white/60">Meter type</p>
                <p className="mt-1 capitalize text-white font-medium">
                  {meterType || "Not selected"}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-sm text-white/60">Meter number</p>
                <p className="mt-1 text-white font-medium">
                  {meterNumber || "Not entered"}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-sm text-white/60">Meter info</p>
                {meterVerified && meterInfo ? (
                  <>
                    <p className="mt-1 text-white font-medium">
                      {meterInfo.customerName}
                    </p>
                    <p className="text-sm text-white/70">
                      {meterInfo.address}
                    </p>
                  </>
                ) : (
                  <p className="mt-1 text-white/70">Not verified yet</p>
                )}
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-sm text-white/60">Amount</p>
                <p className="mt-1 text-white font-medium">
                  ₦{Number.isFinite(amount) ? amount.toLocaleString() : "0"}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-sm text-white/60">Notification number</p>
                <p className="mt-1 text-white font-medium">
                  {phone || "Not entered"}
                </p>
              </div>
            </div>

            <div className="mt-6 hidden lg:block">
              <Button type="button" fullWidth disabled={!canProceed} onClick={handleSubmit(onSubmit)}>
                Proceed to Payment
              </Button>
            </div>
          </div>
        </aside>
      </div>

      {/* Confirmation Modal */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen} size="md">
        <DialogHeader>
          <DialogTitle>Confirm Electricity Payment</DialogTitle>
          <DialogDescription>
            Please review the details before proceeding.
          </DialogDescription>
        </DialogHeader>

        <DialogBody>
          <div className="space-y-3 text-white/85">
            <p>
              <span className="text-white/60">Provider:</span>{" "}
              {providers.find((p) => p.id === selectedProvider)?.label}
            </p>
            <p>
              <span className="text-white/60">Meter Type:</span> {meterType}
            </p>
            <p>
              <span className="text-white/60">Meter Number:</span> {meterNumber}
            </p>
            <p>
              <span className="text-white/60">Customer:</span>{" "}
              {meterInfo?.customerName}
            </p>
            <p>
              <span className="text-white/60">Address:</span> {meterInfo?.address}
            </p>
            <p>
              <span className="text-white/60">Amount:</span> ₦
              {Number.isFinite(amount) ? amount.toLocaleString() : "0"}
            </p>
            <p>
              <span className="text-white/60">Notification Number:</span> {phone}
            </p>
          </div>
        </DialogBody>

        <DialogFooter>
          <Button variant="secondary" onClick={() => setConfirmOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => setConfirmOpen(false)}>
            Confirm Payment
          </Button>
        </DialogFooter>
      </Dialog>
    </main>
  );
}