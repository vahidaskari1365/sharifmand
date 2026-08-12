"use client";

import { Icon } from "./icons";

/**
 * Hero background for a legal platform.
 * Calm and premium: soft page wash, faint grid, subtle icon accents and
 * floating trust cards. No spinning/decorative-only animation (per
 * UI/UX Pro Max: motion must convey meaning; decorative animation is an
 * anti-pattern). All decorative layers are pointer-events-none.
 */
export function HeroScene() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="page-wash absolute inset-0" />

      {/* Soft aurora washes (static, no drift) */}
      <div className="absolute -top-24 right-[12%] h-80 w-80 opacity-40">
        <div
          className="h-full w-full rounded-full blur-[80px]"
          style={{ background: "radial-gradient(closest-side, var(--primary), transparent)" }}
        />
      </div>
      <div className="absolute top-10 left-[8%] h-72 w-72 opacity-30">
        <div
          className="h-full w-full rounded-full blur-[80px]"
          style={{ background: "radial-gradient(closest-side, var(--accent), transparent)" }}
        />
      </div>

      {/* Faint grid */}
      <div className="hero-grid absolute inset-0" />

      {/* Subtle legal icon accents — static, large, low opacity */}
      <div className="absolute left-[6%] top-[18%] hidden opacity-[0.06] lg:block">
        <Icon name="gavel" className="h-36 w-36 text-primary" />
      </div>
      <div className="absolute right-[7%] top-[62%] hidden opacity-[0.05] xl:block">
        <Icon name="landmark" className="h-44 w-44 text-primary" />
      </div>
      <div className="absolute bottom-[10%] left-[12%] hidden opacity-[0.05] xl:block">
        <Icon name="document" className="h-32 w-32 text-primary" />
      </div>

      {/* Floating glass trust cards */}
      <FloatCard className="right-[5%] top-[20%] hidden lg:flex" icon="badge" title="وکیل تأییدشده" sub="احراز هویتشده" tone="primary" />
      <FloatCard className="left-[4%] top-[30%] hidden lg:flex" icon="star" title="۴٫۸ از ۵" sub="امتیاز کاربران" tone="accent" />
      <FloatCard className="right-[9%] bottom-[14%] hidden xl:flex" icon="bolt" title="پاسخ سریع" sub="کمتر از ۳۰ دقیقه" tone="success" />
      <FloatCard className="left-[7%] bottom-[18%] hidden xl:flex" icon="lock" title="اطلاعات محرمانه" sub="رمزنگاریشده" tone="primary" />

      {/* Scroll cue */}
      <div className="absolute bottom-5 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-1 md:flex">
        <span className="text-[10px] font-medium text-muted">برای کشف، اسکرول کنید</span>
        <span className="flex h-9 w-5 items-start justify-center rounded-full border-2 border-border-strong p-1">
          <span className="h-2 w-1 rounded-full bg-muted-soft animate-scroll-cue" />
        </span>
      </div>
    </div>
  );
}

function FloatCard({
  className,
  icon,
  title,
  sub,
  tone,
}: {
  className?: string;
  icon: "badge" | "star" | "bolt" | "lock";
  title: string;
  sub: string;
  tone: "primary" | "accent" | "success";
}) {
  const toneCls =
    tone === "accent"
      ? "bg-accent-soft text-accent"
      : tone === "success"
        ? "bg-[color-mix(in_oklab,var(--success)_18%,transparent)] text-success"
        : "bg-primary-soft text-primary";
  return (
    <div className={`absolute ${className}`}>
      <div className="flex items-center gap-2.5 rounded-2xl border border-border bg-surface/85 px-3.5 py-2.5 shadow-[var(--shadow-lift)] backdrop-blur-md">
        <span className={`inline-flex h-8 w-8 items-center justify-center rounded-lg ${toneCls}`}>
          <Icon name={icon} className="h-4 w-4" />
        </span>
        <div className="leading-tight">
          <p className="text-xs font-bold text-foreground">{title}</p>
          <p className="text-[10px] text-muted">{sub}</p>
        </div>
      </div>
    </div>
  );
}
