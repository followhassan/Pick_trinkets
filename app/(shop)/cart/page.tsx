import Link from "next/link";
import { updateCart } from "@/app/actions/cart";
import { OrderForm } from "@/components/order-form";
import { formatBdt } from "@/lib/format";
import { readCart } from "@/lib/cart";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata = { title: "Place order" };

export default async function CartPage({
  searchParams,
}: {
  searchParams: Promise<{ added?: string }>;
}) {
  const { added } = await searchParams;
  const cart = await readCart();
  const ids = Object.keys(cart);
  const products = ids.length
    ? await prisma.product.findMany({ where: { id: { in: ids } } })
    : [];

  const byId = new Map(products.map((product) => [product.id, product]));
  const lines = ids.map((id) => ({
    id,
    product: byId.get(id) ?? null,
    qty: cart[id] ?? 0,
  }));

  const subtotal = lines.reduce((sum, line) => {
    if (!line.product) return sum;
    return sum + Number(line.product.price) * line.qty;
  }, 0);

  return (
    <div>
      <h1 className="font-serif text-4xl">Place an order</h1>
      <p className="mt-2 max-w-xl text-muted">
        Leave your name and phone. We confirm the order, then send it cash on delivery.
      </p>
      {added ? <p className="mt-4 text-sm font-bold">Added to your bag.</p> : null}

      {lines.length === 0 ? (
        <div className="mt-10 rounded-2xl bg-white px-6 py-12">
          <h2 className="font-serif text-2xl">Your bag is empty</h2>
          <Link href="/shop" className="mt-4 inline-block font-bold">
            Shop pieces
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <ul className="divide-y divide-black/10">
            {lines.map((line) => (
              <li key={line.id} className="flex gap-4 py-5">
                {line.product ? (
                  <img
                    src={line.product.imageUrl}
                    alt=""
                    className="h-24 w-24 rounded-2xl object-cover"
                  />
                ) : (
                  <div className="h-24 w-24 rounded-2xl bg-white" />
                )}
                <div className="min-w-0 flex-1">
                  {line.product ? (
                    <Link href={`/product/${line.product.slug}`} className="font-semibold">
                      {line.product.title}
                    </Link>
                  ) : (
                    <p className="font-semibold">This piece is no longer in the shop</p>
                  )}
                  {line.product ? (
                    <p className="mt-1 text-sm text-muted">{formatBdt(line.product.price)}</p>
                  ) : null}
                  {line.product && line.qty > line.product.stock ? (
                    <p className="mt-1 text-sm font-semibold">
                      Only {line.product.stock} left. Lower the quantity before ordering.
                    </p>
                  ) : null}
                  <form action={updateCart} className="mt-3 flex flex-wrap items-center gap-2">
                    <input type="hidden" name="productId" value={line.id} />
                    <button
                      type="submit"
                      name="op"
                      value="dec"
                      className="grid h-8 w-8 place-items-center rounded-full bg-white font-bold"
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <span className="min-w-6 text-center text-sm font-bold">{line.qty}</span>
                    <button
                      type="submit"
                      name="op"
                      value="inc"
                      className="grid h-8 w-8 place-items-center rounded-full bg-white font-bold"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                    <button
                      type="submit"
                      name="op"
                      value="remove"
                      className="ml-2 text-sm font-bold text-muted"
                    >
                      Remove
                    </button>
                  </form>
                </div>
                {line.product ? (
                  <p className="text-sm font-bold">
                    {formatBdt(Number(line.product.price) * line.qty)}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>

          <aside className="rounded-3xl bg-white p-5">
            <div className="mb-5 flex items-baseline justify-between">
              <h2 className="font-serif text-2xl">Your details</h2>
              <p className="font-bold">{formatBdt(subtotal)}</p>
            </div>
            <OrderForm />
          </aside>
        </div>
      )}
    </div>
  );
}
