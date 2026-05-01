"use client";

import * as React from "react";
import * as Toast from "@radix-ui/react-toast";
import { X, CheckCircle, XCircle, Info, AlertTriangle } from "lucide-react";
import { useToast, ToastType } from "@/components/ui/toast";
import { cn } from "@/lib/utils";

const typeStyles: Record<ToastType, { bg: string; icon: React.ReactNode }> = {
  success: {
    bg: "bg-lime-500",
    icon: <CheckCircle className="h-5 w-5" />,
  },
  error: {
    bg: "bg-red-500",
    icon: <XCircle className="h-5 w-5" />,
  },
  info: {
    bg: "bg-cyan-500",
    icon: <Info className="h-5 w-5" />,
  },
  warning: {
    bg: "bg-amber-500",
    icon: <AlertTriangle className="h-5 w-5" />,
  },
};

function ProgressBar({ duration }: { duration: number }) {
  // CSS animation for perf (no interval updates)
  return (
    <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-white/25">
      <div
        className="h-full w-full origin-left bg-white/70"
        style={{
          animation: `toast-progress ${duration}ms linear forwards`,
        }}
      />
    </div>
  );
}

export function Toaster() {
  const { toasts, dismiss, push } = useToast();

  // Listen for global events (optional helper API)
  React.useEffect(() => {
    const handler = (e: Event) => {
      const ev = e as CustomEvent;
      const d = ev.detail as {
        type: ToastType;
        title?: string;
        description: string;
        duration?: number;
      };
      push({
        type: d.type,
        title: d.title,
        description: d.description,
        duration: d.duration ?? 5000,
      });
    };

    window.addEventListener("quickpay-toast", handler as EventListener);
    return () => window.removeEventListener("quickpay-toast", handler as EventListener);
  }, [push]);

  return (
    <>
      {/* keyframes once */}
      <style>{`
        @keyframes toast-progress { from { transform: scaleX(1); } to { transform: scaleX(0); } }

        @keyframes toast-in {
          from { transform: translateX(24px) translateY(-10px); opacity: 0; }
          to { transform: translateX(0) translateY(0); opacity: 1; }
        }
        @keyframes toast-out {
          from { transform: translateX(0); opacity: 1; }
          to { transform: translateX(24px); opacity: 0; }
        }
      `}</style>

      <Toast.Provider swipeDirection="right" duration={5000}>
        <Toast.Viewport
          className={cn(
            "fixed top-4 right-4 z-9999 w-90 max-w-[calc(100vw-2rem)]",
            "flex flex-col gap-3 outline-none"
          )}
        />

        {toasts.map((t) => {
          const meta = typeStyles[t.type];
          const duration = t.duration ?? 5000;

          return (
            <Toast.Root
              key={t.id}
              duration={duration}
              onOpenChange={(open) => {
                if (!open) dismiss(t.id);
              }}
              className={cn(
                "relative overflow-hidden rounded-2xl text-white",
                "shadow-xl border border-white/15",
                meta.bg
              )}
              style={{
                animation: "toast-in 220ms cubic-bezier(.2,.9,.2,1) both",
              }}
            >
              <div className="p-4">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 opacity-95">{meta.icon}</div>

                  <div className="flex-1">
                    {t.title && (
                      <Toast.Title className="text-sm font-semibold">
                        {t.title}
                      </Toast.Title>
                    )}
                    <Toast.Description className="text-sm text-white/90">
                      {t.description}
                    </Toast.Description>
                  </div>

                  <Toast.Close asChild>
                    <button
                      aria-label="Dismiss toast"
                      className="rounded-lg p-1 hover:bg-white/15 transition duration-200"
                      onClick={() => dismiss(t.id)}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </Toast.Close>
                </div>

                <ProgressBar duration={duration} />
              </div>

              {/* Fade out animation when removed */}
              <Toast.Action asChild altText="Dismiss" className="hidden">
                <button />
              </Toast.Action>
            </Toast.Root>
          );
        })}
      </Toast.Provider>
    </>
  );
}