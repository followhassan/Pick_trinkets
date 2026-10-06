import Link from "next/link";
import { canBuy, formatBdt } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import { btnPrimary } from "@/lib/ui";

export const dynamic = "force-dynamic";
export const metadata = { title: "Products" };

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-4xl">Products</h1>
          <p className="mt-2 text-muted">{products.length} pieces</p>
        </div>
        <Link href="/admin/products/new" className={btnPrimary}>
          Add product
        </Link>
      </div>

      {products.length === 0 ? (
        <p className="mt-10 text-muted">No products yet.</p>
      ) : (
        <ul className="mt-8 divide-y divide-black/10">
          {products.map((product) => (
            <li key={product.id} className="flex items-center gap-4 py-4">
              <img
                src={product.imageUrl}
                alt=""
                className="h-16 w-16 rounded-xl object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold">{product.title}</p>
                <p className="text-sm text-muted">
                  {product.category.name} · {formatBdt(product.price)} · {product.stock} in stock
                  {!canBuy(product) ? " · unavailable" : ""}
                </p>
              </div>
              <Link href={`/admin/products/${product.id}`} className="text-sm font-bold">
                Edit
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
