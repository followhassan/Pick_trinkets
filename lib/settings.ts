import { cache } from "react";
import { prisma } from "./prisma";

export const defaultSettings = {
  id: "shop",
  announcement: "Handmade in Dhaka · Cash on delivery · No online payment",
  heroTitle: "Cute handmade accessories",
  heroSubtitle:
    "Phone charms, bag charms, and bracelets from Dhaka. Place an order here — we confirm by phone, then send it cash on delivery.",
  contactPhone: "",
  deliveryCharge: 0,
  lowStockThreshold: 3,
};

export type ShopSettings = typeof defaultSettings & { updatedAt: Date };

export const getShopSettings = cache(async (): Promise<ShopSettings> => {
  const row = await prisma.shopSetting.findUnique({ where: { id: "shop" } });
  if (!row) return { ...defaultSettings, updatedAt: new Date() };
  return {
    id: row.id,
    announcement: row.announcement,
    heroTitle: row.heroTitle,
    heroSubtitle: row.heroSubtitle,
    contactPhone: row.contactPhone,
    deliveryCharge: Number(row.deliveryCharge),
    lowStockThreshold: row.lowStockThreshold,
    updatedAt: row.updatedAt,
  };
});
