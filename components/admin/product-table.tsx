"use client";

import Link from "next/link";
import { bulkUpdateProducts, updateStock } from "@/app/actions/products";
import { formatBdt } from "@/lib/format";
import { inputClass } from "@/lib/ui";

export type AdminProductRow = {
  id: string;
  title: string;
  price: number;
  stock: number;
  available: boolean;
  featured: boolean;
  bestseller: boolean;
  imageUrl: string;
  categoryName: string;
  low: boolean;
};

export function ProductTable({ products }: { products: AdminProductRow[] }) {
  if (products.length === 0) {
    return <p className="mt-10 text-muted">No products yet.</p>;
  }

  return (
    <form
      action={bulkUpdateProducts}
      className="mt-8"
      onSubmit={(event) => {
        const data = new FormData(event.currentTarget);
        const selected = data.getAll("ids");
        if (selected.length === 0) {
          event.preventDefault();
          return;
        }
        if (data.get("bulk") === "delete" && !confirm(`Delete ${selected.length} product(s)?`)) {
          event.preventDefault();
        }
      }}
    >
      <div className="flex flex-wrap items-center gap-2 rounded-2xl bg-white p-3 ring-1 ring-black/5">
        <label className="text-sm font-bold">
          <span className="sr-only">Bulk action</span>
          <select name="bulk" defaultValue="feature" className={inputClass}>
            <option value="feature">Mark featured</option>
            <option value="unfeature">Remove featured</option>
            <option value="bestseller">Mark bestseller</option>
            <option value="unbestseller">Remove bestseller</option>
            <option value="available">Mark available</option>
            <option value="unavailable">Hide from sale</option>
            <option value="delete">Delete</option>
          </select>
        </label>
        <button type="submit" className="rounded-full bg-ink px-4 py-2 text-sm font-bold text-white">
          Apply to selected
        </button>
      </div>

      <ul className="mt-4 divide-y divide-black/10">
        {products.map((product) => (
          <li key={product.id} className="flex flex-wrap items-center gap-3 py-4 sm:flex-nowrap">
            <input type="checkbox" name="ids" value={product.id} aria-label={`Select ${product.title}`} className="h-4 w-4 accent-pink-deep" />
            <img src={product.imageUrl} alt="" className="h-16 w-16 rounded-xl object-cover" />
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold">{product.title}</p>
              <p className="text-sm text-muted">
                {product.categoryName} · {formatBdt(product.price)}
                {!product.available ? " · hidden" : ""}
                {product.featured ? " · featured" : ""}
                {product.bestseller ? " · bestseller" : ""}
                {product.stock === 0 ? " · sold out" : product.low ? " · low stock" : ""}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs font-bold text-muted">
                Stock
                <input
                  form={`stock-${product.id}`}
                  name="stock"
                  type="number"
                  min={0}
                  defaultValue={product.stock}
                  className={`${inputClass} mt-1 w-20`}
                />
              </label>
              <button form={`stock-${product.id}`} className="mt-5 text-sm font-bold">
                Save
              </button>
            </div>
            <Link href={`/admin/products/${product.id}`} className="text-sm font-bold">
              Edit
            </Link>
          </li>
        ))}
      </ul>
      {products.map((product) => (
        <form key={`stock-form-${product.id}`} id={`stock-${product.id}`} action={updateStock}>
          <input type="hidden" name="id" value={product.id} />
        </form>
      ))}
    </form>
  );
}
