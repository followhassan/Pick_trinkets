import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_COOKIE, verifySession } from "@/lib/auth";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (!pathname.startsWith("/admin")) return NextResponse.next();

  const ok = await verifySession(request.cookies.get(ADMIN_COOKIE)?.value);

  if (pathname === "/admin/login") {
    if (ok) return NextResponse.redirect(new URL("/admin", request.url));
    return NextResponse.next();
  }

  if (!ok) {
    const url = new URL("/admin/login", request.url);
    if (pathname !== "/admin") url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
