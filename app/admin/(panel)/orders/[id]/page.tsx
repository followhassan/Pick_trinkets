import Link from "next/link";
import { notFound } from "next/navigation";
import { updateOrderStatus } from "@/app/actions/products";
import { formatBdt, formatWhen, statusLabel } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import { btnPrimary, inputClass } from "@/lib/ui";

export const dynamic = "force-dynamic";
export const metadata = { title: "Order" };

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  });
  if (!order) notFound();

  return (
    <div className="max-w-xl">
      <Link href="/admin/orders" className="text-sm font-bold">
        All orders
      </Link>
      <h1 className="mt-2 font-serif text-4xl">{order.code}</h1>
      <p className="mt-2 text-sm text-muted">{formatWhen(order.createdAt)}</p>

      <form action={updateOrderStatus} className="mt-6 flex flex-wrap items-end gap-3">
        <input type="hidden" name="id" value={order.id} />
        <label className="block">
          <span className="mb-1.5 block text-sm font-bold">Status</span>
          <select name="status" defaultValue={order.status} className={inputClass}>
            <option value="NEW">{statusLabel.NEW}</option>
            <option value="PROCESSING">{statusLabel.PROCESSING}</option>
            <option value="DONE">{statusLabel.DONE}</option>
          </select>
        </label>
        <button type="submit" className={btnPrimary}>
          Update
        </button>
      </form>

      <section className="mt-8 rounded-3xl bg-white p-5">
        <h2 className="font-serif text-2xl">Customer</h2>
        <p className="mt-3 leading-relaxed">
          {order.customerName}
          <br />
          <a href={`tel:${order.phone}`} className="font-bold">
            {order.phone}
          </a>
          <br />
          {order.address}
          <br />
          {order.area}
        </p>
        {order.note ? <p className="mt-3 text-sm">Note: {order.note}</p> : null}
      </section>

      <section className="mt-4 rounded-3xl bg-white p-5">
        <h2 className="font-serif text-2xl">Items</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {order.items.map((item) => (
            <li key={item.id} className="flex justify-between gap-4">
              <span>
                {item.productName} × {item.quantity}
              </span>
              <span>{formatBdt(Number(item.unitPrice) * item.quantity)}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 flex justify-between border-t border-black/10 pt-3 font-bold">
          <span>Total</span>
          <span>{formatBdt(order.total)}</span>
        </p>
        <p className="mt-2 text-xs text-muted">Cash on delivery. No online payment.</p>
      </section>
    </div>
  );
}
