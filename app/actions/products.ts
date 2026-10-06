"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ImageError, storeProductImage } from "@/lib/images";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";
import { slugify } from "@/lib/slug";

export type ProductFormState = { error?: string };

class ProductFormError extends Error {}

function checked(formData: FormData, name: string) {
  const value = formData.get(name);
  return value === "on" || value === "true" || value === "1";
}

async function upsertProduct(formData: FormData) {
  const id = String(formData.get("id") || "");
  const title = String(formData.get("title") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const categoryName = String(formData.get("category") || "").trim();
  const price = Number(formData.get("price"));
  const stock = Math.floor(Number(formData.get("stock")));

  if (title.length < 2) throw new ProductFormError("Add a title.");
  if (description.length < 8) throw new ProductFormError("Add a short description.");
  if (!Number.isFinite(price) || price < 0) throw new ProductFormError("Enter a price in BDT.");
  if (!Number.isFinite(stock) || stock < 0) throw new ProductFormError("Stock must be zero or more.");

  const categorySlug = slugify(categoryName);
  if (!categorySlug) throw new ProductFormError("Add a category, like Bracelets.");

  const slug = slugify(title);
  if (!slug) throw new ProductFormError("Use a title with letters or numbers.");

  const clash = await prisma.product.findFirst({
    where: { slug, ...(id ? { NOT: { id } } : {}) },
  });
  if (clash) {
    throw new ProductFormError("A product with that name already exists. Change the title slightly.");
  }

  let category = await prisma.category.findUnique({ where: { slug: categorySlug } });
  if (!category) {
    category = await prisma.category.create({
      data: { name: categoryName, slug: categorySlug },
    });
  }

  const existing = id
    ? await prisma.product.findUnique({ where: { id } })
    : null;
  if (id && !existing) throw new ProductFormError("That product no longer exists.");

  let imageUrl = existing?.imageUrl ?? "";
  const file = formData.get("image");
  if (file instanceof File && file.size > 0) {
    imageUrl = await storeProductImage(file);
  }
  if (!imageUrl) throw new ProductFormError("Add a product photo.");

  const data = {
    title,
    slug,
    description,
    price,
    stock,
    available: checked(formData, "available"),
    featured: checked(formData, "featured"),
    imageUrl,
    categoryId: category.id,
  };

  if (existing) {
    await prisma.product.update({ where: { id: existing.id }, data });
    return existing.slug;
  }

  const created = await prisma.product.create({ data });
  return created.slug;
}

export async function saveProduct(
  _prev: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  await requireAdmin();

  try {
    const slug = await upsertProduct(formData);
    revalidatePath("/");
    revalidatePath("/shop");
    revalidatePath(`/product/${slug}`);
  } catch (error) {
    if (error instanceof ProductFormError || error instanceof ImageError) {
      return { error: error.message };
    }
    console.error(error);
    return { error: "Could not save the product. Please try again." };
  }

  redirect("/admin/products");
}

export async function deleteProduct(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  if (!id) redirect("/admin/products");

  const product = await prisma.product.findUnique({ where: { id } });
  if (product) {
    await prisma.product.delete({ where: { id } });
    revalidatePath("/");
    revalidatePath("/shop");
    revalidatePath(`/product/${product.slug}`);
  }
  redirect("/admin/products");
}

export async function updateOrderStatus(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  const status = String(formData.get("status") || "");
  if (!id || !["NEW", "PROCESSING", "DONE"].includes(status)) {
    redirect("/admin/orders");
  }

  await prisma.order.update({
    where: { id },
    data: { status: status as "NEW" | "PROCESSING" | "DONE" },
  });
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${id}`);
  redirect(`/admin/orders/${id}`);
}
