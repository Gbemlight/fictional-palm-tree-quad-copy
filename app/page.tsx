"use client";

import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, Info } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#000000] p-10">
      <div className="flex flex-wrap gap-3 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 p-8">
        <Badge variant="success" dot icon={<CheckCircle2 className="h-4 w-4" />}>
          Success
        </Badge>

        <Badge variant="pending" dot>
          Pending
        </Badge>

        <Badge variant="failed" dot icon={<XCircle className="h-4 w-4" />}>
          Failed
        </Badge>

        <Badge variant="info" size="sm" icon={<Info className="h-4 w-4" />}>
          Info
        </Badge>

        <Badge variant="neutral" size="sm">
          Neutral
        </Badge>
      </div>
    </main>
  );
}