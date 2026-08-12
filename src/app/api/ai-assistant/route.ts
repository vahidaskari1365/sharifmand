import { NextResponse } from "next/server";
import { analyzeLegalQuery, analyzeContract } from "@/lib/legal-engine";
import { askLLM } from "@/lib/llm";
export const runtime = "nodejs";
export async function POST(req: Request) {
  let body: { query?: string; mode?: "contract" | "guide"; contract?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "بدنه درخواست نامعتبر است." }, { status: 400 });
  }
  if (body.mode === "contract" || body.contract) {
    const text = (body.contract ?? "").trim();
    if (!text) return NextResponse.json({ ok: false, error: "متن قرارداد خالی است." }, { status: 400 });
    const llm = await askLLM([
      { role: "user", content: `قرارداد زیر را تحلیل کن و نقاط ضعف، ریسک‌ها و بندهای مهم آن را به فارسی فهرست کن:\n\n${text.slice(0, 6000)}` },
    ], 450);
    if (llm) return NextResponse.json({ ok: true, mode: "contract", source: "llm", analysis: llm });
    const result = analyzeContract(text);
    return NextResponse.json({ ok: true, mode: "contract", source: "local", ...result });
  }
  const query = (body.query ?? "").trim();
  if (!query) return NextResponse.json({ ok: false, error: "لطفاً سؤال خود را بنویسید." }, { status: 400 });
  const llm = await askLLM([{ role: "user", content: query }], 400);
  if (llm) return NextResponse.json({ ok: true, mode: "guide", source: "llm", answer: llm, echo: query });
  const guidance = analyzeLegalQuery(query);
  return NextResponse.json({ ok: true, mode: "guide", source: "local", guidance, echo: query });
}
