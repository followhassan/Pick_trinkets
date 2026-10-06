"use client";

import { useActionState, useState } from "react";
import { deleteProduct, saveProduct, type ProductFormState } from "@/app/actions/products";
import { btnGhost, btnPrimary, inputClass, labelClass } from "@/lib/ui";

type ProductDefaults = {
  id: string;
  title: string;
  description: string;
  price: string;
  stock: number;
  available: boolean;
  featured: boolean;
  imageUrl: string;
  categoryName: string;
};

const initial: ProductFormState = {};

export function ProductForm({
  product,
  categories,
}: {
  product?: ProductDefaults | null;
  categories: string[];
}) {
  const [state, action, pending] = useActionState(saveProduct, initial);
  const [preview, setPreview] = useState(product?.imageUrl ?? "");

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,32rem)_16rem]">
      <form action={action} className="space-y-4">
        {product ? <input type="hidden" name="id" value={product.id} /> : null}
        {state.error ? (
          <p role="alert" className="rounded-xl bg-white px-3 py-2 text-sm font-semibold">
            {state.error}
          </p>
        ) : null}

        <label className="block">
          <span className={labelClass}>Photo</span>
          <input
            name="image"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className={`${inputClass} bg-white file:mr-3 file:rounded-full file:border-0 file:bg-cream file:px-3 file:py-1 file:text-sm file:font-bold`}
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (!file) return;
              setPreview(URL.createObjectURL(file));
            }}
          />
          <span className="mt-1 block text-xs text-muted">JPG or PNG, under 4 MB. A plain background looks best.</span>
        </label>

        {preview ? (
          <img src={preview} alt="" className="h-40 w-40 rounded-2xl object-cover" />
        ) : null}

        <label className="block">
          <span className={labelClass}>Title</span>
          <input
            name="title"
            required
            defaultValue={product?.title ?? ""}
            className={inputClass}
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className={labelClass}>Price (BDT)</span>
            <input
              name="price"
              required
              type="number"
              min="0"
              step="1"
              inputMode="decimal"
              defaultValue={product?.price ?? ""}
              className={inputClass}
            />
          </label>
          <label className="block">
            <span className={labelClass}>Stock</span>
            <input
              name="stock"
              required
              type="number"
              min="0"
              step="1"
              defaultValue={product?.stock ?? 1}
              className={inputClass}
            />
          </label>
        </div>

        <label className="block">
          <span className={labelClass}>Category</span>
          <input
            name="category"
            required
            list="category-names"
            defaultValue={product?.categoryName ?? categories[0] ?? ""}
            placeholder="Bracelets"
            className={inputClass}
          />
          <datalist id="category-names">
            {categories.map((name) => (
              <option key={name} value={name} />
            ))}
          </datalist>
        </label>

        <label className="block">
          <span className={labelClass}>Description</span>
          <textarea
            name="description"
            required
            rows={5}
            defaultValue={product?.description ?? ""}
            className={inputClass}
          />
        </label>

        <label className="flex items-center gap-2 text-sm font-semibold">
          <input
            type="checkbox"
            name="available"
            defaultChecked={product?.available ?? true}
            className="h-4 w-4 accent-pink-deep"
          />
          Available to order
        </label>
        <label className="flex items-center gap-2 text-sm font-semibold">
          <input
            type="checkbox"
            name="featured"
            defaultChecked={product?.featured ?? false}
            className="h-4 w-4 accent-pink-deep"
          />
          Show on the home page
        </label>

        <button type="submit" className={btnPrimary} disabled={pending}>
          {pending ? "Saving…" : "Save product"}
        </button>
      </form>

      {product ? (
        <form
          action={deleteProduct}
          className="lg:pt-8"
          onSubmit={(event) => {
            if (!confirm("Delete this product?")) event.preventDefault();
          }}
        >
          <input type="hidden" name="id" value={product.id} />
          <button type="submit" className={btnGhost}>
            Delete product
          </button>
        </form>
      ) : null}
    </div>
  );
}
