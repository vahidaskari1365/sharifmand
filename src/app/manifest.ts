import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "دادبان — پلتفرم خدمات حقوقی",
    short_name: "دادبان",
    description: "وکیل‌یابی، مشاوره آنلاین، تنظیم اسناد و دستیار حقوقی هوش مصنوعی",
    start_url: "/",
    display: "standalone",
    background_color: "#f6f8fc",
    theme_color: "#15365d",
    lang: "fa",
    dir: "rtl",
    categories: ["legal", "business", "productivity"],
    icons: [
      {
        src: "/logo1.png",
        sizes: "1024x1024",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}
