"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE, passwordsMatch, sessionCookie, signSession } from "@/lib/auth";

export type LoginState = { error?: string };

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    return { error: "ADMIN_PASSWORD is not set on the server yet." };
  }

  const password = String(formData.get("password") || "");
  if (!(await passwordsMatch(password, expected))) {
    return { error: "Wrong password." };
  }

  const jar = await cookies();
  jar.set(ADMIN_COOKIE, await signSession(), sessionCookie);

  const next = String(formData.get("next") || "/admin");
  const safe = next.startsWith("/admin") && !next.startsWith("//") ? next : "/admin";
  redirect(safe);
}

export async function logout() {
  const jar = await cookies();
  jar.delete(ADMIN_COOKIE);
  redirect("/admin/login");
}
