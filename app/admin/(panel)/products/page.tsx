import Link from "next/link";
import { ProductTable } from "@/components/admin/product-table";
import { prisma } from "@/lib/prisma";
import { getShopSettings } from "@/lib/settings";
import { btnPrimary } from "@/lib/ui";

export const dynamic = "force-dynamic";
export const metadata = { title: "Products" };

export default async function AdminProductsPage() {
  const [products, settings] = await Promise.all([
    prisma.product.findMany({
      include: { category: true },
      orderBy: { updatedAt: "desc" },
    }),
    getShopSettings(),
  ]);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-4xl">Products</h1>
          <p className="mt-2 text-muted">
            {products.length} pieces · low stock at {settings.lowStockThreshold} or below
          </p>
        </div>
        <Link href="/admin/products/new" className={btnPrimary}>
          Add product
        </Link>
      </div>
      <ProductTable
        products={products.map((product) => ({
          id: product.id,
          title: product.title,
          price: Number(product.price),
          stock: product.stock,
          available: product.available,
          featured: product.featured,
          bestseller: product.bestseller,
          imageUrl: product.imageUrl,
          categoryName: product.category.name,
          low: product.stock <= settings.lowStockThreshold,
        }))}
      />
    </div>
  );
}