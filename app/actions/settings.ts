"use server";

import { revalidatePath } from "next/cache";
import { isBdPhone } from "@/lib/phone";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";

export type SettingsState = { error?: string; saved?: boolean };

const limit = (value: string, max: number) => value.trim().slice(0, max);

export async function saveShopSettings(
  _prev: SettingsState,
  formData: FormData,
): Promise<SettingsState> {
  await requireAdmin();

  const announcement = limit(String(formData.get("announcement") || ""), 180);
  const heroTitle = limit(String(formData.get("heroTitle") || ""), 80);
  const heroSubtitle = limit(String(formData.get("heroSubtitle") || ""), 280);
  const contactPhone = limit(String(formData.get("contactPhone") || ""), 20);
  const deliveryCharge = Number(formData.get("deliveryCharge"));
  const lowStockThreshold = Math.floor(Number(formData.get("lowStockThreshold")));

  if (announcement.length < 3) return { error: "Write a short announcement for the pink bar." };
  if (heroTitle.length < 3) return { error: "Add a homepage title." };
  if (heroSubtitle.length < 8) return { error: "Add a homepage subtitle." };
  if (contactPhone && !isBdPhone(contactPhone)) {
    return { error: "Use a Bangladeshi mobile number, like 01XXXXXXXXX." };
  }
  if (!Number.isFinite(deliveryCharge) || deliveryCharge < 0 || deliveryCharge > 5000) {
    return { error: "Delivery charge must be between 0 and 5000 BDT." };
  }
  if (!Number.isFinite(lowStockThreshold) || lowStockThreshold < 0 || lowStockThreshold > 100) {
    return { error: "Low-stock alert must be between 0 and 100." };
  }

  await prisma.shopSetting.upsert({
    where: { id: "shop" },
    update: {
      announcement,
      heroTitle,
      heroSubtitle,
      contactPhone,
      deliveryCharge,
      lowStockThreshold,
    },
    create: {
      id: "shop",
      announcement,
      heroTitle,
      heroSubtitle,
      contactPhone,
      deliveryCharge,
      lowStockThreshold,
    },
  });

  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/cart");
  revalidatePath("/admin");
  revalidatePath("/admin/settings");
  return { saved: true };
}
