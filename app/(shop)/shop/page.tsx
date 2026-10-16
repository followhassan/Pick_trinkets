import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { ShopToolbar, shopHref } from "@/components/shop-toolbar";
import { parsePrice, parseSort, sortOrder } from "@/lib/catalog";
import { prisma } from "@/lib/prisma";
import { getShopSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

type Search = {
  q?: string;
  category?: string;
  stock?: string;
  sort?: string;
  min?: string;
  max?: string;
};

export default async function ShopPage({ searchParams }: { searchParams: Promise<Search> }) {
  const params = await searchParams;
  const q = (params.q ?? "").trim();
  const categorySlug = (params.category ?? "").trim();
  const inStockOnly = params.stock === "1";
  const sort = parseSort(params.sort);
  let min = parsePrice(params.min);
  let max = parsePrice(params.max);
  if (min !== undefined && max !== undefined && min > max) {
    [min, max] = [max, min];
  }

  const [categories, settings] = await Promise.all([
    prisma.category.findMany({ orderBy: [{ sortOrder: "asc" }, { name: "asc" }] }),
    getShopSettings(),
  ]);
  const current = categories.find((category) => category.slug === categorySlug);
  const query = {
    q: q || undefined,
    category: current?.slug,
    stock: inStockOnly ? "1" : undefined,
    sort,
    min: min !== undefined ? String(min) : undefined,
    max: max !== undefined ? String(max) : undefined,
  };

  const products = await prisma.product.findMany({
    where: {
      ...(current ? { categoryId: current.id } : {}),
      ...(q
        ? {
            OR: [
              { title: { contains: q, mode: "insensitive" } },
              { description: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),
      ...(inStockOnly ? { available: true, stock: { gt: 0 } } : {}),
      ...(min !== undefined || max !== undefined
        ? { price: { ...(min !== undefined ? { gte: min } : {}), ...(max !== undefined ? { lte: max } : {}) } }
        : {}),
    },
    orderBy: sortOrder(sort),
  });

  return (
    <div>
      <h1 className="font-serif text-4xl md:text-5xl">{current?.name ?? "Shop"}</h1>
      <p className="mt-2 max-w-xl text-muted">
        Handmade in Dhaka. Prices in BDT. Sold-out pieces stay listed so you can ask about a restock.
      </p>

      <ShopToolbar categories={categories} current={current} query={query} />

      <p className="mt-8 text-sm text-muted">
        {products.length} {products.length === 1 ? "piece" : "pieces"}
        {q ? ` for “${q}”` : ""}
      </p>

      {products.length === 0 ? (
        <div className="mt-6 rounded-3xl bg-white px-6 py-14 text-center ring-1 ring-black/5">
          <img src="/brand/logo.png" alt="" className="mx-auto h-16 w-16 rounded-full object-cover" />
          <h2 className="mt-4 font-serif text-2xl">Nothing matched</h2>
          <p className="mt-2 text-muted">Try another word, a wider price, or browse everything.</p>
          <Link href="/shop" className="mt-6 inline-block font-bold">
            Clear filters
          </Link>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              lowStockAt={settings.lowStockThreshold}
            />
          ))}
        </div>
      )}
      {products.length > 0 ? (
        <p className="mt-8 text-center text-sm text-muted">
          Looking for something else?{" "}
          <Link href={shopHref({ q })} className="font-bold text-ink">
            Search again
          </Link>
        </p>
      ) : null}
    </div>
  );
}
