"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

type DialogSize = "sm" | "md" | "lg" | "full";

const sizeMap: Record<DialogSize, string> = {
  sm: "max-w-[400px]",
  md: "max-w-[600px]",
  lg: "max-w-[800px]",
  full: "max-w-[calc(100vw-2rem)] w-full",
};

export interface DialogProps extends DialogPrimitive.DialogProps {
  size?: DialogSize;
  closeOnOverlayClick?: boolean;
}

export function Dialog({
  children,
  size = "md",
  closeOnOverlayClick = true,
  open,
  onOpenChange,
  ...props
}: DialogProps) {
  // Scroll lock (prevents body scroll when modal is open)
  React.useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  // Separate the trigger from the content to avoid double-rendering and event blocking
  const childrenArray = React.Children.toArray(children);
  const trigger = childrenArray.find(
    (child) => React.isValidElement(child) && child.type === DialogTrigger
  );
  const content = childrenArray.filter(
    (child) => !(React.isValidElement(child) && child.type === DialogTrigger)
  );

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange} {...props}>
      {trigger}

      <DialogPrimitive.Portal>
        <AnimatePresence>
          {open ? (
            <>
              {/* Overlay */}
              <DialogPrimitive.Overlay asChild>
                <motion.div
                  className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.18 }}
                  onMouseDown={(e: React.MouseEvent<HTMLDivElement>) => {
                    if (!closeOnOverlayClick) e.preventDefault();
                  }}
                />
              </DialogPrimitive.Overlay>

              {/* Content wrapper */}
              <DialogPrimitive.Content
                asChild
                onInteractOutside={(e: Event) => {
                  if (!closeOnOverlayClick) e.preventDefault();
                }}
              >
                <motion.div
                  drag="y"
                  dragConstraints={{ top: 0 }}
                  dragElastic={0.2}
                  onDragEnd={(_: any, info: any) => {
                    if (info.offset.y > 150) onOpenChange?.(false);
                  }}
                  className={cn(
                    "fixed left-1/2 top-1/2 z-50 w-[calc(100vw-2rem)] -translate-x-1/2 -translate-y-1/2",
                    sizeMap[size],
                    "rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl shadow-2xl",
                    "text-white"
                  )}
                  initial={{ opacity: 0, scale: 0.96, y: 8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98, y: 10 }}
                  transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 22,
                  }}
                >
                  {/* Close button */}
                  <DialogPrimitive.Close asChild>
                    <button
                      type="button"
                      aria-label="Close dialog"
                      className="absolute right-3 top-3 z-50 rounded-lg p-2 text-white/80 hover:bg-white/10 hover:text-white transition pointer-events-auto"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </DialogPrimitive.Close>

                  {/* subtle gradient wash */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 rounded-2xl opacity-60
                      bg-[radial-gradient(circle_at_top_left,rgba(124,58,237,0.22),transparent_55%),radial-gradient(circle_at_bottom_right,rgba(236,72,153,0.18),transparent_55%)]"
                  />

                  <div className="relative p-6">{content}</div>
                </motion.div>
              </DialogPrimitive.Content>
            </>
          ) : null}
        </AnimatePresence>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

/* ========== Composable Parts ========== */

export function DialogTrigger(props: DialogPrimitive.DialogTriggerProps) {
  return <DialogPrimitive.Trigger {...props} />;
}

export function DialogHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("mb-4 space-y-1", className)} {...props} />
  );
}

export function DialogTitle({
  className,
  ...props
}: DialogPrimitive.DialogTitleProps) {
  return (
    <DialogPrimitive.Title
      className={cn("text-lg font-semibold", className)}
      {...props}
    />
  );
}

export function DialogDescription({
  className,
  ...props
}: DialogPrimitive.DialogDescriptionProps) {
  return (
    <DialogPrimitive.Description
      className={cn("text-sm text-white/70", className)}
      {...props}
    />
  );
}

export function DialogBody({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("space-y-4", className)} {...props} />;
}

export function DialogFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("mt-6 flex items-center justify-end gap-3", className)}
      {...props}
    />
  );
}