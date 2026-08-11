"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHero } from "@/components/page-hero";
import { Container, Card, Button } from "@/components/ui";
import { Icon } from "@/components/icons";

export default function LoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier || !password) return;
    setLoading(true);
    setTimeout(() => router.push("/dashboard/client"), 600);
  };

  const fieldCls = "h-11 w-full rounded-xl border border-border-strong bg-background px-3 text-sm text-foreground outline-none transition-colors focus:border-primary";

  return (
    <>
      <PageHero badge="ورود" title="به شریفمند خوش آمدید" desc="برای دسترسی به پرونده‌ها، مشاوره‌ها و اسناد خود وارد شوید." breadcrumb={[{ label: "خانه", href: "/" }, { label: "ورود" }]} />
      <Container className="py-12">
        <div className="mx-auto max-w-md">
          <Card hover={false}>
            <form onSubmit={submit} className="space-y-4">
              <label className="block">
                <span className="text-sm font-bold text-foreground">موبایل یا ایمیل</span>
                <input value={identifier} onChange={(e) => setIdentifier(e.target.value)} className={`${fieldCls} mt-2`} placeholder="09123456789" dir="ltr" style={{ textAlign: "right" }} />
              </label>
              <label className="block">
                <span className="text-sm font-bold text-foreground">رمز عبور</span>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className={`${fieldCls} mt-2`} placeholder="••••••••" />
              </label>
              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 text-muted"><input type="checkbox" className="h-4 w-4 accent-[var(--primary)]" /> مرا به‌خاطر بسپار</label>
                <a href="/login" className="font-medium text-primary hover:text-primary-hover">فراموشی رمز؟</a>
              </div>
              <Button type="submit" disabled={loading} className="w-full" icon="user">{loading ? "در حال ورود…" : "ورود"}</Button>
            </form>
            <p className="mt-4 text-center text-sm text-muted">
              حساب ندارید؟ <a href="/register" className="font-bold text-primary hover:text-primary-hover">ثبت‌نام کنید</a>
            </p>
          </Card>
          <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-xs text-muted"><Icon name="lock" className="h-3.5 w-3.5 text-success" /> ورود امن با رمزنگاری اطلاعات</p>
        </div>
      </Container>
    </>
  );
}
