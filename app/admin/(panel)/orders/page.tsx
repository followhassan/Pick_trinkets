import Link from "next/link";
import { formatBdt, formatWhen, statusLabel } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import { inputClass } from "@/lib/ui";

export const dynamic = "force-dynamic";
export const metadata = { title: "Orders" };

const filters = ["NEW", "PROCESSING", "DONE"] as const;

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  const params = await searchParams;
  const current = filters.find((item) => item === params.status);
  const q = (params.q ?? "").trim();

  const orders = await prisma.order.findMany({
    where: {
      ...(current ? { status: current } : {}),
      ...(q
        ? {
            OR: [
              { code: { contains: q, mode: "insensitive" } },
              { customerName: { contains: q, mode: "insensitive" } },
              { phone: { contains: q } },
              { area: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    orderBy: { createdAt: "desc" },
  });

  const exportParams = new URLSearchParams();
  if (current) exportParams.set("status", current);
  if (q) exportParams.set("q", q);
  const exportHref = exportParams.size
    ? `/admin/orders/export?${exportParams.toString()}`
    : "/admin/orders/export";

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-4xl">Orders</h1>
          <p className="mt-2 text-muted">{orders.length} in this list</p>
        </div>
        <a href={exportHref} className="text-sm font-bold">
          Export CSV
        </a>
      </div>

      <form action="/admin/orders" className="mt-6 flex flex-col gap-2 sm:flex-row">
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Code, name, phone, or area"
          className={inputClass}
          aria-label="Search orders"
        />
        <button type="submit" className="rounded-full bg-ink px-4 py-2.5 text-sm font-bold text-white">
          Search
        </button>
      </form>

      <div className="mt-4 flex flex-wrap gap-2">
        <Link
          href={q ? `/admin/orders?q=${encodeURIComponent(q)}` : "/admin/orders"}
          className={`rounded-full px-3 py-1.5 text-sm font-bold ${current ? "bg-white" : "bg-pink"}`}
        >
          All
        </Link>
        {filters.map((item) => (
          <Link
            key={item}
            href={`/admin/orders?status=${item}${q ? `&q=${encodeURIComponent(q)}` : ""}`}
            className={`rounded-full px-3 py-1.5 text-sm font-bold ${
              current === item ? "bg-pink" : "bg-white"
            }`}
          >
            {statusLabel[item]}
          </Link>
        ))}
      </div>

      {orders.length === 0 ? (
        <div className="mt-10 rounded-3xl bg-white px-6 py-12 text-center ring-1 ring-black/5">
          <h2 className="font-serif text-2xl">No orders in this list</h2>
          <p className="mt-2 text-muted">Try another status or clear the search.</p>
        </div>
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