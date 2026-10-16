import { ContactDock } from "@/components/contact-dock";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { cartCount, readCart } from "@/lib/cart";
import { getShopSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

export default async function ShopLayout({ children }: { children: React.ReactNode }) {
  const [cart, settings] = await Promise.all([readCart(), getShopSettings()]);
  const count = cartCount(cart);

  return (
    <div className="flex min-h-screen flex-col">
      {settings.announcement.trim() ? (
        <p className="bg-pink px-4 py-2 text-center text-sm font-bold">{settings.announcement}</p>
      ) : null}
      <SiteHeader count={count} />
      <main id="main" className="mx-auto w-full max-w-6xl flex-1 px-5 py-8 md:py-10">
        {children}
      </main>
      <SiteFooter />
      <ContactDock phone={settings.contactPhone} />
    </div>
  );
}