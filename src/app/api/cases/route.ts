import { NextResponse } from "next/server";
import { db } from "@/db";
import { cases } from "@/db/schema";
import { faNum } from "@/lib/data";

export const runtime = "nodejs";

const STAGES = [
  "ثبت اولیه",
  "بررسی مدارک",
  "تنظیم دادخواست",
  "ثبت در دادگاه",
  "تعیین شعبه",
  "جلسه اول",
  "صدور رأی",
  "تجدیدنظر",
];

export async function POST(req: Request) {
  let body: {
    subject?: string;
    description?: string;
    city?: string;
    stage?: string;
    budget?: string;
    name?: string;
    phone?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "درخواست نامعتبر" }, { status: 400 });
  }

  const { subject, description, city, stage, budget, name, phone } = body;

  if (!subject || !description || !city || !name || !phone) {
    return NextResponse.json(
      { ok: false, error: "لطفاً موضوع، شرح ماجرا، شهر و اطلاعات تماس را کامل وارد کنید." },
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

  const caseNumber = "1258-" + Math.floor(1000 + Math.random() * 9000);

  await db.insert(cases).values({
    caseNumber,
    subject,
    description,
    city,
    stage: stage || "ثبت اولیه",
    budget: budget || null,
    contactName: name,
    contactPhone: phone,
    status: "new",
  });

  return NextResponse.json({
    ok: true,
    caseNumber,
    stageIndex: STAGES.indexOf(stage || "ثبت اولیه") === -1 ? 0 : STAGES.indexOf(stage || "ثبت اولیه"),
    stages: STAGES,
    message: "پرونده شما ثبت شد و در دست بررسی کارشناسان قرار گرفت.",
  });
}

export async function GET() {
  const rows = await db.select().from(cases);
  return NextResponse.json({ ok: true, count: faNum(String(rows.length)), cases: rows.slice(0, 20) });
}
