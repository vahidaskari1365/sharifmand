import { NextResponse } from "next/server";
import { db } from "@/db";
import { lawyers, contracts, qaQuestions, cases, consultations, tickets, articles } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { isAdmin } from "@/lib/admin-auth";

export const runtime = "nodejs";

const TABLES: Record<string, { table: any; orderBy: any; searchCol?: any }> = {
  lawyers: { table: lawyers, orderBy: desc(lawyers.createdAt), searchCol: lawyers.name },
  contracts: { table: contracts, orderBy: null, searchCol: contracts.title },
  "qa": { table: qaQuestions, orderBy: desc(qaQuestions.createdAt), searchCol: qaQuestions.question },
  cases: { table: cases, orderBy: desc(cases.createdAt), searchCol: cases.caseNumber },
  consultations: { table: consultations, orderBy: desc(consultations.createdAt), searchCol: consultations.clientName },
  tickets: { table: tickets, orderBy: desc(tickets.createdAt), searchCol: tickets.ticketNumber },
  articles: { table: articles, orderBy: desc(articles.publishedAt), searchCol: articles.title },
};

export async function GET(req: Request, { params }: { params: Promise<{ resource: string }> }) {
  const { resource } = await params;
  if (!(await isAdmin())) return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  const cfg = TABLES[resource];
  if (!cfg) return NextResponse.json({ ok: false, error: "unknown resource" }, { status: 404 });
  try {
    const rows = await db.select().from(cfg.table).orderBy(cfg.orderBy).limit(200);
    return NextResponse.json({ ok: true, rows });
  } catch {
    return NextResponse.json({ ok: false, error: "db unavailable" }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ resource: string }> }) {
  const { resource } = await params;
  if (!(await isAdmin())) return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  const cfg = TABLES[resource];
  if (!cfg) return NextResponse.json({ ok: false, error: "unknown resource" }, { status: 404 });
  let body: { id: number; changes: Record<string, unknown> };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad body" }, { status: 400 });
  }
  const allowed = new Set(Object.keys(cfg.table));
  const changes = Object.fromEntries(Object.entries(body.changes ?? {}).filter(([k]) => allowed.has(k)));
  if (!Object.keys(changes).length) return NextResponse.json({ ok: false, error: "no changes" }, { status: 400 });
  try {
    await db.update(cfg.table).set(changes).where(eq(cfg.table.id, Number(body.id)));
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "update failed" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ resource: string }> }) {
  const { resource } = await params;
  if (!(await isAdmin())) return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  const cfg = TABLES[resource];
  if (!cfg) return NextResponse.json({ ok: false, error: "unknown resource" }, { status: 404 });
  const url = new URL(req.url);
  const id = Number(url.searchParams.get("id"));
  if (!id) return NextResponse.json({ ok: false, error: "id required" }, { status: 400 });
  try {
    await db.delete(cfg.table).where(eq(cfg.table.id, id));
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "delete failed" }, { status: 500 });
  }
}
