"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { site } from "@/lib/site";

const links = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/cart", label: "Bag" },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        className="rounded-full border border-black/10 bg-white px-3 py-1.5 text-sm font-bold"
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen((value) => !value)}
      >
        Menu
      </button>
      {open ? (
        <div
          id="mobile-menu"
          className="absolute inset-x-0 top-full border-b border-black/10 bg-white px-5 py-3"
        >
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="block py-2.5 font-semibold">
              {link.label}
            </Link>
          ))}
          <a href={site.instagram} className="block py-2.5 font-semibold" target="_blank" rel="noreferrer">
            Instagram
          </a>
        </div>
      ) : null}
    </div>
  );
}
