"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Tv, CheckCircle2, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogFooter,
} from "@/components/ui/dialog";

import { Select } from "@/components/ui/select";
import { Switch } from "@radix-ui/react-switch";
import { cn } from "@/lib/utils";

/* ---------------- Packages ---------------- */

const packages = {
  dstv: [
    { name: "Compact", price: 10500 },
    { name: "Compact Plus", price: 16600 },
    { name: "Premium", price: 21000 },
  ],
  gotv: [
    { name: "Jolli", price: 3950 },
    { name: "Max", price: 5700 },
    { name: "Supa", price: 7600 },
  ],
  startimes: [
    { name: "Nova", price: 1700 },
    { name: "Basic", price: 3200 },
    { name: "Classic", price: 5000 },
  ],
};

const providers = [
  { id: "dstv", label: "DSTV" },
  { id: "gotv", label: "GOTV" },
  { id: "startimes", label: "Startimes" },
];

/* ---------------- Validation ---------------- */

const schema = z.object({
  provider: z.string().min(1),
  cardNumber: z.string().regex(/^\d{10}$/, "Card number must be 10 digits"),
  package: z.string().min(1),
  duration: z.number(),
  autoRenew: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

/* ---------------- Discounts ---------------- */

function getDiscount(duration: number) {
  if (duration >= 12) return 0.15;
  if (duration >= 6) return 0.1;
  if (duration >= 3) return 0.05;
  return 0;
}

export default function CablePage() {
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
      cardNumber: "",
      package: "",
      duration: 1,
      autoRenew: false,
    },
  });

  const provider = watch("provider");
  const cardNumber = watch("cardNumber");
  const packageName = watch("package");
  const duration = watch("duration");
  const autoRenew = watch("autoRenew");

  const [verifying, setVerifying] = React.useState(false);
  const [verified, setVerified] = React.useState(false);
  const [customer, setCustomer] = React.useState("");
  const [confirmOpen, setConfirmOpen] = React.useState(false);

  const providerPackages = provider
    ? packages[provider as keyof typeof packages]
    : [];

  const selectedPackage = providerPackages.find(
    (p) => p.name === packageName
  );

  const basePrice = selectedPackage?.price || 0;
  const discount = getDiscount(duration);
  const total = Math.round(basePrice * duration * (1 - discount));

  /* ---------- Verification ---------- */

  const verifyCard = async () => {
    const valid = await trigger("cardNumber");
    if (!valid) return;

    setVerifying(true);

    setTimeout(() => {
      setCustomer("Sadiq Ahmad");
      setVerified(true);
      setVerifying(false);
    }, 1000);
  };

  const onSubmit = () => setConfirmOpen(true);

  return (
    <main className="min-h-screen bg-[#000000] p-6 md:p-10">
      <div className="mx-auto max-w-5xl space-y-6">

        {/* Header */}
        <section className="rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <Tv className="h-6 w-6 text-white" />
            <h1 className="text-3xl font-bold text-white">
              Renew Cable Subscription
            </h1>
          </div>
        </section>

        {/* Provider Selection */}
        <section className="rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur-xl">
          <h2 className="mb-4 text-xl text-white font-semibold">
            Select Provider
          </h2>

          <div className="grid grid-cols-3 gap-4">
            {providers.map((p) => {
              const active = provider === p.id;

              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() =>
                    setValue("provider", p.id, { shouldValidate: true })
                  }
                  className={cn(
                    "rounded-2xl border p-4 transition",
                    active
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                      : "border-white/20 text-white/80 hover:bg-white/10"
                  )}
                >
                  {p.label}
                </button>
              );
            })}
          </div>
        </section>

        {/* Card Input */}
        <section className="rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur-xl">
          <h2 className="mb-4 text-xl font-semibold text-white">
            Smart Card / IUC Number
          </h2>

          <div className="flex gap-3">
            <Controller
              name="cardNumber"
              control={control}
              render={({ field }) => (
                <Input
                  placeholder="Enter 10-digit card number"
                  value={field.value}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value.replace(/\D/g, "").slice(0, 10)
                    )
                  }
                />
              )}
            />

            <Button onClick={verifyCard} type="button">
              {verifying ? (
                <Loader2 className="animate-spin h-4 w-4" />
              ) : (
                "Verify Card"
              )}
            </Button>
          </div>

          {verified && (
            <p className="mt-3 text-green-400">
              Verified: {customer}
            </p>
          )}
        </section>

        {/* Package */}
        <section className="rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur-xl">
          <h2 className="mb-4 text-xl font-semibold text-white">
            Select Package
          </h2>

          <Controller
            name="package"
            control={control}
            render={({ field }) => (
              <Select
                label="Package"
                value={field.value}
                onValueChange={field.onChange}
                options={providerPackages.map((p) => ({
                  value: p.name,
                  label: `${p.name} – ₦${p.price.toLocaleString()}`,
                }))}
              />
            )}
          />
        </section>

        {/* Duration */}
        <section className="rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur-xl">
          <h2 className="mb-4 text-xl font-semibold text-white">
            Duration
          </h2>

          <div className="flex gap-3">
            {[1, 3, 6, 12].map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setValue("duration", d)}
                className={cn(
                  "rounded-full px-4 py-2 border",
                  duration === d
                    ? "bg-purple-500 text-white"
                    : "text-white/70"
                )}
              >
                {d} month{d > 1 && "s"}
                {d >= 3 && (
                  <span className="ml-2 text-xs text-green-400">
                    {Math.round(getDiscount(d) * 100)}% off
                  </span>
                )}
              </button>
            ))}
          </div>
        </section>

        {/* Auto Renew */}
        <section className="rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <span className="text-white font-medium">
              Enable Auto-Renewal
            </span>

            <Controller
              name="autoRenew"
              control={control}
              render={({ field }) => (
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
          </div>
        </section>

        {/* Summary */}
        <section className="rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur-xl">
          <h2 className="text-xl font-semibold text-white">
            Total: ₦{total.toLocaleString()}
          </h2>

          <Button
            fullWidth
            disabled={!verified || !isValid}
            onClick={handleSubmit(onSubmit)}
          >
            Subscribe Now
          </Button>
        </section>
      </div>

      {/* Confirmation */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogHeader>
          <DialogTitle>Confirm Subscription</DialogTitle>
          <DialogDescription>
            Review your cable renewal details.
          </DialogDescription>
        </DialogHeader>

        <DialogBody>
          <p className="text-white">
            {provider?.toUpperCase()} – {packageName}
          </p>
          <p className="text-white">Duration: {duration} months</p>
          <p className="text-white">
            Total: ₦{total.toLocaleString()}
          </p>
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