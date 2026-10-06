import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { btnGhost, btnPrimary } from "@/lib/ui";
import { categoryOrder, site } from "@/lib/site";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const fallbackImages: Record<string, string> = {
  "phone-charms": "/products/enamel-flower-phone-charm.jpg",
  "bag-charms": "/products/berry-pearl-bag-charm.jpg",
  bracelets: "/products/cherry-pearl-bracelet.jpg",
};

export default async function HomePage() {
  const [featured, categories] = await Promise.all([
    prisma.product.findMany({
      where: { featured: true },
      orderBy: { title: "asc" },
      take: 8,
    }),
    prisma.category.findMany({
      include: {
        products: {
          take: 1,
          orderBy: { title: "asc" },
          select: { imageUrl: true },
        },
      },
    }),
  ]);

  const tiles = [...categories].sort((a, b) => {
    const rank = (slug: string) => {
      const index = categoryOrder.indexOf(slug);
      return index === -1 ? 99 : index;
    };
    return rank(a.slug) - rank(b.slug);
  });

  return (
    <div>
      <section className="grid items-center gap-10 md:grid-cols-2 md:gap-16 md:py-6">
        <div>
          <img
            src="/brand/logo.png"
            alt="Pick Trinkets"
            width={72}
            height={72}
            className="h-[4.5rem] w-[4.5rem] rounded-full object-cover"
          />
          <h1 className="mt-6 max-w-md font-serif text-4xl leading-tight md:text-5xl">
            Cute handmade accessories
          </h1>
          <p className="mt-4 max-w-md text-lg leading-relaxed text-muted">
            Phone charms, bag charms, and bracelets from Dhaka. Place an order here — we
            confirm by phone, then send it cash on delivery.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/shop" className={btnPrimary}>
              Shop
            </Link>
            <a href={site.instagram} target="_blank" rel="noreferrer" className={btnGhost}>
              Instagram
            </a>
          </div>
        </div>
        <img
          src="/products/pink-headphone-charm.jpg"
          alt="Pink headphone bag charm with a bow and pearls"
          className="aspect-square w-full rounded-3xl object-cover"
        />
      </section>

      <section className="mt-16 grid gap-4 sm:grid-cols-3">
        {tiles.map((category) => (
          <Link
            key={category.id}
            href={`/shop?category=${category.slug}`}
            className="overflow-hidden rounded-2xl bg-white"
          >
            <img
              src={category.products[0]?.imageUrl || fallbackImages[category.slug] || "/brand/placeholder.svg"}
              alt=""
              className="aspect-[4/3] w-full object-cover"
            />
            <span className="block px-4 py-3 font-serif text-xl">{category.name}</span>
          </Link>
        ))}
      </section>

      <section className="mt-16">
        <div className="mb-6 flex items-end justify-between gap-4">
          <h2 className="font-serif text-3xl">Pieces</h2>
          <Link href="/shop" className="text-sm font-bold">
            View all
          </Link>
        </div>
        {featured.length === 0 ? (
          <p className="text-muted">New pieces will show up here once they are added.</p>
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      <section className="mt-16 grid gap-8 border-t border-black/10 pt-10 md:grid-cols-3">
        <div>
          <p className="font-serif text-3xl">1</p>
          <h2 className="mt-2 font-semibold">Add to your bag</h2>
          <p className="mt-1 text-sm text-muted">Choose a ready-made charm or bracelet.</p>
        </div>
        <div>
          <p className="font-serif text-3xl">2</p>
          <h2 className="mt-2 font-semibold">Leave your phone</h2>
          <p className="mt-1 text-sm text-muted">Name, number, and where to send it.</p>
        </div>
        <div>
          <p className="font-serif text-3xl">3</p>
          <h2 className="mt-2 font-semibold">Pay on delivery</h2>
          <p className="mt-1 text-sm text-muted">We confirm the order, then the courier collects payment.</p>
        </div>
      </section>

      <p className="mt-10 text-sm text-muted">
        Want a custom colour or charm? Message{" "}
        <a href={site.instagram} className="font-bold text-ink" target="_blank" rel="noreferrer">
          {site.instagramHandle}
        </a>{" "}
        on Instagram.
      </p>
    </div>
  );
}
