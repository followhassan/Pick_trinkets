import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { inputClass } from "@/lib/ui";
import { categoryOrder } from "@/lib/site";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type Search = { q?: string; category?: string; stock?: string };

function shopHref(params: Search) {
  const search = new URLSearchParams();
  if (params.category) search.set("category", params.category);
  if (params.q) search.set("q", params.q);
  if (params.stock) search.set("stock", params.stock);
  const query = search.toString();
  return query ? `/shop?${query}` : "/shop";
}

export default async function ShopPage({ searchParams }: { searchParams: Promise<Search> }) {
  const params = await searchParams;
  const q = (params.q ?? "").trim();
  const categorySlug = (params.category ?? "").trim();
  const inStockOnly = params.stock === "1";

  const categories = await prisma.category.findMany();
  categories.sort((a, b) => {
    const rank = (slug: string) => {
      const index = categoryOrder.indexOf(slug);
      return index === -1 ? 99 : index;
    };
    return rank(a.slug) - rank(b.slug);
  });

  const current = categories.find((category) => category.slug === categorySlug);

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
    },
    orderBy: [{ stock: "desc" }, { title: "asc" }],
  });

  const chips = [
    { href: shopHref({ q, stock: inStockOnly ? "1" : undefined }), label: "All", on: !current },
    ...categories.map((category) => ({
      href: shopHref({
        q,
        category: category.slug,
        stock: inStockOnly ? "1" : undefined,
      }),
      label: category.name,
      on: current?.id === category.id,
    })),
  ];

  return (
    <div>
      <h1 className="font-serif text-4xl">{current?.name ?? "Shop"}</h1>
      <p className="mt-2 max-w-xl text-muted">
        Handmade in Dhaka. Prices in BDT. Sold-out pieces stay listed so you can ask about a restock.
      </p>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {chips.map((chip) => (
            <Link
              key={chip.label}
              href={chip.href}
              className={`rounded-full px-3 py-1.5 text-sm font-bold ${
                chip.on ? "bg-pink text-black" : "bg-white text-ink"
              }`}
            >
              {chip.label}
            </Link>
          ))}
          <Link
            href={shopHref({
              q,
              category: current?.slug,
              stock: inStockOnly ? undefined : "1",
            })}
            className={`rounded-full px-3 py-1.5 text-sm font-bold ${
              inStockOnly ? "bg-ink text-white" : "bg-white text-ink"
            }`}
          >
            In stock
          </Link>
        </div>
        <form action="/shop" className="flex w-full gap-2 sm:max-w-xs">
          {current ? <input type="hidden" name="category" value={current.slug} /> : null}
          {inStockOnly ? <input type="hidden" name="stock" value="1" /> : null}
          <input
            type="search"
            name="q"
            defaultValue={q}
            placeholder="Search"
            aria-label="Search"
            className={inputClass}
          />
        </form>
      </div>

      <p className="mt-8 text-sm text-muted">
        {products.length} {products.length === 1 ? "piece" : "pieces"}
        {q ? ` for “${q}”` : ""}
      </p>

      {products.length === 0 ? (
        <div className="mt-6 rounded-2xl bg-white px-6 py-12 text-center">
          <h2 className="font-serif text-2xl">Nothing matched</h2>
          <p className="mt-2 text-muted">Try another word, or browse everything.</p>
          <Link href="/shop" className="mt-6 inline-block font-bold">
            Clear filters
          </Link>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
