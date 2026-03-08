"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Wifi, Mail, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogFooter,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type ProviderId = "smile" | "spectranet" | "swift" | "ipnx";

type Plan = {
  id: string;
  provider: ProviderId;
  name: string;
  dataGb: number | null;
  validity: string;
  price: number;
  speed?: string;
  recommended?: boolean;
};

const providers = [
  { id: "smile", label: "Smile", inputLabel: "Phone Number", inputPlaceholder: "07012345678" },
  { id: "spectranet", label: "Spectranet", inputLabel: "Account ID", inputPlaceholder: "Enter Spectranet Account ID" },
  { id: "swift", label: "Swift", inputLabel: "Phone Number", inputPlaceholder: "08012345678" },
  { id: "ipnx", label: "ipNX", inputLabel: "Account ID", inputPlaceholder: "Enter ipNX Customer ID" },
] as const;

const plans: Plan[] = [
  {
    id: "smile-10",
    provider: "smile",
    name: "Smile 10GB",
    dataGb: 10,
    validity: "30 Days",
    price: 3000,
    speed: "4G LTE",
  },
  {
    id: "smile-25",
    provider: "smile",
    name: "Smile 25GB",
    dataGb: 25,
    validity: "30 Days",
    price: 6500,
    speed: "4G LTE",
    recommended: true,
  },
  {
    id: "smile-unlimited",
    provider: "smile",
    name: "Smile Unlimited",
    dataGb: null,
    validity: "30 Days",
    price: 15000,
    speed: "Unlimited",
  },
  {
    id: "spectranet-10",
    provider: "spectranet",
    name: "Spectranet 10GB",
    dataGb: 10,
    validity: "30 Days",
    price: 3200,
    speed: "5G Ready",
  },
  {
    id: "spectranet-25",
    provider: "spectranet",
    name: "Spectranet 25GB",
    dataGb: 25,
    validity: "30 Days",
    price: 6800,
    speed: "5G Ready",
    recommended: true,
  },
  {
    id: "spectranet-unlimited",
    provider: "spectranet",
    name: "Spectranet Unlimited",
    dataGb: null,
    validity: "30 Days",
    price: 15500,
    speed: "Unlimited",
  },
  {
    id: "swift-10",
    provider: "swift",
    name: "Swift 10GB",
    dataGb: 10,
    validity: "30 Days",
    price: 3100,
    speed: "4G",
  },
  {
    id: "swift-25",
    provider: "swift",
    name: "Swift 25GB",
    dataGb: 25,
    validity: "30 Days",
    price: 6600,
    speed: "4G",
    recommended: true,
  },
  {
    id: "swift-unlimited",
    provider: "swift",
    name: "Swift Unlimited",
    dataGb: null,
    validity: "30 Days",
    price: 14800,
    speed: "Unlimited",
  },
  {
    id: "ipnx-10",
    provider: "ipnx",
    name: "ipNX 10GB",
    dataGb: 10,
    validity: "30 Days",
    price: 3500,
    speed: "Fiber / LTE",
  },
  {
    id: "ipnx-25",
    provider: "ipnx",
    name: "ipNX 25GB",
    dataGb: 25,
    validity: "30 Days",
    price: 7000,
    speed: "Fiber / LTE",
    recommended: true,
  },
  {
    id: "ipnx-unlimited",
    provider: "ipnx",
    name: "ipNX Unlimited",
    dataGb: null,
    validity: "30 Days",
    price: 16000,
    speed: "Unlimited",
  },
];

const userEmail = "sadiq@quickpay.app";

const schema = z.object({
  provider: z.string().min(1, "Select an ISP provider"),
  accountId: z.string().min(1, "Enter your account ID or phone number"),
  planId: z.string().min(1, "Select a plan"),
  email: z.string().email("Enter a valid email address"),
});

type FormValues = z.infer<typeof schema>;

function validateAccount(provider: string, value: string) {
  const trimmed = value.trim();

  if (!provider) return "Select a provider first";

  if (provider === "smile" || provider === "swift") {
    return /^(070|080|081|090|091)\d{8}$/.test(trimmed)
      ? ""
      : "Enter a valid Nigerian phone number";
  }

  if (provider === "spectranet") {
    return /^[A-Za-z0-9]{6,14}$/.test(trimmed)
      ? ""
      : "Enter a valid Spectranet account ID";
  }

  if (provider === "ipnx") {
    return /^[A-Za-z0-9-]{6,16}$/.test(trimmed)
      ? ""
      : "Enter a valid ipNX customer ID";
  }

  return "";
}

function naira(value: number) {
  return `₦${value.toLocaleString()}`;
}

export default function InternetBundlesPage() {
  const {
    control,
    watch,
    setValue,
    handleSubmit,
    trigger,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      provider: "",
      accountId: "",
      planId: "",
      email: userEmail,
    },
  });

  const selectedProvider = watch("provider");
  const accountId = watch("accountId");
  const selectedPlanId = watch("planId");
  const email = watch("email");

  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [accountError, setAccountError] = React.useState("");

  const providerMeta = providers.find((p) => p.id === selectedProvider);
  const filteredPlans = plans.filter((p) => p.provider === selectedProvider);
  const selectedPlan = filteredPlans.find((p) => p.id === selectedPlanId);

  React.useEffect(() => {
    setValue("planId", "", { shouldValidate: true });
    setAccountError("");
  }, [selectedProvider, setValue]);

  const verifyAccountField = async () => {
    const baseValid = await trigger(["provider", "accountId"]);
    if (!baseValid) return false;

    const customError = validateAccount(selectedProvider, accountId);
    setAccountError(customError);
    return !customError;
  };

  const onSubmit = async () => {
    const ok = await verifyAccountField();
    if (!ok) return;
    setConfirmOpen(true);
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#1a1a1a] px-4 py-8 md:px-8 md:py-10">
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-purple-500/30 blur-[140px]" />

      <div className="relative mx-auto max-w-6xl space-y-6">
        <section className="rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur-xl md:p-8">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-white/10 p-3">
              <Wifi className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white md:text-4xl">
                Purchase Internet Bundle
              </h1>
              <p className="text-sm text-white/70">
                Choose your ISP, pick a plan, and complete your purchase.
              </p>
            </div>
          </div>
        </section>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            {/* Provider selection */}
            <section className="rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur-xl md:p-8">
              <h2 className="mb-4 text-xl font-semibold text-white">
                1. Select ISP Provider
              </h2>

              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
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
                        "rounded-2xl border p-5 text-left transition-all duration-200",
                        "focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/50",
                        active
                          ? "border-transparent bg-[linear-gradient(135deg,var(--color-primary),var(--color-secondary))] text-white shadow-[0_12px_24px_rgba(236,72,153,0.22)]"
                          : "border-white/15 bg-white/5 text-white/85 hover:bg-white/10"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">{provider.label}</span>
                        {active && <CheckCircle2 className="h-4 w-4" />}
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

            {/* Account input */}
            <section className="rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur-xl md:p-8">
              <h2 className="mb-4 text-xl font-semibold text-white">
                2. Enter Account Details
              </h2>

              <Controller
                name="accountId"
                control={control}
                render={({ field }) => (
                  <Input
                    label={providerMeta?.inputLabel || "Account ID / Phone Number"}
                    placeholder={
                      providerMeta?.inputPlaceholder ||
                      "Select provider to see required format"
                    }
                    value={field.value}
                    onChange={(e) => {
                      field.onChange(e.target.value);
                      if (accountError) setAccountError("");
                    }}
                    onBlur={async () => {
                      field.onBlur();
                      await verifyAccountField();
                    }}
                    helperText={
                      providerMeta
                        ? providerMeta.id === "smile" || providerMeta.id === "swift"
                          ? "Enter a valid Nigerian phone number"
                          : "Enter the provider-issued account ID"
                        : "Select a provider first"
                    }
                    state={
                      errors.accountId || accountError
                        ? "error"
                        : accountId && !errors.accountId && !accountError
                        ? "success"
                        : "default"
                    }
                    errorMessage={errors.accountId?.message || accountError}
                  />
                )}
              />
            </section>

            {/* Plans */}
            <section className="rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur-xl md:p-8">
              <h2 className="mb-4 text-xl font-semibold text-white">
                3. Choose Plan
              </h2>

              {selectedProvider ? (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {filteredPlans.map((plan) => {
                    const active = selectedPlanId === plan.id;
                    const valuePerGb =
                      plan.dataGb && plan.dataGb > 0
                        ? Math.round(plan.price / plan.dataGb)
                        : null;

                    return (
                      <motion.button
                        key={plan.id}
                        type="button"
                        whileHover={{ y: -4, scale: 1.01 }}
                        transition={{ duration: 0.2 }}
                        onClick={() =>
                          setValue("planId", plan.id, {
                            shouldValidate: true,
                            shouldDirty: true,
                          })
                        }
                        className={cn(
                          "relative rounded-3xl border p-5 text-left transition-all",
                          "focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/50",
                          active
                            ? "border-transparent bg-[linear-gradient(135deg,var(--color-primary),var(--color-secondary))] text-white shadow-[0_16px_32px_rgba(124,58,237,0.26)]"
                            : "border-white/15 bg-white/5 text-white/85 hover:bg-white/10"
                        )}
                      >
                        {plan.recommended && (
                          <div className="mb-3">
                            <Badge variant="success" size="sm">
                              Best Value
                            </Badge>
                          </div>
                        )}

                        <h3 className="text-lg font-semibold">{plan.name}</h3>

                        <div className="mt-3 space-y-1 text-sm">
                          <p>
                            <span className="text-white/65">Data:</span>{" "}
                            {plan.dataGb ? `${plan.dataGb}GB` : "Unlimited"}
                          </p>
                          <p>
                            <span className="text-white/65">Validity:</span>{" "}
                            {plan.validity}
                          </p>
                          <p>
                            <span className="text-white/65">Speed:</span>{" "}
                            {plan.speed || "N/A"}
                          </p>
                          <p>
                            <span className="text-white/65">Price:</span>{" "}
                            {naira(plan.price)}
                          </p>
                          {valuePerGb && (
                            <p>
                              <span className="text-white/65">Value:</span>{" "}
                              {naira(valuePerGb)}/GB
                            </p>
                          )}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              ) : (
                <div className="rounded-2xl border border-white/10 bg-black/20 p-5 text-white/70">
                  Select an ISP provider to view available plans.
                </div>
              )}

              {errors.planId && (
                <p className="mt-3 text-sm text-[var(--color-danger)]">
                  {errors.planId.message}
                </p>
              )}
            </section>

            {/* Email */}
            <section className="rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur-xl md:p-8">
              <h2 className="mb-4 text-xl font-semibold text-white">
                4. Receipt Email
              </h2>

              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <Input
                    label="Email Address"
                    placeholder="Enter receipt email"
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    leftIcon={<Mail className="h-4 w-4" />}
                    state={errors.email ? "error" : email ? "success" : "default"}
                    errorMessage={errors.email?.message}
                  />
                )}
              />
            </section>

            <div className="lg:hidden">
              <Button type="submit" fullWidth disabled={!isValid || !!accountError}>
                Purchase Bundle
              </Button>
            </div>
          </div>

          {/* Summary */}
          <aside className="h-fit lg:sticky lg:top-8">
            <div className="rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur-xl">
              <h2 className="text-2xl font-semibold text-white">Summary</h2>
              <p className="mt-1 text-sm text-white/60">
                Review selected provider, account, and plan details.
              </p>

              <div className="mt-6 space-y-4">
                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <p className="text-sm text-white/60">Provider</p>
                  <p className="mt-1 text-white font-medium">
                    {providerMeta?.label || "Not selected"}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <p className="text-sm text-white/60">
                    {providerMeta?.inputLabel || "Account"}
                  </p>
                  <p className="mt-1 text-white font-medium">
                    {accountId || "Not entered"}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <p className="text-sm text-white/60">Selected Plan</p>
                  {selectedPlan ? (
                    <div className="mt-1 space-y-1">
                      <p className="font-medium text-white">{selectedPlan.name}</p>
                      <p className="text-sm text-white/70">
                        {selectedPlan.dataGb
                          ? `${selectedPlan.dataGb}GB`
                          : "Unlimited"}{" "}
                        • {selectedPlan.validity}
                      </p>
                      <p className="text-sm text-white/70">
                        {naira(selectedPlan.price)}
                      </p>
                    </div>
                  ) : (
                    <p className="mt-1 text-white/70">No plan selected</p>
                  )}
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <p className="text-sm text-white/60">Receipt Email</p>
                  <p className="mt-1 text-white font-medium">
                    {email || "Not entered"}
                  </p>
                </div>
              </div>

              <div className="mt-6 hidden lg:block">
                <Button type="submit" fullWidth disabled={!isValid || !!accountError} onClick={handleSubmit(onSubmit)}>
                  Purchase Bundle
                </Button>
              </div>
            </div>
          </aside>
        </form>
      </div>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen} size="md">
        <DialogHeader>
          <DialogTitle>Confirm Internet Bundle Purchase</DialogTitle>
          <DialogDescription>
            Review your selected provider, account details, and plan.
          </DialogDescription>
        </DialogHeader>

        <DialogBody>
          <div className="space-y-3 text-white/85">
            <p>
              <span className="text-white/60">Provider:</span>{" "}
              {providerMeta?.label}
            </p>
            <p>
              <span className="text-white/60">
                {providerMeta?.inputLabel || "Account"}:
              </span>{" "}
              {accountId}
            </p>
            <p>
              <span className="text-white/60">Plan:</span>{" "}
              {selectedPlan?.name}
            </p>
            <p>
              <span className="text-white/60">Amount:</span>{" "}
              {selectedPlan ? naira(selectedPlan.price) : "—"}
            </p>
            <p>
              <span className="text-white/60">Receipt Email:</span> {email}
            </p>
          </div>
        </DialogBody>

        <DialogFooter>
          <Button variant="secondary" onClick={() => setConfirmOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => setConfirmOpen(false)}>
            Confirm Purchase
          </Button>
        </DialogFooter>
      </Dialog>
    </main>
  );
}