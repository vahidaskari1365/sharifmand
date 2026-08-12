import { NextResponse } from "next/server";
import { db } from "@/db";
import { lawyers, articles, contracts, qaQuestions } from "@/db/schema";
import { count } from "drizzle-orm";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ ok: false, db: "missing", error: "DATABASE_URL تعریف نشده است" });
  }
  try {
    const [l] = await db.select({ n: count() }).from(lawyers);
    const [a] = await db.select({ n: count() }).from(articles);
    const [c] = await db.select({ n: count() }).from(contracts);
    const [q] = await db.select({ n: count() }).from(qaQuestions);
    return NextResponse.json({
      ok: true,
      db: "connected",
      counts: { lawyers: l?.n ?? 0, articles: a?.n ?? 0, contracts: c?.n ?? 0, qa: q?.n ?? 0 },
    });
  } catch (e) {
    const err = e as Error & { cause?: unknown; code?: string };
    const cause = err.cause instanceof Error ? `${err.cause.message}${err.cause.cause instanceof Error ? ` // ${err.cause.cause.message}` : ""}` : String(err.cause ?? "");
    return NextResponse.json(
      {
        ok: false,
        db: "error",
        error: (err.message || "unknown").slice(0, 300),
        code: err.code ?? null,
        cause: cause.slice(0, 300),
      },
      { status: 500 }
    );
  }
}
