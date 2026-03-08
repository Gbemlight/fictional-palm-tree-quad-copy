"use client";

import * as React from "react";
import {
  Search,
  MoreVertical,
  Star,
  Trash2,
  Pencil,
  Send,
  UserPlus,
  Heart,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/phone-input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogFooter,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type Network = "MTN" | "Airtel" | "Glo" | "9mobile";

type Beneficiary = {
  id: string;
  name: string;
  phone: string;
  network: Network;
  nickname?: string;
  favorite: boolean;
  avatarColor: string;
};

const networkOptions = [
  { value: "MTN", label: "MTN" },
  { value: "Airtel", label: "Airtel" },
  { value: "Glo", label: "Glo" },
  { value: "9mobile", label: "9mobile" },
];

const avatarColors = [
  "from-purple-500 to-pink-500",
  "from-cyan-500 to-purple-500",
  "from-emerald-500 to-cyan-500",
  "from-amber-500 to-pink-500",
  "from-red-500 to-orange-500",
  "from-indigo-500 to-cyan-500",
];

const initialData: Beneficiary[] = [
  {
    id: "1",
    name: "Amina Bello",
    phone: "08031234567",
    network: "MTN",
    nickname: "Sister",
    favorite: true,
    avatarColor: avatarColors[0],
  },
  {
    id: "2",
    name: "Usman Lawal",
    phone: "08123456789",
    network: "Airtel",
    nickname: "Office",
    favorite: false,
    avatarColor: avatarColors[1],
  },
  {
    id: "3",
    name: "Fatima Ali",
    phone: "09087654321",
    network: "Glo",
    nickname: "School",
    favorite: true,
    avatarColor: avatarColors[2],
  },
];

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function validateName(name: string) {
  return name.trim().length >= 2;
}

function validatePhone(phone: string) {
  return /^(070|080|081|090|091)\d{8}$/.test(phone);
}

export default function BeneficiariesPage() {
  const [beneficiaries, setBeneficiaries] =
    React.useState<Beneficiary[]>(initialData);
  const [search, setSearch] = React.useState("");

  const [modalOpen, setModalOpen] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);

  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [selectedDelete, setSelectedDelete] = React.useState<Beneficiary | null>(
    null
  );

  const [form, setForm] = React.useState({
    name: "",
    phone: "",
    network: "" as Network | "",
    nickname: "",
    avatarColor: avatarColors[0],
  });

  const [errors, setErrors] = React.useState({
    name: "",
    phone: "",
    network: "",
  });

  const filtered = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return beneficiaries;

    return beneficiaries.filter(
      (b) =>
        b.name.toLowerCase().includes(q) ||
        b.phone.toLowerCase().includes(q) ||
        (b.nickname ?? "").toLowerCase().includes(q)
    );
  }, [search, beneficiaries]);

  const favorites = filtered.filter((b) => b.favorite);
  const others = filtered.filter((b) => !b.favorite);

  const resetForm = () => {
    setForm({
      name: "",
      phone: "",
      network: "",
      nickname: "",
      avatarColor: avatarColors[0],
    });
    setErrors({
      name: "",
      phone: "",
      network: "",
    });
    setEditingId(null);
  };

  const openAdd = () => {
    resetForm();
    setModalOpen(true);
  };

  const openEdit = (item: Beneficiary) => {
    setEditingId(item.id);
    setForm({
      name: item.name,
      phone: item.phone,
      network: item.network,
      nickname: item.nickname ?? "",
      avatarColor: item.avatarColor,
    });
    setErrors({
      name: "",
      phone: "",
      network: "",
    });
    setModalOpen(true);
  };

  const validateForm = () => {
    const nextErrors = {
      name: validateName(form.name) ? "" : "Enter a valid name",
      phone: validatePhone(form.phone)
        ? ""
        : "Enter a valid Nigerian phone number",
      network: form.network ? "" : "Select a network",
    };

    setErrors(nextErrors);

    return !nextErrors.name && !nextErrors.phone && !nextErrors.network;
  };

  const submitForm = () => {
    if (!validateForm()) return;

    if (editingId) {
      setBeneficiaries((prev) =>
        prev.map((item) =>
          item.id === editingId
            ? {
                ...item,
                name: form.name,
                phone: form.phone,
                network: form.network as Network,
                nickname: form.nickname,
                avatarColor: form.avatarColor,
              }
            : item
        )
      );
    } else {
      const newItem: Beneficiary = {
        id: crypto.randomUUID(),
        name: form.name,
        phone: form.phone,
        network: form.network as Network,
        nickname: form.nickname,
        favorite: false,
        avatarColor: form.avatarColor,
      };

      setBeneficiaries((prev) => [newItem, ...prev]);
    }

    setModalOpen(false);
    resetForm();
  };

  const confirmDelete = () => {
    if (!selectedDelete) return;
    setBeneficiaries((prev) =>
      prev.filter((item) => item.id !== selectedDelete.id)
    );
    setDeleteOpen(false);
    setSelectedDelete(null);
  };

  const toggleFavorite = (id: string) => {
    setBeneficiaries((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, favorite: !item.favorite } : item
      )
    );
  };

  const Card = ({ item }: { item: Beneficiary }) => {
    const [menuOpen, setMenuOpen] = React.useState(false);

    return (
      <div className="rounded-3xl border border-white/15 bg-white/10 p-5 backdrop-blur-xl shadow-[0_10px_30px_rgba(124,58,237,0.14)]">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div
              className={cn(
                "flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br text-sm font-bold text-white shadow-lg",
                item.avatarColor
              )}
            >
              {initials(item.name)}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-white">{item.name}</h3>
                {item.favorite && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-yellow-400/20 px-2 py-0.5 text-xs text-yellow-300">
                    <Star className="h-3 w-3 fill-yellow-300" />
                    Favorite
                  </span>
                )}
              </div>

              <p className="text-sm text-white/70">{item.phone}</p>

              <div className="mt-2 flex items-center gap-2">
                <Badge variant="info" size="sm">
                  {item.network}
                </Badge>
                {item.nickname ? (
                  <span className="text-xs text-white/55">{item.nickname}</span>
                ) : null}
              </div>
            </div>
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              className="rounded-xl p-2 text-white/80 transition hover:bg-white/10 hover:text-white"
            >
              <MoreVertical className="h-5 w-5" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 z-20 mt-2 w-44 rounded-2xl border border-white/10 bg-[#161622] p-2 shadow-xl">
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    openEdit(item);
                  }}
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-white/85 hover:bg-white/10"
                >
                  <Pencil className="h-4 w-4" />
                  Edit
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    setSelectedDelete(item);
                    setDeleteOpen(true);
                  }}
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-white/85 hover:bg-white/10"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                  }}
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-white/85 hover:bg-white/10"
                >
                  <Send className="h-4 w-4" />
                  Send Money
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    toggleFavorite(item.id);
                  }}
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-white/85 hover:bg-white/10"
                >
                  <Star className="h-4 w-4" />
                  {item.favorite ? "Remove Favorite" : "Set as Favorite"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-[#0f0f14] px-4 py-8 md:px-8 md:py-10">
      <div className="mx-auto max-w-6xl">
        <section className="mb-6 rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur-xl md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white md:text-4xl">
                Saved Beneficiaries
              </h1>
              <p className="mt-2 text-sm text-white/70">
                Save recipients for faster transfers and bill payments.
              </p>
            </div>

            <div className="hidden md:block">
              <Button leftIcon={<UserPlus className="h-4 w-4" />} onClick={openAdd}>
                Add Beneficiary
              </Button>
            </div>
          </div>
        </section>

        <section className="mb-6 rounded-3xl border border-white/15 bg-white/10 p-5 backdrop-blur-xl md:p-6">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/55" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, phone, or nickname"
              className="w-full rounded-2xl border border-white/10 bg-black/20 py-3 pl-10 pr-4 text-white outline-none placeholder:text-white/40 focus:border-white/20"
            />
          </div>
        </section>

        {beneficiaries.length === 0 ? (
          <EmptyState
            icon={<Heart className="h-10 w-10 text-white" />}
            title="No saved beneficiaries yet"
            description="Save your frequent recipients to make future payments faster and easier."
            cta={
              <Button leftIcon={<UserPlus className="h-4 w-4" />} onClick={openAdd}>
                Add Beneficiary
              </Button>
            }
          />
        ) : (
          <div className="space-y-8">
            {favorites.length > 0 && (
              <section>
                <div className="mb-4 flex items-center gap-2">
                  <Star className="h-5 w-5 fill-yellow-300 text-yellow-300" />
                  <h2 className="text-xl font-semibold text-white">Favorites</h2>
                </div>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {favorites.map((item) => (
                    <Card key={item.id} item={item} />
                  ))}
                </div>
              </section>
            )}

            <section>
              <h2 className="mb-4 text-xl font-semibold text-white">
                All Beneficiaries
              </h2>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {others.map((item) => (
                  <Card key={item.id} item={item} />
                ))}
              </div>
            </section>
          </div>
        )}

        {/* Floating mobile button */}
        <div className="fixed bottom-6 right-6 z-30 md:hidden">
          <button
            type="button"
            onClick={openAdd}
            className="flex h-16 w-16 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--color-primary),var(--color-secondary))] text-white shadow-[0_16px_32px_rgba(236,72,153,0.3)]"
          >
            <UserPlus className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen} size="md">
        <DialogHeader>
          <DialogTitle>
            {editingId ? "Edit Beneficiary" : "Add Beneficiary"}
          </DialogTitle>
          <DialogDescription>
            Enter recipient details for quick future payments.
          </DialogDescription>
        </DialogHeader>

        <DialogBody>
          <div className="space-y-5">
            <Input
              label="Full Name"
              placeholder="Enter beneficiary name"
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              state={errors.name ? "error" : form.name ? "success" : "default"}
              errorMessage={errors.name}
            />

            <PhoneInput
              label="Phone Number"
              value={form.phone}
              onChange={(value) => setForm((prev) => ({ ...prev, phone: value }))}
              onBlur={() => {
                if (form.phone && !validatePhone(form.phone)) {
                  setErrors((prev) => ({
                    ...prev,
                    phone: "Enter a valid Nigerian phone number",
                  }));
                } else {
                  setErrors((prev) => ({ ...prev, phone: "" }));
                }
              }}
              state={errors.phone ? "error" : form.phone ? "success" : "default"}
              errorMessage={errors.phone}
              helperText="Format: 08012345678"
            />

            <Select
              label="Network"
              value={form.network}
              onValueChange={(value) =>
                setForm((prev) => ({ ...prev, network: value as Network }))
              }
              options={networkOptions}
              errorMessage={errors.network}
            />

            <Input
              label="Nickname (optional)"
              placeholder="e.g. Mum, Office, School"
              value={form.nickname}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, nickname: e.target.value }))
              }
            />

            <div>
              <p className="mb-3 text-sm font-medium text-white">Avatar Color</p>
              <div className="flex flex-wrap gap-3">
                {avatarColors.map((color) => {
                  const active = form.avatarColor === color;
                  return (
                    <button
                      key={color}
                      type="button"
                      onClick={() =>
                        setForm((prev) => ({ ...prev, avatarColor: color }))
                      }
                      className={cn(
                        "h-10 w-10 rounded-full bg-gradient-to-br shadow-lg ring-2 transition",
                        color,
                        active ? "ring-white" : "ring-transparent"
                      )}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </DialogBody>

        <DialogFooter>
          <Button variant="secondary" onClick={() => setModalOpen(false)}>
            Cancel
          </Button>
          <Button onClick={submitForm}>
            {editingId ? "Save Changes" : "Add Beneficiary"}
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen} size="sm">
        <DialogHeader>
          <DialogTitle>Delete Beneficiary</DialogTitle>
          <DialogDescription>
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogBody>
          <p className="text-white/80">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-white">
              {selectedDelete?.name}
            </span>
            ?
          </p>
        </DialogBody>

        <DialogFooter>
          <Button variant="secondary" onClick={() => setDeleteOpen(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Delete
          </Button>
        </DialogFooter>
      </Dialog>
    </main>
  );
}