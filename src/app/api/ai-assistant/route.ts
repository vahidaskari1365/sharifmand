import { NextResponse } from "next/server";
import { analyzeLegalQuery, analyzeContract } from "@/lib/legal-engine";
import { askLLM } from "@/lib/llm";
import { rateLimit, readJson, text } from "@/lib/api-security";

export const runtime = "nodejs";

const withTimeout = <T,>(task: Promise<T>, ms: number) =>
  Promise.race<T>([task, new Promise<T>((_, reject) => setTimeout(() => reject(new Error("timeout")), ms))]);

const CONTRACT_PROMPT = `قرارداد زیر را تحلیل کن و نقاط ضعف، ریسک‌ها و بندهای مهم آن را به فارسی فهرست کن.
در تحلیل خود به مواد قانونی مرتبط هم استناد کن (مانند مواد ۱۰، ۲۱۹ و ۲۳۰ قانون مدنی) و شماره ماده و تبصره را ذکر کن:

`;

export async function POST(req: Request) {
  const body = await readJson(req, 16_384);
  const limited = rateLimit(req, "ai", 15, 60 * 60_000);
  if (limited) return limited;

  const contract = text(body?.contract, 6000);
  const query = text(body?.query, 3000);
  const mode = body?.mode;

  try {
    if (mode === "contract" || contract) {
      if (!contract) return NextResponse.json({ ok: false, error: "متن قرارداد معتبر نیست." }, { status: 400 });
      const llm = await withTimeout(askLLM([{ role: "user", content: `${CONTRACT_PROMPT}${contract}` }], 700), 20_000);
      if (llm) return NextResponse.json({ ok: true, mode: "contract", source: "llm", analysis: llm });
      return NextResponse.json({ ok: true, mode: "contract", source: "local", ...analyzeContract(contract) });
    }

    if (!query) return NextResponse.json({ ok: false, error: "لطفاً سؤال خود را بنویسید." }, { status: 400 });

    const llm = await withTimeout(askLLM([{ role: "user", content: query }], 700), 20_000);
    if (llm) return NextResponse.json({ ok: true, mode: "guide", source: "llm", answer: llm });
    return NextResponse.json({ ok: true, mode: "guide", source: "local", guidance: analyzeLegalQuery(query) });
  } catch {
    return NextResponse.json({ ok: false, error: "پاسخ‌گویی در حال حاضر ممکن نیست." }, { status: 503 });
  }
}
