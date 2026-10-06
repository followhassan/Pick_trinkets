import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatBdt, formatWhen, statusLabel } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import { btnPrimary } from "@/lib/ui";

export const dynamic = "force-dynamic";

type Params = { code: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { code } = await params;
  return { title: `Order ${code}` };
}

export default async function OrderConfirmationPage({ params }: { params: Promise<Params> }) {
  const { code } = await params;
  const order = await prisma.order.findUnique({
    where: { code },
    include: { items: true },
  });
  if (!order) notFound();

  return (
    <div className="mx-auto max-w-xl">
      <p className="text-sm font-bold text-muted">Order {order.code}</p>
      <h1 className="mt-2 font-serif text-4xl">Order received</h1>
      <p className="mt-4 leading-relaxed">
        This order is saved as <strong>{statusLabel[order.status].toLowerCase()}</strong>. We will
        call or message {order.phone} to confirm. Nothing has been charged online — pay the courier
        when it arrives.
      </p>

      <div className="mt-8 rounded-3xl bg-white p-5">
        <ul className="space-y-3">
          {order.items.map((item) => (
            <li key={item.id} className="flex justify-between gap-4 text-sm">
              <span>
                {item.productName} × {item.quantity}
              </span>
              <span className="font-bold">{formatBdt(Number(item.unitPrice) * item.quantity)}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 flex justify-between border-t border-black/10 pt-4 font-bold">
          <span>Total</span>
          <span>{formatBdt(order.total)}</span>
        </p>
        <p className="mt-4 text-sm text-muted">
          {order.customerName}
          <br />
          {order.phone}
          <br />
          {order.address}
          <br />
          {order.area}
        </p>
        {order.note ? <p className="mt-3 text-sm">Note: {order.note}</p> : null}
        <p className="mt-4 text-xs text-muted">{formatWhen(order.createdAt)}</p>
      </div>

      <Link href="/shop" className={`${btnPrimary} mt-8`}>
        Back to shop
      </Link>
    </div>
  );
}
