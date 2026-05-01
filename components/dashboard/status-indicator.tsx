import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { type TransactionStatus } from "@/lib/dummy-data";

interface StatusIndicatorProps {
  status: TransactionStatus;
  size?: "sm" | "md";
  subStatus?: string;
}

export function StatusIndicator({ status, size = "md", subStatus }: StatusIndicatorProps) {
  const variantMap: Record<TransactionStatus, "success" | "pending" | "failed" | "neutral"> = {
    success: "success",
    pending: "pending",
    failed: "failed",
    processing: "pending",
    cancelled: "neutral",
  };

  return (
    <div className="flex flex-col items-start gap-1">
      <Badge variant={variantMap[status]} size={size} dot>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
      {subStatus && <span className="text-[10px] text-neutral-400 font-medium">{subStatus}</span>}
    </div>
  );
}