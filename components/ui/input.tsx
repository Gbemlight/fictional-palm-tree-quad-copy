"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { CheckCircle2, AlertCircle } from "lucide-react";

type InputState = "default" | "success" | "error";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  errorMessage?: string;
  state?: InputState;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      helperText,
      errorMessage,
      state = "default",
      leftIcon,
      rightIcon,
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const inputId = id ?? generatedId;
    const describedByIds = [
      helperText ? `${inputId}-help` : null,
      errorMessage ? `${inputId}-error` : null,
    ].filter(Boolean).join(" ");

    const showError = state === "error" && !!errorMessage;
    const showSuccess = state === "success";

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
            "relative flex items-center rounded-xl border bg-white/70 backdrop-blur",
            "transition-all duration-200",
            "focus-within:ring-2 focus-within:ring-[var(--color-accent)]/40",
            "focus-within:border-[var(--color-primary)]",
            disabled && "opacity-60 pointer-events-none",
            showError &&
              "border-[var(--color-danger)] focus-within:border-[var(--color-danger)] focus-within:ring-[var(--color-danger)]/30",
            showSuccess &&
              "border-[var(--color-success)] focus-within:border-[var(--color-success)] focus-within:ring-[var(--color-success)]/30"
          )}
        >
          {leftIcon && (
            <span className="pl-3 text-gray-500">{leftIcon}</span>
          )}

          <input
            ref={ref}
            id={inputId}
            aria-invalid={showError ? "true" : "false"}
            aria-describedby={describedByIds || undefined}
            disabled={disabled}
            className={cn(
              "h-11 w-full bg-transparent px-4 text-sm text-gray-900 outline-none placeholder:text-gray-400",
              leftIcon ? "pl-2" : undefined,
              (rightIcon || showError || showSuccess) ? "pr-10" : undefined,
              !(rightIcon || showError || showSuccess) ? "pr-4" : undefined
            )}
            {...props}
          />

          {/* Right icon / state icon */}
          <span className="absolute right-3 flex items-center">
            {showError ? (
              <AlertCircle className="h-5 w-5 text-[var(--color-danger)]" />
            ) : showSuccess ? (
              <CheckCircle2 className="h-5 w-5 text-[var(--color-success)]" />
            ) : (
              rightIcon
            )}
          </span>
        </div>

        {helperText && !showError && (
          <p id={`${inputId}-help`} className="mt-2 text-xs text-gray-500">
            {helperText}
          </p>
        )}

        {showError && (
          <p
            id={`${inputId}-error`}
            role="alert"
            aria-live="polite"
            className="mt-2 text-xs text-[var(--color-danger)]"
          >
            {errorMessage}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";