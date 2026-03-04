"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogFooter,
} from "@/components/ui/dialog";

export default function Home() {
  const [open, setOpen] = React.useState(false);

  return (
    <main className="min-h-screen flex items-center justify-center bg-[var(--gradient-purple-pink)] p-10">
      <Dialog open={open} onOpenChange={setOpen} size="md" closeOnOverlayClick>
        <DialogTrigger asChild>
          <Button>Open Modal</Button>
        </DialogTrigger>

        <DialogHeader>
          <DialogTitle>Confirm Action</DialogTitle>
          <DialogDescription>
            This dialog uses Radix focus trapping + Escape close.
          </DialogDescription>
        </DialogHeader>

        <DialogBody>
          <p className="text-white/80">
            Glassmorphism content + blur overlay + spring animation.
          </p>
        </DialogBody>

        <DialogFooter>
          <Button variant="secondary" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => setOpen(false)}>Confirm</Button>
        </DialogFooter>
      </Dialog>
    </main>
  );
}