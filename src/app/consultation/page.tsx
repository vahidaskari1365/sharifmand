"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Container, Button, Card, Badge } from "@/components/ui";
import { Icon } from "@/components/icons";
import { CONSULTATION_TYPES, faNum } from "@/lib/data";
import type { IconKey } from "@/lib/data";

const DURATIONS: Record<string, { min: number; price: number }[]> = {
  chat: [{ min: 15, price: 120000 }, { min: 30, price: 200000 }],
  voice: [{ min: 15, price: 250000 }, { min: 30, price: 350000 }, { min: 60, price: 600000 }],
  video: [{ min: 30, price: 500000 }, { min: 60, price: 800000 }],
};

interface LawyerOpt { slug: string; name: string; city: string }

function ConsultationContent() {
  const search = useSearchParams();
  const [type, setType] = useState<"chat" | "voice" | "video">(
    (search.get("type") as "chat" | "voice" | "video") || "chat",
  );
  const [duration, setDuration] = useState(30);
  const [lawyerSlug, setLawyerSlug] = useState(search.get("lawyer") ?? "");
  const [lawyers, setLawyers] = useState<LawyerOpt[]>([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ ticketNo: string; priceLabel: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/lawyers").then((r) => r.json()).then((d) => {
      if (d.ok) setLawyers(d.lawyers);
    });
  }, []);

  useEffect(() => {
    setDuration(DURATIONS[type][0].min);
  }, [type]);

  const price = DURATIONS[type].find((d) => d.min === duration)?.price ?? DURATIONS[type][0].price;

  const submit = async () => {
    setError(null);
    if (!name || !phone || !subject) {
      setError("لطفاً نام، شماره تماس و موضوع را وارد کنید.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/consultations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lawyer: lawyerSlug || undefined, type, duration, name, phone, subject, date, time }),
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error);
      setResult({ ticketNo: data.ticketNo, priceLabel: data.priceLabel });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (e) {
      setError(e instanceof Error ? e.message : "خطا در ثبت درخواست");
    } finally {
      setLoading(false);
    }
  };

  const fieldCls =
    "h-11 w-full rounded-xl border border-border-strong bg-background px-3 text-sm text-foreground outline-none transition-colors focus:border-primary";

  if (result) {
    return (
      <Container className="py-16">
        <div className="mx-auto max-w-lg text-center">
          <span className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-success/15 text-success">
            <Icon name="check" className="h-8 w-8" />
          </span>
          <h1 className="mt-5 text-2xl font-extrabold text-foreground">درخواست مشاوره ثبت شد!</h1>
          <p className="mt-2 text-sm leading-7 text-muted">
            کارشناسان شریفمند به‌زودی برای تأیید نوبت و پرداخت با شما تماس می‌گیرند.
          </p>
          <Card hover={false} className="mt-6 text-right">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <span className="text-sm text-muted">شماره پیگیری</span>
              <span className="font-mono text-base font-bold text-primary" dir="ltr">{result.ticketNo}</span>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-sm text-muted">مبلغ مشاوره</span>
              <span className="font-bold text-foreground">{result.priceLabel}</span>
            </div>
          </Card>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button href="/lawyers">مشاهده وکلای دیگر</Button>
            <Button href="/" variant="outline">بازگشت به خانه</Button>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <>
      <section className="border-b border-border bg-gradient-to-b from-surface-2/60 to-background py-8">
        <Container>
          <nav className="flex items-center gap-1.5 text-xs text-muted">
            <a href="/" className="hover:text-primary">خانه</a>
            <Icon name="chevron" className="h-3 w-3 rotate-180" />
            <span className="text-foreground-soft">رزرو مشاوره</span>
          </nav>
          <h1 className="mt-3 text-2xl font-extrabold text-foreground sm:text-3xl">رزرو مشاوره حقوقی آنلاین</h1>
          <p className="mt-2 text-sm leading-7 text-muted">
            نوع مشاوره و زمان را انتخاب کنید؛ در کمتر از ۲ دقیقه رزرو خود را نهایی کنید.
          </p>
        </Container>
      </section>

      <Container className="grid gap-8 py-10 lg:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          {/* Type */}
          <Card hover={false}>
            <h2 className="flex items-center gap-2 text-sm font-bold text-foreground">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">۱</span>
              نوع مشاوره را انتخاب کنید
            </h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {CONSULTATION_TYPES.map((c) => (
                <button
                  key={c.key}
                  type="button"
                  onClick={() => setType(c.key)}
                  className={`flex flex-col items-start gap-2 rounded-2xl border p-4 text-right transition-all cursor-pointer ${
                    type === c.key ? "border-primary bg-primary-soft ring-1 ring-primary" : "border-border hover:border-primary/40 hover:bg-surface-2"
                  }`}
                >
                  <span className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${type === c.key ? "bg-primary text-primary-foreground" : "bg-primary-soft text-primary"}`}>
                    <Icon name={c.icon as IconKey} className="h-5 w-5" />
                  </span>
                  <span className="text-sm font-bold text-foreground">{c.title}</span>
                  <span className="text-xs text-muted">{c.desc}</span>
                </button>
              ))}
            </div>
          </Card>

          {/* Duration + schedule */}
          <Card hover={false}>
            <h2 className="flex items-center gap-2 text-sm font-bold text-foreground">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">۲</span>
              مدت و زمان موردنظر
            </h2>
            <div className="mt-4 grid grid-cols-3 gap-2">
              {DURATIONS[type].map((d) => (
                <button
                  key={d.min}
                  type="button"
                  onClick={() => setDuration(d.min)}
                  className={`rounded-xl border px-3 py-3 text-center transition-all cursor-pointer ${
                    duration === d.min ? "border-primary bg-primary-soft" : "border-border hover:bg-surface-2"
                  }`}
                >
                  <p className="text-sm font-bold text-foreground">{faNum(d.min)} دقیقه</p>
                  <p className="mt-0.5 text-xs text-muted">{faNum(d.price.toLocaleString("en-US"))} ت</p>
                </button>
              ))}
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold text-muted">تاریخ پیشنهادی</span>
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={fieldCls} />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold text-muted">ساعت پیشنهادی</span>
                <select value={time} onChange={(e) => setTime(e.target.value)} className={fieldCls}>
                  <option value="">انتخاب ساعت</option>
                  {["۰۹:۰۰ تا ۱۱:۰۰", "۱۱:۰۰ تا ۱۳:۰۰", "۱۴:۰۰ تا ۱۶:۰۰", "۱۶:۰۰ تا ۱۸:۰۰", "۱۸:۰۰ تا ۲۰:۰۰"].map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </label>
            </div>
          </Card>

          {/* Contact */}
          <Card hover={false}>
            <h2 className="flex items-center gap-2 text-sm font-bold text-foreground">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">۳</span>
              اطلاعات تماس
            </h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold text-muted">نام و نام خانوادگی</span>
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="مثلاً علی رضایی" className={fieldCls} />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold text-muted">شماره موبایل</span>
                <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="09123456789" dir="ltr" className={fieldCls + " text-right"} />
              </label>
            </div>
            <label className="mt-3 flex flex-col gap-1.5">
              <span className="text-xs font-semibold text-muted">وکیل موردنظر (اختیاری)</span>
              <select value={lawyerSlug} onChange={(e) => setLawyerSlug(e.target.value)} className={fieldCls}>
                <option value="">بدون وکیل مشخص — معرفی بهترین وکیل</option>
                {lawyers.map((lw) => (
                  <option key={lw.slug} value={lw.slug}>{lw.name} — {lw.city}</option>
                ))}
              </select>
            </label>
            <label className="mt-3 flex flex-col gap-1.5">
              <span className="text-xs font-semibold text-muted">شرح موضوع / سؤال شما</span>
              <textarea value={subject} onChange={(e) => setSubject(e.target.value)} rows={3} placeholder="موضوع مشاوره را به اختصار بنویسید…" className={fieldCls + " h-auto resize-y py-2.5"} />
            </label>
            {error && (
              <div className="mt-3 rounded-xl border border-danger/30 bg-danger/5 px-3 py-2 text-xs text-danger">{error}</div>
            )}
            <Button onClick={submit} disabled={loading} icon="calendar" className="mt-4 w-full">
              {loading ? "در حال ثبت…" : "ثبت درخواست مشاوره"}
            </Button>
            <p className="mt-2 text-center text-[11px] text-muted">
              با ثبت درخواست، شرایط استفاده از خدمات شریفمند را می‌پذیرید. اطلاعات شما محرمانه است.
            </p>
          </Card>
        </div>

        {/* Summary */}
        <aside className="lg:sticky lg:top-20 lg:self-start">
          <Card hover={false} className="space-y-4">
            <h3 className="font-bold text-foreground">خلاصه رزرو</h3>
            <div className="space-y-2.5 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted">نوع مشاوره</span>
                <span className="font-medium text-foreground">{CONSULTATION_TYPES.find((c) => c.key === type)?.title}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted">مدت</span>
                <span className="font-medium text-foreground">{faNum(duration)} دقیقه</span>
              </div>
              {lawyerSlug && (
                <div className="flex items-center justify-between">
                  <span className="text-muted">وکیل</span>
                  <span className="font-medium text-foreground">{lawyers.find((l) => l.slug === lawyerSlug)?.name ?? "—"}</span>
                </div>
              )}
            </div>
            <div className="border-t border-border pt-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-foreground">مبلغ قابل پرداخت</span>
                <span className="text-lg font-extrabold text-primary">{faNum(price.toLocaleString("en-US"))} <span className="text-xs font-normal">تومان</span></span>
              </div>
            </div>
            <div className="rounded-xl bg-surface-2 p-3">
              <p className="flex items-start gap-2 text-xs leading-5 text-muted">
                <Icon name="lock" className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                پرداخت امن پس از تأیید درخواست، با تضمین بازگشت وجه.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge tone="success" icon="shield">تضمین بازگشت وجه</Badge>
              <Badge tone="primary" icon="lock">محرمانگی</Badge>
            </div>
          </Card>
        </aside>
      </Container>
    </>
  );
}

export default function ConsultationPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center text-sm text-muted">
          در حال بارگذاری…
        </div>
      }
    >
      <ConsultationContent />
    </Suspense>
  );
}
