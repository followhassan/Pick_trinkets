"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { quickAddToCart } from "@/app/actions/cart";

export function QuickAdd({ productId }: { productId: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState("");

  return (
    <div className="mt-3 flex items-center gap-2">
      <button
        type="button"
        disabled={pending}
        onClick={() => {
          setMessage("");
          startTransition(async () => {
            const result = await quickAddToCart(productId);
            setMessage(result.ok ? "Added" : result.error || "Could not add");
            if (result.ok) router.refresh();
          });
        }}
        className="rounded-full bg-pink px-3 py-1.5 text-xs font-bold transition duration-200 hover:bg-pink-deep active:scale-[0.98] disabled:opacity-60"
      >
        {pending ? "Adding…" : "Add to bag"}
      </button>
      {message ? (
        <span className={`text-xs font-bold ${message === "Added" ? "text-ink" : "text-pink-deep"}`}>
          {message}
        </span>
      ) : null}
    </div>
  );
}
