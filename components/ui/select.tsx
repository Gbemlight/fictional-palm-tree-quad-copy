"use client";

import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { cn } from "@/lib/utils";
import { Check, ChevronDown } from "lucide-react";

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  label?: string;
  helperText?: string;
  errorMessage?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  options: SelectOption[];
  disabled?: boolean;
  id?: string;
  name?: string;
  triggerClassName?: string; // Added for custom trigger styling
}

export const Select = React.forwardRef<HTMLButtonElement, SelectProps>(
  (
    {
      label,
      helperText,
      errorMessage,
      value,
      onValueChange,
      placeholder = "Select an option",
      options,
      disabled,
      triggerClassName,
      id,
    },
    ref
  ) => {
    const generatedId = React.useId();
    const selectId = id ?? generatedId;
    const showError = !!errorMessage;
    const describedByIds = [
      helperText ? `${selectId}-help` : null,
      errorMessage ? `${selectId}-error` : null,
    ].filter(Boolean).join(" ");

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={selectId}
            className="mb-2 block text-sm font-medium text-gray-800"
          >
            {label}
          </label>
        )}

      <SelectPrimitive.Root
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
      >
        <SelectPrimitive.Trigger
          ref={ref}
          id={selectId}
          aria-invalid={showError ? "true" : "false"}
          aria-describedby={describedByIds || undefined}
          className={cn(
            "h-11 w-full rounded-xl border bg-white/70 backdrop-blur px-4 text-sm text-gray-900",
            "flex items-center justify-between outline-none transition-all duration-200",
            "focus:ring-2 focus:ring-accent/40 focus:border-primary",
            disabled && "opacity-60 pointer-events-none",
            showError &&
              "border-danger focus:border-danger focus:ring-danger/30",
            triggerClassName // Apply custom class name here
          )}
        >
          <SelectPrimitive.Value placeholder={placeholder} />
          <SelectPrimitive.Icon>
            <ChevronDown className="h-4 w-4 text-gray-600" />
          </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>

        <SelectPrimitive.Portal>
          <SelectPrimitive.Content
            className="z-50 overflow-hidden rounded-xl border border-white/20 bg-white/90 backdrop-blur shadow-lg"
            position="popper"
          >
            <SelectPrimitive.Viewport className="p-2">
              {options.map((opt) => (
                <SelectPrimitive.Item
                  key={opt.value}
                  value={opt.value}
                  className={cn(
                    "relative flex cursor-pointer select-none items-center rounded-lg px-3 py-2 text-sm outline-none",
                    "text-gray-900 hover:bg-gray-100 data-highlighted:bg-gray-100"
                  )}
                >
                  <SelectPrimitive.ItemText>
                    {opt.label}
                  </SelectPrimitive.ItemText>
                  <SelectPrimitive.ItemIndicator className="absolute right-2">
                    <Check className="h-4 w-4 text-primary" />
                  </SelectPrimitive.ItemIndicator>
                </SelectPrimitive.Item>
              ))}
            </SelectPrimitive.Viewport>
          </SelectPrimitive.Content>
        </SelectPrimitive.Portal>
      </SelectPrimitive.Root>

        {helperText && !showError && (
          <p id={`${selectId}-help`} className="mt-2 text-xs text-gray-500">{helperText}</p>
        )}

        {showError && (
          <p id={`${selectId}-error`} role="alert" aria-live="polite" className="mt-2 text-xs text-danger">
            {errorMessage}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";