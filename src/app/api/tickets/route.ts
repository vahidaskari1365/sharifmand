import { NextResponse } from "next/server";
import { db } from "@/db";
import { tickets } from "@/db/schema";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let body: { name?: string; phone?: string; category?: string; message?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "درخواست نامعتبر" }, { status: 400 });
  }

  const { name, phone, category, message } = body;
  if (!name || !phone || !message) {
    return NextResponse.json({ ok: false, error: "لطفاً نام، تماس و متن را وارد کنید." }, { status: 422 });
  }

  const ticketNo = "T-" + Math.floor(10000 + Math.random() * 90000);
  await db.insert(tickets).values({
    ticketNumber: ticketNo,
    name,
    phone,
    category: category || "سایر",
    message,
    status: "open",
  });

  return NextResponse.json({ ok: true, ticketNo, message: "تیکت شما ثبت شد. تیم پشتیبانی به‌زودی پاسخ می‌دهد." });
}
