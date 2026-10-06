export const ADMIN_COOKIE = "pt_admin";
const WEEK = 60 * 60 * 24 * 7;

function bytesToHex(bytes: Uint8Array) {
  return [...bytes].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function hmacHex(value: string, secret: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value));
  return bytesToHex(new Uint8Array(signature));
}

function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function passwordsMatch(input: string, expected: string) {
  const digest = async (value: string) => {
    const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
    return bytesToHex(new Uint8Array(buf));
  };
  return safeEqual(await digest(input), await digest(expected));
}

export async function signSession(maxAgeSeconds = WEEK) {
  const secret = process.env.ADMIN_PASSWORD;
  if (!secret) throw new Error("ADMIN_PASSWORD is not set");
  const exp = Date.now() + maxAgeSeconds * 1000;
  const body = `v1.${exp}`;
  const sig = await hmacHex(body, secret);
  return `${body}.${sig}`;
}

export async function verifySession(token: string | undefined | null) {
  const secret = process.env.ADMIN_PASSWORD;
  if (!secret || !token) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [version, expRaw, sig] = parts;
  const exp = Number(expRaw);
  if (version !== "v1" || !Number.isFinite(exp) || Date.now() > exp) return false;
  const expected = await hmacHex(`${version}.${expRaw}`, secret);
  return safeEqual(expected, sig);
}

export const sessionCookie = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: WEEK,
};
