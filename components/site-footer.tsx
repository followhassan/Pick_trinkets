import Link from "next/link";
import { site } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-black/5 bg-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-12 sm:grid-cols-3">
        <div>
          <p className="font-serif text-xl">Pick Trinkets</p>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            {site.tagline} from {site.location}. Phone charms, bag charms, and bracelets.
            Pay when the order arrives.
          </p>
        </div>
        <div className="flex flex-col gap-2 text-sm font-semibold">
          <p className="font-serif text-lg font-normal">Shop</p>
          <Link href="/shop">All pieces</Link>
          <Link href="/shop?category=phone-charms">Phone charms</Link>
          <Link href="/shop?category=bag-charms">Bag charms</Link>
          <Link href="/shop?category=bracelets">Bracelets</Link>
        </div>
        <div className="flex flex-col gap-2 text-sm font-semibold">
          <p className="font-serif text-lg font-normal">Visit</p>
          <a href={site.instagram} target="_blank" rel="noreferrer">
            Instagram {site.instagramHandle}
          </a>
          <a href={site.facebook} target="_blank" rel="noreferrer">
            Facebook
          </a>
          <a href={`mailto:${site.email}`}>{site.email}</a>
          <p className="font-normal text-muted">{site.location}</p>
        </div>
      </div>
      <p className="px-5 pb-8 text-center text-xs text-muted">
        © {new Date().getFullYear()} Pick Trinkets ·{" "}
        <Link href="/admin/login" className="underline">
          Staff
        </Link>
      </p>
    </footer>
  );
}
