"use client";

import { use, useState } from "react";
import { PageHero } from "@/components/page-hero";
import { Container, Card, Badge, Button } from "@/components/ui";
import { Icon } from "@/components/icons";
import { faNum } from "@/lib/data";

const TIMELINE = [
  { title: "ثبت پرونده", date: "۱۰ اردیبهشت", done: true },
  { title: "بررسی مدارک", date: "۱۲ اردیبهشت", done: true },
  { title: "تنظیم دادخواست", date: "۱۵ اردیبهشت", done: true },
  { title: "ثبت دادخواست", date: "۱۸ اردیبهشت", done: true, current: false },
  { title: "تعیین شعبه", date: "در انتظار", done: false },
  { title: "جلسه اول", date: "—", done: false },
  { title: "صدور رأی", date: "—", done: false },
];

const DOCS = [
  { name: "قرارداد اجاره ۱۴۰۳.pdf", type: "قرارداد", size: "۲۴۰ کیلوبایت" },
  { name: "کارت ملی.jpg", type: "هویتی", size: "۱۲۰ کیلوبایت" },
  { name: "اظهارنامه مطالبه وجه.pdf", type: "اظهارنامه", size: "۸۰ کیلوبایت" },
];

export default function CaseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [tab, setTab] = useState("timeline");
  const caseId = id || "1258-0001";

  const TABS = [
    { key: "summary", label: "خلاصه", icon: "home" as const },
    { key: "timeline", label: "Timeline", icon: "clock" as const },
    { key: "docs", label: "مدارک", icon: "document" as const },
    { key: "deadlines", label: "مهلت‌ها", icon: "alert" as const },
    { key: "messages", label: "پیام‌ها", icon: "chat" as const },
    { key: "payments", label: "پرداخت‌ها", icon: "money" as const },
  ];

  return (
    <>
      <PageHero title="پرونده: مطالبه وجه چک" desc={`شماره پرونده ${caseId} • در حال رسیدگی`} breadcrumb={[{ label: "خانه", href: "/" }, { label: "پنل موکل", href: "/dashboard/client" }, { label: "پرونده" }]}>
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="success">در حال رسیدگی</Badge>
          <Badge tone="primary" icon="user">وکیل: دکتر سهراب محمدی</Badge>
          <Button href="/consultation" variant="outline" size="sm" icon="chat">پیام به وکیل</Button>
        </div>
      </PageHero>

      <Container className="py-10">
        {/* Tabs */}
        <div className="mb-6 flex gap-1 overflow-x-auto rounded-2xl border border-border bg-surface p-1.5">
          {TABS.map((t) => (
            <button key={t.key} type="button" onClick={() => setTab(t.key)} className={`inline-flex shrink-0 items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-medium transition-all ${tab === t.key ? "bg-primary text-primary-foreground" : "text-foreground-soft hover:bg-surface-2"}`}>
              <Icon name={t.icon} className="h-4 w-4" /> {t.label}
            </button>
          ))}
        </div>

        {tab === "summary" && (
          <Card hover={false} className="grid gap-4 sm:grid-cols-2">
            {[
              { k: "موضوع", v: "مطالبه وجه چک برگشتی" },
              { k: "شهر", v: "تهران" },
              { k: "مرحله", v: "ثبت دادخواست" },
              { k: "وکیل", v: "دکتر سهراب محمدی" },
              { k: "تاریخ تشکیل", v: "۱۰ اردیبهشت ۱۴۰۳" },
              { k: "مهلت نزدیک", v: "جلسه ۲۵ اردیبهشت" },
            ].map((x) => (
              <div key={x.k} className="rounded-xl border border-border bg-surface-2 p-3"><p className="text-xs text-muted">{x.k}</p><p className="mt-0.5 text-sm font-bold text-foreground">{x.v}</p></div>
            ))}
          </Card>
        )}

        {tab === "timeline" && (
          <Card hover={false}>
            <ol className="space-y-0">
              {TIMELINE.map((t, i) => (
                <li key={t.title} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <span className={`flex h-8 w-8 items-center justify-center rounded-full text-xs ${t.done ? "bg-primary text-primary-foreground" : "bg-surface-2 text-muted"}`}>{t.done ? <Icon name="check" className="h-4 w-4" /> : faNum(i + 1)}</span>
                    {i < TIMELINE.length - 1 && <span className={`my-1 w-0.5 flex-1 ${t.done ? "bg-primary" : "bg-border"}`} style={{ minHeight: 28 }} />}
                  </div>
                  <div className="pb-5"><p className={`text-sm font-semibold ${t.done ? "text-foreground" : "text-muted"}`}>{t.title}</p><p className="text-xs text-muted">{t.date}</p></div>
                </li>
              ))}
            </ol>
          </Card>
        )}

        {tab === "docs" && (
          <div className="space-y-3">
            <div className="flex justify-end"><Button size="sm" icon="plus">آپلود سند</Button></div>
            {DOCS.map((d) => (
              <Card key={d.name} hover={false} className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-surface-2 text-foreground-soft"><Icon name="file" className="h-5 w-5" /></span>
                <div className="flex-1"><p className="text-sm font-bold text-foreground">{d.name}</p><p className="text-xs text-muted">{d.type} • {d.size}</p></div>
                <Icon name="lock" className="h-4 w-4 text-success" />
              </Card>
            ))}
          </div>
        )}

        {tab === "deadlines" && (
          <div className="space-y-3">
            {[{ t: "جلسه دادگاه", d: "شنبه ۲۵ اردیبهشت — ۱۰:۰۰", u: true }, { t: "مهلت پاسخ به اخطار", d: "۲۸ اردیبهشت", u: true }, { t: "ارسال مدارک مکمل", d: "۳۰ اردیبهشت", u: false }].map((e) => (
              <Card key={e.t} hover={false} className={`flex items-center gap-3 ${e.u ? "border-danger/30 bg-danger/5" : ""}`}>
                <span className={`inline-flex h-10 w-10 items-center justify-center rounded-lg ${e.u ? "bg-danger/15 text-danger" : "bg-primary-soft text-primary"}`}><Icon name="clock" className="h-5 w-5" /></span>
                <div className="flex-1"><p className="text-sm font-bold text-foreground">{e.t}</p><p className="text-xs text-muted">{e.d}</p></div>
                {e.u && <Badge tone="danger">فوری</Badge>}
              </Card>
            ))}
          </div>
        )}

        {tab === "messages" && (
          <Card hover={false} className="space-y-3">
            {[{ from: "دکتر سهراب محمدی", text: "دادخواست ثبت شد، منتظر تعیین شعبه هستیم.", me: false }, { from: "شما", text: "ممنون، مدارک جدید را آپلود کردم.", me: true }].map((m, i) => (
              <div key={i} className={`flex ${m.me ? "justify-start" : "justify-end"}`}><div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${m.me ? "bg-primary-soft text-foreground" : "bg-primary text-primary-foreground"}`}><p className="text-[11px] opacity-80">{m.from}</p>{m.text}</div></div>
            ))}
          </Card>
        )}

        {tab === "payments" && (
          <Card hover={false} className="space-y-3">
            {[{ t: "حق‌الوکاله — مرحله اول", a: "۳٫۵۰۰٫۰۰۰ تومان", s: "پرداخت‌شده" }, { t: "هزینه دادرسی", a: "۸۵۰٫۰۰۰ تومان", s: "پرداخت‌شده" }, { t: "حق‌الوکاله — مرحله دوم", a: "۲٫۰۰۰٫۰۰۰ تومان", s: "در انتظار" }].map((p) => (
              <div key={p.t} className="flex items-center justify-between rounded-xl border border-border p-3"><div><p className="text-sm font-bold text-foreground">{p.t}</p><p className="text-xs text-muted">{p.a}</p></div><Badge tone={p.s === "پرداخت‌شده" ? "success" : "accent"}>{p.s}</Badge></div>
            ))}
          </Card>
        )}
      </Container>
    </>
  );
}
