import Link from "next/link";
import { logout } from "@/app/actions/auth";
import { requireAdmin } from "@/lib/session";

export const dynamic = "force-dynamic";

export const metadata = {
  title: { default: "Staff", template: "%s · Staff" },
  robots: { index: false, follow: false },
};

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/settings", label: "Settings" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();

  return (
    <div className="min-h-screen">
      <header className="border-b border-black/5 bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-5 gap-y-2 px-5 py-4">
          <Link href="/admin" className="font-serif text-xl">
            Pick Trinkets
          </Link>
          <nav className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm font-bold">
            {links.map((link) => (
              <Link key={link.href} href={link.href}>
                {link.label}
              </Link>
            ))}
            <Link href="/" className="font-semibold text-muted">
              View shop
            </Link>
          </nav>
          <form action={logout} className="ml-auto">
            <button type="submit" className="text-sm font-bold">
              Log out
            </button>
          </form>
        </div>
      </header>
      <main id="main" className="mx-auto w-full max-w-6xl px-5 py-8">
        {children}
      </main>
    </div>
  );
}