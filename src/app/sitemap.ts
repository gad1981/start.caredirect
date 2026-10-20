import type { MetadataRoute } from "next";
import { locales, localePath, siteUrl } from "@/lib/i18n";
import { PROGRAMS } from "@/lib/programs";

const paths = ["/", "/plan/", ...PROGRAMS.map((p) => `/${p.slug}/`)];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl().replace(/\/$/, "");
  const now = new Date();

  return locales.flatMap((locale) =>
    paths.map((path) => {
      const url = `${base}${localePath(locale, path)}`;
      const isHome = path === "/";
      const isPlan = path === "/plan/";
      return {
        url,
        lastModified: now,
        changeFrequency: isHome ? ("weekly" as const) : ("monthly" as const),
        priority: isHome ? 1 : isPlan ? 0.9 : 0.8,
        alternates: {
          languages: Object.fromEntries(
            locales.map((l) => [l, `${base}${localePath(l, path)}`]),
          ),
        },
      };
    }),
  );
}
