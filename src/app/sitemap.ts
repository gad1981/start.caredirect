import type { MetadataRoute } from "next";
import { getBlogSlugs } from "@/lib/blog";
import { locales, localePath, siteUrl } from "@/lib/i18n";
import { PROGRAMS } from "@/lib/programs";

const paths = [
  "/",
  "/plan/",
  "/blog/",
  "/faq/",
  ...PROGRAMS.map((p) => `/${p.slug}/`),
  ...getBlogSlugs().map((slug) => `/blog/${slug}/`),
];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl().replace(/\/$/, "");
  const now = new Date();

  return locales.flatMap((locale) =>
    paths.map((path) => {
      const url = `${base}${localePath(locale, path)}`;
      const isHome = path === "/";
      const isPlan = path === "/plan/";
      const isBlog = path.startsWith("/blog");
      const isFaq = path === "/faq/";
      return {
        url,
        lastModified: now,
        changeFrequency:
          isHome || isBlog || isFaq
            ? ("weekly" as const)
            : ("monthly" as const),
        priority: isHome
          ? 1
          : isPlan
            ? 0.9
            : isFaq
              ? 0.8
              : isBlog
                ? 0.75
                : 0.8,
        alternates: {
          languages: {
            ...Object.fromEntries(
              locales.map((l) => [l, `${base}${localePath(l, path)}`]),
            ),
            "x-default": `${base}${localePath("en", path)}`,
          },
        },
      };
    }),
  );
}
