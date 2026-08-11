import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { Container, Card, Button } from "@/components/ui";
import { Icon } from "@/components/icons";
import { Reveal } from "@/components/reveal";
import { faNum } from "@/lib/data";

export const metadata: Metadata = {
  title: "رزرو مشاوره",
  description: "فرایند رزرو مشاوره حقوقی: انتخاب خدمت، وکیل، تاریخ و ساعت، ثبت و پرداخت.",
  alternates: { canonical: "/booking" },
};

const STEPS = [
  { title: "انتخاب خدمت", desc: "نوع مشاوره را مشخص کنید.", icon: "chat" as const },
  { title: "انتخاب وکیل", desc: "وکیل متخصص مرتبط.", icon: "user" as const },
  { title: "انتخاب تاریخ و ساعت", desc: "زمان مناسب خود را برگزینید.", icon: "calendar" as const },
  { title: "ثبت اطلاعات", desc: "اطلاعات تماس و موضوع.", icon: "document" as const },
  { title: "پرداخت امن", desc: "پرداخت آنلاین با تضمین بازگشت.", icon: "money" as const },
  { title: "تأیید رزرو", desc: "جزئیات جلسه و لینک جلسه.", icon: "check" as const },
];

export default function BookingPage() {
  return (
    <>
      <PageHero
        badge="رزرو مشاوره"
        title="در چند گام، مشاوره خود را رزرو کنید"
        desc="از انتخاب خدمت و وکیل تا پرداخت امن و دریافت لینک جلسه؛ تمام فرایند آنلاین و شفاف."
        breadcrumb={[{ label: "خانه", href: "/" }, { label: "رزرو مشاوره" }]}
      >
        <Button href="/consultation" icon="calendar">شروع رزرو</Button>
      </PageHero>

      <Container className="py-12">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {STEPS.map((s, i) => (
            <Reveal key={s.title} delay={i * 50}>
              <Card className="flex h-full items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">{faNum(i + 1)}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-foreground">{s.title}</h3>
                    <Icon name={s.icon} className="h-4 w-4 text-accent" />
                  </div>
                  <p className="mt-1 text-xs leading-5 text-muted">{s.desc}</p>
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      </Container>

      <Container className="py-8">
        <Reveal>
          <Card hover={false} className="flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-right">
            <div>
              <h2 className="text-xl font-bold text-foreground">پس از رزرو چه می‌شود؟</h2>
              <p className="mt-1 text-sm text-muted">جزئیات جلسه (وکیل، تاریخ، ساعت، نوع جلسه و لینک) در پنل شما نمایش داده می‌شود و امکان لغو طبق مقررات وجود دارد.</p>
            </div>
            <Button href="/consultation" className="shrink-0" icon="calendar">همین حالا رزرو کنید</Button>
          </Card>
        </Reveal>
      </Container>
    </>
  );
}
