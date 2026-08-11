"use client";

import { useEffect, useRef } from "react";
import { Icon } from "./icons";

/**
 * Cinematic, scroll-linked hero background for a legal platform.
 * Parallax lives on outer wrappers (inline transform); CSS float/drift
 * animations live on inner elements so they never fight each other.
 */
export function HeroScene() {
  const layers = useRef<HTMLElement[]>([]);

  const register = (el: HTMLElement | null, speed: number) => {
    if (el && !layers.current.includes(el)) {
      el.dataset.speed = String(speed);
      layers.current.push(el);
    }
  };

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        for (const el of layers.current) {
          const s = Number(el.dataset.speed || 0);
          el.style.transform = `translate3d(0, ${y * s}px, 0)`;
        }
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="page-wash absolute inset-0" />

      {/* Aurora blobs */}
      <div ref={(el) => register(el, 0.12)} className="absolute -top-24 right-[12%] h-80 w-80">
        <div
          className="aurora-blob h-full w-full animate-drift opacity-50"
          style={{ background: "radial-gradient(closest-side, var(--primary), transparent)" }}
        />
      </div>
      <div ref={(el) => register(el, 0.08)} className="absolute top-10 left-[8%] h-72 w-72">
        <div
          className="aurora-blob h-full w-full animate-drift-rev opacity-40"
          style={{ background: "radial-gradient(closest-side, var(--accent), transparent)" }}
        />
      </div>

      {/* Faint grid */}
      <div ref={(el) => register(el, 0.05)} className="hero-grid absolute inset-0" />

      {/* Giant rotating scales of justice (centered + spinning, no parallax) */}
      <div className="absolute left-1/2 top-[44%] -z-10 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 opacity-[0.05]">
        <Icon name="balance" className="h-full w-full animate-spin-slow" />
      </div>

      {/* Floating glass trust cards */}
      <FloatCard speed={0.22} className="right-[5%] top-[20%] hidden lg:flex" icon="badge" title="وکیل تأییدشده" sub="احراز هویت‌شده" tone="primary" register={register} />
      <FloatCard speed={0.16} className="left-[4%] top-[30%] hidden lg:flex" icon="star" title="۴٫۸ از ۵" sub="امتیاز کاربران" tone="accent" register={register} />
      <FloatCard speed={0.28} className="right-[9%] bottom-[14%] hidden xl:flex" icon="bolt" title="پاسخ سریع" sub="کمتر از ۳۰ دقیقه" tone="success" register={register} />
      <FloatCard speed={0.2} className="left-[7%] bottom-[18%] hidden xl:flex" icon="lock" title="اطلاعات محرمانه" sub="رمزنگاری‌شده" tone="primary" register={register} />

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
  register,
  speed,
  className,
  icon,
  title,
  sub,
  tone,
}: {
  register: (el: HTMLElement | null, speed: number) => void;
  speed: number;
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
    <div ref={(el) => register(el, speed)} className={`absolute ${className}`}>
      <div className="flex animate-float items-center gap-2.5 rounded-2xl border border-border bg-surface/85 px-3.5 py-2.5 shadow-[var(--shadow-lift)] backdrop-blur-md">
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
