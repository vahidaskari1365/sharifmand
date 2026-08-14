import Link from "next/link";
import { db } from "@/db";
import { lawyers, articles, qaQuestions, contracts } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { Container, SectionHeading, Button, Card } from "@/components/ui";
import { Icon } from "@/components/icons";
import { LawyerCard } from "@/components/lawyer-card";
import { HomeHero } from "@/components/home-hero";
import { QuickStart } from "@/components/quick-start";
import { Reveal } from "@/components/reveal";
import { Counter } from "@/components/counter";
import { SERVICES, CONSULTATION_TYPES, faNum, faPrice } from "@/lib/data";
import type { IconKey } from "@/lib/data";
import { SPECIAL_SERVICES } from "@/lib/content";
import { getPlatformStats } from "@/lib/stats";

export const dynamic = "force-dynamic";

const TRUST: { title: string; desc: string; icon: IconKey }[] = [
  { title: "احراز هویت و تأیید پروانه", desc: "هویت و پروانه همه وکلا توسط کارشناسان شریفمند راستی‌آزمایی می‌شود.", icon: "badge" },
  { title: "محرمانگی اطلاعات", desc: "اطلاعات شما محرمانه نگه‌داری می‌شود و طبق سیاست حریم خصوصی در اختیار غیر قرار نمی‌گیرد.", icon: "lock" },
  { title: "بازگشت وجه طبق سیاست شفاف", desc: "اگر خدمتی ارائه نشود، وجه شما طبق سیاست بازگشت وجه عودت داده می‌شود.", icon: "shield" },
  { title: "حل اختلاف شفاف", desc: "تیم پشتیبانی در صورت بروز اختلاف، رسیدگی بی‌طرفانه انجام می‌دهد.", icon: "balance" },
];

export default async function HomePage() {
  const [featured, recentArticles, popularQa, popularContracts, stats] = await Promise.all([
    db.select().from(lawyers).where(eq(lawyers.featured, true)).limit(4),
    db.select().from(articles).orderBy(desc(articles.publishedAt)).limit(3),
    db.select().from(qaQuestions).orderBy(desc(qaQuestions.helpful)).limit(3),
    db.select().from(contracts).where(eq(contracts.popular, true)).limit(3),
    getPlatformStats(),
  ]);

  // Real numbers only — nothing fabricated; a metric is hidden when unknown.
  const realStats: { to: number; label: string; icon: IconKey }[] = [
    ...(stats.verifiedLawyers != null ? [{ to: stats.verifiedLawyers, label: "وکیل تأییدشده", icon: "badge" as IconKey }] : []),
    ...(stats.registeredCases != null && stats.registeredCases > 0 ? [{ to: stats.registeredCases, label: "پرونده ثبت‌شده", icon: "folder" as IconKey }] : []),
    ...(stats.answeredQuestions != null && stats.answeredQuestions > 0 ? [{ to: stats.answeredQuestions, label: "پرسش حقوقی پاسخ‌داده‌شده", icon: "chat" as IconKey }] : []),
    ...(stats.publishedArticles != null && stats.publishedArticles > 0 ? [{ to: stats.publishedArticles, label: "مقاله حقوقی منتشرشده", icon: "book" as IconKey }] : []),
  ];

  return (
    <div className="page-wash">
      <HomeHero />

      {/* Stats — real, DB-derived counters only */}
      {realStats.length > 0 && (
        <Container>
          <Reveal>
            <div className="grid grid-cols-2 gap-4 rounded-3xl border border-border bg-surface/80 p-6 card-shadow backdrop-blur sm:grid-cols-4 sm:p-8">
              {realStats.map((s) => (
                <div key={s.label} className="flex flex-col items-center gap-1.5 text-center">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary-soft text-primary">
                    <Icon name={s.icon} className="h-5 w-5" />
                  </span>
                  <Counter
                    to={s.to}
                    className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl"
                  />
                  <span className="text-xs text-muted sm:text-sm">{s.label}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </Container>
      )}

      {/* Services grid */}
      <section className="mt-24">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="خدمات حقوقی"
              title="هر کمکی که نیاز دارید، اینجاست"
              desc="از وکیل‌یابی و مشاوره تا تنظیم اسناد و مدیریت پرونده؛ خدمات شریفمند را انتخاب کنید."
            />
          </Reveal>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((s, i) => (
              <Reveal key={s.title} delay={i * 40}>
                <Link
                  href={s.href}
                  className={`group flex h-full items-start gap-4 rounded-2xl border bg-surface p-5 card-shadow transition-all duration-200 hover:-translate-y-1 hover:shadow-[var(--shadow-lift)] ${
                    s.accent ? "border-accent/30" : "border-border hover:border-primary/30"
                  }`}
                >
                  <span
                    className={`inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-110 ${
                      s.accent ? "bg-accent-soft text-accent" : "bg-primary-soft text-primary"
                    }`}
                  >
                    <Icon name={s.icon} className="h-6 w-6" />
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-bold text-foreground">{s.title}</h3>
                      <Icon name="arrow" className="h-4 w-4 text-muted opacity-0 transition-opacity group-hover:opacity-100" />
                    </div>
                    <p className="mt-1 text-sm leading-6 text-muted">{s.desc}</p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Special services */}
      <section className="mt-24">
        <Container>
          <Reveal>
            <SectionHeading eyebrow="خدمات ویژه" title="سریع‌ترین راه‌حل‌ها، همین‌جا" desc="خدماتی که بیشترین تقاضا را دارند؛ با یک کلیک شروع کنید." />
          </Reveal>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {SPECIAL_SERVICES.map((s, i) => (
              <Reveal key={s.title} delay={i * 50}>
                <a
                  href={s.href}
                  className={`group flex h-full flex-col rounded-2xl border bg-surface p-5 card-shadow transition-all duration-200 hover:-translate-y-1 hover:shadow-[var(--shadow-lift)] ${s.accent ? "border-accent/40" : "border-border hover:border-primary/30"}`}
                >
                  <span className={`inline-flex h-11 w-11 items-center justify-center rounded-xl transition-transform group-hover:scale-110 ${s.accent ? "bg-accent text-accent-foreground" : "bg-primary-soft text-primary"}`}>
                    <Icon name={s.icon} className="h-5 w-5" />
                  </span>
                  <h3 className="mt-3 text-sm font-bold text-foreground">{s.title}</h3>
                  <p className="mt-1 text-xs leading-5 text-muted">{s.desc}</p>
                </a>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Quick start — decision engine */}
      <section id="quickstart" className="mt-24 scroll-mt-24">
        <Container>
          <Reveal>
            <QuickStart />
          </Reveal>
        </Container>
      </section>

      {/* Featured lawyers */}
      {featured.length > 0 && (
        <section className="mt-24">
          <Container>
            <Reveal>
              <div className="flex flex-wrap items-end justify-between gap-4">
                <SectionHeading
                  align="start"
                  eyebrow="وکیل‌یابی"
                  title="وکلای برتر و تأییدشده"
                  desc="از میان وکلای متخصص با پروانه معتبر، انتخاب کنید."
                />
                <Button href="/lawyers" variant="outline" icon="arrow" className="shrink-0">
                  همه وکلا
                </Button>
              </div>
            </Reveal>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {featured.map((l, i) => (
                <Reveal key={l.id} delay={i * 60}>
                  <LawyerCard lawyer={l} />
                </Reveal>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Consultation types */}
      <section className="mt-24">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="مشاوره آنلاین"
              title="به روش خودتان مشاوره بگیرید"
              desc="مشاوره متنی، صوتی یا تصویری با وکیل متخصص — در هر زمان و مکان."
            />
          </Reveal>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {CONSULTATION_TYPES.map((c, i) => (
              <Reveal key={c.key} delay={i * 70}>
                <Card className="flex h-full flex-col">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary-soft text-primary">
                    <Icon name={c.icon} className="h-6 w-6" />
                  </span>
                  <h3 className="mt-4 text-lg font-bold text-foreground">{c.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-muted">{c.desc}</p>
                  <ul className="mt-4 space-y-2 text-sm text-foreground-soft">
                    {(i === 0
                      ? ["پاسخ مکتوب و دقیق", "ذخیره سابقه گفتگو", "ارسال فایل و سند"]
                      : i === 1
                        ? ["تماس ۱۵ / ۳۰ / ۶۰ دقیقه", "یادآوری پیامکی", "ثبت صورت‌جلسه"]
                        : ["جلسه ویدئویی داخل پلتفرم", "اشتراک صفحه و فایل", "کیفیت بالا"]
                    ).map((f) => (
                      <li key={f} className="flex items-center gap-2">
                        <Icon name="check" className="h-4 w-4 shrink-0 text-success" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Button href="/consultation" variant="soft" icon="calendar" className="mt-5 w-full">
                    رزرو مشاوره
                  </Button>
                </Card>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* AI Assistant CTA */}
      <section className="mt-24">
        <Container>
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-primary to-primary-hover p-8 text-primary-foreground sm:p-12">
              <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-accent/25 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-24 -right-10 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
              <div className="relative grid items-center gap-8 lg:grid-cols-[1.5fr_1fr]">
                <div>
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur">
                    <Icon name="sparkles" className="h-4 w-4" /> هوش مصنوعی حقوقی
                  </span>
                  <h2 className="mt-4 text-2xl font-bold leading-snug sm:text-3xl">
                    دستیار حقوقی هوشمند، ۲۴ ساعته کنار شماست
                  </h2>
                  <p className="mt-3 max-w-xl text-sm leading-7 text-white/85">
                    موضوع مشکل خود را بنویسید؛ دستیار شریفمند موضوع را تشخیص می‌دهد، مراحل، مدارک و
                    ریسک‌ها را توضیح می‌دهد و شما را به وکیل متخصص وصل می‌کند.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    <Button href="/ai-assistant" variant="accent" icon="sparkles">شروع گفتگو با دستیار</Button>
                    <Button href="/ai-assistant?tab=contract" className="bg-white/15 text-white hover:bg-white/25">تحلیل قرارداد</Button>
                  </div>
                </div>
                <div className="hidden rounded-2xl bg-white/10 p-4 backdrop-blur lg:block">
                  <div className="flex items-center gap-2 border-b border-white/15 pb-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                      <Icon name="sparkles" className="h-4 w-4" />
                    </span>
                    <span className="text-sm font-semibold">دستیار شریفمند</span>
                  </div>
                  <div className="mt-3 space-y-2 text-xs">
                    <p className="rounded-xl rounded-tr-sm bg-white/15 px-3 py-2">مستأجر من سه ماه اجاره نداده، چه کنم؟</p>
                    <p className="rounded-xl rounded-tl-sm bg-white/25 px-3 py-2 leading-6">
                      موضوع ملک و اجاره شناسایی شد. طبق ماده ۴۹۴ قانون مدنی و ماده ۲ قانون روابط موجر و مستأجر
                      ۱۳۷۶، مدارک لازم: قرارداد اجاره و گواهی پرداخت. مراحل: اظهارنامه، دادخواست تخلیه، اجرای حکم…
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* Trust badges */}
      <section className="mt-24">
        <Container>
          <Reveal>
            <SectionHeading eyebrow="چرا شریفمند؟" title="اعتماد، اصل ماجراست" />
          </Reveal>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {TRUST.map((t, i) => (
              <Reveal key={t.title} delay={i * 60}>
                <Card className="h-full text-center">
                  <span className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent-soft text-accent">
                    <Icon name={t.icon} className="h-6 w-6" />
                  </span>
                  <h3 className="mt-4 text-sm font-bold text-foreground">{t.title}</h3>
                  <p className="mt-1.5 text-xs leading-6 text-muted">{t.desc}</p>
                </Card>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Knowledge + Q&A + Contracts */}
      <section className="mt-24">
        <Container>
          <div className="grid gap-8 lg:grid-cols-3">
            <Reveal>
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-foreground">جدیدترین مقالات</h2>
                <Link href="/knowledge" className="text-sm font-medium text-primary hover:text-primary-hover">همه ←</Link>
              </div>
              <div className="mt-4 space-y-3">
                {recentArticles.map((a) => (
                  <Link key={a.slug} href={`/knowledge/${a.slug}`} className="block rounded-2xl border border-border bg-surface p-4 transition-colors hover:border-primary/30 hover:bg-surface-2">
                    <div className="flex items-center gap-2 text-xs text-accent"><Icon name="book" className="h-3.5 w-3.5" />{a.category}</div>
                    <h3 className="mt-1.5 text-sm font-bold leading-6 text-foreground">{a.title}</h3>
                    <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted">{a.excerpt}</p>
                  </Link>
                ))}
              </div>
            </Reveal>

            <Reveal delay={80}>
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-foreground">پرسش و پاسخ</h2>
                <Link href="/qa" className="text-sm font-medium text-primary hover:text-primary-hover">همه ←</Link>
              </div>
              <div className="mt-4 space-y-3">
                {popularQa.map((q) => (
                  <Link key={q.slug} href={`/qa#${q.slug}`} className="block rounded-2xl border border-border bg-surface p-4 transition-colors hover:border-primary/30 hover:bg-surface-2">
                    <div className="flex items-start gap-2">
                      <Icon name="chat" className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <h3 className="text-sm font-bold leading-6 text-foreground">{q.question}</h3>
                    </div>
                    <p className="mt-1.5 line-clamp-2 text-xs leading-5 text-muted">{q.answer}</p>
                    <p className="mt-2 text-[11px] text-muted">پاسخ {q.lawyerName} • {faNum(q.helpful)} مفید</p>
                  </Link>
                ))}
              </div>
            </Reveal>

            <Reveal delay={160}>
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-foreground">قراردادهای پرطرفدار</h2>
                <Link href="/contracts" className="text-sm font-medium text-primary hover:text-primary-hover">همه ←</Link>
              </div>
              <div className="mt-4 space-y-3">
                {popularContracts.map((c) => (
                  <Link key={c.slug} href={`/contracts/${c.slug}`} className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-4 transition-colors hover:border-primary/30 hover:bg-surface-2">
                    <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
                      <Icon name={c.icon as IconKey} className="h-5 w-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-sm font-bold text-foreground">{c.title}</h3>
                      <p className="text-xs text-muted">از {faPrice(c.samplePrice)}</p>
                    </div>
                    <Icon name="chevron" className="h-4 w-4 shrink-0 rotate-180 text-muted" />
                  </Link>
                ))}
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Final CTA */}
      <section className="mt-24 pb-8">
        <Container>
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl border border-border bg-surface p-8 text-center card-shadow sm:p-12">
              <div className="pointer-events-none absolute inset-0 opacity-50" style={{ background: "linear-gradient(110deg, color-mix(in oklab, var(--primary) 14%, transparent), color-mix(in oklab, var(--accent) 12%, transparent), color-mix(in oklab, var(--primary) 14%, transparent))" }} />
              <div className="relative">
                <h2 className="text-2xl font-bold text-foreground sm:text-3xl">آماده‌اید مشکل حقوقی‌تان را حل کنید؟</h2>
                <p className="mx-auto mt-3 max-w-xl text-muted">
                  همین حالا وکیل متخصص خود را پیدا کنید یا پرونده‌تان را ثبت نمایید. تیم شریفمند کنار شماست.
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <Button href="/lawyers" size="lg" icon="search">پیدا کردن وکیل</Button>
                  <Button href="/case/new" size="lg" variant="outline" icon="folder">ثبت پرونده</Button>
                </div>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>
    </div>
  );
}
