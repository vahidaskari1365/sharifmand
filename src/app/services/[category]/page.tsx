import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { Container, Card, Button, Badge, StarRating } from "@/components/ui";
import { Icon } from "@/components/icons";
import { Reveal } from "@/components/reveal";
import { db } from "@/db";
import { lawyers } from "@/db/schema";
import { or, sql } from "drizzle-orm";
import { SERVICE_CATEGORIES, SERVICE_STEPS } from "@/lib/content";
import { faNum } from "@/lib/data";

export const revalidate = 300;

const CATEGORY_SPECIALTIES: Record<string, string[]> = {
  family: ["خانواده", "ارث"],
  property: ["ملک"],
  criminal: ["کیفری"],
  commercial: ["قراردادها", "تجارت", "شرکت‌ها", "چک و اسناد"],
  administrative: ["کار", "مالیاتی"],
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const c = SERVICE_CATEGORIES.find((x) => x.slug === category);
  if (!c) return { title: "خدمت یافت نشد" };
  return {
    title: `خدمات حقوقی ${c.name}`,
    description: c.desc,
    alternates: { canonical: `/services/${category}` },
  };
}

export default async function ServiceCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const cat = SERVICE_CATEGORIES.find((x) => x.slug === category);
  if (!cat) return notFoundUi();

  const specs = CATEGORY_SPECIALTIES[category] ?? [];
  const lawyersList = specs.length
    ? await db
        .select()
        .from(lawyers)
        .where(or(...specs.map((s) => sql`${lawyers.specialties} @> ARRAY[${s}]::text[]`)))
        .limit(4)
    : [];

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      { "@type": "Question", name: `هزینه مشاوره ${cat.name} چقدر است؟`, acceptedAnswer: { "@type": "Answer", text: "هزینه بسته به نوع مشاوره (متنی، صوتی، تصویری) متفاوت است و در هر پروفایل وکیل مشخص شده." } },
      { "@type": "Question", name: `چقدر طول می‌کشد؟`, acceptedAnswer: { "@type": "Answer", text: "زمان بسته به پیچیدگی پرونده متغیر است؛ مشاوره اولیه معمولاً همان روز انجام می‌شود." } },
    ],
  };

  return (
    <>
      <PageHero
        badge={`خدمات ${cat.name}`}
        title={`وکیل و مشاوره تخصصی ${cat.name}`}
        desc={cat.desc}
        breadcrumb={[{ label: "خانه", href: "/" }, { label: "خدمات", href: "/services" }, { label: cat.name }]}
      >
        <div className="flex flex-wrap gap-2">
          <Button href="/consultation" icon="chat">درخواست مشاوره</Button>
          <Button href="/cases/create" variant="outline" icon="folder">ثبت پرونده</Button>
        </div>
      </PageHero>

      <Container className="py-12">
        {/* Sub-services */}
        <h2 className="text-xl font-bold text-foreground">خدمات این حوزه</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cat.sub.map((s, i) => (
            <Reveal key={s.name} delay={i * 50}>
              <a href={s.href} className="group flex h-full flex-col rounded-2xl border border-border bg-surface p-5 card-shadow transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-accent-soft text-accent">
                  <Icon name={cat.icon} className="h-5 w-5" />
                </span>
                <h3 className="mt-3 text-sm font-bold text-foreground">{s.name}</h3>
                <span className="mt-auto pt-4 text-xs font-semibold text-primary">شروع ←</span>
              </a>
            </Reveal>
          ))}
        </div>
      </Container>

      {/* Process */}
      <Container className="py-6">
        <h2 className="text-xl font-bold text-foreground">مراحل کار</h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {SERVICE_STEPS.map((s, i) => (
            <div key={s.title} className="rounded-2xl border border-border bg-surface p-4">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-soft text-xs font-bold text-primary">{faNum(i + 1)}</span>
              <h3 className="mt-2 text-sm font-bold text-foreground">{s.title}</h3>
            </div>
          ))}
        </div>
      </Container>

      {/* Required docs */}
      <Container className="py-6">
        <Card hover={false}>
          <h2 className="flex items-center gap-2 text-lg font-bold text-foreground"><Icon name="folder" className="h-5 w-5 text-primary" /> مدارک معمول موردنیاز</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {["مدارک هویتی", "اسناد و قراردادهای مرتبط", "مدارک موضوع پرونده", "استشهادیه (در صورت نیاز)"].map((d) => (
              <Badge key={d} tone="neutral">{d}</Badge>
            ))}
          </div>
        </Card>
      </Container>

      {/* Specialist lawyers */}
      {lawyersList.length > 0 && (
        <Container className="py-8">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-foreground">وکلای متخصص {cat.name}</h2>
            <Button href="/lawyers" variant="outline" size="sm" icon="arrow" className="">همه وکلا</Button>
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {lawyersList.map((l) => (
              <a key={l.id} href={`/lawyers/${l.slug}`} className="rounded-2xl border border-border bg-surface p-4 card-shadow transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]">
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-xs font-bold text-white" style={{ background: l.avatarColor }}>{l.name.slice(0, 1)}</span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-foreground">{l.name}</p>
                    <p className="text-[11px] text-muted">{l.city}</p>
                  </div>
                </div>
                <div className="mt-2"><StarRating rating={l.rating} count={l.reviewCount} /></div>
              </a>
            ))}
          </div>
        </Container>
      )}

      <Container className="py-12">
        <Reveal>
          <div className="rounded-3xl border border-border bg-gradient-to-br from-primary to-primary-hover p-8 text-center text-primary-foreground">
            <h2 className="text-xl font-bold">در زمینه‌ی {cat.name} نیاز به مشاوره دارید؟</h2>
            <p className="mx-auto mt-2 max-w-lg text-sm text-white/85">همین حالا مشاوره رزرو کنید یا پرونده‌تان را ثبت نمایید.</p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <Button href="/consultation" variant="accent" icon="chat">رزرو مشاوره</Button>
              <Button href="/cases/create" className="bg-white/15 text-white hover:bg-white/25" icon="folder">ثبت پرونده</Button>
            </div>
          </div>
        </Reveal>
      </Container>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
    </>
  );
}

function notFoundUi() {
  return (
    <Container className="py-20 text-center">
      <h1 className="text-2xl font-bold text-foreground">خدمت یافت نشد</h1>
      <p className="mt-2 text-muted">دسته‌بندی موردنظر وجود ندارد.</p>
      <Button href="/services" className="mt-6">بازگشت به خدمات</Button>
    </Container>
  );
}
