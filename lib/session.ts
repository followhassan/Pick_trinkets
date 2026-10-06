import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE, verifySession } from "./auth";

export async function requireAdmin() {
  const jar = await cookies();
  const ok = await verifySession(jar.get(ADMIN_COOKIE)?.value);
  if (!ok) redirect("/admin/login");
}
