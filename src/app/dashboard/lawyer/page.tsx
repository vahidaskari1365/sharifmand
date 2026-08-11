import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { cases, consultations, tickets, lawyers } from "@/db/schema";
import { desc } from "drizzle-orm";
import { DashboardShell } from "@/components/dashboard-shell";
import { Card, Badge } from "@/components/ui";
import { Icon } from "@/components/icons";
import { faNum } from "@/lib/data";
import { getCurrentUser } from "@/lib/user-auth";
export const metadata: Metadata = {
  title: "پنل وکیل — داشبورد مدیریت",
  description: "مدیریت پرونده‌ها، مشاوره‌ها، درآمد، موکلان و تقویم برای وکلای شریفمند.",
};
export const dynamic = "force-dynamic";
export default async function LawyerDashboard() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  let myLawyer = null as null | { name: string; rating: number } | undefined;
  let allCases: typeof cases.$inferSelect[] = [];
  let allConsults: typeof consultations.$inferSelect[] = [];
  let openTickets = 0;
  try {
    [myLawyer, allCases, allConsults] = await Promise.all([
      db.select({ name: lawyers.name, rating: lawyers.rating }).from(lawyers).limit(1).then((r) => r[0]),
      db.select().from(cases).orderBy(desc(cases.createdAt)).limit(6),
      db.select().from(consultations).orderBy(desc(consultations.createdAt)).limit(6),
    ]);
    const t = await db.select().from(tickets);
    openTickets = t.filter((x) => x.status === "open").length;
  } catch {
    /* degraded mode */
  }

  const activeCases = allCases.filter((c) => c.status !== "closed");
  const stats = [
    { label: "پرونده‌های فعال", value: faNum(activeCases.length), icon: "folder" as const },
    { label: "درخواست‌های جدید", value: faNum(allConsults.filter((c) => c.status === "pending").length), icon: "mail" as const },
    { label: "تیکت‌های باز", value: faNum(openTickets), icon: "chat" as const },
    { label: "امتیاز", value: myLawyer ? faNum(myLawyer.rating) : "—", icon: "star" as const },
  ];
  const newRequests = allConsults.filter((c) => c.status === "pending").slice(0, 4).map((c) => ({
    name: c.clientName, subject: c.subject, city: "—", time: c.type, budget: faNum(Number(c.price ?? 0)),
  }));
  const today = allCases.slice(0, 4).map((c) => ({
    title: c.subject, time: c.caseNumber, type: c.stage,
  }));

  return (
    <DashboardShell
      role="وکیل"
      title="داشبورد وکیل"
      nav={[
        { label: "نمای کلی", icon: "home", active: true },
        { label: "پرونده‌های فعال", icon: "folder", badge: faNum(activeCases.length) },
        { label: "درخواست‌های جدید", icon: "mail", badge: "۷" },
        { label: "مشاوره‌ها", icon: "chat" },
        { label: "موکلان", icon: "user" },
        { label: "تقویم", icon: "calendar" },
        { label: "اسناد", icon: "document" },
        { label: "مالی و تسویه", icon: "money" },
        { label: "پروفایل من", icon: "badge" },
        { label: "تنظیمات", icon: "user" },
      ]}
    >
      {/* Greeting + profile completion */}
      <Card hover={false} className="bg-gradient-to-l from-primary to-primary-hover text-primary-foreground">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm text-white/80">صبح بخیر، وکیل محترم</p>
            <h2 className="mt-1 text-xl font-bold">دکتر سهراب محمدی</h2>
            <p className="mt-1 text-xs text-white/70">امروز ۳ جلسه و ۷ درخواست جدید دارید.</p>
          </div>
          <div className="text-left">
            <p className="text-xs text-white/70">تکمیل پروفایل</p>
            <p className="text-2xl font-extrabold">۸۵٪</p>
            <div className="mt-1 h-1.5 w-28 rounded-full bg-white/20">
              <div className="h-full w-[85%] rounded-full bg-accent" />
            </div>
          </div>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label} hover={false} className="flex items-center gap-3">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary-soft text-primary">
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
        {/* New requests */}
        <Card hover={false}>
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-bold text-foreground"><Icon name="mail" className="h-5 w-5 text-accent" /> درخواست‌های جدید</h2>
            <Badge tone="accent">۷ مورد</Badge>
          </div>
          <div className="mt-4 space-y-3">
            {newRequests.map((r) => (
              <div key={r.name} className="flex flex-wrap items-center gap-3 rounded-xl border border-border p-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-foreground">{r.name}</p>
                    <Badge tone="primary">{r.subject}</Badge>
                  </div>
                  <p className="mt-0.5 text-xs text-muted">{r.city} • {r.budget} • {r.time}</p>
                </div>
                <div className="flex gap-2">
                  <button className="inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary-hover">
                    <Icon name="check" className="h-3.5 w-3.5" /> پذیرش
                  </button>
                  <button className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:bg-surface-2">
                    مشاهده
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Today's schedule */}
        <Card hover={false}>
          <h2 className="flex items-center gap-2 font-bold text-foreground"><Icon name="calendar" className="h-5 w-5 text-primary" /> برنامه امروز</h2>
          <div className="mt-4 space-y-2">
            {today.map((e) => (
              <div key={e.title} className="flex items-center gap-3 rounded-xl border border-border p-3">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary-soft text-primary">
                  <Icon name={e.type === "video" ? "video" : e.type === "chat" ? "chat" : "gavel"} className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">{e.title}</p>
                  <p className="text-xs text-muted">{e.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Income chart placeholder + reviews */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card hover={false}>
          <h2 className="flex items-center gap-2 font-bold text-foreground"><Icon name="money" className="h-5 w-5 text-success" /> درآمد ۶ ماه اخیر</h2>
          <div className="mt-5 flex h-40 items-end gap-2">
            {[40, 55, 48, 70, 62, 90].map((h, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-2">
                <div className="w-full rounded-t-lg bg-gradient-to-t from-primary to-primary-hover transition-all hover:opacity-80" style={{ height: `${h}%` }} />
                <span className="text-[10px] text-muted">{faNum(i + 1)}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card hover={false}>
          <h2 className="flex items-center gap-2 font-bold text-foreground"><Icon name="star" className="h-5 w-5 text-accent" /> آمار اعتبار</h2>
          <div className="mt-4 space-y-3 text-sm">
            {[
              { label: "میانگین امتیاز", value: "۴٫۹ از ۵" },
              { label: "نرخ پاسخگویی", value: "۹۸٪" },
              { label: "زمان میانگین پاسخ", value: "کمتر از ۳۰ دقیقه" },
              { label: "نرخ تکمیل خدمات", value: "۹۶٪" },
            ].map((r) => (
              <div key={r.label} className="flex items-center justify-between border-b border-border pb-2 last:border-0">
                <span className="text-muted">{r.label}</span>
                <span className="font-bold text-foreground">{r.value}</span>
              </div>
            ))}
            <div className="flex flex-wrap gap-2 pt-2">
              <Badge tone="primary" icon="badge">وکیل تأییدشده</Badge>
              <Badge tone="accent" icon="star">وکیل برتر</Badge>
              <Badge tone="success" icon="bolt">پاسخ سریع</Badge>
            </div>
          </div>
        </Card>
      </div>
    </DashboardShell>
  );
}
