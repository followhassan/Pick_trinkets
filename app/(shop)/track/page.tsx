import type { Metadata } from "next";
import { OrderTracker } from "@/components/order-tracker";
import { prisma } from "@/lib/prisma";
import { btnPrimary, inputClass } from "@/lib/ui";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Track an order" };

export default async function TrackPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string }>;
}) {
  const raw = (await searchParams).code?.trim() ?? "";
  const code = raw.toUpperCase();
  const order = code
    ? await prisma.order.findUnique({
        where: { code },
        include: { items: true, events: { orderBy: { createdAt: "asc" } } },
      })
    : null;

  return (
    <div>
      <div className="mx-auto max-w-xl">
        <h1 className="font-serif text-4xl">Track an order</h1>
        <p className="mt-2 text-muted">
          Enter the code from your confirmation. It looks like PT-1A2B3C4D.
        </p>
        <form action="/track" className="mt-6 flex flex-col gap-3 sm:flex-row">
          <label className="block flex-1">
            <span className="sr-only">Order code</span>
            <input
              name="code"
              defaultValue={raw}
              placeholder="PT-XXXXXXXX"
              required
              className={inputClass}
              autoCapitalize="characters"
            />
          </label>
          <button type="submit" className={btnPrimary}>
            Look up
          </button>
        </form>
      </div>

      {code && !order ? (
        <div className="mx-auto mt-8 max-w-xl rounded-3xl bg-white px-6 py-10 text-center ring-1 ring-black/5">
          <h2 className="font-serif text-2xl">No order with that code</h2>
          <p className="mt-2 text-muted">Check the letters and try again. Codes are not case sensitive.</p>
        </div>
      ) : null}

      {order ? (
        <div className="mt-10">
          <OrderTracker order={order} />
        </div>
      ) : null}
    </div>
  );
}
