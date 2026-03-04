"use client";

import * as React from "react";

export type ToastType = "success" | "error" | "info" | "warning";

export type ToastItem = {
  id: string;
  type: ToastType;
  title?: string;
  description: string;
  duration?: number; // ms
  createdAt: number;
};

type ToastContextValue = {
  toasts: ToastItem[];
  push: (t: Omit<ToastItem, "id" | "createdAt">) => void;
  dismiss: (id: string) => void;
  clear: () => void;
};

const ToastContext = React.createContext<ToastContextValue | null>(null);

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastItem[]>([]);

  const push = React.useCallback(
    (t: Omit<ToastItem, "id" | "createdAt">) => {
      const item: ToastItem = {
        id: uid(),
        createdAt: Date.now(),
        duration: t.duration ?? 5000,
        ...t,
      };

      setToasts((prev) => [item, ...prev].slice(0, 6)); // cap stack for perf
    },
    []
  );

  const dismiss = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const clear = React.useCallback(() => setToasts([]), []);

  const value = React.useMemo(
    () => ({ toasts, push, dismiss, clear }),
    [toasts, push, dismiss, clear]
  );

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
}

export function useToast() {
  const ctx = React.useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

// Convenience helpers
export function toastSuccess(description: string, title?: string, duration?: number) {
  window.dispatchEvent(
    new CustomEvent("quickpay-toast", {
      detail: { type: "success", title, description, duration },
    })
  );
}
export function toastError(description: string, title?: string, duration?: number) {
  window.dispatchEvent(
    new CustomEvent("quickpay-toast", {
      detail: { type: "error", title, description, duration },
    })
  );
}
export function toastInfo(description: string, title?: string, duration?: number) {
  window.dispatchEvent(
    new CustomEvent("quickpay-toast", {
      detail: { type: "info", title, description, duration },
    })
  );
}
export function toastWarning(description: string, title?: string, duration?: number) {
  window.dispatchEvent(
    new CustomEvent("quickpay-toast", {
      detail: { type: "warning", title, description, duration },
    })
  );
}