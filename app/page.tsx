"use client";

import { Skeleton, SkeletonCard, SkeletonText } from "@/components/ui/skeleton";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#000000] p-10 flex items-center justify-center">
      <div className="w-full max-w-xl space-y-6">
        <SkeletonCard />

        <div className="rounded-2xl border border-white/15 bg-white/5 p-6 backdrop-blur">
          <Skeleton variant="text" height={18} className="w-1/3" />
          <div className="mt-4">
            <SkeletonText lines={4} />
          </div>
          <div className="mt-6 flex items-center gap-4">
            <Skeleton variant="avatar" width={36} height={36} />
            <Skeleton variant="rectangle" height={12} className="w-1/4" />
          </div>
        </div>
      </div>
    </main>
  );
}