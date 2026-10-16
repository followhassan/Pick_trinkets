"use client";

import { useActionState } from "react";
import { saveShopSettings, type SettingsState } from "@/app/actions/settings";
import { btnPrimary, inputClass, labelClass } from "@/lib/ui";

const initial: SettingsState = {};

export function SettingsForm({
  settings,
}: {
  settings: {
    announcement: string;
    heroTitle: string;
    heroSubtitle: string;
    contactPhone: string;
    deliveryCharge: number;
    lowStockThreshold: number;
  };
}) {
  const [state, action, pending] = useActionState(saveShopSettings, initial);

  return (
    <form action={action} className="max-w-xl space-y-4">
      {state.error ? (
        <p role="alert" className="rounded-xl bg-white px-3 py-2 text-sm font-semibold">
          {state.error}
        </p>
      ) : null}
      {state.saved ? (
        <p className="rounded-xl bg-pink/40 px-3 py-2 text-sm font-semibold">Saved. The shop is updated.</p>
      ) : null}

      <label className="block">
        <span className={labelClass}>Announcement bar</span>
        <input name="announcement" required defaultValue={settings.announcement} className={inputClass} />
      </label>
      <label className="block">
        <span className={labelClass}>Homepage title</span>
        <input name="heroTitle" required defaultValue={settings.heroTitle} className={inputClass} />
      </label>
      <label className="block">
        <span className={labelClass}>Homepage subtitle</span>
        <textarea name="heroSubtitle" required rows={3} defaultValue={settings.heroSubtitle} className={inputClass} />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className={labelClass}>WhatsApp number</span>
          <input
            name="contactPhone"
            defaultValue={settings.contactPhone}
            placeholder="01XXXXXXXXX"
            className={inputClass}
          />
        </label>
        <label className="block">
          <span className={labelClass}>Delivery charge (BDT)</span>
          <input
            name="deliveryCharge"
            type="number"
            min="0"
            step="1"
            required
            defaultValue={settings.deliveryCharge}
            className={inputClass}
          />
        </label>
      </div>
      <label className="block">
        <span className={labelClass}>Low-stock alert at</span>
        <input
          name="lowStockThreshold"
          type="number"
          min="0"
          max="100"
          required
          defaultValue={settings.lowStockThreshold}
          className={`${inputClass} max-w-40`}
        />
      </label>
      <button type="submit" className={btnPrimary} disabled={pending}>
        {pending ? "Saving…" : "Save settings"}
      </button>
    </form>
  );
}
