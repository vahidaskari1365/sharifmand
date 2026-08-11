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
    return NextResponse.json(
      { ok: false, db: "error", error: e instanceof Error ? e.message.slice(0, 200) : "unknown" },
      { status: 500 }
    );
  }
}
