import Link from "next/link";
import { LiveSearch } from "@/components/live-search";
import { MobileNav } from "@/components/mobile-nav";

export function SiteHeader({ count }: { count: number }) {
  return (
    <header className="sticky top-0 z-20 border-b border-black/5 bg-white/90 backdrop-blur">
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
        <nav className="ml-4 hidden items-center gap-5 md:flex">
          <Link href="/shop" className="text-sm font-bold">
            Shop
          </Link>
          <Link href="/track" className="text-sm font-bold">
            Track
          </Link>
        </nav>
        <div className="ml-auto hidden w-56 lg:block">
          <LiveSearch />
        </div>
        <Link
          href="/cart"
          className="ml-auto inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-1.5 text-sm font-bold transition hover:-translate-y-0.5 lg:ml-0"
        >
          Bag
          {count > 0 ? (
            <span className="grid h-5 min-w-5 place-items-center rounded-full bg-pink px-1 text-xs">
              {count}
            </span>
          ) : null}
        </Link>
      </div>
      <div className="mx-auto w-full max-w-6xl px-5 pb-3 lg:hidden">
        <LiveSearch />
      </div>
    </header>
  );
}