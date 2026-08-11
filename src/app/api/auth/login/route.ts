import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq, or } from "drizzle-orm";
import { verifyPassword, signUserSession, userCookieName } from "@/lib/user-auth";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let body: { identifier?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "درخواست نامعتبر" }, { status: 400 });
  }
  const identifier = String(body.identifier ?? "").trim().toLowerCase();
  const password = String(body.password ?? "");
  if (!identifier || !password) {
    return NextResponse.json({ ok: false, error: "موبایل/ایمیل و رمز عبور را وارد کنید." }, { status: 422 });
  }
  try {
    const phone = identifier.replace(/[^\d]/g, "");
    const rows = phone
      ? await db.select().from(users).where(eq(users.phone, phone))
      : await db.select().from(users).where(eq(users.email, identifier));
    const user = rows[0];
    if (!user || !verifyPassword(password, user.passwordHash)) {
      return NextResponse.json({ ok: false, error: "اطلاعات ورود صحیح نیست." }, { status: 401 });
    }
    const store = await cookies();
    store.set(userCookieName(), signUserSession(user.id, user.role), {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
    return NextResponse.json({ ok: true, user: { id: user.id, name: user.name, phone: user.phone, role: user.role } });
  } catch {
    return NextResponse.json({ ok: false, error: "خطا در ورود" }, { status: 500 });
  }
}
