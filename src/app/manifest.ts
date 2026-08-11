import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "شریفمند — پلتفرم خدمات حقوقی",
    short_name: "شریفمند",
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
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}
