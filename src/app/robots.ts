import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/content";

const DISALLOW = ["/style/", "/order/", "/api/"];

export default function robots(): MetadataRoute.Robots {
  const base = siteUrl().replace(/\/$/, "");
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: DISALLOW,
      },
      // Explicit allow for major AI crawlers (articles + llms.txt).
      {
        userAgent: [
          "GPTBot",
          "ChatGPT-User",
          "Google-Extended",
          "ClaudeBot",
          "PerplexityBot",
          "Applebot-Extended",
        ],
        allow: ["/", "/llms.txt", "/blog/"],
        disallow: DISALLOW,
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
