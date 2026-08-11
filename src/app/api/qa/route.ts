import { NextResponse } from "next/server";

export const runtime = "nodejs";

// Receives a new community question; in production this would persist and
// route to lawyers for review. Here we acknowledge receipt.
export async function POST(req: Request) {
  let body: { question?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "درخواست نامعتبر" }, { status: 400 });
  }
  if (!body.question || !body.question.trim()) {
    return NextResponse.json({ ok: false, error: "سؤال خالی است" }, { status: 422 });
  }
  return NextResponse.json({ ok: true, message: "سؤال شما ثبت شد و پس از بررسی پاسخ داده می‌شود." });
}
