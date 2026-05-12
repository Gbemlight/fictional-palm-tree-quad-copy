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

export interface PhoneInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value"> {
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

export const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
  (
    {
      className,
      label,
      helperText,
      errorMessage,
      state = "default",
      disabled,
      countryCode = "+234",
      value = "",
      onChange,
      onBlur,
      placeholder = "08012345678",
      id,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const inputId = id ?? generatedId;
    const showError = state === "error" && !!errorMessage;
    const showSuccess = state === "success";
    const describedByIds = [
      helperText ? `${inputId}-help` : null,
      errorMessage ? `${inputId}-error` : null,
    ].filter(Boolean).join(" ");

    // local validation hint (optional)
  const localValid = value ? isValidNigerianPhone(value) : false;

  return (
    <div className={cn("w-full", className)}>
      {label && (
        <label
          htmlFor={inputId}
          className="mb-2 block text-sm font-medium text-gray-800"
        >
          {label}
        </label>
      )}

      <div
        className={cn(
          "relative flex h-11 w-full items-center overflow-hidden rounded-xl border bg-white/70 backdrop-blur",
          "transition-all duration-200",
          "focus-within:ring-2 focus-within:ring-accent/40 focus-within:border-primary",
          disabled && "opacity-60 pointer-events-none",
          showError &&
            "border-danger focus-within:border-danger focus-within:ring-danger/30",
          showSuccess &&
            "border-success focus-within:border-success focus-within:ring-success/30"
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
          ref={ref}
          id={inputId}
          aria-invalid={showError ? "true" : "false"}
          aria-describedby={describedByIds || undefined}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          onBlur={onBlur}
          placeholder={placeholder}
          inputMode="numeric"
          disabled={disabled}
          className={cn(
            "h-full w-full bg-transparent px-4 text-sm text-gray-900 outline-none placeholder:text-gray-400 pr-10"
          )}
          {...props}
        />

        <span className="absolute right-3 flex items-center">
          {showError ? (
            <AlertCircle className="h-5 w-5 text-danger" />
          ) : showSuccess || localValid ? (
            <CheckCircle2 className="h-5 w-5 text-success" />
          ) : null}
        </span>
      </div>

      {helperText && !showError && (
        <p id={`${inputId}-help`} className="mt-2 text-xs text-gray-500">{helperText}</p>
      )}

      {showError && (
        <p
          id={`${inputId}-error`}
          role="alert"
          aria-live="polite"
          className="mt-2 text-xs text-danger"
        >
          {errorMessage}
        </p>
      )}
    </div>
  );
  }
);

PhoneInput.displayName = "PhoneInput";