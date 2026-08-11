"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Container, Logo, Button } from "./ui";
import { Icon } from "./icons";
import { ThemeToggle } from "./theme-toggle";
import { NAV } from "@/lib/data";
import type { IconKey } from "@/lib/data";

const childIcon = (label: string): IconKey => {
  const m: Record<string, IconKey> = {
    "مشاوره حقوقی": "chat",
    "درخواست وکیل": "user",
    "تنظیم قرارداد": "document",
    "تنظیم دادخواست و شکواییه": "gavel",
    "تنظیم اسناد": "document",
    "بررسی قرارداد": "file",
    "خدمات ثبتی": "stamp",
    "همه وکلا": "search",
    "وکلای خانواده": "family",
    "وکلای ملکی": "home",
    "وکلای کیفری": "shield",
    "وکلا بر اساس شهر": "location",
    "جستجوی وکیل": "search",
    "تخصص‌ها": "scale",
    "شهرها": "landmark",
    "مقالات": "book",
    "قوانین": "landmark",
    "آرای قضایی": "gavel",
    "پرسش و پاسخ": "chat",
    "واژه‌نامه حقوقی": "book",
    "دستیار حقوقی AI": "sparkles",
    "دستیار هوش مصنوعی": "sparkles",
    "تحلیل قرارداد": "file",
    "قراردادساز": "document",
    "فرم‌های حقوقی": "file",
    "تعرفه خدمات": "money",
  };
  return m[label] ?? "arrow";
};

export function Header() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setOpenMenu(null);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? "glass border-b border-border shadow-sm" : "bg-transparent"
      }`}
    >
      <Container className="flex h-16 items-center justify-between gap-4 lg:h-18">
        {/* Right (logo) — RTL */}
        <Link href="/" className="shrink-0" aria-label="شریفمند — خانه">
          <Logo />
        </Link>

        {/* Center nav */}
        <nav className="hidden lg:block" onMouseLeave={() => setOpenMenu(null)}>
          <ul className="flex items-center gap-1">
            {NAV.map((item) => (
              <li key={item.label} className="relative">
                <button
                  type="button"
                  className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-foreground-soft transition-colors hover:bg-surface-2 hover:text-foreground"
                  onMouseEnter={() => setOpenMenu(item.children ? item.label : null)}
                  onClick={() => setOpenMenu(openMenu === item.label ? null : item.label)}
                  aria-expanded={openMenu === item.label}
                >
                  {item.label}
                  {item.children && (
                    <Icon name="check" className="h-3 w-3 rotate-90 opacity-60" />
                  )}
                </button>
                {item.children && openMenu === item.label && (
                  <div
                    className="absolute right-0 top-full z-50 w-72 animate-scale-in pt-2"
                    onMouseEnter={() => setOpenMenu(item.label)}
                  >
                    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-2 shadow-[var(--shadow-lift)]">
                      {item.children.map((c) => (
                        <Link
                          key={c.label}
                          href={c.href}
                          className="flex items-start gap-3 rounded-xl p-2.5 transition-colors hover:bg-surface-2"
                        >
                          <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary">
                            <Icon name={childIcon(c.label)} className="h-4 w-4" />
                          </span>
                          <span className="flex flex-col">
                            <span className="text-sm font-semibold text-foreground">{c.label}</span>
                            {c.desc && <span className="text-xs text-muted">{c.desc}</span>}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Left actions */}
        <div className="flex items-center gap-2">
          <ThemeToggle compact />
          <a
            href="/dashboard/client"
            className="hidden items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium text-foreground-soft transition-colors hover:bg-surface-2 hover:text-foreground sm:inline-flex"
          >
            <Icon name="user" className="h-4 w-4" />
            ورود
          </a>
          <Button href="/consultation" size="sm" icon="calendar" className="hidden sm:inline-flex">
            رزرو مشاوره
          </Button>
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-surface text-foreground lg:hidden"
            aria-label="منو"
            aria-expanded={mobileOpen}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {mobileOpen ? <path d="M6 6l12 12M6 18 18 6" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </Container>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden">
          <div className="glass border-t border-border px-4 py-4">
            <nav className="flex flex-col gap-1">
              {NAV.map((item) => (
                <div key={item.label} className="border-b border-border pb-2 last:border-0">
                  <p className="px-2 pb-1 pt-2 text-xs font-bold uppercase tracking-wide text-muted">{item.label}</p>
                  {item.children && (
                    <div className="flex flex-col">
                      {item.children.map((c) => (
                        <Link
                          key={c.label}
                          href={c.href}
                          className="flex items-center gap-3 rounded-xl px-2 py-2.5 text-sm font-medium text-foreground-soft hover:bg-surface-2"
                        >
                          <Icon name={childIcon(c.label)} className="h-4 w-4 text-primary" />
                          {c.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
            <div className="mt-4 flex flex-col gap-2">
              <Button href="/consultation" icon="calendar" className="w-full">رزرو مشاوره</Button>
              <Button href="/dashboard/client" variant="outline" icon="user" className="w-full">ورود / ثبت‌نام</Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
