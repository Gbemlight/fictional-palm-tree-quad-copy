"use client";

import Link from "next/link";
import { Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0f0f14]">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold text-white">
          QuickPay UI Demo
        </h1>

        <p className="text-white/60">
          Beneficiaries management preview
        </p>

        <Link href="/wallet/beneficiaries">
          <Button size="lg" leftIcon={<Users className="h-5 w-5" />}>
            Open Beneficiaries Page
          </Button>
        </Link>
      </div>
    </main>
  );
}