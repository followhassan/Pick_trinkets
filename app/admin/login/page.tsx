import type { Metadata } from "next";
import { LoginForm } from "@/components/admin/login-form";

export const metadata: Metadata = {
  title: "Staff login",
  robots: { index: false, follow: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  const destination = next?.startsWith("/admin") ? next : "/admin";

  return (
    <main id="main" className="mx-auto flex min-h-screen w-full max-w-sm flex-col justify-center px-5 py-16">
      <img
        src="/brand/logo.png"
        alt=""
        width={64}
        height={64}
        className="h-16 w-16 rounded-full object-cover"
      />
      <h1 className="mt-5 font-serif text-4xl">Staff</h1>
      <p className="mt-2 text-sm text-muted">Sign in to add products and manage orders.</p>
      <div className="mt-8">
        <LoginForm next={destination} />
      </div>
    </main>
  );
}
