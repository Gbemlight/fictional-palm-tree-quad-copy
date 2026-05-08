"use client";

import { Camera, CheckCircle2, Loader2, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "react-toastify";
import Image from "next/image";

type FormData = {
  fullName: string;
  email: string;
  phone: string;
  dob?: string;
  bio?: string;
};

export default function ProfileForm() {
  const router = useRouter();
  const defaultValues: FormData = {
    fullName: "",
    email: "",
    phone: "",
    dob: "",
    bio: "",
  };

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isDirty },
  } = useForm<FormData>({ defaultValues });

  const [avatar, setAvatar] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isAvatarDirty, setIsAvatarDirty] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPhone, setShowPhone] = useState(true);

  // Avatar preview modal
  const handleAvatarChange = (file: File) => {
    const url = URL.createObjectURL(file);
    setPreview(url);
  };

  const onSubmit = async () => {
    setLoading(true);

    await new Promise((res) => setTimeout(res, 1500));

    setLoading(false);
    toast.success("Profile updated successfully ✅", {
      onClose: () => {
        reset(defaultValues);
        setAvatar(null);
        setIsAvatarDirty(false);
      },
    });
  };

  // Warn before leaving
  useEffect(() => {
    const beforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty || avatar) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", beforeUnload);
    return () => window.removeEventListener("beforeunload", beforeUnload);
  }, [isDirty, avatar]);

  const handleDiscard = () => {
    reset(defaultValues);
    setAvatar(null);
    setIsAvatarDirty(false);
    toast.info("Changes discarded");
  };

  // Make initials reactive to the name input
  const watchedFullName = useWatch({ control, name: "fullName" }) || defaultValues.fullName;
  const watchedEmail = useWatch({ control, name: "email" });
  const watchedPhone = useWatch({ control, name: "phone" });
  const initials = watchedFullName
    .split(" ")
    .filter(Boolean)
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* AVATAR */}
        <div className="flex flex-col items-center gap-2">
          <label className="relative cursor-pointer group">
            <div className="h-24 w-24 rounded-full overflow-hidden bg-[linear-gradient(135deg,#7c3aed,#ec4899)] flex items-center justify-center text-white text-2xl font-bold shadow-[0_10px_25px_-5px_rgba(124,58,237,0.5),0_8px_10px_-6px_rgba(236,72,153,0.5)] border-4 border-neutral-200 dark:border-neutral-800 transition-all group-hover:border-purple-500/30">
              {avatar ? (
                <Image src={avatar} width={96} height={96} className="h-full w-full object-cover" alt="Profile" />
              ) : (
                initials
              )}
            </div>

            {/* Camera Icon */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="bg-white text-black rounded-full p-2 shadow-lg">
                <Camera size={16} />
              </div>
            </div>

            <input
              type="file"
              className="hidden"
              onChange={(e) =>
                e.target.files && handleAvatarChange(e.target.files[0])
              }
            />
          </label>

          <p className="text-xs text-neutral-400 font-medium">Click to update photo</p>
        </div>

        {/* GRID FIELDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* FULL NAME */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-neutral-500 dark:text-white uppercase tracking-widest ml-1">Full Name</label>
            <div className="relative">
              <input
                {...register("fullName", { required: "Full name is required" })}
                placeholder=""
                className={`w-full p-3 pr-11 rounded-xl bg-neutral-50 dark:bg-neutral-900 border transition-all outline-none text-neutral-900 dark:text-white focus:ring-2 focus:ring-purple-500/40 ${
                  errors.fullName ? "border-red-500/50" : "border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700"
                }`}
              />
              {errors.fullName && (
                <p className="text-red-400 text-xs mt-1">{errors.fullName.message}</p>
              )}
            </div>
          </div>

          {/* EMAIL */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-neutral-500 dark:text-white uppercase tracking-widest ml-1">Email Address</label>
            <div className="relative">
              <input
                {...register("email", { 
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address"
                  }
                })}
                placeholder=""
                className={`w-full p-3 pr-11 rounded-xl bg-neutral-50 dark:bg-neutral-900 border transition-all outline-none text-neutral-900 dark:text-white focus:ring-2 focus:ring-purple-500/40 ${
                  errors.email ? "border-red-500/50" : "border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700"
                }`}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                {watchedEmail && !errors.email && (
                  <span className="text-green-400 animate-in fade-in zoom-in duration-300">
                    <CheckCircle2 size={14} />
                  </span>
                )}
              </div>
              {errors.email && (
                <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>
              )}
            </div>
          </div>

          {/* PHONE */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-neutral-500 dark:text-white uppercase tracking-widest ml-1">Phone Number</label>
            <div className="relative">
              <input
                type={showPhone ? "text" : "password"}
                {...register("phone", {
                  pattern: {
                    value: /^[+]?[\d\s-]{7,15}$/,
                    message: "Please enter a valid phone number"
                  }
                })}
                placeholder=""
                className={`w-full p-3 pr-11 rounded-xl bg-neutral-50 dark:bg-neutral-900 border transition-all outline-none text-neutral-900 dark:text-white focus:ring-2 focus:ring-purple-500/40 ${
                  errors.phone ? "border-red-500/50" : "border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700"
                }`}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowPhone(!showPhone)}
                  className="text-neutral-500 hover:text-neutral-300 transition-colors"
                >
                  {showPhone ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
                {watchedPhone && !errors.phone && (
                  <span className="text-green-400 animate-in fade-in zoom-in duration-300">
                    <CheckCircle2 size={14} />
                  </span>
                )}
              </div>
              {errors.phone && (
                <p className="text-red-400 text-xs mt-1">{errors.phone.message}</p>
              )}
            </div>
          </div>

          {/* DOB */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-neutral-500 dark:text-white uppercase tracking-widest ml-1">Date of Birth</label>
            <div className="relative">
              <input
                type="date"
                {...register("dob")}
                placeholder=""
                className="w-full p-3 pr-11 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 text-neutral-900 dark:text-white transition-all outline-none focus:ring-2 focus:ring-purple-500/40 scheme-dark"
              />
            </div>
          </div>
        </div>

        {/* BIO */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-neutral-500 dark:text-white uppercase tracking-widest ml-1">Bio</label>
          <div className="relative">
            <textarea
              {...register("bio")}
              rows={3}
              placeholder=""
              className="w-full p-3 pr-11 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 text-neutral-900 dark:text-white transition-all outline-none focus:ring-2 focus:ring-purple-500/40 resize-none"
            />
          </div>
        </div>

        {/* BUTTONS */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-neutral-200 dark:border-neutral-800/50">
          <button
            type="button"
            onClick={handleDiscard}
            className="text-sm font-medium text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors order-2 sm:order-1"
          >
            Discard Changes
          </button>

          <div className="flex gap-3 w-full sm:w-auto order-1 sm:order-2">
            <button
              type="button"
              onClick={() => router.push("/settings?tab=security")}
              className="flex-1 sm:flex-none bg-[linear-gradient(135deg,#7c3aed,#ec4899)] hover:brightness-110 active:scale-[0.98] px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all shadow-md"
            >
              Change Password
            </button>

            <button
              type="submit"
              disabled={loading || (!isDirty && !isAvatarDirty)}
              className="flex-1 sm:flex-none bg-[linear-gradient(135deg,#7c3aed,#ec4899)] hover:brightness-110 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed px-6 py-2.5 rounded-xl text-sm font-bold text-white shadow-[0_10px_25px_-5px_rgba(124,58,237,0.5),0_8px_10px_-6px_rgba(236,72,153,0.5)] transition-all"
            >
              <span className="flex items-center justify-center gap-2">
                {loading && <Loader2 size={16} className="animate-spin" />}
                {loading ? "Saving..." : "Save Changes"}
              </span>
            </button>
          </div>
        </div>
      </form>

      {/* AVATAR MODAL */}
      {preview && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-100 p-4">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-8 rounded-3xl w-full max-w-xs text-center shadow-2xl">
            <h3 className="text-lg font-bold mb-6 text-neutral-900 dark:text-white">Preview Photo</h3>
            
            <div className="relative w-40 h-40 mx-auto mb-8">
              <Image
                src={preview}
                width={160}
                height={160}
                className="w-full h-full object-cover rounded-full ring-4 ring-purple-500/30 shadow-2xl"
                alt="Preview"
              />
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => {
                  setAvatar(preview);
                  setIsAvatarDirty(true);
                  setPreview(null);
                }}
                className="w-full bg-purple-600 hover:bg-purple-500 py-3 rounded-xl text-sm font-bold transition-colors"
              >
                Use This Photo
              </button>

              <button
                onClick={() => {
                  setPreview(null);
                  URL.revokeObjectURL(preview);
                }}
                className="w-full bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 py-3 rounded-xl text-sm font-medium text-neutral-600 dark:text-neutral-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}