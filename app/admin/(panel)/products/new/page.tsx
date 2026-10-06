import Link from "next/link";
import { ProductForm } from "@/components/admin/product-form";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const metadata = { title: "New product" };

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

  return (
    <div>
      <Link href="/admin/products" className="text-sm font-bold">
        All products
      </Link>
      <h1 className="mt-2 font-serif text-4xl">New product</h1>
      <div className="mt-8">
        <ProductForm categories={categories.map((category) => category.name)} />
      </div>
    </div>
  );
}
