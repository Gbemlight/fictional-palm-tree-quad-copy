"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, LogOut, QrCode, Copy, Check, X } from "lucide-react";
import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";

// ---------------- VALIDATION SCHEMAS ----------------

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Required"),
  newPassword: z
    .string()
    .min(8, "Minimum 8 characters")
    .regex(/[0-9]/, "Must include a number")
    .regex(/[^A-Za-z0-9]/, "Must include a special character"),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type PasswordForm = z.infer<typeof passwordSchema>;

// ---------------- COMPONENT ----------------
export default function SecurityTab() {
  const [pinSet, setPinSet] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [show2FA, setShow2FA] = useState(false);
  
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // ---------------- PASSWORD FORM ----------------
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
  });

  const onSubmit = async () => {
    await new Promise((res) => setTimeout(res, 1200));
    toast.success("Password updated successfully 🔒", {
      autoClose: 3000,
      position: "top-right",
      onClose: () => reset(),
    });
  };

  return (
    <div className="space-y-8 relative">

      {/* ---------------- CHANGE PASSWORD ---------------- */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">Change Password</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-bold text-neutral-500 dark:text-white uppercase tracking-widest ml-1">Current Password</label>
            <div className="relative">
              <input
                type={showCurrentPassword ? "text" : "password"}
                placeholder=""
                {...register("currentPassword")}
                className="w-full p-3 pr-11 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white outline-none focus:ring-2 focus:ring-purple-500/40"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300 transition-colors"
              >
                {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.currentPassword && (
              <p className="text-red-400 text-xs mt-1">{errors.currentPassword.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-neutral-500 dark:text-white uppercase tracking-widest ml-1">New Password</label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                placeholder=""
                {...register("newPassword")}
                className="w-full p-3 pr-11 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white outline-none focus:ring-2 focus:ring-purple-500/40"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300 transition-colors"
              >
                {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.newPassword && (
              <p className="text-red-400 text-xs mt-1">{errors.newPassword.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-neutral-500 dark:text-white uppercase tracking-widest ml-1">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder=""
                {...register("confirmPassword")}
                className="w-full p-3 pr-11 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white outline-none focus:ring-2 focus:ring-purple-500/40"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300 transition-colors"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-400 text-xs mt-1">{errors.confirmPassword.message}</p>
            )}
          </div>

          <button className="bg-[linear-gradient(135deg,#7c3aed,#ec4899)] hover:brightness-110 active:scale-[0.98] px-5 py-2.5 rounded-xl text-sm font-bold text-white shadow-[0_10px_25px_-5px_rgba(124,58,237,0.5),0_8px_10px_-6px_rgba(236,72,153,0.5)] transition-all">
             Update Password
          </button>
        </form>
      </div>

      <div className="h-px bg-neutral-200 dark:bg-neutral-800" />

      {/* ---------------- TRANSACTION PIN ---------------- */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">Transaction PIN</h3>
        
        {!showPinModal ? (
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 rounded-full text-sm font-medium bg-neutral-100 dark:bg-white text-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-100 transition-colors">
              {pinSet ? "PIN Set" : "No PIN Set"}
            </button>
            <button
              onClick={() => setShowPinModal(true)}
              className="px-4 py-2 rounded-full text-sm font-medium bg-neutral-100 dark:bg-white text-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-100 transition-colors"
            >
              {pinSet ? "Change PIN" : "Set PIN"}
            </button>
          </div>
        ) : (
          <PinInputSection
            onClose={() => setShowPinModal(false)}
            onSave={() => { setPinSet(true); setShowPinModal(false); }}
          />
        )}
      </div>

      <div className="h-px bg-neutral-200 dark:bg-neutral-800" />

      {/* ---------------- 2FA ---------------- */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">Two-Factor Authentication (2FA)</h3>
        
        {!show2FA ? (
          <button
            onClick={() => setShow2FA(true)}
            className="px-4 py-2 rounded-full text-sm font-medium bg-neutral-100 dark:bg-white text-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-100 transition-colors"
          >
            Enable 2FA
          </button>
        ) : (
          <TwoFASetupSection
            onClose={() => setShow2FA(false)}
            onComplete={() => { setShow2FA(false); }}
          />
        )}
      </div>

      <div className="h-px bg-neutral-200 dark:bg-neutral-800" />

      {/* ---------------- HISTORY & ACTIONS ---------------- */}
      <div className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">Login History</h3>

          <div className="overflow-x-auto rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-white/2">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-900/50">
                  <th className="text-left py-4 px-4 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Device</th>
                  <th className="text-left py-4 px-4 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Location</th>
                  <th className="text-left py-4 px-4 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Date/Time</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { device: "Chrome on Windows", loc: "Lagos, NG", time: "2026-03-09 10:12" },
                  { device: "Safari on iPhone", loc: "Abuja, NG", time: "2026-03-08 21:44" },
                  { device: "Edge on Windows", loc: "Kano, NG", time: "2026-03-07 16:30" },
                  { device: "Firefox on Mac", loc: "London, UK", time: "2026-03-06 08:15" },
                  { device: "Chrome on Android", loc: "Accra, GH", time: "2026-03-05 19:02" },
                ].map((log, i) => (
                  <tr key={i} className="border-b border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-white/5 transition-colors">
                    <td className="py-4 px-4 text-sm text-neutral-700 dark:text-neutral-200">{log.device}</td>
                    <td className="py-4 px-4 text-sm text-neutral-700 dark:text-neutral-200">{log.loc}</td>
                    <td className="py-4 px-4 text-sm text-neutral-700 dark:text-neutral-200">{log.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <SignOutConfirmation />
      </div>
    </div>
  );
}

// ---------------- SIGN OUT CONFIRMATION ----------------
function SignOutConfirmation() {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSignOut = () => {
    toast.success("Signed out from all devices", {
      autoClose: 3000,
      onClose: () => setShowConfirm(false),
    });
  };

  return (
    <div className="space-y-4">
      <button
        onClick={() => setShowConfirm(true)}
        className="w-full flex items-center justify-center gap-2 bg-[linear-gradient(135deg,#dc2626,#991b1b)] hover:brightness-110 active:scale-[0.98] text-white p-3 rounded-xl text-sm font-bold transition-all"
      >
        <LogOut size={16} />
        Sign out all devices
      </button>

      <Dialog.Root open={showConfirm} onOpenChange={setShowConfirm}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 animate-in fade-in" />
          <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm p-8 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl shadow-2xl z-50 animate-in zoom-in duration-300">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <Dialog.Title className="text-lg font-bold text-neutral-900 dark:text-white">Sign out all devices?</Dialog.Title>
                <button onClick={() => setShowConfirm(false)} className="text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors">
                  <X size={20} />
                </button>
              </div>

              <p className="text-sm text-neutral-400">Are you sure you want to sign out of all devices? This will log you out everywhere.</p>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 py-2.5 rounded-xl text-sm font-bold text-neutral-600 dark:text-neutral-300 transition-colors"
                >
                  Cancel
                </button>
                <button onClick={handleSignOut} className="flex-1 bg-[linear-gradient(135deg,#dc2626,#991b1b)] hover:brightness-110 active:scale-[0.98] py-2.5 rounded-xl text-sm font-bold text-white transition-all">
                  Sign Out All
                </button>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}

// ---------------- PIN INPUT SECTION ----------------
function PinInputSection({ onClose, onSave }: { onClose: () => void; onSave: () => void }) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  return (
    <div className="p-6 rounded-2xl bg-neutral-50 dark:bg-white/5 border border-neutral-200 dark:border-white/10 space-y-4">
      <div className="space-y-4">
        <p className="text-sm text-neutral-500 dark:text-neutral-400">Set PIN</p>
        <div className="flex justify-center gap-3">
          <PinInputBoxes value={pin} onChange={setPin} />
        </div>
        {error && <p className="text-center text-sm text-red-400">{error}</p>}
      </div>

      <div className="flex gap-3 pt-4">
        <button
          onClick={() => {
            if (pin.length !== 4) return setError("Enter all 4 digits");
            toast.success("Transaction PIN updated successfully 🔐", {
              autoClose: 3000,
              onClose: () => { onSave(); onClose(); }
            });
          }}
          className="flex-1 bg-[linear-gradient(135deg,#7c3aed,#ec4899)] hover:brightness-110 active:scale-[0.98] py-3 rounded-xl text-sm font-bold text-white shadow-[0_10px_25px_-5px_rgba(124,58,237,0.5),0_8px_10px_-6px_rgba(236,72,153,0.5)] transition-all"
        >
          Continue
        </button>
        <button
          onClick={onClose}
          className="flex-1 bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 py-3 rounded-xl text-sm font-bold text-neutral-600 dark:text-neutral-300 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

function PinInputBoxes({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const digits = value.split("").slice(0, 4);
  const placeholders = Array(4).fill("");

  return (
    <div className="relative flex items-center justify-center gap-3">
      <input
        ref={inputRef}
        type="text"
        inputMode="numeric"
        maxLength={4}
        value={value}
        onChange={(e) => onChange(e.target.value.replace(/\D/g, ""))}
        className="absolute inset-0 opacity-0 cursor-default"
      />
      {placeholders.map((_, i) => (
        <div
          key={i}
          onClick={() => inputRef.current?.focus()}
          className={`w-12 h-14 rounded-xl border flex items-center justify-center text-xl font-bold transition-all
            ${digits[i] ? "border-purple-500 bg-purple-500/5 text-purple-600 dark:text-white" : "border-neutral-300 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-400 dark:text-neutral-600"}
            ${value.length === i ? "ring-2 ring-purple-500/40 border-purple-500/50" : ""}
          `}
        >
          {digits[i] ? "●" : ""}
        </div>
      ))}
    </div>
  );
}

// ---------------- 2FA SETUP SECTION ----------------
function TwoFASetupSection({ onClose, onComplete }: { onClose: () => void; onComplete: () => void }) {
  const [copied, setCopied] = useState(false);

  return (
    <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-6">
      <div className="space-y-4">
        <p className="text-sm text-neutral-400">Scan this QR code with your authenticator app.</p>
        <div className="mx-auto w-44 h-44 bg-white rounded-2xl flex items-center justify-center p-3">
          <QrCode className="w-full h-full text-black" />
        </div>
        <p className="text-center text-xs text-neutral-500">(Dummy QR for demo)</p>

        <div className="space-y-2">
          <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">Manual Key</p>
          <div className="flex items-center justify-between bg-neutral-800 p-3 rounded-xl border border-white/5">
            <code className="text-sm text-purple-400">XFGH-8901-LKJH-ZZ01</code>
            <button onClick={() => { navigator.clipboard.writeText("XFGH-8901-LKJH-ZZ01"); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="text-neutral-400 hover:text-white">
              {copied ? <Check size={16} /> : <Copy size={16} />}
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-sm text-neutral-400">Backup Codes</p>
        <div className="grid grid-cols-2 gap-3">
          {["8F2D - 1A0C", "1D7E - 4C2F", "5DBA - 6E1B", "4K2M - 9L3P"].map((code) => (
            <div key={code} className="bg-neutral-800 p-3 text-center rounded-xl border border-white/5 font-mono text-sm text-neutral-300">
              {code}
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <button
          onClick={() => {
            toast.success("Two-Factor Authentication Enabled ✅", {
              autoClose: 3000,
              onClose: onComplete
            });
          }}
          className="flex-1 bg-[linear-gradient(135deg,#7c3aed,#ec4899)] hover:brightness-110 active:scale-[0.98] py-3 rounded-xl text-sm font-bold text-white shadow-[0_10px_25px_-5px_rgba(124,58,237,0.5),0_8px_10px_-6px_rgba(236,72,153,0.5)] transition-all"
        >
          Finish Setup
        </button>
        <button
          onClick={onClose}
          className="flex-1 bg-neutral-800 hover:bg-neutral-700 py-3 rounded-xl text-sm font-bold text-neutral-300 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}