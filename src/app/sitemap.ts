import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/content";
import { PROGRAMS } from "@/lib/programs";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  const now = new Date();
  return [
    { url: `${base}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    {
      url: `${base}/plan/`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    ...PROGRAMS.map((p) => ({
      url: `${base}/${p.slug}/`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
