import React from "react";
import { cn } from "@/lib/utils";

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
}

export const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ value, max = 100, className, ...props }, ref) => {
  const percentage = Math.min(Math.max(0, value), max) / (max / 100);

  return (
    <div 
      ref={ref}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      className={cn("w-full h-2 bg-gray-200 rounded overflow-hidden", className)}
      {...props}
    >
      <div
        className="h-full bg-indigo-500 transition-all duration-300 ease-in-out"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
  }
);

Progress.displayName = "Progress";
