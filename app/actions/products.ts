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
    const last = await prisma.category.findFirst({ orderBy: { sortOrder: "desc" } });
    category = await prisma.category.create({
      data: { name: categoryName, slug: categorySlug, sortOrder: (last?.sortOrder ?? -1) + 1 },
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
    bestseller: checked(formData, "bestseller"),
    imageUrl,
    categoryId: category.id,
  };

  const saved = existing
    ? await prisma.product.update({ where: { id: existing.id }, data })
    : await prisma.product.create({ data });

  const removeIds = formData
    .getAll("removeImage")
    .map((value) => String(value))
    .filter(Boolean);
  if (removeIds.length > 0) {
    await prisma.productImage.deleteMany({
      where: { productId: saved.id, id: { in: removeIds } },
    });
  }

  const extraFiles = formData
    .getAll("extraImages")
    .filter((file): file is File => file instanceof File && file.size > 0);
  if (extraFiles.length > 0) {
    const remaining = await prisma.productImage.count({ where: { productId: saved.id } });
    if (remaining + extraFiles.length > 5) {
      throw new ProductFormError("Keep extra photos to 5. Remove one before adding more.");
    }
    for (const [index, file] of extraFiles.entries()) {
      const url = await storeProductImage(file);
      await prisma.productImage.create({
        data: { productId: saved.id, url, sortOrder: remaining + index },
      });
    }
  }

  return saved.slug;
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
  const note = String(formData.get("note") || "").trim().slice(0, 300);
  if (!id || !["NEW", "PROCESSING", "DONE"].includes(status)) {
    redirect("/admin/orders");
  }

  const order = await prisma.order.findUnique({ where: { id } });
  if (!order) redirect("/admin/orders");

  const nextStatus = status as "NEW" | "PROCESSING" | "DONE";
  if (order.status !== nextStatus || note) {
    await prisma.$transaction([
      prisma.order.update({ where: { id }, data: { status: nextStatus } }),
      prisma.orderStatusEvent.create({
        data: {
          orderId: id,
          fromStatus: order.status,
          toStatus: nextStatus,
          note: note || null,
        },
      }),
    ]);
  }

  revalidatePath("/admin");
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${id}`);
  revalidatePath(`/order/${order.code}`);
  revalidatePath("/track");
  redirect(`/admin/orders/${id}`);
}

export async function updateStock(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  const stock = Math.floor(Number(formData.get("stock")));
  if (!id || !Number.isFinite(stock) || stock < 0 || stock > 9999) return;

  await prisma.product.update({ where: { id }, data: { stock } });
  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/admin");
  revalidatePath("/admin/products");
}

export async function bulkUpdateProducts(formData: FormData) {
  await requireAdmin();
  const ids = formData.getAll("ids").map((value) => String(value)).filter(Boolean);
  const action = String(formData.get("bulk") || "");
  if (ids.length === 0) return;

  const where = { id: { in: ids } };
  if (action === "delete") {
    await prisma.product.deleteMany({ where });
  } else if (action === "feature") {
    await prisma.product.updateMany({ where, data: { featured: true } });
  } else if (action === "unfeature") {
    await prisma.product.updateMany({ where, data: { featured: false } });
  } else if (action === "bestseller") {
    await prisma.product.updateMany({ where, data: { bestseller: true } });
  } else if (action === "unbestseller") {
    await prisma.product.updateMany({ where, data: { bestseller: false } });
  } else if (action === "available") {
    await prisma.product.updateMany({ where, data: { available: true } });
  } else if (action === "unavailable") {
    await prisma.product.updateMany({ where, data: { available: false } });
  } else {
    return;
  }

  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/admin");
  revalidatePath("/admin/products");
}
