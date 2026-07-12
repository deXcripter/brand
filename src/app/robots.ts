import type { MetadataRoute } from "next";

/**
 * Thin fallback robots.txt. The canonical `/robots.txt` is served
 * by the backend via the next.config.ts rewrite to `/api/seo/robots.txt`.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard/", "/api/"],
    },
    sitemap: "https://dexcripter.com/sitemap.xml",
  };
}
