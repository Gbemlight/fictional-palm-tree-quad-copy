"use client";

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

/* ---------- Types ---------- */

type Contact = {
  id: string;
  name: string;
  phone: string;
  network: "MTN" | "Airtel" | "Glo" | "9mobile";
  group: "saved" | "recent";
};

/* ---------- Dummy data ---------- */

const CONTACTS: Contact[] = [
  { id: "1", name: "Amina Bello", phone: "08031234567", network: "MTN", group: "saved" },
  { id: "2", name: "Ibrahim Musa", phone: "08123456789", network: "Airtel", group: "saved" },
  { id: "3", name: "Sadiq Ahmad", phone: "09087654321", network: "Glo", group: "saved" },
  { id: "4", name: "Fatima Ali", phone: "07045678901", network: "9mobile", group: "recent" },
  { id: "5", name: "Usman Lawal", phone: "08099887766", network: "MTN", group: "recent" },
];

/* ---------- Helpers ---------- */

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function sortAlpha(list: Contact[]) {
  return [...list].sort((a, b) => a.name.localeCompare(b.name));
}

/* ---------- Component ---------- */

export function ContactPicker({
  onSelect,
}: {
  onSelect: (phone: string) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [tab, setTab] = React.useState<"saved" | "recent">("saved");
  const [query, setQuery] = React.useState("");

  const filtered = React.useMemo(() => {
    const base = CONTACTS.filter((c) => c.group === tab);

    const q = query.trim().toLowerCase();
    const searched = !q
      ? base
      : base.filter(
          (c) =>
            c.name.toLowerCase().includes(q) ||
            c.phone.replace(/\s+/g, "").includes(q)
        );

    return sortAlpha(searched);
  }, [tab, query]);

  function handlePick(phone: string) {
    onSelect(phone);
    setOpen(false);
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      {/* Trigger */}
      <Dialog.Trigger asChild>
        <Button variant="secondary" className="mt-2">
          Choose from contacts
        </Button>
      </Dialog.Trigger>

      <Dialog.Portal>
        {/* Overlay */}
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" />

        {/* Content */}
        <Dialog.Content
          className={cn(
            "fixed left-1/2 top-1/2 z-50 w-[92vw] max-w-lg -translate-x-1/2 -translate-y-1/2",
            "rounded-3xl border border-white/15 bg-white/10 p-5 backdrop-blur-xl shadow-2xl",
            "text-white outline-none"
          )}
        >
          {/* Header */}
          <div className="mb-4 flex items-center justify-between">
            <Dialog.Title className="text-lg font-semibold">
              Choose recipient
            </Dialog.Title>

            <Dialog.Close asChild>
              <button
                aria-label="Close"
                className="rounded-lg p-2 hover:bg-white/10 transition"
              >
                <X className="h-4 w-4" />
              </button>
            </Dialog.Close>
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/60" />
            <Input
              placeholder="Search name or number"
              className="pl-9"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          {/* Tabs */}
          <div className="mb-4 flex gap-2">
            {(["saved", "recent"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={cn(
                  "rounded-full px-4 py-1.5 text-sm font-medium transition",
                  tab === t
                    ? "bg-[linear-gradient(135deg,var(--color-primary),var(--color-secondary))]"
                    : "bg-white/10 hover:bg-white/20"
                )}
              >
                {t === "saved" ? "Saved" : "Recent"}
              </button>
            ))}
          </div>

          {/* Contact List */}
          <div className="max-h-[340px] space-y-2 overflow-y-auto pr-1">
            {filtered.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
                <p className="text-sm text-white/70">
                  No contacts found.
                </p>
              </div>
            ) : (
              filtered.map((contact) => (
                <button
                  key={contact.id}
                  onClick={() => handlePick(contact.phone)}
                  className="flex w-full items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3 text-left transition hover:bg-white/10"
                >
                  {/* Avatar */}
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--color-primary),var(--color-secondary))] text-sm font-bold">
                    {initials(contact.name)}
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <p className="text-sm font-medium">{contact.name}</p>
                    <p className="text-xs text-white/60">
                      {contact.phone}
                    </p>
                  </div>

                  {/* Network */}
                  <Badge variant="info" size="sm">
                    {contact.network}
                  </Badge>
                </button>
              ))
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}