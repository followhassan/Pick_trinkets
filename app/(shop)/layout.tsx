import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { cartCount, readCart } from "@/lib/cart";

export const dynamic = "force-dynamic";

export default async function ShopLayout({ children }: { children: React.ReactNode }) {
  const count = cartCount(await readCart());

  return (
    <div className="flex min-h-screen flex-col">
      <p className="bg-pink px-4 py-2 text-center text-sm font-bold">
        Handmade in Dhaka · Cash on delivery · No online payment
      </p>
      <SiteHeader count={count} />
      <main id="main" className="mx-auto w-full max-w-6xl flex-1 px-5 py-10">
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
