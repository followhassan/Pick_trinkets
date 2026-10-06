import Link from "next/link";
import { canBuy, formatBdt } from "@/lib/format";

export type CardProduct = {
  title: string;
  slug: string;
  price: number | string | { toString(): string };
  imageUrl: string;
  stock: number;
  available: boolean;
};

export function ProductCard({ product }: { product: CardProduct }) {
  const soldOut = !canBuy(product);

  return (
    <Link href={`/product/${product.slug}`} className="group block">
      <div className="relative overflow-hidden rounded-2xl bg-white">
        <img
          src={product.imageUrl}
          alt={product.title}
          className="aspect-square w-full object-cover"
        />
        {soldOut ? (
          <span className="absolute left-3 top-3 rounded-full bg-ink px-2.5 py-1 text-xs font-bold text-white">
            Sold out
          </span>
        ) : null}
      </div>
      <h2 className="mt-3 font-serif text-lg leading-snug text-ink group-hover:underline">
        {product.title}
      </h2>
      <p className="mt-1 text-sm text-muted">{formatBdt(product.price)}</p>
    </Link>
  );
}
