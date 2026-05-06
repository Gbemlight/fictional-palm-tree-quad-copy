"use client";

import React, { Suspense } from "react";
import { BuyDataPaymentContent } from "./content";

export default function BuyDataPaymentPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BuyDataPaymentContent />
    </Suspense>
  );
}
