"use client";

import { useState } from "react";
import { PageHero } from "@/components/page-hero";
import { Container, Card, Button } from "@/components/ui";
import { Icon } from "@/components/icons";
import { LEGAL_TOPICS, ALL_CITIES, faNum } from "@/lib/data";

const STAGES = ["ثبت اولیه", "بررسی مدارک", "در دادگاه/دادسرا", "صدور رأی", "مرحله اجرا"];
const STEPS = ["نوع پرونده", "شرح ماجرا", "شهر و مرحله", "اطلاعات تماس"];

export default function CreateCasePage() {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [f, setF] = useState({ subject: "", description: "", city: "", stage: "ثبت اولیه", name: "", phone: "" });
  const set = (k: keyof typeof f, v: string) => setF((p) => ({ ...p, [k]: v }));

  const canNext = (step === 0 && f.subject) || (step === 1 && f.description) || (step === 2 && f.city) || step === 3;
  const fieldCls = "h-11 w-full rounded-xl border border-border-strong bg-background px-3 text-sm text-foreground outline-none transition-colors focus:border-primary";

  const submit = async () => {
    setErr(null);
    if (!f.name || !f.phone) { setErr("نام و شماره تماس الزامی است."); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/cases", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(f) });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error);
      setDone(data.caseNumber);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (e) {
      setErr(e instanceof Error ? e.message : "خطا در ثبت");
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <Container className="py-16">
        <div className="mx-auto max-w-lg text-center">
          <span className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-success/15 text-success"><Icon name="check" className="h-8 w-8" /></span>
          <h1 className="mt-5 text-2xl font-extrabold text-foreground">پرونده ثبت شد!</h1>
          <p className="mt-2 text-sm text-muted">شماره پرونده: <span className="font-bold text-primary" dir="ltr">{done}</span></p>
          <p className="mt-1 text-sm text-muted">کارشناسان بررسی و وکلای مرتبط را معرفی می‌کنند.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button href="/dashboard/cases/1258-0001">مشاهده در پنل</Button>
            <Button href="/consultation" variant="outline" icon="chat">مشاوره فوری</Button>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <>
      <PageHero badge="ثبت پرونده" title="پرونده‌ی خود را ثبت کنید" desc="اطلاعات را مرحله‌به‌مرحله وارد کنید تا توسط کارشناسان بررسی و به وکلای متخصص معرفی شود." breadcrumb={[{ label: "خانه", href: "/" }, { label: "ثبت پرونده" }]} />
      <Container className="py-12">
        <div className="mx-auto max-w-2xl">
          <div className="mb-6 flex items-center gap-2">
            {STEPS.map((s, i) => (
              <div key={s} className="flex flex-1 flex-col items-center gap-1.5">
                <span className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${i <= step ? "bg-primary text-primary-foreground" : "bg-surface-2 text-muted"}`}>{i < step ? <Icon name="check" className="h-4 w-4" /> : faNum(i + 1)}</span>
                <span className={`hidden text-[10px] sm:block ${i === step ? "font-bold text-foreground" : "text-muted"}`}>{s}</span>
              </div>
            ))}
          </div>

          <Card hover={false} className="min-h-[260px]">
            {step === 0 && (
              <div>
                <h2 className="text-lg font-bold text-foreground">نوع پرونده</h2>
                <div className="mt-4 flex flex-wrap gap-2">
                  {LEGAL_TOPICS.map((t) => (
                    <button key={t.label} type="button" onClick={() => set("subject", t.label)} className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all cursor-pointer ${f.subject === t.label ? "border-primary bg-primary text-primary-foreground" : "border-border text-foreground-soft hover:bg-primary-soft"}`}>
                      <Icon name={t.icon} className="h-3.5 w-3.5" /> {t.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {step === 1 && (
              <label className="block"><span className="text-sm font-bold text-foreground">شرح ماجرا</span><textarea value={f.description} onChange={(e) => set("description", e.target.value)} rows={6} placeholder="اتفاقی که افتاده، طرف مقابل و خواسته‌تان را بنویسید…" className={`${fieldCls} mt-3 h-auto resize-y py-2.5`} /></label>
            )}
            {step === 2 && (
              <div className="space-y-3">
                <label className="block"><span className="text-sm font-bold text-foreground">شهر</span>
                  <select value={f.city} onChange={(e) => set("city", e.target.value)} className={`${fieldCls} mt-2`}><option value="">انتخاب شهر</option>{ALL_CITIES.map((c) => <option key={c} value={c}>{c}</option>)}</select>
                </label>
                <div><span className="text-sm font-bold text-foreground">مرحله پرونده</span>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {STAGES.map((s) => (
                      <button key={s} type="button" onClick={() => set("stage", s)} className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-all cursor-pointer ${f.stage === s ? "border-accent bg-accent-soft text-accent" : "border-border text-foreground-soft hover:bg-surface-2"}`}>{s}</button>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {step === 3 && (
              <div className="space-y-3">
                <label className="block"><span className="text-sm font-bold text-foreground">نام و نام خانوادگی</span><input value={f.name} onChange={(e) => set("name", e.target.value)} className={`${fieldCls} mt-2`} placeholder="نام شما" /></label>
                <label className="block"><span className="text-sm font-bold text-foreground">شماره موبایل</span><input value={f.phone} onChange={(e) => set("phone", e.target.value)} className={`${fieldCls} mt-2`} placeholder="09123456789" dir="ltr" style={{ textAlign: "right" }} /></label>
                {err && <p className="text-xs text-danger">{err}</p>}
              </div>
            )}

            <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
              <button type="button" onClick={() => setStep((s) => Math.max(0, s - 1))} className="text-sm font-medium text-muted hover:text-foreground">{step === 0 ? "" : "→ قبلی"}</button>
              {step < 3 ? (
                <Button onClick={() => setStep((s) => s + 1)} disabled={!canNext} icon="arrow" className="rotate-180">مرحله‌ی بعد</Button>
              ) : (
                <Button onClick={submit} disabled={loading} icon="folder">{loading ? "در حال ثبت…" : "ثبت نهایی پرونده"}</Button>
              )}
            </div>
          </Card>
        </div>
      </Container>
    </>
  );
}
