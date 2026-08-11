import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { hashPassword } from "@/lib/user-auth";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let body: { name?: string; phone?: string; email?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "درخواست نامعتبر" }, { status: 400 });
  }
  const name = String(body.name ?? "").trim();
  const phone = String(body.phone ?? "").trim().replace(/[^\d]/g, "");
  const email = String(body.email ?? "").trim().toLowerCase();
  const password = String(body.password ?? "");
  if (!name || !phone || phone.length < 10) {
    return NextResponse.json({ ok: false, error: "نام و شماره موبایل معتبر وارد کنید." }, { status: 422 });
  }
  if (password.length < 6) {
    return NextResponse.json({ ok: false, error: "رمز عبور باید حداقل ۶ کاراکتر باشد." }, { status: 422 });
  }
  try {
    const existing = await db.select().from(users).where(eq(users.phone, phone));
    if (existing.length > 0) {
      return NextResponse.json({ ok: false, error: "این شماره موبایل قبلاً ثبت شده است. وارد شوید." }, { status: 409 });
    }
    const [created] = await db
      .insert(users)
      .values({ name, phone, email: email || null, passwordHash: hashPassword(password) })
      .returning({ id: users.id, name: users.name, phone: users.phone, role: users.role });
    return NextResponse.json({ ok: true, user: created });
  } catch {
    return NextResponse.json({ ok: false, error: "خطا در ثبت‌نام" }, { status: 500 });
  }
}
