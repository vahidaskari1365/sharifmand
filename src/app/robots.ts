import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/dashboard/", "/admin", "/developer"],
      },
    ],
    sitemap: "https://sharifmand.ir/sitemap.xml",
    host: "https://sharifmand.ir",
  };
}
