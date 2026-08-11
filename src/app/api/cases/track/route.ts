import { NextResponse } from "next/server";
import { db } from "@/db";
import { cases } from "@/db/schema";
import { eq } from "drizzle-orm";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = (url.searchParams.get("code") ?? "").trim();
  if (!code) return NextResponse.json({ ok: false, found: false, error: "کد پیگیری را وارد کنید." }, { status: 422 });
  try {
    const [row] = await db.select().from(cases).where(eq(cases.caseNumber, code));
    if (!row) return NextResponse.json({ ok: true, found: false, error: "پرونده‌ای با این کد یافت نشد." });
    return NextResponse.json({ ok: true, found: true, caseData: row });
  } catch {
    return NextResponse.json({ ok: true, found: false, error: "دیتابیس در دسترس نیست." });
  }
}
