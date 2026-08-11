import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { Container, Card, Button } from "@/components/ui";
import { Icon } from "@/components/icons";
import { Reveal } from "@/components/reveal";
import { SERVICE_CATEGORIES, SERVICE_STEPS } from "@/lib/content";

export const metadata: Metadata = {
  title: "خدمات حقوقی",
  description:
    "تمام خدمات حقوقی شریفمند در یک‌جا: خانواده، ملکی، کیفری، تجاری و اداری؛ از مشاوره و وکالت تا تنظیم قرارداد و اسناد.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        badge="خدمات حقوقی"
        title="راهکار حقوقی مناسب خود را پیدا کنید"
        desc="موضوع مشکل خود را انتخاب کنید؛ از مشاوره و وکالت تخصصی تا تنظیم قرارداد، دادخواست و خدمات ثبتی — همه با وکلای پایه یک دادگستری."
        breadcrumb={[{ label: "خانه", href: "/" }, { label: "خدمات حقوقی" }]}
      />

      <Container className="py-12">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICE_CATEGORIES.map((c, i) => (
            <Reveal key={c.slug} delay={i * 60}>
              <Card className="flex h-full flex-col">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary-soft text-primary">
                    <Icon name={c.icon} className="h-6 w-6" />
                  </span>
                  <div>
                    <h2 className="text-lg font-bold text-foreground">{c.name}</h2>
                    <p className="text-xs text-muted">{c.tagline}</p>
                  </div>
                </div>
                <p className="mt-4 flex-1 text-sm leading-7 text-foreground-soft">{c.desc}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {c.sub.map((s) => (
                    <Link
                      key={s.name}
                      href={s.href}
                      className="rounded-full border border-border bg-surface-2 px-3 py-1 text-xs font-medium text-foreground-soft transition-colors hover:border-primary/40 hover:text-primary"
                    >
                      {s.name}
                    </Link>
                  ))}
                </div>
                <Button href={`/services/${c.slug}`} variant="soft" icon="arrow" className="mt-5 w-full rotate-180">
                  مشاهده خدمت
                </Button>
              </Card>
            </Reveal>
          ))}
        </div>
      </Container>

      {/* How it works */}
      <Container className="py-10">
        <Reveal>
          <h2 className="text-center text-2xl font-bold text-foreground">از درخواست تا نتیجه، در ۶ گام</h2>
        </Reveal>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {SERVICE_STEPS.map((s, i) => (
            <Reveal key={s.title} delay={i * 50}>
              <Card hover={false} className="h-full">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">{i + 1}</span>
                <h3 className="mt-3 text-sm font-bold text-foreground">{s.title}</h3>
                <p className="mt-1 text-xs leading-5 text-muted">{s.desc}</p>
              </Card>
            </Reveal>
          ))}
        </div>
      </Container>

      <Container className="py-12">
        <Reveal>
          <div className="flex flex-col items-center justify-between gap-4 rounded-3xl border border-border bg-surface p-8 text-center card-shadow sm:flex-row sm:text-right">
            <div>
              <h2 className="text-xl font-bold text-foreground">مطمئن نیستید کدام خدمت مناسب شماست؟</h2>
              <p className="mt-1 text-sm text-muted">پرونده‌تان را ثبت کنید تا کارشناسان بهترین مسیر را پیشنهاد دهند.</p>
            </div>
            <div className="flex shrink-0 flex-wrap justify-center gap-3">
              <Button href="/cases/create" icon="folder">ثبت پرونده</Button>
              <Button href="/ai-assistant" variant="outline" icon="sparkles">پرسیدن از دستیار</Button>
            </div>
          </div>
        </Reveal>
      </Container>
    </>
  );
}
