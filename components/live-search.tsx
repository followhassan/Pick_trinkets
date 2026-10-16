"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { formatBdt } from "@/lib/format";

type Hit = {
  id: string;
  title: string;
  slug: string;
  price: number;
  imageUrl: string;
  available: boolean;
  stock: number;
};

export function LiveSearch() {
  const listId = useId();
  const [query, setQuery] = useState("");
  const [hits, setHits] = useState<Hit[]>([]);
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "ready">("idle");
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 1) {
      setHits([]);
      setStatus("idle");
      return;
    }

    setStatus("loading");
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(trimmed)}`, {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error("search failed");
        const data = (await response.json()) as { products: Hit[] };
        if (controller.signal.aborted) return;
        setHits(data.products ?? []);
        setStatus("ready");
        setOpen(true);
      } catch (error) {
        if ((error as Error).name === "AbortError" || controller.signal.aborted) return;
        setHits([]);
        setStatus("ready");
      }
    }, 160);
    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [query]);

  useEffect(() => {
    function onPointer(event: MouseEvent) {
      if (!box.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onPointer);
    return () => document.removeEventListener("mousedown", onPointer);
  }, []);

  const trimmed = query.trim();

  return (
    <div ref={box} className="relative w-full">
      <label className="sr-only" htmlFor={`${listId}-input`}>
        Search the shop
      </label>
      <input
        id={`${listId}-input`}
        type="search"
        value={query}
        placeholder="Search charms"
        autoComplete="off"
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        onChange={(event) => {
          setQuery(event.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        className="w-full rounded-full border border-black/10 bg-cream px-4 py-2 text-sm outline-none transition focus:border-pink focus:bg-white"
      />
      {open && trimmed ? (
        <div
          id={listId}
          role="listbox"
          className="absolute left-0 right-0 top-[calc(100%+0.4rem)] z-40 overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-black/10"
        >
          {status !== "ready" ? (
            <p className="px-4 py-3 text-sm text-muted">Searching…</p>
          ) : hits.length === 0 ? (
            <p className="px-4 py-3 text-sm text-muted">No pieces match “{trimmed}”.</p>
          ) : (
            <ul>
              {hits.map((hit) => (
                <li key={hit.id}>
                  <Link
                    href={`/product/${hit.slug}`}
                    className="flex items-center gap-3 px-3 py-2 transition hover:bg-cream"
                    onClick={() => setOpen(false)}
                  >
                    <img src={hit.imageUrl} alt="" className="h-12 w-12 rounded-xl object-cover" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-bold">{hit.title}</span>
                      <span className="text-xs text-muted">
                        {formatBdt(hit.price)}
                        {!hit.available || hit.stock <= 0 ? " · Sold out" : ""}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
          <Link
            href={`/shop?q=${encodeURIComponent(trimmed)}`}
            className="block border-t border-black/5 px-4 py-2.5 text-sm font-bold hover:bg-cream"
            onClick={() => setOpen(false)}
          >
            See all results
          </Link>
        </div>
      ) : null}
    </div>
  );
}
