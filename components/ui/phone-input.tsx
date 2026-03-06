"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { CheckCircle2, AlertCircle, ChevronDown } from "lucide-react";

type InputState = "default" | "success" | "error";

const countryOptions = [
  { code: "+234", label: "NG" }, // Nigeria default
];

function isValidNigerianPhone(raw: string) {
  // Accepts: 080..., 081..., 090..., 070..., 091...
  // Normalize: remove spaces, dashes
  const v = raw.replace(/\s|-/g, "");
  return /^(070|080|081|090|091)\d{8}$/.test(v);
}

interface PhoneInputProps {
  label?: string;
  helperText?: string;
  errorMessage?: string;
  state?: InputState;
  disabled?: boolean;

  countryCode?: string;
  onCountryCodeChange?: (v: string) => void;

  value?: string;
  onChange?: (v: string) => void;
  onBlur?: () => void;
  placeholder?: string;
}

export function PhoneInput({
  label,
  helperText,
  errorMessage,
  state = "default",
  disabled,
  countryCode = "+234",
  onCountryCodeChange,
  value = "",
  onChange,
  onBlur,
  placeholder = "08012345678",
}: PhoneInputProps) {
  const id = React.useId();
  const showError = state === "error" && !!errorMessage;
  const showSuccess = state === "success";

  // local validation hint (optional)
  const localValid = value ? isValidNigerianPhone(value) : false;

  return (
    <div className="w-full">
      {label && (
        <label className="mb-2 block text-sm font-medium text-gray-800">
          {label}
        </label>
      )}

      <div
        className={cn(
          "relative flex h-11 w-full items-center overflow-hidden rounded-xl border bg-white/70 backdrop-blur",
          "transition-all duration-200",
          "focus-within:ring-2 focus-within:ring-[var(--color-accent)]/40 focus-within:border-[var(--color-primary)]",
          disabled && "opacity-60 pointer-events-none",
          showError &&
            "border-[var(--color-danger)] focus-within:border-[var(--color-danger)] focus-within:ring-[var(--color-danger)]/30",
          showSuccess &&
            "border-[var(--color-success)] focus-within:border-[var(--color-success)] focus-within:ring-[var(--color-success)]/30"
        )}
      >
        {/* Country code selector (simple dropdown UI) */}
        <button
          type="button"
          className="flex h-full items-center gap-2 px-3 text-sm text-gray-800 border-r border-white/20"
          disabled={disabled}
          aria-label="Select country code"
          onClick={() => {
            // only one option now, but ready for extension
          }}
        >
          <span className="font-medium">{countryOptions[0].label}</span>
          <span className="text-gray-600">{countryCode}</span>
          <ChevronDown className="h-4 w-4 text-gray-600" />
        </button>

        <input
          id={id}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          onBlur={onBlur}
          placeholder={placeholder}
          inputMode="numeric"
          className={cn(
            "h-full w-full bg-transparent px-4 text-sm text-gray-900 outline-none placeholder:text-gray-400 pr-10"
          )}
        />

        <span className="absolute right-3 flex items-center">
          {showError ? (
            <AlertCircle className="h-5 w-5 text-[var(--color-danger)]" />
          ) : showSuccess || localValid ? (
            <CheckCircle2 className="h-5 w-5 text-[var(--color-success)]" />
          ) : null}
        </span>
      </div>

      {helperText && !showError && (
        <p className="mt-2 text-xs text-gray-500">{helperText}</p>
      )}

      {showError && (
        <p role="alert" aria-live="polite" className="mt-2 text-xs text-[var(--color-danger)]">
          {errorMessage}
        </p>
      )}
    </div>
  );
}