import Link from "next/link";
import { notFound } from "next/navigation";
import { updateOrderStatus } from "@/app/actions/products";
import { formatBdt, formatWhen, statusLabel } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import { btnPrimary, inputClass } from "@/lib/ui";
import { whatsappHref } from "@/lib/whatsapp";

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
    include: { items: true, events: { orderBy: { createdAt: "asc" } } },
  });
  if (!order) notFound();

  const delivery = Number(order.deliveryCharge);
  const subtotal = Number(order.total) - delivery;
  const whatsapp = whatsappHref(
    order.phone,
    `Hi ${order.customerName}, this is Pick Trinkets about order ${order.code}.`,
  );

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,24rem)_minmax(0,1fr)]">
      <div>
        <Link href="/admin/orders" className="text-sm font-bold">
          All orders
        </Link>
        <h1 className="mt-2 font-serif text-4xl">{order.code}</h1>
        <p className="mt-2 text-sm text-muted">{formatWhen(order.createdAt)}</p>

        <form action={updateOrderStatus} className="mt-6 space-y-3 rounded-3xl bg-white p-5 ring-1 ring-black/5">
          <input type="hidden" name="id" value={order.id} />
          <label className="block">
            <span className="mb-1.5 block text-sm font-bold">Status</span>
            <select name="status" defaultValue={order.status} className={inputClass}>
              <option value="NEW">{statusLabel.NEW}</option>
              <option value="PROCESSING">{statusLabel.PROCESSING}</option>
              <option value="DONE">{statusLabel.DONE}</option>
            </select>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-bold">Note for the history</span>
            <input name="note" placeholder="Called, will deliver tomorrow" className={inputClass} />
          </label>
          <button type="submit" className={btnPrimary}>
            Update
          </button>
        </form>
      </div>

      <div className="space-y-4">
        <section className="rounded-3xl bg-white p-5 ring-1 ring-black/5">
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
          {whatsapp ? (
            <a href={whatsapp} target="_blank" rel="noreferrer" className="mt-3 inline-block text-sm font-bold">
              Message on WhatsApp
            </a>
          ) : null}
          {order.note ? <p className="mt-3 text-sm">Customer note: {order.note}</p> : null}
        </section>

        <section className="rounded-3xl bg-white p-5 ring-1 ring-black/5">
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
          <dl className="mt-4 space-y-1 border-t border-black/10 pt-3 text-sm">
            <div className="flex justify-between">
              <dt>Pieces</dt>
              <dd>{formatBdt(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt>Delivery</dt>
              <dd>{formatBdt(delivery)}</dd>
            </div>
            <div className="flex justify-between font-bold">
              <dt>Total</dt>
              <dd>{formatBdt(order.total)}</dd>
            </div>
          </dl>
          <p className="mt-2 text-xs text-muted">Cash on delivery. No online payment.</p>
        </section>

        <section className="rounded-3xl bg-white p-5 ring-1 ring-black/5">
          <h2 className="font-serif text-2xl">Status history</h2>
          {order.events.length === 0 ? (
            <p className="mt-3 text-sm text-muted">No updates yet.</p>
          ) : (
            <ol className="mt-3 space-y-3">
              {order.events.map((event) => (
                <li key={event.id} className="text-sm">
                  <p className="font-bold">
                    {event.fromStatus && event.fromStatus !== event.toStatus
                      ? `${statusLabel[event.fromStatus]} → ${statusLabel[event.toStatus]}`
                      : statusLabel[event.toStatus]}
                  </p>
                  {event.note ? <p>{event.note}</p> : null}
                  <p className="text-muted">{formatWhen(event.createdAt)}</p>
                </li>
              ))}
            </ol>
          )}
        </section>
      </div>
    </div>
  );
}