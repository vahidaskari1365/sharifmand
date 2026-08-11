import { NextResponse } from "next/server";
import { db } from "@/db";
import { consultations, lawyers } from "@/db/schema";
import { eq } from "drizzle-orm";
import { faNum } from "@/lib/data";

export const runtime = "nodejs";

const PRICES: Record<string, number> = {
  "chat-15": 120000,
  "chat-30": 200000,
  "voice-15": 250000,
  "voice-30": 350000,
  "voice-60": 600000,
  "video-30": 500000,
  "video-60": 800000,
};

export async function POST(req: Request) {
  let body: {
    lawyer?: string;
    type?: "chat" | "voice" | "video";
    duration?: number;
    name?: string;
    phone?: string;
    subject?: string;
    date?: string;
    time?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "درخواست نامعتبر" }, { status: 400 });
  }

  const { lawyer, type, duration, name, phone, subject, date, time } = body;

  if (!name || !phone || !subject || !type) {
    return NextResponse.json(
      { ok: false, error: "لطفاً همه فیلدهای ضروری را پر کنید." },
      { status: 422 },
    );
  }

  const phoneOk = /^0?9\d{9}$/.test(phone.replace(/\s|-/g, ""));
  if (!phoneOk) {
    return NextResponse.json(
      { ok: false, error: "شماره موبایل معتبر نیست (مثال: 09123456789)." },
      { status: 422 },
    );
  }

  const dur = duration ?? (type === "video" ? 30 : type === "voice" ? 30 : 15);
  const priceKey = `${type}-${dur}`;
  let price = PRICES[priceKey] ?? 150000;

  let lawyerName: string | null = null;
  let lawyerId: number | null = null;
  if (lawyer) {
    const rows = await db.select().from(lawyers).where(eq(lawyers.slug, lawyer)).limit(1);
    if (rows[0]) {
      lawyerName = rows[0].name;
      lawyerId = rows[0].id;
      // Use lawyer's actual pricing if available
      if (type === "chat") price = rows[0].priceChat || price;
      if (type === "voice") price = rows[0].priceVoice || price;
      if (type === "video") price = rows[0].priceVideo || price;
    }
  }

  const ticketNo = "C-" + Math.floor(100000 + Math.random() * 900000);

  await db.insert(consultations).values({
    lawyerName,
    lawyerId,
    type,
    duration: dur,
    clientName: name,
    clientPhone: phone,
    subject,
    scheduledAt: date && time ? `${date} ${time}` : null,
    price: String(price),
  });

  return NextResponse.json({
    ok: true,
    ticketNo,
    price,
    priceLabel: faNum(price.toLocaleString("en-US")) + " تومان",
    message: "درخواست مشاوره شما ثبت شد. کارشناسان ما به‌زودی برای تأیید و پرداخت با شما تماس می‌گیرند.",
  });
}
