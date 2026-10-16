"use client";

import { useActionState } from "react";
import { placeOrder, type OrderFormState } from "@/app/actions/orders";
import { btnPrimary, inputClass, labelClass } from "@/lib/ui";

const initial: OrderFormState = {};

export function OrderForm() {
  const [state, action, pending] = useActionState(placeOrder, initial);

  return (
    <form action={action} className="space-y-4">
      {state.error ? (
        <p role="alert" className="rounded-xl bg-white px-3 py-2 text-sm font-semibold text-ink">
          {state.error}
        </p>
      ) : null}
      <label className="block">
        <span className={labelClass}>Name</span>
        <input name="customerName" required autoComplete="name" className={inputClass} />
      </label>
      <label className="block">
        <span className={labelClass}>Phone</span>
        <input
          name="phone"
          required
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="01XXXXXXXXX"
          className={inputClass}
        />
      </label>
      <label className="block">
        <span className={labelClass}>Address</span>
        <textarea
          name="address"
          required
          rows={3}
          autoComplete="street-address"
          placeholder="House, road, landmark"
          className={inputClass}
        />
      </label>
      <label className="block">
        <span className={labelClass}>Area / city</span>
        <input
          name="area"
          required
          autoComplete="address-level2"
          placeholder="Dhanmondi, Dhaka"
          className={inputClass}
        />
      </label>
      <label className="block">
        <span className={labelClass}>Note (optional)</span>
        <textarea name="note" rows={2} maxLength={500} className={inputClass} />
      </label>
      <button type="submit" className={`${btnPrimary} w-full`} disabled={pending}>
        {pending ? "Placing order…" : "Place order"}
      </button>
      <p className="text-sm text-muted">No online payment. Pay the courier the total above when it arrives.</p>
    </form>
  );
}
