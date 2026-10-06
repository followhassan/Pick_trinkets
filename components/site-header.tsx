import Link from "next/link";
import { MobileNav } from "@/components/mobile-nav";
import { site } from "@/lib/site";

export function SiteHeader({ count }: { count: number }) {
  return (
    <header className="sticky top-0 z-20 border-b border-black/5 bg-white">
      <div className="relative mx-auto flex max-w-6xl items-center gap-3 px-5 py-3">
        <MobileNav />
        <Link href="/" className="flex items-center gap-2.5">
          <img
            src="/brand/logo.png"
            alt=""
            width={40}
            height={40}
            className="h-10 w-10 rounded-full object-cover"
          />
          <span className="font-serif text-xl leading-none">Pick Trinkets</span>
        </Link>
        <nav className="ml-6 hidden items-center gap-6 md:flex">
          <Link href="/" className="text-sm font-bold">
            Home
          </Link>
          <Link href="/shop" className="text-sm font-bold">
            Shop
          </Link>
        </nav>
        <div className="ml-auto flex items-center gap-3">
          <a
            href={site.instagram}
            target="_blank"
            rel="noreferrer"
            className="hidden text-sm font-bold sm:inline"
          >
            Instagram
          </a>
          <Link
            href="/cart"
            className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-1.5 text-sm font-bold"
          >
            Bag
            {count > 0 ? (
              <span className="grid h-5 min-w-5 place-items-center rounded-full bg-pink px-1 text-xs">
                {count}
              </span>
            ) : null}
          </Link>
        </div>
      </div>
    </header>
  );
}
