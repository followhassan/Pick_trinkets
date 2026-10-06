import { cookies } from "next/headers";

export const CART_COOKIE = "pt_cart";

export type CartMap = Record<string, number>;

export async function readCart(): Promise<CartMap> {
  const jar = await cookies();
  const raw = jar.get(CART_COOKIE)?.value;
  if (!raw) return {};

  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") return {};
    const clean: CartMap = {};
    for (const [id, qty] of Object.entries(parsed)) {
      const count = Number(qty);
      if (id && Number.isInteger(count) && count > 0 && count <= 10) {
        clean[id] = count;
      }
    }
    return clean;
  } catch {
    return {};
  }
}

export async function writeCart(cart: CartMap) {
  const jar = await cookies();
  const entries = Object.entries(cart).filter(([, qty]) => qty > 0);
  if (entries.length === 0) {
    jar.delete(CART_COOKIE);
    return;
  }

  jar.set(CART_COOKIE, JSON.stringify(Object.fromEntries(entries)), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 14,
  });
}

export function cartCount(cart: CartMap) {
  return Object.values(cart).reduce((sum, qty) => sum + qty, 0);
}
