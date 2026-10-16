import Link from "next/link";
import { formatBdt, formatWhen, statusDetail, statusLabel } from "@/lib/format";
import { btnPrimary } from "@/lib/ui";

type Item = {
  id: string;
  productName: string;
  quantity: number;
  unitPrice: number | string | { toString(): string };
};

type Event = {
  id: string;
  fromStatus: "NEW" | "PROCESSING" | "DONE" | null;
  toStatus: "NEW" | "PROCESSING" | "DONE";
  createdAt: Date;
};

const steps = ["NEW", "PROCESSING", "DONE"] as const;

export function OrderTracker({
  order,
}: {
  order: {
    code: string;
    status: "NEW" | "PROCESSING" | "DONE";
    customerName: string;
    phone: string;
    address: string;
    area: string;
    note: string | null;
    total: number | string | { toString(): string };
    deliveryCharge: number | string | { toString(): string };
    createdAt: Date;
    items: Item[];
    events: Event[];
  };
}) {
  const current = steps.indexOf(order.status);
  const delivery = Number(order.deliveryCharge);
  const subtotal = Number(order.total) - delivery;

  return (
    <div className="mx-auto max-w-xl">
      <p className="text-sm font-bold text-muted">Order {order.code}</p>
      <h1 className="mt-2 font-serif text-4xl">{statusLabel[order.status]}</h1>
      <p className="mt-3 leading-relaxed text-muted">{statusDetail[order.status]}</p>

      <ol className="mt-8 grid grid-cols-3 gap-2">
        {steps.map((step, index) => {
          const reached = index <= current;
          return (
            <li key={step} className="text-center">
              <div className={`mb-2 h-1.5 rounded-full ${reached ? "bg-pink" : "bg-black/10"}`} />
              <p className={`text-xs font-bold ${reached ? "text-ink" : "text-muted"}`}>
                {statusLabel[step]}
              </p>
            </li>
          );
        })}
      </ol>

      <div className="mt-8 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-black/5">
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
        <dl className="mt-4 space-y-1 border-t border-black/10 pt-4 text-sm">
          <div className="flex justify-between">
            <dt>Pieces</dt>
            <dd>{formatBdt(subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt>Delivery</dt>
            <dd>{delivery > 0 ? formatBdt(delivery) : "Confirmed by phone"}</dd>
          </div>
          <div className="flex justify-between pt-1 font-bold">
            <dt>Total</dt>
            <dd>{formatBdt(order.total)}</dd>
          </div>
        </dl>
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
        <p className="mt-4 text-xs text-muted">Placed {formatWhen(order.createdAt)} · Cash on delivery</p>
      </div>

      {order.events.length > 0 ? (
        <section className="mt-6">
          <h2 className="font-serif text-2xl">Updates</h2>
          <ol className="mt-3 space-y-3">
            {order.events.map((event) => (
              <li key={event.id} className="rounded-2xl bg-white px-4 py-3 text-sm ring-1 ring-black/5">
                <p className="font-bold">
                  {event.fromStatus && event.fromStatus !== event.toStatus
                    ? `${statusLabel[event.fromStatus]} → ${statusLabel[event.toStatus]}`
                    : statusLabel[event.toStatus]}
                </p>
                <p className="text-muted">{formatWhen(event.createdAt)}</p>
              </li>
            ))}
          </ol>
        </section>
      ) : null}

      <Link href="/shop" className={`${btnPrimary} mt-8`}>
        Back to shop
      </Link>
    </div>
  );
}
