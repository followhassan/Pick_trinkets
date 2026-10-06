"use client";

export default function ShopError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="py-16">
      <h1 className="font-serif text-4xl">The shop could not load</h1>
      <p className="mt-3 max-w-md text-muted">
        Check that DATABASE_URL is set and the database migration has been applied.
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-6 rounded-full bg-pink px-5 py-2.5 text-sm font-bold"
      >
        Try again
      </button>
    </div>
  );
}
