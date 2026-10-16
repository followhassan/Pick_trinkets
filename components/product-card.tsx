import Link from "next/link";
import { QuickAdd } from "@/components/quick-add";
import { canBuy, formatBdt } from "@/lib/format";

export type CardProduct = {
  id: string;
  title: string;
  slug: string;
  price: number | string | { toString(): string };
  imageUrl: string;
  stock: number;
  available: boolean;
  bestseller?: boolean;
  featured?: boolean;
};

export function ProductCard({
  product,
  lowStockAt = 3,
}: {
  product: CardProduct;
  lowStockAt?: number;
}) {
  const soldOut = !canBuy(product);
  const low = !soldOut && product.stock <= lowStockAt;

  return (
    <article className="group">
      <Link href={`/product/${product.slug}`} className="block">
        <div className="card-media relative overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5 transition duration-300 group-hover:-translate-y-1 group-hover:shadow-lg">
          <img
            src={product.imageUrl}
            alt={product.title}
            className="aspect-square w-full object-cover transition duration-500 group-hover:scale-105"
          />
          {soldOut ? (
            <span className="absolute left-3 top-3 rounded-full bg-ink px-2.5 py-1 text-xs font-bold text-white">
              Sold out
            </span>
          ) : product.bestseller ? (
            <span className="absolute left-3 top-3 rounded-full bg-pink px-2.5 py-1 text-xs font-bold">
              Bestseller
            </span>
          ) : product.featured ? (
            <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-bold">
              Featured
            </span>
          ) : null}
        </div>
        <h2 className="mt-3 font-serif text-lg leading-snug text-ink group-hover:underline">
          {product.title}
        </h2>
        <p className="mt-1 text-sm text-muted">
          {formatBdt(product.price)}
          {low ? <span className="ml-2 font-bold text-pink-deep">{product.stock} left</span> : null}
        </p>
      </Link>
      {soldOut ? null : <QuickAdd productId={product.id} />}
    </article>
  );
}
