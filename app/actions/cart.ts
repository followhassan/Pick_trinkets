"use server";

import { redirect } from "next/navigation";
import { readCart, writeCart } from "@/lib/cart";
import { prisma } from "@/lib/prisma";

export async function addToCart(formData: FormData) {
  const id = String(formData.get("productId") || "");
  const requested = Math.min(10, Math.max(1, Math.floor(Number(formData.get("qty") || 1))));
  const product = await prisma.product.findUnique({ where: { id } });

  if (!product) redirect("/shop");
  if (!product.available || product.stock <= 0) {
    redirect(`/product/${product.slug}?error=soldout`);
  }

  const cart = await readCart();
  const nextQty = Math.min(product.stock, (cart[id] ?? 0) + requested);
  if (nextQty <= 0) redirect(`/product/${product.slug}?error=soldout`);

  cart[id] = nextQty;
  await writeCart(cart);
  redirect("/cart?added=1");
}

export async function updateCart(formData: FormData) {
  const id = String(formData.get("productId") || "");
  const op = String(formData.get("op") || "");
  const cart = await readCart();
  const current = cart[id] ?? 0;

  if (op === "remove" || current <= 0) {
    delete cart[id];
  } else if (op === "dec") {
    const next = current - 1;
    if (next <= 0) delete cart[id];
    else cart[id] = next;
  } else if (op === "inc") {
    const product = await prisma.product.findUnique({ where: { id } });
    const cap = product && product.available ? Math.min(10, product.stock) : current;
    cart[id] = Math.min(cap, current + 1);
  }

  await writeCart(cart);
  redirect("/cart");
}
