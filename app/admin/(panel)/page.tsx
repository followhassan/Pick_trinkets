import Link from "next/link";
import { SalesChart } from "@/components/admin/sales-chart";
import { dhakaDateKey, formatBdt, formatWhen, lastDhakaDays, statusLabel } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import { getShopSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

export default async function AdminHomePage() {
  const settings = await getShopSettings();
  const days = lastDhakaDays(14);
  const since = new Date(`${days[0].key}T00:00:00+06:00`);

  const attentionWhere = {
    OR: [{ stock: { lte: settings.lowStockThreshold } }, { available: false }],
  };
  const [productCount, orders, recent, attention, attentionCount, recentItems, allOrders] =
    await Promise.all([
      prisma.product.count(),
      prisma.order.findMany({
        where: { createdAt: { gte: since } },
        select: { createdAt: true, total: true, status: true },
      }),
      prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 6 }),
      prisma.product.findMany({
        where: attentionWhere,
        orderBy: [{ stock: "asc" }, { title: "asc" }],
        include: { category: true },
        take: 6,
      }),
      prisma.product.count({ where: attentionWhere }),
      prisma.orderItem.aggregate({ _sum: { quantity: true } }),
      prisma.order.groupBy({
        by: ["status"],
        _count: { _all: true },
        _sum: { total: true },
      }),
    ]);

  const buckets = new Map(days.map((day) => [day.key, { ...day, total: 0, orders: 0 }]));
  for (const order of orders) {
    const bucket = buckets.get(dhakaDateKey(order.createdAt));
    if (!bucket) continue;
    bucket.total += Number(order.total);
    bucket.orders += 1;
  }

  const byStatus = Object.fromEntries(
    allOrders.map((row) => [row.status, { count: row._count._all, total: Number(row._sum.total ?? 0) }]),
  ) as Partial<Record<"NEW" | "PROCESSING" | "DONE", { count: number; total: number }>>;

  const orderCount = allOrders.reduce((sum, row) => sum + row._count._all, 0);
  const revenue = allOrders.reduce((sum, row) => sum + Number(row._sum.total ?? 0), 0);
  const open = (byStatus.NEW?.count ?? 0) + (byStatus.PROCESSING?.count ?? 0);

  const cards = [
    { href: "/admin/orders", label: "Order value", value: formatBdt(revenue), hint: "All cash-on-delivery orders" },
    { href: "/admin/orders?status=NEW", label: "Open orders", value: String(open), hint: `${byStatus.NEW?.count ?? 0} new` },
    { href: "/admin/products", label: "Products", value: String(productCount), hint: `${recentItems._sum.quantity ?? 0} pieces ordered` },
    { href: "/admin/products", label: "Needs attention", value: String(attentionCount), hint: `Stock at or under ${settings.lowStockThreshold}` },
  ];

  return (
    <div>
      <h1 className="font-serif text-4xl">Dashboard</h1>
      <p className="mt-2 text-muted">Sales, stock, and the orders waiting on a phone call.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Link key={card.label} href={card.href} className="rounded-3xl bg-white p-5 ring-1 ring-black/5 transition hover:-translate-y-0.5">
            <p className="text-sm text-muted">{card.label}</p>
            <p className="mt-1 font-serif text-3xl">{card.value}</p>
            <p className="mt-2 text-xs text-muted">{card.hint}</p>
          </Link>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,0.8fr)]">
        <section className="rounded-3xl bg-white p-5 ring-1 ring-black/5">
          <h2 className="font-serif text-2xl">Sales</h2>
          <div className="mt-4">
            {orderCount === 0 ? (
              <p className="py-10 text-center text-sm text-muted">The chart fills in after the first order.</p>
            ) : (
              <SalesChart days={[...buckets.values()]} />
            )}
          </div>
        </section>
        <section className="rounded-3xl bg-white p-5 ring-1 ring-black/5">
          <h2 className="font-serif text-2xl">Orders</h2>
          <ul className="mt-4 space-y-3">
            {(["NEW", "PROCESSING", "DONE"] as const).map((status) => (
              <li key={status}>
                <Link href={`/admin/orders?status=${status}`} className="flex items-center justify-between gap-3 text-sm">
                  <span className="font-bold">{statusLabel[status]}</span>
                  <span>
                    {byStatus[status]?.count ?? 0}
                    <span className="ml-2 text-muted">{formatBdt(byStatus[status]?.total ?? 0)}</span>
                  </span>
                </Link>
                <div className="mt-1 h-2 overflow-hidden rounded-full bg-cream">
                  <div
                    className="h-full rounded-full bg-pink"
                    style={{ width: `${orderCount ? ((byStatus[status]?.count ?? 0) / orderCount) * 100 : 0}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-muted">{orderCount} orders in total</p>
        </section>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <section className="rounded-3xl bg-white p-5 ring-1 ring-black/5">
          <div className="flex items-baseline justify-between">
            <h2 className="font-serif text-2xl">Low stock</h2>
            <Link href="/admin/products" className="text-sm font-bold">
              Products
            </Link>
          </div>
          {attention.length === 0 ? (
            <p className="mt-4 text-sm text-muted">Every piece is above the alert line.</p>
          ) : (
            <ul className="mt-4 divide-y divide-black/10">
              {attention.map((product) => (
                <li key={product.id} className="flex items-center justify-between gap-3 py-3 text-sm">
                  <Link href={`/admin/products/${product.id}`} className="font-semibold">
                    {product.title}
                  </Link>
                  <span className={product.stock <= settings.lowStockThreshold ? "font-bold text-pink-deep" : "text-muted"}>
                    {product.stock} in stock
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-3xl bg-white p-5 ring-1 ring-black/5">
          <div className="flex items-baseline justify-between">
            <h2 className="font-serif text-2xl">Recent orders</h2>
            <Link href="/admin/orders" className="text-sm font-bold">
              All orders
            </Link>
          </div>
          {recent.length === 0 ? (
            <p className="mt-4 text-sm text-muted">No orders yet.</p>
          ) : (
            <ul className="mt-4 divide-y divide-black/10">
              {recent.map((order) => (
                <li key={order.id}>
                  <Link href={`/admin/orders/${order.id}`} className="block py-3 text-sm">
                    <span className="flex justify-between gap-3 font-bold">
                      <span>{order.code}</span>
                      <span>{formatBdt(order.total)}</span>
                    </span>
                    <span className="mt-1 block text-muted">
                      {order.customerName} · {statusLabel[order.status]} · {formatWhen(order.createdAt)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}