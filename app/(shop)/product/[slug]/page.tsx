import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { addToCart } from "@/app/actions/cart";
import { ProductCard } from "@/components/product-card";
import { ProductGallery } from "@/components/product-gallery";
import { galleryUrls } from "@/lib/catalog";
import { canBuy, formatBdt } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import { getShopSettings } from "@/lib/settings";
import { site } from "@/lib/site";
import { whatsappHref } from "@/lib/whatsapp";
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
    include: { category: true, images: { orderBy: { sortOrder: "asc" } } },
  });
  if (!product) notFound();

  const [related, settings] = await Promise.all([
    prisma.product.findMany({
      where: { categoryId: product.categoryId, NOT: { id: product.id } },
      orderBy: [{ bestseller: "desc" }, { createdAt: "desc" }],
      take: 4,
    }),
    getShopSettings(),
  ]);

  const soldOut = !canBuy(product);
  const whatsapp = whatsappHref(
    settings.contactPhone,
    `Hi Pick Trinkets! Is ${product.title} available?`,
  );

  return (
    <div>
      <article className="grid items-start gap-8 md:grid-cols-2 md:gap-14">
        <ProductGallery images={galleryUrls(product)} title={product.title} soldOut={soldOut} />

        <div className="animate-rise">
          <Link href={`/shop?category=${product.category.slug}`} className="text-sm font-bold">
            {product.category.name}
          </Link>
          <h1 className="mt-2 font-serif text-4xl leading-tight">{product.title}</h1>
          <p className="mt-3 text-lg">{formatBdt(product.price)}</p>
          <div className="mt-3 flex flex-wrap gap-2 text-xs font-bold">
            {product.bestseller ? <span className="rounded-full bg-pink px-2.5 py-1">Bestseller</span> : null}
            {product.featured ? <span className="rounded-full bg-white px-2.5 py-1 ring-1 ring-black/10">Featured</span> : null}
            <span className="rounded-full bg-white px-2.5 py-1 ring-1 ring-black/10">Cash on delivery</span>
          </div>
          <p className="mt-5 whitespace-pre-wrap leading-relaxed text-muted">{product.description}</p>

          {error === "soldout" ? (
            <p role="alert" className="mt-4 text-sm font-semibold">
              That piece just sold out.
            </p>
          ) : null}

          {soldOut ? (
            <div className="mt-6 rounded-3xl bg-white p-5 ring-1 ring-black/5">
              <p className="text-sm">Sold out for now. Custom versions are still open.</p>
              <div className="mt-3 flex flex-wrap gap-4 text-sm font-bold">
                <a href={site.instagram} target="_blank" rel="noreferrer">
                  Message on Instagram
                </a>
                {whatsapp ? (
                  <a href={whatsapp} target="_blank" rel="noreferrer">
                    WhatsApp us
                  </a>
                ) : null}
              </div>
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
                {product.stock} in stock
                {product.stock <= settings.lowStockThreshold ? " · going fast" : ""} · Prices in BDT
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
              <ProductCard key={item.id} product={item} lowStockAt={settings.lowStockThreshold} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
