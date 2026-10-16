import {
  createCategory,
  deleteCategory,
  moveCategory,
  renameCategory,
} from "@/app/actions/categories";
import { prisma } from "@/lib/prisma";
import { btnPrimary, inputClass } from "@/lib/ui";

export const dynamic = "force-dynamic";
export const metadata = { title: "Categories" };

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    include: { _count: { select: { products: true } } },
  });

  return (
    <div>
      <h1 className="font-serif text-4xl">Categories</h1>
      <p className="mt-2 max-w-xl text-muted">
        These chips appear on the shop. A category with products cannot be deleted.
      </p>

      <form action={createCategory} className="mt-6 flex max-w-lg flex-col gap-2 sm:flex-row">
        <input name="name" required placeholder="New category" className={inputClass} />
        <button type="submit" className={btnPrimary}>
          Add
        </button>
      </form>

      {categories.length === 0 ? (
        <p className="mt-10 text-muted">No categories yet.</p>
      ) : (
        <ul className="mt-8 max-w-2xl divide-y divide-black/10">
          {categories.map((category, index) => (
            <li key={category.id} className="flex flex-wrap items-center gap-3 py-4">
              <form action={renameCategory} className="flex min-w-0 flex-1 items-center gap-2">
                <input type="hidden" name="id" value={category.id} />
                <input name="name" defaultValue={category.name} required className={inputClass} />
                <button type="submit" className="text-sm font-bold">
                  Save
                </button>
              </form>
              <p className="text-sm text-muted">{category._count.products} pieces</p>
              <form action={moveCategory} className="flex gap-1">
                <input type="hidden" name="id" value={category.id} />
                <button
                  type="submit"
                  name="direction"
                  value="up"
                  disabled={index === 0}
                  className="rounded-full bg-white px-2 py-1 text-sm font-bold disabled:opacity-30"
                  aria-label={`Move ${category.name} up`}
                >
                  Up
                </button>
                <button
                  type="submit"
                  name="direction"
                  value="down"
                  disabled={index === categories.length - 1}
                  className="rounded-full bg-white px-2 py-1 text-sm font-bold disabled:opacity-30"
                  aria-label={`Move ${category.name} down`}
                >
                  Down
                </button>
              </form>
              {category._count.products === 0 ? (
                <form action={deleteCategory}>
                  <input type="hidden" name="id" value={category.id} />
                  <button type="submit" className="text-sm font-bold text-muted">
                    Delete
                  </button>
                </form>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}