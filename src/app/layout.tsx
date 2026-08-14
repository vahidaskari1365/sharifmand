import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { noFlashScript } from "@/components/no-flash";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Tracker } from "@/components/tracker";

/* فونت وزیرمتن به‌صورت local میزبانی می‌شود تا build به شبکه خارجی وابسته نباشد */
const vazirmatn = localFont({
  src: [
    { path: "../assets/fonts/vazirmatn-arabic-wght-normal.woff2", weight: "100 900", style: "normal" },
    { path: "../assets/fonts/vazirmatn-latin-wght-normal.woff2", weight: "100 900", style: "normal" },
  ],
  variable: "--font-vazirmatn",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://sharifmand.ir"),
  title: {
    default: "شریفمند | پلتفرم هوشمند خدمات حقوقی، وکیل‌یابی و مشاوره آنلاین",
    template: "%s | شریفمند",
  },
  description:
    "شریفمند پلتفرم کامل خدمات حقوقی است: جستجوی وکیل متخصص، مشاوره متنی و صوتی و تصویری، ثبت و مدیریت پرونده، تنظیم قرارداد، دادخواست و شکواییه، بانک قوانین و دستیار حقوقی هوش مصنوعی.",
  keywords: [
    "وکیل", "مشاوره حقوقی آنلاین", "وکیل خانواده", "وکیل ملکی", "وکیل کیفری",
    "تنظیم قرارداد", "چک برگشتی", "طلاق", "ثبت شرکت", "مشاوره وکیل",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "fa_IR",
    siteName: "شریفمند",
    title: "شریفمند | پلتفرم هوشمند خدمات حقوقی",
    description:
      "جستجوی وکیل متخصص، مشاوره آنلاین، ثبت پرونده، تنظیم قرارداد و دستیار حقوقی هوش مصنوعی — همه در شریفمند.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f7fb" },
    { media: "(prefers-color-scheme: dark)", color: "#141416" },
  ],
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "LegalService",
  name: "شریفمند",
  alternateName: "Sharifmand Legal Platform",
  description:
    "پلتفرم هوشمند خدمات حقوقی؛ وکیل‌یابی، مشاوره آنلاین، ثبت پرونده، تنظیم اسناد حقوقی و دستیار حقوقی هوش مصنوعی.",
  url: "https://sharifmand.ir",
  areaServed: "IR",
  knowsLanguage: ["fa"],
  priceRange: "$$",
  serviceType: [
    "مشاوره حقوقی آنلاین",
    "وکیل‌یابی",
    "تنظیم قرارداد",
    "ثبت پرونده",
    "خدمات ثبتی",
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning className={vazirmatn.variable}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: noFlashScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
      </head>
      <body className="bg-background text-foreground antialiased">
        <ThemeProvider>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:right-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
          >
            پرش به محتوای اصلی
          </a>
          <Header />
          <main id="main" className="page-wash">
            {children}
          </main>
          <Footer />
          <Tracker />
        </ThemeProvider>
      </body>
    </html>
  );
}
