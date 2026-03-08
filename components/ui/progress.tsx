import React from "react";
import { cn } from "@/lib/utils";

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  max?: number;
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value = 0, max = 100, ...props }, ref) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
    return (
      <div
        ref={ref}
        className={cn("relative h-2 w-full rounded-full bg-gray-200 overflow-hidden", className)}
        {...props}
      >
        <div
          className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
    );
  }
);
Progress.displayName = "Progress";

export { Progress };