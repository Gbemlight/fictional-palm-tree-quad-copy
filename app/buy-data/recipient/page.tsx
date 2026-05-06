"use client";

import React, { Suspense } from "react";
import { BuyDataRecipientContent } from "./content";

export default function BuyDataRecipientPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BuyDataRecipientContent />
    </Suspense>
  );
}
