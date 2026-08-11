import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { Container, Card, Badge, Button } from "@/components/ui";
import { Icon } from "@/components/icons";
import { Reveal } from "@/components/reveal";
import { faNum } from "@/lib/data";

export const metadata: Metadata = {
  title: "پنل مدیریت (Admin)",
  description: "داشبورد مدیریت پلتفرم شریفمند: کاربران، وکلا، احراز هویت، محتوا، مالی، پشتیبانی و تحلیل.",
  alternates: { canonical: "/admin" },
};

const STATS = [
  { label: "کاربران", value: "۸٬۴۲۰", icon: "user" as const, tone: "primary" as const },
  { label: "وکلای فعال", value: "۱٬۲۶۴", icon: "badge" as const, tone: "accent" as const },
  { label: "پرونده‌های باز", value: "۳۱۲", icon: "folder" as const, tone: "success" as const },
  { label: "درآمد ماه", value: "۸۴م", icon: "money" as const, tone: "neutral" as const },
];

const MODULES = [
  { group: "کاربران و احراز هویت", items: ["کاربران", "وکلا", "شرکت‌ها", "احراز هویت"], icon: "user" as const },
  { group: "Marketplace", items: ["خدمات", "سفارش‌ها", "رزروها", "پرونده‌ها"], icon: "briefcase" as const },
  { group: "محتوا", items: ["مقالات", "قوانین", "سؤالات", "صفحات"], icon: "book" as const },
  { group: "مالی", items: ["پرداخت‌ها", "کمیسیون", "بازپرداخت", "تسویه"], icon: "money" as const },
  { group: "پشتیبانی", items: ["تیکت", "شکایت", "گزارش تخلف"], icon: "chat" as const },
  { group: "تحلیل (Analytics)", items: ["کاربران", "درآمد", "Conversion", "خدمات محبوب"], icon: "sparkles" as const },
];

const TASKS = [
  { t: "تأیید پروانه ۳ وکیل جدید", p: "high", c: "احراز هویت" },
  { t: "۵ تیکت پشتیبانی پاسخ‌نشده", p: "medium", c: "پشتیبانی" },
  { t: "بازپرداخت در انتظار تأیید", p: "high", c: "مالی" },
  { t: "گزارش تخلف یک وکیل", p: "medium", c: "پشتیبانی" },
];

export default function AdminPage() {
  return (
    <>
      <PageHero
        badge="Admin · پنل مدیریت"
        title="داشبورد مدیریت پلتفرم"
        desc="مدیریت کامل کاربران، وکلا، محتوا، مالی، پشتیبانی و تحلیل — بر پایه‌ی RBAC و Audit Log."
        breadcrumb={[{ label: "خانه", href: "/" }, { label: "پنل مدیریت" }]}
      >
        <div className="flex flex-wrap gap-2">
          <Button href="/developer" variant="outline" icon="landmark" size="sm">نقشه‌ی دیتابیس</Button>
          <Badge tone="success" icon="shield">دسترسی SUPER_ADMIN</Badge>
        </div>
      </PageHero>

      <Container className="py-12">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 50}>
              <Card hover={false} className="flex items-center gap-3">
                <span className={`inline-flex h-11 w-11 items-center justify-center rounded-xl ${s.tone === "primary" ? "bg-primary-soft text-primary" : s.tone === "accent" ? "bg-accent-soft text-accent" : s.tone === "success" ? "bg-success/15 text-success" : "bg-surface-2 text-foreground-soft"}`}>
                  <Icon name={s.icon} className="h-5 w-5" />
                </span>
                <div><p className="text-xl font-extrabold text-foreground">{s.value}</p><p className="text-xs text-muted">{s.label}</p></div>
              </Card>
            </Reveal>
          ))}
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.6fr_1fr]">
          {/* Modules */}
          <div>
            <h2 className="text-lg font-bold text-foreground">ماژول‌های مدیریت</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {MODULES.map((m, i) => (
                <Reveal key={m.group} delay={i * 40}>
                  <Card hover={false} className="h-full">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-primary"><Icon name={m.icon} className="h-5 w-5" /></span>
                    <h3 className="mt-3 text-sm font-bold text-foreground">{m.group}</h3>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {m.items.map((it) => <span key={it} className="rounded-full bg-surface-2 px-2 py-0.5 text-[11px] text-foreground-soft">{it}</span>)}
                    </div>
                  </Card>
                </Reveal>
              ))}
            </div>
          </div>

          {/* Tasks */}
          <div>
            <h2 className="text-lg font-bold text-foreground">کارهای در انتظار</h2>
            <div className="mt-4 space-y-3">
              {TASKS.map((task, i) => (
                <Reveal key={i} delay={i * 40}>
                  <Card hover={false} className="flex items-center gap-3">
                    <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${task.p === "high" ? "bg-danger" : "bg-warning"}`} />
                    <div className="flex-1"><p className="text-sm font-medium text-foreground">{task.t}</p><p className="text-[11px] text-muted">{task.c}</p></div>
                    <Badge tone={task.p === "high" ? "danger" : "accent"}>{task.p === "high" ? "فوری" : "متوسط"}</Badge>
                  </Card>
                </Reveal>
              ))}
            </div>
          </div>
        </div>

        {/* Audit / RBAC note */}
        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          <Card hover={false}>
            <h3 className="flex items-center gap-2 text-sm font-bold text-foreground"><Icon name="lock" className="h-4 w-4 text-primary" /> کنترل دسترسی (RBAC)</h3>
            <p className="mt-2 text-xs leading-6 text-muted">دسترسی‌ها مبتنی بر نقش و دسترسی ریزدانه است (مثلاً <span className="font-mono">case.read</span>، <span className="font-mono">lawyer.verify</span>). کاربر فقط به پرونده‌هایی دسترسی دارد که عضو آن‌هاست.</p>
            <div className="mt-3 flex flex-wrap gap-1.5">{["USER", "CLIENT", "LAWYER", "ADMIN", "SUPER_ADMIN"].map((r) => <Badge key={r} tone="primary" >{r}</Badge>)}</div>
          </Card>
          <Card hover={false}>
            <h3 className="flex items-center gap-2 text-sm font-bold text-foreground"><Icon name="landmark" className="h-4 w-4 text-accent" /> Audit Log</h3>
            <p className="mt-2 text-xs leading-6 text-muted">تمام عملیات حساس (مشاهده‌ی سند، تغییر وضعیت وکیل، پرداخت) در <span className="font-mono">audit_logs</span> با IP و User-Agent ثبت و قابل ردیابی است.</p>
            <div className="mt-3 flex items-center gap-2 text-[11px] text-muted">
              <span className="rounded-md bg-surface-2 px-2 py-0.5 font-mono">create</span>
              <span className="rounded-md bg-surface-2 px-2 py-0.5 font-mono">update</span>
              <span className="rounded-md bg-surface-2 px-2 py-0.5 font-mono">view</span>
              <span className="rounded-md bg-surface-2 px-2 py-0.5 font-mono">delete</span>
              <span className="rounded-md bg-surface-2 px-2 py-0.5 font-mono">{faNum(12400)} رخداد</span>
            </div>
          </Card>
        </div>
      </Container>
    </>
  );
}
