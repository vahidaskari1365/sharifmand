import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

function required(name: "ADMIN_EMAIL" | "ADMIN_PASSWORD" | "ADMIN_SECRET"): string {
  const value = process.env[name];
  if (!value || (name === "ADMIN_SECRET" && value.length < 32)) throw new Error(`${name} must be configured`);
  return value;
}
const COOKIE = "sharifmand_admin";
const TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

function safeEq(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return timingSafeEqual(ab, bb);
}

export function checkCredentials(email: string, password: string): boolean {
  return safeEq(email.trim().toLowerCase(), required("ADMIN_EMAIL").toLowerCase()) && safeEq(password, required("ADMIN_PASSWORD"));
}

export function signSession(email: string): string {
  const payload = Buffer.from(JSON.stringify({ e: email, exp: Date.now() + TTL_MS })).toString("base64url");
  const sig = createHmac("sha256", required("ADMIN_SECRET")).update(payload).digest("base64url");
  return `${payload}.${sig}`;
}

export function verifySession(token: string | undefined): boolean {
  if (!token) return false;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return false;
  const expected = createHmac("sha256", required("ADMIN_SECRET")).update(payload).digest("base64url");
  if (!safeEq(sig, expected)) return false;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    return typeof data.exp === "number" && data.exp > Date.now();
  } catch {
    return false;
  }
}

export async function isAdmin(): Promise<boolean> {
  const store = await cookies();
  return verifySession(store.get(COOKIE)?.value);
}

export function cookieName(): string {
  return COOKIE;
}
