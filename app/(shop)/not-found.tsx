import Link from "next/link";
import { btnPrimary } from "@/lib/ui";

export default function NotFound() {
  return (
    <div className="py-16 text-center">
      <h1 className="font-serif text-4xl">That page wandered off</h1>
      <p className="mt-3 text-muted">It may have been renamed or removed.</p>
      <Link href="/shop" className={`${btnPrimary} mt-8`}>
        Back to shop
      </Link>
    </div>
  );
}
