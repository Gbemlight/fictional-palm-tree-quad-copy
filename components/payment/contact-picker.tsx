"use client";

import * as React from "react";
import { Search, Users, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogBody,
} from "@/components/ui/dialog";
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
  { id: "4", name: "Fatima Ali", phone: "07045678901", network: "9mobile", group: "saved" },
  { id: "5", name: "Usman Lawal", phone: "08099887766", network: "MTN", group: "recent" },
  { id: "6", name: "Bisi Akande", phone: "08022334455", network: "Airtel", group: "saved" },
  { id: "7", name: "Chidi Okafor", phone: "08155667788", network: "Glo", group: "recent" },
  { id: "8", name: "Zainab Haruna", phone: "09011223344", network: "MTN", group: "recent" },
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
  return [...list].sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
}

/* ---------- Component ---------- */

export function ContactPicker({
  onSelect,
}: {
  onSelect: (phone: string) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [group, setGroup] = React.useState<"saved" | "recent">("saved");
  const [query, setQuery] = React.useState("");

  const filtered = React.useMemo(() => {
    const base = CONTACTS.filter((c) => c.group === group);

    const q = query.trim().toLowerCase();
    const searched = !q
      ? base
      : base.filter(
          (c) =>
            c.name.toLowerCase().includes(q) ||
            c.phone.replace(/\s+/g, "").includes(q)
        );

    return sortAlpha(searched);
  }, [group, query]);

  function handlePick(phone: string) {
    onSelect(phone);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen} size="md">
      {/* Trigger */}
      <DialogTrigger asChild>
        <Button variant="secondary" size="sm" className="font-bold">
          Choose from contacts
        </Button>
      </DialogTrigger>

      <DialogHeader>
        <DialogTitle className="text-xl font-bold tracking-tight">
          Choose Recipient
        </DialogTitle>
      </DialogHeader>

      <DialogBody>
        <div className="space-y-6">
          {/* Category Tabs */}
          <div className="flex gap-2">
            {[
              { id: "saved", label: "Saved", icon: <Users className="h-4 w-4" /> },
              { id: "recent", label: "Recent", icon: <History className="h-4 w-4" /> },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  setGroup(t.id as "saved" | "recent");
                  setQuery("");
                }}
                className={cn(
                  "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition-all",
                  group === t.id
                    ? "bg-linear-to-br from-primary to-secondary text-white shadow-lg"
                    : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
                )}
              >
                {t.icon}
                {t.label}
              </button>
            ))}
          </div>

          {/* Search */}
          <Input
            placeholder={`Search ${group} recipients...`}
            leftIcon={<Search className="h-4 w-4" />}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          {/* Contact List */}
          <div className="max-h-95 space-y-2 overflow-y-auto pr-2 scrollbar-hide">
            {filtered.length === 0 ? (
              <div className="rounded-2xl border border-white/5 bg-white/5 p-8 text-center animate-in fade-in zoom-in-95 duration-300">
                <p className="text-sm text-white/70">
                  {query ? `No contacts found for "${query}"` : `No ${group} recipients yet`}
                </p>
              </div>
            ) : (
              filtered.map((contact) => (
                <button
                  key={contact.id}
                  onClick={() => handlePick(contact.phone)}
                  className="group/contact flex w-full items-center gap-4 rounded-2xl border border-white/5 bg-white/5 p-3 text-left transition-all hover:bg-white/10 hover:border-white/10 active:scale-[0.98] animate-in fade-in slide-in-from-bottom-1"
                >
                  {/* Avatar */}
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-primary to-secondary text-sm font-black text-white shadow-lg">
                    {initials(contact.name)}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white leading-none mb-1 truncate group-hover/contact:text-primary transition-colors">
                      {contact.name}
                    </p>
                    <p className="text-xs font-medium text-white/50">
                      {contact.phone.replace(/(\d{3})(\d{4})(\d{4})/, "$1 $2 $3")}
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
        </div>
      </DialogBody>
    </Dialog>
  );
}