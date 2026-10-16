"use client";

import { useEffect, useState } from "react";

export function ProductGallery({
  images,
  title,
  soldOut,
}: {
  images: string[];
  title: string;
  soldOut: boolean;
}) {
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState(false);
  const [origin, setOrigin] = useState("50% 50%");
  const [lightbox, setLightbox] = useState(false);
  const safe = images.length > 0 ? images : ["/brand/placeholder.svg"];
  const current = safe[Math.min(active, safe.length - 1)];

  useEffect(() => {
    if (!lightbox) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setLightbox(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox]);

  return (
    <div>
      <div
        className="relative overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-black/5"
        onMouseEnter={() => setZoom(true)}
        onMouseLeave={() => setZoom(false)}
        onMouseMove={(event) => {
          const rect = event.currentTarget.getBoundingClientRect();
          const x = ((event.clientX - rect.left) / rect.width) * 100;
          const y = ((event.clientY - rect.top) / rect.height) * 100;
          setOrigin(`${x}% ${y}%`);
          setZoom(true);
        }}
      >
        <img
          src={current}
          alt={title}
          className="aspect-square w-full object-cover transition duration-200"
          style={{
            transformOrigin: origin,
            transform: zoom ? "scale(1.85)" : "scale(1)",
          }}
        />
        {soldOut ? (
          <span className="absolute left-4 top-4 rounded-full bg-ink px-3 py-1 text-sm font-bold text-white">
            Sold out
          </span>
        ) : null}
        <button
          type="button"
          onClick={() => setLightbox(true)}
          className="absolute bottom-4 right-4 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold shadow-sm ring-1 ring-black/10"
        >
          Zoom
        </button>
      </div>
      {lightbox ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${title} enlarged`}
          className="fixed inset-0 z-50 grid place-items-center bg-ink/80 p-4"
          onClick={() => setLightbox(false)}
        >
          <img
            src={current}
            alt={title}
            className="max-h-[88vh] max-w-[92vw] rounded-2xl object-contain"
            onClick={(event) => event.stopPropagation()}
          />
          <button
            type="button"
            className="absolute right-4 top-4 rounded-full bg-white px-3 py-1.5 text-sm font-bold"
            onClick={() => setLightbox(false)}
          >
            Close
          </button>
        </div>
      ) : null}
      {safe.length > 1 ? (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {safe.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              aria-label={`Photo ${index + 1}`}
              onClick={() => setActive(index)}
              className={`h-16 w-16 shrink-0 overflow-hidden rounded-xl ring-2 transition ${
                index === active ? "ring-pink" : "ring-transparent"
              }`}
            >
              <img src={image} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
