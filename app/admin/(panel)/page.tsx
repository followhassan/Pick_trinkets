import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { btnPrimary } from "@/lib/ui";

export const dynamic = "force-dynamic";

export default async function AdminHomePage() {
  const [products, orders, fresh] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.order.count({ where: { status: "NEW" } }),
  ]);

  return (
    <div>
      <h1 className="font-serif text-4xl">Staff</h1>
      <p className="mt-2 text-muted">Add pieces and mark orders as you pack them.</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Link href="/admin/products" className="rounded-2xl bg-white p-5">
          <p className="text-sm text-muted">Products</p>
          <p className="mt-1 font-serif text-3xl">{products}</p>
        </Link>
        <Link href="/admin/orders" className="rounded-2xl bg-white p-5">
          <p className="text-sm text-muted">Orders</p>
          <p className="mt-1 font-serif text-3xl">{orders}</p>
        </Link>
        <Link href="/admin/orders?status=NEW" className="rounded-2xl bg-white p-5">
          <p className="text-sm text-muted">New</p>
          <p className="mt-1 font-serif text-3xl">{fresh}</p>
        </Link>
      </div>
      <Link href="/admin/products/new" className={`${btnPrimary} mt-8`}>
        Add a product
      </Link>
    </div>
  );
}
