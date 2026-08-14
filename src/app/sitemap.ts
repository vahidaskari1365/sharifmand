import type { MetadataRoute } from "next";
import { db } from "@/db";
import { lawyers, contracts, articles, qaQuestions } from "@/db/schema";
import { GLOSSARY, LAWS, JUDGMENTS, LEGAL_FORMS } from "@/lib/content";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-dynamic";

const BASE = SITE_URL;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let lw: { slug: string; updatedAt: Date }[] = [];
  let ct: { slug: string }[] = [];
  let ar: { slug: string; updatedAt: Date }[] = [];
  let qa: { slug: string }[] = [];
  try {
    [lw, ct, ar, qa] = await Promise.all([
      db.select({ slug: lawyers.slug, updatedAt: lawyers.createdAt }).from(lawyers),
      db.select({ slug: contracts.slug }).from(contracts),
      db.select({ slug: articles.slug, updatedAt: articles.publishedAt }).from(articles),
      db.select({ slug: qaQuestions.slug }).from(qaQuestions),
    ]);
  } catch {
    /* degrade gracefully when DB is not configured */
  }

  const staticRoutes: MetadataRoute.Sitemap = [
    "", "services", "services/family", "services/property", "services/criminal", "services/commercial", "services/administrative",
    "lawyers", "consultation", "case/new", "contracts", "contracts/builder", "contracts/review",
    "legal-forms", "ai-assistant", "knowledge", "qa", "laws", "judgments", "glossary",
    "pricing", "business", "about", "contact", "support", "notifications", "login", "register",
    "dashboard/client", "dashboard/lawyer", "dashboard/documents",
    "legal/terms", "legal/privacy", "legal/refund-policy", "legal/security", "legal/transparency",
    "glossary/*",
  ].map((r) => ({
    url: `${BASE}/${r}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: r === "" ? 1 : 0.7,
  }));

  const contentRoutes: MetadataRoute.Sitemap = [
    ...GLOSSARY.map((g) => `${BASE}/glossary/${g.slug}`),
    ...LAWS.map((l) => `${BASE}/laws/${l.slug}`),
    ...JUDGMENTS.map((j) => `${BASE}/judgments/${j.slug}`),
    ...LEGAL_FORMS.map((f) => `${BASE}/legal-forms/${f.slug}`),
    `${BASE}/services/family/divorce`,
  ].map((url) => ({ url, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.6 }));

  return [
    ...staticRoutes,
    ...contentRoutes,
    ...lw.map((l) => ({ url: `${BASE}/lawyers/${l.slug}`, lastModified: l.updatedAt, changeFrequency: "monthly" as const, priority: 0.9 })),
    ...ct.map((c) => ({ url: `${BASE}/contracts/${c.slug}`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.7 })),
    ...ar.map((a) => ({ url: `${BASE}/knowledge/${a.slug}`, lastModified: a.updatedAt, changeFrequency: "monthly" as const, priority: 0.7 })),
    ...qa.map((q) => ({ url: `${BASE}/qa/${q.slug}`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.6 })),
  ];
}
