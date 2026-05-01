"use client";
import { useRouter } from "next/navigation";
import { useEffect, use } from "react";

export default function ReceiptPage({ params }: { params: Promise<{ ref: string }> }) {
  const router = useRouter();
  const { ref } = use(params);

  useEffect(() => {
    // Dynamically import jsPDF only on client
    import("jspdf").then(({ jsPDF }) => {
      const doc = new jsPDF();
      doc.text("Transaction Receipt", 20, 20);
      doc.text(`Reference: ${ref}`, 20, 40);
      doc.text("Amount: ₦1,000", 20, 50);
      doc.text("Status: Success", 20, 60);
      doc.text("Date: 2026-03-06", 20, 70);
      doc.save(`receipt-${ref}.pdf`);
      router.push(`/transactions/${ref}`);
    });
  }, [ref, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <p className="text-lg font-semibold">Generating your receipt PDF...</p>
    </div>
  );
}
