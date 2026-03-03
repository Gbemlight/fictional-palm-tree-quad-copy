"use client";

/**
 * ISSUE #5 – Form Input Components Demo
 *
 * - Text Input with label, helper text, error + success states
 * - Radix Select dropdown
 * - Nigerian Phone Input with validation
 * - react-hook-form + Zod integration
 * - Validation triggers on blur
 * - Accessible error messages
 * - Keyboard navigable
 */

import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { PhoneInput } from "@/components/ui/phone-input";
import { Button } from "@/components/ui/button";

const schema = z.object({
  name: z.string().min(2, "Name is required"),
  network: z.string().min(1, "Select a network"),
  phone: z
    .string()
    .regex(/^(070|080|081|090|091)\d{8}$/, "Enter a valid Nigerian number"),
});

type FormValues = z.infer<typeof schema>;

export default function Home() {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onBlur",
  });

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#000000] p-6">
      <div className="w-full max-w-md rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 p-8 shadow-xl">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">
          QuickPay Form Demo
        </h1>

        <form
          className="space-y-5"
          onSubmit={handleSubmit((v) => console.log(v))}
        >
          <Input
            label="Full Name"
            placeholder="Enter your name"
            state={errors.name ? "error" : "default"}
            errorMessage={errors.name?.message}
            {...register("name")}
          />

          <Controller
            name="network"
            control={control}
            render={({ field }) => (
              <Select
                label="Network"
                value={field.value}
                onValueChange={field.onChange}
                errorMessage={errors.network?.message}
                options={[
                  { value: "mtn", label: "MTN" },
                  { value: "airtel", label: "Airtel" },
                  { value: "glo", label: "Glo" },
                  { value: "9mobile", label: "9mobile" },
                ]}
              />
            )}
          />

          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <PhoneInput
                label="Phone Number"
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                state={errors.phone ? "error" : "default"}
                errorMessage={errors.phone?.message}
                helperText="Format: 08012345678"
              />
            )}
          />

          <Button type="submit" fullWidth>
            Submit
          </Button>
        </form>
      </div>
    </main>
  );
}