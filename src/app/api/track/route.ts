import { NextResponse } from "next/server";
import { db } from "@/db";
import { pageViews } from "@/db/schema";
import { sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const path = String(body?.path ?? "").slice(0, 300);
    if (!path || path.startsWith("/api") || path.startsWith("/admin")) {
      return NextResponse.json({ ok: false });
    }
    await db
      .insert(pageViews)
      .values({ path, views: 1 })
      .onConflictDoUpdate({
        target: pageViews.path,
        set: { views: sql`${pageViews.views} + 1`, lastSeen: sql`now()` },
      });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false });
  }
}
