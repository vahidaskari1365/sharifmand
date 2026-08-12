import { NextResponse } from "next/server";
import { db } from "@/db";
import { lawyers, contracts } from "@/db/schema";

export const dynamic = "force-dynamic";

export async function GET() {
  const out: Record<string, unknown> = {};
  try {
    const l = await db.select().from(lawyers).limit(1);
    out.lawyers = { ok: true, row: l[0] ? Object.keys(l[0]) : [] };
  } catch (e) {
    out.lawyers = { ok: false, err: String((e as Error)?.message ?? e) };
  }
  try {
    const c = await db.select().from(contracts).limit(1);
    out.contracts = { ok: true, row: c[0] ? Object.keys(c[0]) : [] };
  } catch (e) {
    out.contracts = { ok: false, err: String((e as Error)?.message ?? e) };
  }
  return NextResponse.json(out);
}
