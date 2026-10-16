import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { btnGhost, btnPrimary } from "@/lib/ui";
import { site } from "@/lib/site";
import { prisma } from "@/lib/prisma";
import { getShopSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

const fallbackImages = [
  "/products/pink-headphone-charm.jpg",
  "/products/berry-pearl-bag-charm.jpg",
  "/products/cherry-pearl-bracelet.jpg",
];

export default async function HomePage() {
  const [featured, newest, bestsellers, categories, settings] = await Promise.all([
    prisma.product.findMany({ where: { featured: true }, orderBy: { updatedAt: "desc" }, take: 8 }),
    prisma.product.findMany({ orderBy: [{ createdAt: "desc" }, { title: "asc" }], take: 4 }),
    prisma.product.findMany({ where: { bestseller: true }, orderBy: { title: "asc" }, take: 8 }),
    prisma.category.findMany({
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      include: {
        products: { take: 1, orderBy: { createdAt: "desc" }, select: { imageUrl: true } },
        _count: { select: { products: true } },
      },
    }),
    getShopSettings(),
  ]);

  const heroImages = [
    ...featured.map((product) => product.imageUrl),
    ...fallbackImages,
  ].slice(0, 3);

  return (
    <div>
      <section className="relative overflow-hidden rounded-[2rem] bg-white px-5 py-8 shadow-sm ring-1 ring-black/5 md:px-10 md:py-12">
        <div className="pointer-events-none absolute -left-10 -top-16 h-48 w-48 rounded-full bg-pink/30 blur-3xl animate-float" />
        <div className="pointer-events-none absolute -bottom-20 right-10 h-56 w-56 rounded-full bg-[#f8c6e2]/80 blur-3xl" />
        <div className="relative grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,28rem)]">
          <div className="animate-rise">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-pink-deep">
              {site.location}
            </p>
            <h1 className="mt-3 max-w-xl font-serif text-4xl leading-[1.05] md:text-6xl">
              {settings.heroTitle}
            </h1>
            <p className="mt-4 max-w-md text-lg leading-relaxed text-muted">{settings.heroSubtitle}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/shop" className={btnPrimary}>
                Shop the pieces
              </Link>
              <a href={site.instagram} target="_blank" rel="noreferrer" className={btnGhost}>
                Instagram
              </a>
            </div>
            <ul className="mt-8 flex flex-wrap gap-2 text-xs font-bold">
              {["Cash on delivery", "Made in Dhaka", "No online payment"].map((item) => (
                <li key={item} className="rounded-full bg-cream px-3 py-1.5">
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="relative mx-auto h-[22rem] w-full max-w-md animate-rise delay-150 sm:h-[26rem]">
            <img
              src={heroImages[0]}
              alt=""
              className="absolute left-6 top-4 h-64 w-52 rounded-[2rem] object-cover shadow-xl ring-4 ring-white animate-float sm:h-80 sm:w-64"
            />
            <img
              src={heroImages[1] || heroImages[0]}
              alt=""
              className="absolute bottom-2 right-0 h-36 w-28 rounded-3xl object-cover shadow-lg ring-4 ring-white animate-float delay-300 sm:h-44 sm:w-36"
            />
            <img
              src={heroImages[2] || heroImages[0]}
              alt=""
              className="absolute right-8 top-0 h-24 w-20 rounded-2xl object-cover shadow-lg ring-4 ring-white animate-float delay-500 sm:h-28 sm:w-24"
            />
          </div>
        </div>
      </section>

      <section className="mt-12 grid gap-4 sm:grid-cols-3">
        {categories.map((category, index) => (
          <Link
            key={category.id}
            href={`/shop?category=${category.slug}`}
            className="group overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-black/5 transition duration-300 hover:-translate-y-1 hover:shadow-lg animate-rise"
            style={{ animationDelay: `${index * 80}ms` }}
          >
            <img
              src={category.products[0]?.imageUrl || "/brand/placeholder.svg"}
              alt=""
              className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-105"
            />
            <span className="flex items-baseline justify-between px-4 py-3">
              <span className="font-serif text-xl">{category.name}</span>
              <span className="text-xs font-bold text-muted">{category._count.products}</span>
            </span>
          </Link>
        ))}
      </section>

      <ProductSection
        title="Featured"
        href="/shop"
        products={featured}
        lowStockAt={settings.lowStockThreshold}
        empty="Featured pieces show up here when you mark them in the staff area."
      />
      <ProductSection
        title="New arrivals"
        href="/shop?sort=new"
        products={newest}
        lowStockAt={settings.lowStockThreshold}
        empty="New pieces will land here as soon as they are added."
      />
      <ProductSection
        title="Bestsellers"
        href="/shop"
        products={bestsellers}
        lowStockAt={settings.lowStockThreshold}
        empty="Mark a few favourites as bestsellers and they will gather here."
      />

      <section className="mt-16 grid gap-4 md:grid-cols-3">
        {[
          ["1", "Add to your bag", "Choose a ready-made charm or bracelet."],
          ["2", "Leave your phone", "Name, number, and where to send it."],
          ["3", "Pay on delivery", "We confirm the order, then the courier collects payment."],
        ].map(([step, title, copy]) => (
          <div key={step} className="rounded-3xl bg-white p-5 ring-1 ring-black/5">
            <p className="font-serif text-3xl text-pink-deep">{step}</p>
            <h2 className="mt-2 font-semibold">{title}</h2>
            <p className="mt-1 text-sm text-muted">{copy}</p>
          </div>
        ))}
      </section>

      <section className="mt-8 overflow-hidden rounded-[2rem] bg-ink px-6 py-10 text-white md:px-10">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-pink">Say hello</p>
        <h2 className="mt-2 max-w-lg font-serif text-3xl md:text-4xl">
          Want a custom colour or charm?
        </h2>
        <p className="mt-3 max-w-md text-white/75">
          Message {site.instagramHandle} and we will make one with you.
        </p>
        <a
          href={site.instagram}
          target="_blank"
          rel="noreferrer"
          className="mt-6 inline-flex rounded-full bg-pink px-5 py-2.5 text-sm font-bold text-black"
        >
          Instagram
        </a>
      </section>
    </div>
  );
}

function ProductSection({
  title,
  href,
  products,
  empty,
  lowStockAt,
}: {
  title: string;
  href: string;
  products: Array<{
    id: string;
    title: string;
    slug: string;
    price: { toString(): string };
    imageUrl: string;
    stock: number;
    available: boolean;
    bestseller: boolean;
    featured: boolean;
  }>;
  empty: string;
  lowStockAt: number;
}) {
  return (
    <section className="mt-16">
      <div className="mb-6 flex items-end justify-between gap-4">
        <h2 className="font-serif text-3xl">{title}</h2>
        <Link href={href} className="text-sm font-bold">
          View all
        </Link>
      </div>
      {products.length === 0 ? (
        <div className="rounded-3xl bg-white px-6 py-10 text-center ring-1 ring-black/5">
          <p className="text-muted">{empty}</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} lowStockAt={lowStockAt} />
          ))}
        </div>
      )}
    </section>
  );
}
