import Link from "next/link";
import { sortOptions, type SortId } from "@/lib/catalog";
import { inputClass } from "@/lib/ui";

type Category = { slug: string; name: string };

export type ShopQuery = {
  q?: string;
  category?: string;
  stock?: string;
  sort?: SortId;
  min?: string;
  max?: string;
};

export function shopHref(params: ShopQuery) {
  const search = new URLSearchParams();
  if (params.category) search.set("category", params.category);
  if (params.q) search.set("q", params.q);
  if (params.stock) search.set("stock", params.stock);
  if (params.sort && params.sort !== "new") search.set("sort", params.sort);
  if (params.min) search.set("min", params.min);
  if (params.max) search.set("max", params.max);
  const query = search.toString();
  return query ? `/shop?${query}` : "/shop";
}

export function ShopToolbar({
  categories,
  current,
  query,
}: {
  categories: Category[];
  current?: Category;
  query: ShopQuery;
}) {
  const inStockOnly = query.stock === "1";
  const chips = [
    { href: shopHref({ ...query, category: undefined }), label: "All", on: !current },
    ...categories.map((category) => ({
      href: shopHref({ ...query, category: category.slug }),
      label: category.name,
      on: current?.slug === category.slug,
    })),
  ];

  return (
    <div className="mt-6 space-y-4">
      <div className="flex flex-wrap gap-2">
        {chips.map((chip) => (
          <Link
            key={chip.label}
            href={chip.href}
            className={`rounded-full px-3 py-1.5 text-sm font-bold transition ${
              chip.on ? "bg-pink text-black" : "bg-white text-ink hover:-translate-y-0.5"
            }`}
          >
            {chip.label}
          </Link>
        ))}
        <Link
          href={shopHref({ ...query, stock: inStockOnly ? undefined : "1" })}
          className={`rounded-full px-3 py-1.5 text-sm font-bold transition ${
            inStockOnly ? "bg-ink text-white" : "bg-white text-ink hover:-translate-y-0.5"
          }`}
        >
          In stock
        </Link>
      </div>

      <form action="/shop" className="grid gap-3 rounded-3xl bg-white p-4 ring-1 ring-black/5 sm:grid-cols-2 lg:grid-cols-5">
        {current ? <input type="hidden" name="category" value={current.slug} /> : null}
        {inStockOnly ? <input type="hidden" name="stock" value="1" /> : null}
        <label className="block sm:col-span-2">
          <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-muted">Search</span>
          <input
            type="search"
            name="q"
            defaultValue={query.q ?? ""}
            placeholder="Flower, pearl, bracelet"
            aria-label="Search"
            className={inputClass}
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-muted">Sort</span>
          <select name="sort" defaultValue={query.sort ?? "new"} className={inputClass} aria-label="Sort">
            {sortOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-muted">Min ৳</span>
          <input
            name="min"
            inputMode="numeric"
            defaultValue={query.min ?? ""}
            placeholder="100"
            className={inputClass}
            aria-label="Minimum price"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-muted">Max ৳</span>
          <input
            name="max"
            inputMode="numeric"
            defaultValue={query.max ?? ""}
            placeholder="400"
            className={inputClass}
            aria-label="Maximum price"
          />
        </label>
        <div className="flex items-end sm:col-span-2 lg:col-span-5">
          <button type="submit" className="rounded-full bg-ink px-4 py-2.5 text-sm font-bold text-white">
            Apply
          </button>
          <Link href="/shop" className="ml-4 self-center text-sm font-bold">
            Clear
          </Link>
        </div>
      </form>
    </div>
  );
}
