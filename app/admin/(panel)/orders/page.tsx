import Link from "next/link";
import { formatBdt, formatWhen, statusLabel } from "@/lib/format";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const metadata = { title: "Orders" };

const filters = ["NEW", "PROCESSING", "DONE"] as const;

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const current = filters.find((item) => item === status);

  const orders = await prisma.order.findMany({
    where: current ? { status: current } : {},
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="font-serif text-4xl">Orders</h1>
      <div className="mt-6 flex flex-wrap gap-2">
        <Link
          href="/admin/orders"
          className={`rounded-full px-3 py-1.5 text-sm font-bold ${
            current ? "bg-white" : "bg-pink"
          }`}
        >
          All
        </Link>
        {filters.map((item) => (
          <Link
            key={item}
            href={`/admin/orders?status=${item}`}
            className={`rounded-full px-3 py-1.5 text-sm font-bold ${
              current === item ? "bg-pink" : "bg-white"
            }`}
          >
            {statusLabel[item]}
          </Link>
        ))}
      </div>

      {orders.length === 0 ? (
        <p className="mt-10 text-muted">No orders in this list.</p>
      ) : (
        <ul className="mt-6 divide-y divide-black/10">
          {orders.map((order) => (
            <li key={order.id}>
              <Link href={`/admin/orders/${order.id}`} className="block py-4">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="font-bold">{order.code}</p>
                  <p className="text-sm">{statusLabel[order.status]}</p>
                </div>
                <p className="mt-1 text-sm text-muted">
                  {order.customerName} · {order.phone} · {order.area}
                </p>
                <p className="mt-1 text-sm">
                  {formatBdt(order.total)} · {formatWhen(order.createdAt)}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
