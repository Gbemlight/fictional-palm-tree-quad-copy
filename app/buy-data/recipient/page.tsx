"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { savedBeneficiaries } from "../../../lib/dummy-data";

const phoneSchema = z.string()
  .regex(/^0(70|80|81|90|91)\d{8}$/, "Enter a valid Nigerian phone number (e.g. 08012345678)");

const formSchema = z.object({
  phone: phoneSchema,
  save: z.boolean().optional(),
  name: z.string().optional(),
});

const recentRecipients = [
  "08012345678",
  "08123456789",
  "09087654321",
];

export default function BuyDataRecipientPage() {
  const [formatPhone, setFormatPhone] = useState("");
  const { register, handleSubmit, setValue, watch, formState: { errors, touchedFields } } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { phone: "", save: false, name: "" },
    mode: "onChange"
  });

  const saveChecked = watch("save");

  function autoFormatPhone(val: string) {
    if (!val) return "";
    // Format as 080 1234 5678
    const digits = val.replace(/\D/g, "");
    let formatted = digits;
    if (digits.length > 3) formatted = digits.slice(0, 3) + " " + digits.slice(3);
    if (digits.length > 7) formatted = formatted.slice(0, 8) + " " + formatted.slice(8);
    return formatted;
  }

  // Keep formatPhone in sync with form value
  const phoneValue = watch("phone");
  React.useEffect(() => {
    setFormatPhone(autoFormatPhone(phoneValue));
  }, [phoneValue]);

  function onPhoneChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value.replace(/\D/g, "");
    setValue("phone", val, { shouldValidate: true, shouldTouch: true });
  }

  function onBeneficiarySelect(ben: { phone: string; name?: string }) {
    const clean = ben.phone.replace(/\D/g, "");
    setValue("phone", clean, { shouldValidate: true, shouldTouch: true });
  }

  function onRecentSelect(num: string) {
    setValue("phone", num, { shouldValidate: true, shouldTouch: true });
  }

  function onSubmit(data: { phone: string; save?: boolean; name?: string }) {
    window.location.assign(`/buy-data/payment?phone=${data.phone}${data.save && data.name ? `&name=${data.name}` : ""}`);
  }

  return (
    <div className="min-h-screen bg-[#18181b] text-white p-6 pb-24">
      <Link href="/buy-data/plans" className="mb-6 inline-block text-sm text-white/70 hover:text-white transition">&larr; Back to Plans</Link>
      <div className="mb-6 flex gap-4">
        <button className="px-4 py-2 rounded-full bg-indigo-500 text-white font-semibold">Recipient</button>
      </div>
      <h1 className="text-2xl font-bold mb-2">Enter Recipient Number</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block mb-2 font-semibold">Phone Number</label>
          <input
            type="text"
            inputMode="numeric"
            maxLength={14}
            className={`w-full rounded-lg p-3 bg-[#23232a] text-white text-lg border ${errors.phone ? "border-red-500" : "border-white/10"}`}
            value={formatPhone}
            onChange={onPhoneChange}
            onBlur={e => setValue("phone", e.target.value.replace(/\D/g, ""))}
            placeholder="080 1234 5678"
            autoComplete="off"
          />
          {errors.phone && touchedFields.phone && (
            <div className="mt-2 text-red-500 text-sm">{errors.phone.message}</div>
          )}
        </div>
        <div className="flex items-center gap-2 mt-2">
          <input type="checkbox" id="save" {...register("save")} className="accent-indigo-500 w-4 h-4" />
          <label htmlFor="save" className="text-sm">Save this number as beneficiary</label>
        </div>
        {saveChecked && (
          <div>
            <label className="block mb-2 text-sm">Beneficiary Name</label>
            <input
              type="text"
              {...register("name")}
              className="w-full rounded-lg p-3 bg-[#23232a] text-white text-lg border border-white/10"
              placeholder="Enter name (e.g. Dad, Work)"
              autoComplete="off"
            />
          </div>
        )}
        <button
          className="w-full max-w-xs mx-auto block rounded-xl py-3 font-semibold text-lg transition bg-indigo-500 hover:bg-indigo-600 text-white"
          type="submit"
        >
          Continue to Payment
        </button>
      </form>
      {/* Recent Recipients */}
      <div className="mt-10">
        <div className="font-semibold mb-2">Recent Recipients</div>
        <div className="flex gap-3">
          {recentRecipients.map(num => (
            <button
              key={num}
              className="rounded-xl bg-[#23232a] px-4 py-3 text-lg font-mono border border-white/10 hover:bg-indigo-500 transition"
              onClick={() => onRecentSelect(num)}
            >
              {autoFormatPhone(num)}
            </button>
          ))}
        </div>
      </div>
      {/* Saved Beneficiaries */}
      <div className="mt-10">
        <div className="font-semibold mb-2">Saved Beneficiaries</div>
        <div className="space-y-3">
          {savedBeneficiaries.filter(ben => ben.phone).map(ben => (
            <button
              key={ben.id}
              className="flex items-center gap-3 rounded-xl bg-[#23232a] px-4 py-3 border border-white/10 hover:bg-green-500 transition"
              onClick={() => onBeneficiarySelect(ben as { phone: string; name?: string })}
            >
              <span className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-lg text-white">{ben.name[0]}</span>
              <span className="font-semibold">{ben.name}</span>
              <span className="ml-auto font-mono text-lg">{autoFormatPhone(ben.phone as string)}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
