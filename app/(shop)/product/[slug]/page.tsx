import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { addToCart } from "@/app/actions/cart";
import { ProductCard } from "@/components/product-card";
import { canBuy, formatBdt } from "@/lib/format";
import { site } from "@/lib/site";
import { prisma } from "@/lib/prisma";
import { btnPrimary, inputClass } from "@/lib/ui";

export const dynamic = "force-dynamic";

type Params = { slug: string };
type Search = { error?: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await prisma.product.findUnique({ where: { slug } });
  if (!product) return { title: "Not found" };
  return {
    title: product.title,
    description: product.description,
    openGraph: product.imageUrl.startsWith("data:")
      ? undefined
      : { images: [product.imageUrl] },
  };
}

export default async function ProductPage({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams: Promise<Search>;
}) {
  const { slug } = await params;
  const { error } = await searchParams;
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { category: true },
  });
  if (!product) notFound();

  const related = await prisma.product.findMany({
    where: { categoryId: product.categoryId, NOT: { id: product.id } },
    orderBy: { title: "asc" },
    take: 4,
  });

  const soldOut = !canBuy(product);

  return (
    <div>
      <article className="grid items-start gap-8 md:grid-cols-2 md:gap-14">
        <div className="relative overflow-hidden rounded-3xl bg-white">
          <img
            src={product.imageUrl}
            alt={product.title}
            className="aspect-square w-full object-cover"
          />
          {soldOut ? (
            <span className="absolute left-4 top-4 rounded-full bg-ink px-3 py-1 text-sm font-bold text-white">
              Sold out
            </span>
          ) : null}
        </div>

        <div>
          <Link href={`/shop?category=${product.category.slug}`} className="text-sm font-bold">
            {product.category.name}
          </Link>
          <h1 className="mt-2 font-serif text-4xl leading-tight">{product.title}</h1>
          <p className="mt-3 text-lg">{formatBdt(product.price)}</p>
          <p className="mt-5 whitespace-pre-wrap leading-relaxed text-muted">{product.description}</p>

          {error === "soldout" ? (
            <p role="alert" className="mt-4 text-sm font-semibold">
              That piece just sold out.
            </p>
          ) : null}

          {soldOut ? (
            <div className="mt-6">
              <p className="text-sm">Sold out for now. Custom versions are still open.</p>
              <a
                href={site.instagram}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-block text-sm font-bold"
              >
                Message on Instagram
              </a>
            </div>
          ) : (
            <form action={addToCart} className="mt-6 flex flex-wrap items-end gap-3">
              <input type="hidden" name="productId" value={product.id} />
              <label className="block">
                <span className="mb-1.5 block text-sm font-bold">Quantity</span>
                <input
                  type="number"
                  name="qty"
                  min={1}
                  max={Math.min(10, product.stock)}
                  defaultValue={1}
                  className={`${inputClass} w-24`}
                />
              </label>
              <button type="submit" className={btnPrimary}>
                Add to bag
              </button>
              <p className="w-full text-sm text-muted">
                {product.stock} in stock · Cash on delivery
              </p>
            </form>
          )}
        </div>
      </article>

      {related.length > 0 ? (
        <section className="mt-16">
          <h2 className="font-serif text-2xl">More {product.category.name.toLowerCase()}</h2>
          <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-4">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
