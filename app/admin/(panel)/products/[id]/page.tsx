import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/product-form";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const metadata = { title: "Edit product" };

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id }, include: { category: true } }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);
  if (!product) notFound();

  return (
    <div>
      <Link href="/admin/products" className="text-sm font-bold">
        All products
      </Link>
      <h1 className="mt-2 font-serif text-4xl">Edit product</h1>
      <div className="mt-8">
        <ProductForm
          categories={categories.map((category) => category.name)}
          product={{
            id: product.id,
            title: product.title,
            description: product.description,
            price: Number(product.price).toString(),
            stock: product.stock,
            available: product.available,
            featured: product.featured,
            imageUrl: product.imageUrl,
            categoryName: product.category.name,
          }}
        />
      </div>
    </div>
  );
}
