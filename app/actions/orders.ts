"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { readCart, writeCart } from "@/lib/cart";
import { OrderError, createOrder } from "@/lib/orders";

export type OrderFormState = { error?: string };

export async function placeOrder(
  _prev: OrderFormState,
  formData: FormData,
): Promise<OrderFormState> {
  const cart = await readCart();

  try {
    const order = await createOrder(
      {
        customerName: String(formData.get("customerName") || ""),
        phone: String(formData.get("phone") || ""),
        address: String(formData.get("address") || ""),
        area: String(formData.get("area") || ""),
        note: String(formData.get("note") || ""),
      },
      cart,
    );
    await writeCart({});
    revalidatePath("/shop");
    redirect(`/order/${order.code}`);
  } catch (error) {
    if (error instanceof OrderError) return { error: error.message };
    if (typeof error === "object" && error && "digest" in error) {
      const digest = String((error as { digest?: string }).digest ?? "");
      if (digest.startsWith("NEXT_REDIRECT")) throw error;
    }
    console.error(error);
    return { error: "We could not place that order. Please try again." };
  }
}
