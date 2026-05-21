"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "danger"
  | "success"
  | "outline"
  | "outline-primary"; // Add outline variant

export type ButtonSize = "sm" | "md" | "lg" | "xl";

interface ButtonProps extends Omit<React.ComponentPropsWithoutRef<typeof motion.button>, "className"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  asChild?: boolean;
  fullWidth?: boolean;
  className?: string;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md hover:shadow-indigo-500/40",
  secondary:
    "border border-neutral-200 text-neutral-800 bg-white hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800",
  ghost:
    "bg-transparent text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800",
  danger:
    "bg-red-600 text-white hover:bg-red-700",
  success:
    "bg-green-600 text-white hover:bg-green-700",
  outline:
    "bg-transparent border border-neutral-300 text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800",
  "outline-primary":
    "bg-transparent border border-indigo-500 text-indigo-600 hover:bg-indigo-50 dark:border-indigo-400 dark:text-indigo-400 dark:hover:bg-indigo-900/20",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-base",
  xl: "h-14 px-8 text-lg",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      loading = false,
      asChild = false,
      disabled,
      leftIcon,
      rightIcon,
      fullWidth,
      children,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;
    const Comp = asChild ? Slot : motion.button;

    // Only apply motion props if we are NOT using asChild
    const motionProps = asChild ? {} : {
      whileTap: { scale: 0.97 },
      whileHover: { y: -2 },
      transition: { duration: 0.2 }
    };

    return (
      <Comp
        ref={ref}
        {...motionProps}
        disabled={isDisabled}
        className={cn(
          "relative inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200 ease-out",
          "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500",
          "active:scale-[0.98]",
          "disabled:opacity-50 disabled:pointer-events-none",
          variantClasses[variant as ButtonVariant],
          sizeClasses[size as ButtonSize],
          fullWidth && "w-full",
          className
        )}
        {...props}
      >
        {loading ? (
          <motion.div 
            className="h-5 w-5 rounded-full border-2 border-white/30 border-t-white" 
            animate={{ rotate: 360 }}
            transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
          />
        ) : asChild ? (
          children
        ) : (
          <>
            {leftIcon && <span className="flex items-center">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="flex items-center">{rightIcon}</span>}
          </>
        )}
      </Comp>
    );
  }
);

Button.displayName = "Button";