import { NextResponse } from "next/server";
import { seedAll } from "@/lib/auto-seed";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  try {
    const counts = await seedAll();
    return NextResponse.json({ ok: true, counts });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "seed failed" },
      { status: 500 },
    );
  }
}
