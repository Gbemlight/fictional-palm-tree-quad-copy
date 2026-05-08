"use client";

import * as Switch from "@radix-ui/react-switch";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

type FormData = {
  [key: string]: boolean | string;
};

const categories = [
  "Transactions",
  "Promotions",
  "Security Alerts",
  "Product Updates",
];

const channels = ["email", "sms", "push"];

export default function NotificationsTab() {
  const { setValue, watch, handleSubmit } = useForm<FormData>({
    defaultValues: {
      quietStart: "22:00",
      quietEnd: "07:00",
    },
  });

  const values = watch();
  const quietStart = values.quietStart as string | undefined;
  const quietEnd = values.quietEnd as string | undefined;
  const isQuietInvalid = quietStart && quietEnd && quietStart >= quietEnd;

  // Enable / Disable all
  const setAll = (value: boolean) => {
    categories.forEach((cat) => {
      channels.forEach((ch) => {
        setValue(`${cat}-${ch}`, value);
      });
    });
  };

  const onSubmit = (data: FormData) => {
    if (data.quietStart >= data.quietEnd) {
      toast.error("Quiet hours must be a valid range");
      return;
    }

    toast.success("Notification preferences saved 🔔");
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* HEADER ACTIONS */}
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-xl font-semibold text-neutral-900 dark:text-white">
            Notification Settings
          </h3>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setAll(false)}
              className="px-4 py-2 text-sm font-medium bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600 text-neutral-700 dark:text-white rounded-lg transition"
            >
              Disable All
            </button>

            <button
              type="button"
              onClick={() => setAll(true)}
              className="px-4 py-2 text-sm font-bold bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition"
            >
              Enable All
            </button>
          </div>
        </div>

        {/* CATEGORIES */}
        <div className="space-y-5">
          {categories.map((cat) => (
            <div
              key={cat}
              className="bg-white dark:bg-neutral-900/95 rounded-[28px] p-5 space-y-4 border border-neutral-200 dark:border-neutral-800 shadow-[0_8px_30px_-24px_rgba(0,0,0,0.1)] dark:shadow-[0_8px_30px_-24px_rgba(0,0,0,0.7)]"
            >
              <h4 className="text-base font-semibold text-neutral-900 dark:text-white">{cat}</h4>

              <div className="grid grid-cols-3 gap-4">
                {channels.map((ch) => {
                  const key = `${cat}-${ch}`;
                  const checked = values[key] || false;

                  return (
                    <div
                      key={key}
                      className="flex items-center justify-between bg-neutral-50 dark:bg-neutral-800/90 rounded-2xl px-4 py-3 border border-neutral-200 dark:border-neutral-800"
                    >
                      <span className="text-sm text-neutral-600 dark:text-neutral-300 capitalize">
                        {ch}
                      </span>
                      <Switch.Root
                        checked={checked as boolean}
                        onCheckedChange={(val) => setValue(key, val)}
                        className="w-11 h-6 bg-neutral-200 dark:bg-neutral-700 rounded-full relative data-[state=checked]:bg-purple-600 transition"
                      >
                        <Switch.Thumb className="block w-5 h-5 bg-white rounded-full translate-x-0.5 data-[state=checked]:translate-x-5 transition" />
                      </Switch.Root>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* QUIET HOURS */}
        <div className="bg-white dark:bg-neutral-900/95 rounded-[28px] p-5 space-y-4 border border-neutral-200 dark:border-neutral-800 shadow-[0_8px_30px_-24px_rgba(0,0,0,0.1)] dark:shadow-[0_8px_30px_-24px_rgba(0,0,0,0.7)]">
          <h4 className="text-base font-semibold text-neutral-900 dark:text-white">Quiet Hours</h4>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
            <p className="text-sm text-neutral-600 dark:text-white">No notifications from</p>

            <div className="flex items-center gap-3">
              <div className="relative">
                <label htmlFor="quietStart" className="sr-only">
                  Quiet Hours Start
                </label>
                <input
                  id="quietStart"
                  type="time"
                  {...(watch("quietStart") !== undefined && {
                    value: watch("quietStart") as string,
                  })}
                  onChange={(e) => setValue("quietStart", e.target.value)}
                className="w-36 bg-neutral-50 dark:bg-neutral-800 p-2.5 rounded-xl text-neutral-900 dark:text-white border border-neutral-200 dark:border-neutral-800 outline-none focus:ring-2 focus:ring-purple-500/40 transition-all text-sm"
                />
              </div>

              <span className="text-neutral-500 text-sm">to</span>

              <div className="relative">
                <label htmlFor="quietEnd" className="sr-only">
                  Quiet Hours End
                </label>
                <input
                  id="quietEnd"
                  type="time"
                  {...(watch("quietEnd") !== undefined && {
                    value: watch("quietEnd") as string,
                  })}
                  onChange={(e) => setValue("quietEnd", e.target.value)}
                className="w-36 bg-neutral-50 dark:bg-neutral-800 p-2.5 rounded-xl text-neutral-900 dark:text-white border border-neutral-200 dark:border-neutral-800 outline-none focus:ring-2 focus:ring-purple-500/40 transition-all text-sm"
                />
              </div>
            </div>
          </div>

          {isQuietInvalid ? (
            <p className="text-sm text-rose-400">
              Start time must be before end time.
            </p>
          ) : null}
        </div>

        {/* SAVE BUTTON */}
        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-500 active:scale-[0.98] px-6 py-2.5 rounded-xl text-sm font-bold text-white shadow-lg shadow-green-900/30 transition-all"
          >
            Save Preferences
          </button>
        </div>
      </form>
    </>
  );
}
