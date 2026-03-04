"use client";
import { toastSuccess, toastError, toastInfo, toastWarning } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";

export default function Page() {
  return (
    <div className="p-10 space-x-3">
      <Button onClick={() => toastSuccess("Payment completed successfully", "Success")}>Success</Button>
      <Button variant="danger" onClick={() => toastError("Transaction failed. Try again.", "Error")}>Error</Button>
      <Button variant="secondary" onClick={() => toastInfo("New update available", "Info")}>Info</Button>
      <Button onClick={() => toastWarning("Low wallet balance", "Warning")}>Warning</Button>
    </div>
  );
}