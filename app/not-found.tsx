import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-lg px-5 py-24 text-center">
      <h1 className="font-serif text-4xl">Page not found</h1>
      <Link href="/" className="mt-6 inline-block font-bold">
        Home
      </Link>
    </main>
  );
}
