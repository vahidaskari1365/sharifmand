import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { cases, consultations, tickets } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { DashboardShell } from "@/components/dashboard-shell";
import { Card, Badge } from "@/components/ui";
import { Icon } from "@/components/icons";
import { faNum } from "@/lib/data";
import { getCurrentUser } from "@/lib/user-auth";
export const metadata: Metadata = {
  title: "پنل موکل — داشبورد حقوقی من",
  description: "مدیریت پرونده‌ها، مشاوره‌ها، اسناد، قراردادها، پرداخت‌ها و پیام‌های شما.",
};
export const dynamic = "force-dynamic";
export default async function ClientDashboard() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const phone = user.phone;

  let myCases: typeof cases.$inferSelect[] = [];
  let myConsults: typeof consultations.$inferSelect[] = [];
  let myTickets: typeof tickets.$inferSelect[] = [];
  try {
    [myCases, myConsults, myTickets] = await Promise.all([
      db.select().from(cases).where(eq(cases.contactPhone, phone)).orderBy(desc(cases.createdAt)).limit(5),
      db.select().from(consultations).where(eq(consultations.clientPhone, phone)).orderBy(desc(consultations.createdAt)).limit(5),
      db.select().from(tickets).where(eq(tickets.phone, phone)).orderBy(desc(tickets.createdAt)).limit(5),
    ]);
  } catch {
    /* degraded mode */
  }

  const stats = [
    { label: "پرونده‌های من", value: faNum(myCases.length), icon: "folder" as const, tone: "primary" as const },
    { label: "مشاوره‌های من", value: faNum(myConsults.length), icon: "chat" as const, tone: "accent" as const },
    { label: "تیکت‌های پشتیبانی", value: faNum(myTickets.length), icon: "mail" as const, tone: "success" as const },
    { label: "خوش آمدید", value: user.name.split(" ")[0], icon: "user" as const, tone: "neutral" as const },
  ];

  const recentItems = [
    ...myCases.map((c) => ({ kind: "پرونده", title: c.subject, meta: c.caseNumber + " • " + c.city, tone: "primary" as const })),
    ...myConsults.map((c) => ({ kind: "مشاوره", title: c.subject, meta: c.type + " • " + c.status, tone: "accent" as const })),
    ...myTickets.map((t) => ({ kind: "تیکت", title: t.message.slice(0, 60), meta: t.ticketNumber + " • " + t.status, tone: "neutral" as const })),
  ].slice(0, 6);

  return (
    <DashboardShell
      role="موکل"
      title={`داشبورد حقوقی ${user.name}`}
      nav={[
        { label: "نمای کلی", icon: "home", active: true },
        { label: "پرونده‌های من", icon: "folder", badge: faNum(myCases.length) },
        { label: "وکلای من", icon: "user" },
        { label: "مشاوره‌ها", icon: "chat", badge: faNum(myConsults.length) },
        { label: "اسناد و مدارک", icon: "document" },
        { label: "قراردادها", icon: "file" },
        { label: "پرداخت‌ها", icon: "money" },
        { label: "پیام‌ها", icon: "mail", badge: faNum(myTickets.length) },
        { label: "اعلان‌ها", icon: "alert" },
        { label: "تنظیمات", icon: "user" },
      ]}
    >
      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label} hover={false} className="flex items-center gap-3">
            <span className={`inline-flex h-11 w-11 items-center justify-center rounded-xl ${
              s.tone === "primary" ? "bg-primary-soft text-primary" :
              s.tone === "accent" ? "bg-accent-soft text-accent" :
              s.tone === "success" ? "bg-success/15 text-success" : "bg-surface-2 text-foreground-soft"
            }`}>
              <Icon name={s.icon} className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xl font-extrabold text-foreground">{s.value}</p>
              <p className="text-xs text-muted">{s.label}</p>
            </div>
          </Card>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        {/* Cases */}
        <Card hover={false}>
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-bold text-foreground"><Icon name="folder" className="h-5 w-5 text-primary" /> پرونده‌های من</h2>
            <a href="/case/new" className="text-xs font-medium text-primary hover:text-primary-hover">+ پرونده جدید</a>
          </div>
          <div className="mt-4 space-y-3">
            {myCases.length > 0 ? myCases.map((c) => (
              <div key={c.id} className="rounded-xl border border-border p-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold text-foreground">{c.subject}</p>
                  <span className="font-mono text-xs text-muted" dir="ltr">{c.caseNumber}</span>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <Badge tone="primary">{c.stage}</Badge>
                  <Badge tone="success">{c.status}</Badge>
                  <span className="mr-auto text-xs text-muted">{c.city}</span>
                </div>
              </div>
            )) : (
              <div className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted">
                هنوز پرونده‌ای ثبت نکرده‌اید.
                <a href="/case/new" className="mr-2 text-primary hover:text-primary-hover">ثبت اولین پرونده</a>
              </div>
            )}
          </div>
        </Card>
        {/* Recent activity */}
        <Card hover={false}>
          <h2 className="flex items-center gap-2 font-bold text-foreground"><Icon name="clock" className="h-5 w-5 text-accent" /> فعالیت‌های اخیر</h2>
          <div className="mt-4 space-y-2">
            {recentItems.length > 0 ? recentItems.map((m, i) => (
              <div key={i} className="flex gap-3 rounded-xl p-2.5 bg-surface-2/50">
                <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${m.tone === "primary" ? "bg-primary" : m.tone === "accent" ? "bg-accent" : "bg-foreground-soft"}`} />
                <div className="min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-bold text-foreground">{m.title}</p>
                    <span className="shrink-0 text-[10px] text-muted">{m.kind}</span>
                  </div>
                  <p className="truncate text-xs text-muted" dir="ltr">{m.meta}</p>
                </div>
              </div>
            )) : (
              <p className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted">هنوز فعالیتی ثبت نشده است.</p>
            )}
          </div>
        </Card>
      </div>
      {/* Tickets */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card hover={false}>
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-bold text-foreground"><Icon name="mail" className="h-5 w-5 text-success" /> تیکت‌های پشتیبانی</h2>
            <a href="/contact" className="inline-flex items-center gap-1 rounded-lg bg-primary-soft px-2.5 py-1 text-xs font-medium text-primary"><Icon name="plus" className="h-3.5 w-3.5" /> تیکت جدید</a>
          </div>
          <div className="mt-4 space-y-2">
            {myTickets.length > 0 ? myTickets.map((t) => (
              <div key={t.id} className="flex items-center gap-3 rounded-xl border border-border p-3">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-surface-2 text-foreground-soft"><Icon name="chat" className="h-4 w-4" /></span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">{t.message}</p>
                  <p className="text-xs text-muted" dir="ltr">{t.ticketNumber} • {t.category}</p>
                </div>
                <Badge tone={t.status === "open" ? "primary" : "success"}>{t.status === "open" ? "باز" : "بسته"}</Badge>
              </div>
            )) : (
              <p className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted">تیکتی ثبت نکرده‌اید. برای ارتباط با پشتیبانی <a href="/contact" className="text-primary hover:underline">اینجا</a> کلیک کنید.</p>
            )}
          </div>
        </Card>
        <Card hover={false}>
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-bold text-foreground"><Icon name="chat" className="h-5 w-5 text-accent" /> مشاوره‌های من</h2>
            <a href="/consultation" className="inline-flex items-center gap-1 rounded-lg bg-accent-soft px-2.5 py-1 text-xs font-medium text-accent"><Icon name="calendar" className="h-3.5 w-3.5" /> رزرو مشاوره</a>
          </div>
          <div className="mt-4 space-y-2">
            {myConsults.length > 0 ? myConsults.map((c) => (
              <div key={c.id} className="flex items-center gap-3 rounded-xl border border-border p-3">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-surface-2 text-foreground-soft"><Icon name="calendar" className="h-4 w-4" /></span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">{c.subject}</p>
                  <p className="text-xs text-muted" dir="ltr">{c.type} • {c.duration} دقیقه</p>
                </div>
                <Badge tone="accent">{c.status}</Badge>
              </div>
            )) : (
              <p className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted">مشاوره‌ای ثبت نکرده‌اید. <a href="/consultation" className="text-accent hover:underline">رزرو مشاوره آنلاین</a></p>
            )}
          </div>
        </Card>
      </div>
    </DashboardShell>
  );
}
