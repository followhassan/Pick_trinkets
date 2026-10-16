-- Additive shop upgrade. Existing products, categories, and orders are kept.

ALTER TABLE "categories" ADD COLUMN "sort_order" INTEGER NOT NULL DEFAULT 0;

ALTER TABLE "products" ADD COLUMN "bestseller" BOOLEAN NOT NULL DEFAULT false;

CREATE INDEX "products_created_at_idx" ON "products"("created_at");

ALTER TABLE "orders" ADD COLUMN "delivery_charge" DECIMAL(10,2) NOT NULL DEFAULT 0;

CREATE TABLE "product_images" (
    "id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_images_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "product_images_product_id_sort_order_idx" ON "product_images"("product_id", "sort_order");

ALTER TABLE "product_images" ADD CONSTRAINT "product_images_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "shop_settings" (
    "id" TEXT NOT NULL,
    "announcement" TEXT NOT NULL,
    "hero_title" TEXT NOT NULL,
    "hero_subtitle" TEXT NOT NULL,
    "contact_phone" TEXT NOT NULL DEFAULT '',
    "delivery_charge" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "low_stock_threshold" INTEGER NOT NULL DEFAULT 3,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "shop_settings_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "order_status_events" (
    "id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "from_status" "OrderStatus",
    "to_status" "OrderStatus" NOT NULL,
    "note" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "order_status_events_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "order_status_events_order_id_created_at_idx" ON "order_status_events"("order_id", "created_at");

ALTER TABLE "order_status_events" ADD CONSTRAINT "order_status_events_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Keep the public category order the shop already uses.
UPDATE "categories" SET "sort_order" = CASE "slug"
  WHEN 'phone-charms' THEN 0
  WHEN 'bag-charms' THEN 1
  WHEN 'bracelets' THEN 2
  ELSE "sort_order"
END;

-- Flag a few existing pieces as bestsellers. Other products stay as they are.
UPDATE "products" SET "bestseller" = true
WHERE "slug" IN (
  'pink-headphone-charm',
  'berry-pearl-bag-charm',
  'pearl-bow-bracelet',
  'flower-bead-bracelets',
  'cherry-pearl-bracelet'
);

INSERT INTO "shop_settings" (
  "id",
  "announcement",
  "hero_title",
  "hero_subtitle",
  "contact_phone",
  "delivery_charge",
  "low_stock_threshold",
  "updated_at"
) VALUES (
  'shop',
  'Handmade in Dhaka · Cash on delivery · No online payment',
  'Cute handmade accessories',
  'Phone charms, bag charms, and bracelets from Dhaka. Place an order here — we confirm by phone, then send it cash on delivery.',
  '',
  0,
  3,
  CURRENT_TIMESTAMP
);

-- One history row per existing order so the timeline is not empty after deploy.
INSERT INTO "order_status_events" ("id", "order_id", "from_status", "to_status", "note", "created_at")
SELECT 'hist_' || "id", "id", NULL, "status", NULL, "created_at"
FROM "orders";
