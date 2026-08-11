import type { Metadata } from "next";
import { db } from "@/db";
import { cases } from "@/db/schema";
import { desc } from "drizzle-orm";
import { DashboardShell } from "@/components/dashboard-shell";
import { Card, Badge } from "@/components/ui";
import { Icon } from "@/components/icons";
import { faNum } from "@/lib/data";

export const metadata: Metadata = {
  title: "پنل موکل — داشبورد حقوقی من",
  description: "مدیریت پرونده‌ها، مشاوره‌ها، اسناد، قراردادها، پرداخت‌ها و پیام‌های شما.",
};

export const dynamic = "force-dynamic";

export default async function ClientDashboard() {
  const recentCases = await db.select().from(cases).orderBy(desc(cases.createdAt)).limit(3);

  const stats = [
    { label: "پرونده‌های فعال", value: faNum(recentCases.length || 3), icon: "folder" as const, tone: "primary" as const },
    { label: "مشاوره‌های من", value: "۱۲", icon: "chat" as const, tone: "accent" as const },
    { label: "اسناد من", value: "۲۸", icon: "document" as const, tone: "success" as const },
    { label: "هزینه کل", value: "۴٫۸م", icon: "money" as const, tone: "neutral" as const },
  ];

  const documents = [
    { name: "قرارداد اجاره ۱۴۰۳", type: "قرارداد", date: "۲ روز پیش" },
    { name: "کارت ملی.pdf", type: "هویتی", date: "۱ هفته پیش" },
    { name: "چک برگشتی.jpg", type: "سند", date: "۳ روز پیش" },
    { name: "دادخواست طلاق.docx", type: "دادخواست", date: "امروز" },
  ];

  const messages = [
    { from: "دکتر سهراب محمدی", text: "مدارک شما دریافت شد، فردا جلسه‌ای داریم.", time: "۱۰ دقیقه پیش", unread: true },
    { from: "ندا کریمی", text: "قرارداد اجاره آماده بازبینی است.", time: "۲ ساعت پیش", unread: true },
    { from: "پشتیبانی شریفمند", text: "درخواست مشاوره شما تأیید شد.", time: "دیروز", unread: false },
  ];

  return (
    <DashboardShell
      role="موکل"
      title="داشبورد حقوقی من"
      nav={[
        { label: "نمای کلی", icon: "home", active: true },
        { label: "پرونده‌های من", icon: "folder", badge: faNum(recentCases.length || 3) },
        { label: "وکلای من", icon: "user" },
        { label: "مشاوره‌ها", icon: "chat" },
        { label: "اسناد و مدارک", icon: "document" },
        { label: "قراردادها", icon: "file" },
        { label: "پرداخت‌ها", icon: "money" },
        { label: "پیام‌ها", icon: "mail", badge: "۲" },
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
            {recentCases.length > 0 ? recentCases.map((c) => (
              <div key={c.id} className="rounded-xl border border-border p-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold text-foreground">{c.subject}</p>
                  <span className="font-mono text-xs text-muted" dir="ltr">{c.caseNumber}</span>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <Badge tone="primary">{c.stage}</Badge>
                  <Badge tone="success">در حال پیگیری</Badge>
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

        {/* Messages */}
        <Card hover={false}>
          <h2 className="flex items-center gap-2 font-bold text-foreground"><Icon name="mail" className="h-5 w-5 text-accent" /> پیام‌ها</h2>
          <div className="mt-4 space-y-2">
            {messages.map((m, i) => (
              <div key={i} className={`flex gap-3 rounded-xl p-2.5 ${m.unread ? "bg-primary-soft/50" : ""}`}>
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                <div className="min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-bold text-foreground">{m.from}</p>
                    <span className="shrink-0 text-[10px] text-muted">{m.time}</span>
                  </div>
                  <p className="truncate text-xs text-muted">{m.text}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Documents + calendar */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card hover={false}>
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-bold text-foreground"><Icon name="document" className="h-5 w-5 text-success" /> اسناد و مدارک</h2>
            <button className="inline-flex items-center gap-1 rounded-lg bg-primary-soft px-2.5 py-1 text-xs font-medium text-primary"><Icon name="plus" className="h-3.5 w-3.5" /> آپلود</button>
          </div>
          <div className="mt-4 space-y-2">
            {documents.map((d) => (
              <div key={d.name} className="flex items-center gap-3 rounded-xl border border-border p-3">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-surface-2 text-foreground-soft"><Icon name="file" className="h-4 w-4" /></span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">{d.name}</p>
                  <p className="text-xs text-muted">{d.type} • {d.date}</p>
                </div>
                <Icon name="lock" className="h-4 w-4 text-success" />
              </div>
            ))}
          </div>
        </Card>

        <Card hover={false}>
          <h2 className="flex items-center gap-2 font-bold text-foreground"><Icon name="calendar" className="h-5 w-5 text-primary" /> تقویم و مهلت‌ها</h2>
          <div className="mt-4 space-y-2">
            {[
              { title: "جلسه دادگاه پرونده طلاق", date: "شنبه، ۲ خرداد", time: "۱۰:۰۰", urgent: true },
              { title: "مهلت تجدیدنظر", date: "دوشنبه، ۴ خرداد", time: "پایان مهلت", urgent: true },
              { title: "مشاوره با وکیل ملکی", date: "چهارشنبه، ۶ خرداد", time: "۱۶:۰۰", urgent: false },
            ].map((e) => (
              <div key={e.title} className={`flex items-center gap-3 rounded-xl border p-3 ${e.urgent ? "border-danger/30 bg-danger/5" : "border-border"}`}>
                <span className={`inline-flex h-9 w-9 items-center justify-center rounded-lg ${e.urgent ? "bg-danger/15 text-danger" : "bg-primary-soft text-primary"}`}>
                  <Icon name="clock" className="h-4 w-4" />
                </span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{e.title}</p>
                  <p className="text-xs text-muted">{e.date} • {e.time}</p>
                </div>
                {e.urgent && <Badge tone="danger">فوری</Badge>}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </DashboardShell>
  );
}
