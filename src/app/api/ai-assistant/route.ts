import { NextResponse } from "next/server";
import { analyzeLegalQuery, analyzeContract } from "@/lib/legal-engine";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let body: { query?: string; mode?: "contract" | "guide"; contract?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "بدنه درخواست نامعتبر است." }, { status: 400 });
  }

  // Contract analysis mode
  if (body.mode === "contract" || body.contract) {
    const text = body.contract ?? "";
    if (!text.trim()) {
      return NextResponse.json({ ok: false, error: "متن قرارداد خالی است." }, { status: 400 });
    }
    const result = analyzeContract(text);
    return NextResponse.json({ ok: true, mode: "contract", ...result });
  }

  // Legal guidance mode
  const query = (body.query ?? "").trim();
  if (!query) {
    return NextResponse.json({ ok: false, error: "لطفاً سؤال خود را بنویسید." }, { status: 400 });
  }

  const guidance = analyzeLegalQuery(query);
  return NextResponse.json({ ok: true, mode: "guide", guidance, echo: query });
}
