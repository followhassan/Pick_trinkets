"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";
import { slugify } from "@/lib/slug";

function refresh() {
  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/admin/categories");
  revalidatePath("/admin/products");
}

export async function createCategory(formData: FormData) {
  await requireAdmin();
  const name = String(formData.get("name") || "").trim();
  const slug = slugify(name);
  if (!slug) return;
  const existing = await prisma.category.findUnique({ where: { slug } });
  if (existing) return;

  const last = await prisma.category.findFirst({ orderBy: { sortOrder: "desc" } });
  await prisma.category.create({
    data: { name, slug, sortOrder: (last?.sortOrder ?? -1) + 1 },
  });
  refresh();
}

export async function renameCategory(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  const name = String(formData.get("name") || "").trim();
  const slug = slugify(name);
  if (!id || !slug) return;

  const clash = await prisma.category.findFirst({ where: { slug, NOT: { id } } });
  if (clash) return;
  await prisma.category.update({ where: { id }, data: { name, slug } });
  refresh();
}

export async function deleteCategory(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  if (!id) return;
  const count = await prisma.product.count({ where: { categoryId: id } });
  if (count > 0) return;
  await prisma.category.delete({ where: { id } });
  refresh();
}

export async function moveCategory(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  const direction = String(formData.get("direction") || "");
  const categories = await prisma.category.findMany({
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  });
  const index = categories.findIndex((category) => category.id === id);
  const target = direction === "up" ? index - 1 : index + 1;
  if (index < 0 || target < 0 || target >= categories.length) return;

  const next = [...categories];
  const [item] = next.splice(index, 1);
  next.splice(target, 0, item);
  await prisma.$transaction(
    next.map((category, order) =>
      prisma.category.update({ where: { id: category.id }, data: { sortOrder: order } }),
    ),
  );
  refresh();
}
