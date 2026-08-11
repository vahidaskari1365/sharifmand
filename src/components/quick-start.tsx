"use client";

import { useState } from "react";
import { Button } from "./ui";
import { Icon } from "./icons";
import { LEGAL_TOPICS, ALL_CITIES, faNum } from "@/lib/data";
import type { IconKey } from "@/lib/data";

const STAGES = ["هنوز اقدامی نکرده‌ام", "اظهارنامه/اخطار داده‌ام", "در دادگاه/دادسراست", "رأی صادر شده", "مرحله اجرا"];
const HELPS = [
  { key: "consult", label: "مشاوره و راهنمایی", icon: "chat" as IconKey },
  { key: "lawyer", label: "استخدام وکیل", icon: "user" as IconKey },
  { key: "doc", label: "تنظیم سند/قرارداد", icon: "document" as IconKey },
];

export function QuickStart() {
  const [step, setStep] = useState(0);
  const [topic, setTopic] = useState<string | null>(null);
  const [city, setCity] = useState<string | null>(null);
  const [stage, setStage] = useState<string | null>(null);
  const [help, setHelp] = useState<string | null>(null);

  const steps = [topic, city, stage, help];
  const canNext = steps[step] !== null;
  const total = 4;

  const recommendation = () => {
    if (help === "lawyer") return { title: "استخدام وکیل متخصص", href: `/lawyers${topic ? `?sp=${encodeURIComponent(topic)}` : ""}`, icon: "user" as IconKey };
    if (help === "doc") return { title: "تنظیم سند حقوقی", href: `/contracts${topic ? `?q=${encodeURIComponent(topic)}` : ""}`, icon: "document" as IconKey };
    return { title: "مشاوره با وکیل متخصص", href: `/ai-assistant${topic ? `?q=${encodeURIComponent("مشکل " + topic)}` : ""}`, icon: "chat" as IconKey };
  };

  const reset = () => {
    setStep(0); setTopic(null); setCity(null); setStage(null); setHelp(null);
  };

  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-surface shadow-[var(--shadow-lift)]">
      <div className="grid lg:grid-cols-[1fr_1.3fr]">
        {/* Side panel */}
        <div className="relative hidden flex-col justify-between bg-gradient-to-br from-primary to-primary-hover p-8 text-primary-foreground lg:flex">
          <div>
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-white/15">
              <Icon name="bolt" className="h-6 w-6" />
            </span>
            <h3 className="mt-5 text-2xl font-bold leading-snug">مشکل حقوقی‌تان را در ۲ دقیقه مشخص کنید</h3>
            <p className="mt-3 text-sm leading-7 text-white/80">
              به چند سؤال کوتاه پاسخ دهید تا بهترین اقدام بعدی و وکلای مناسب را پیشنهاد دهیم.
            </p>
          </div>
          <div className="mt-8">
            <div className="flex items-center gap-2">
              {Array.from({ length: total }).map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                    i <= step ? "bg-accent" : "bg-white/20"
                  }`}
                />
              ))}
            </div>
            <p className="mt-2 text-xs text-white/70">گام {faNum(step + 1)} از {faNum(total)}</p>
          </div>
        </div>

        {/* Steps */}
        <div className="p-6 sm:p-8">
          {step < total ? (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-accent">
                مسیر سریع شریفمند
              </p>
              {step === 0 && (
                <h4 className="mt-2 text-xl font-bold text-foreground">موضوع پرونده شما چیست؟</h4>
              )}
              {step === 1 && (
                <h4 className="mt-2 text-xl font-bold text-foreground">در کدام شهر هستید؟</h4>
              )}
              {step === 2 && (
                <h4 className="mt-2 text-xl font-bold text-foreground">پرونده در چه مرحله‌ای است؟</h4>
              )}
              {step === 3 && (
                <h4 className="mt-2 text-xl font-bold text-foreground">چه کمکی می‌خواهید؟</h4>
              )}

              <div className="mt-5">
                {step === 0 && (
                  <div className="flex flex-wrap gap-2">
                    {LEGAL_TOPICS.map((t) => (
                      <button
                        key={t.label}
                        type="button"
                        onClick={() => setTopic(t.label)}
                        className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm font-medium transition-all cursor-pointer ${
                          topic === t.label
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border text-foreground-soft hover:border-primary/40 hover:bg-primary-soft"
                        }`}
                      >
                        <Icon name={t.icon} className="h-4 w-4" />
                        {t.label}
                      </button>
                    ))}
                  </div>
                )}

                {step === 1 && (
                  <div className="flex flex-wrap gap-2">
                    {ALL_CITIES.slice(0, 18).map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setCity(c)}
                        className={`rounded-full border px-3.5 py-2 text-sm font-medium transition-all cursor-pointer ${
                          city === c ? "border-primary bg-primary text-primary-foreground" : "border-border text-foreground-soft hover:bg-primary-soft"
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                )}

                {step === 2 && (
                  <div className="flex flex-col gap-2">
                    {STAGES.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setStage(s)}
                        className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-right text-sm font-medium transition-all cursor-pointer ${
                          stage === s ? "border-primary bg-primary-soft text-primary" : "border-border text-foreground-soft hover:bg-surface-2"
                        }`}
                      >
                        <span className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${stage === s ? "border-primary bg-primary text-primary-foreground" : "border-border-strong"}`}>
                          {stage === s && <Icon name="check" className="h-3 w-3" />}
                        </span>
                        {s}
                      </button>
                    ))}
                  </div>
                )}

                {step === 3 && (
                  <div className="grid gap-2 sm:grid-cols-3">
                    {HELPS.map((h) => (
                      <button
                        key={h.key}
                        type="button"
                        onClick={() => setHelp(h.key)}
                        className={`flex flex-col items-center gap-2 rounded-xl border px-4 py-5 text-center text-sm font-medium transition-all cursor-pointer ${
                          help === h.key ? "border-primary bg-primary-soft text-primary" : "border-border text-foreground-soft hover:bg-surface-2"
                        }`}
                      >
                        <Icon name={h.icon} className="h-6 w-6" />
                        {h.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-6 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => (step === 0 ? reset() : setStep((s) => s - 1))}
                  className="text-sm font-medium text-muted transition-colors hover:text-foreground"
                >
                  {step === 0 ? "" : "→ قبلی"}
                </button>
                <Button onClick={() => setStep((s) => s + 1)} disabled={!canNext} icon="arrow" className="rotate-180">
                  ادامه
                </Button>
              </div>
            </div>
          ) : (
            <div className="animate-scale-in">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-success/15 text-success">
                <Icon name="check" className="h-6 w-6" />
              </span>
              <h4 className="mt-4 text-xl font-bold text-foreground">بهترین اقدام بعدی برای شما:</h4>
              <p className="mt-1 text-sm text-muted">
                {recommendation().title}{topic ? ` در حوزه «${topic}»` : ""}{city ? ` در شهر ${city}` : ""}.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button href={recommendation().href} icon={recommendation().icon}>
                  شروع کنید
                </Button>
                <Button href="/case/new" variant="outline" icon="folder">
                  ثبت کامل پرونده
                </Button>
              </div>
              <button
                type="button"
                onClick={reset}
                className="mt-5 text-sm font-medium text-primary transition-colors hover:text-primary-hover"
              >
                شروع دوباره
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
