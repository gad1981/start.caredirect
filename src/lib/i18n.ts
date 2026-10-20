export const locales = ["en", "el", "ro", "sr", "bg"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";
export const prefixedLocales = ["el", "ro", "sr", "bg"] as const;
export type PrefixedLocale = (typeof prefixedLocales)[number];

export const localeLabels: Record<Locale, string> = {
  en: "EN",
  el: "ΕΛ",
  ro: "RO",
  sr: "SR",
  bg: "BG",
};

export const htmlLang: Record<Locale, string> = {
  en: "en-GB",
  el: "el",
  ro: "ro",
  sr: "sr-Latn",
  bg: "bg",
};

export const LOCALE_COOKIE = "START_LOCALE";

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export function isPrefixedLocale(value: string): value is PrefixedLocale {
  return (prefixedLocales as readonly string[]).includes(value);
}

/** Build a path for a locale. English has no prefix. */
export function localePath(locale: Locale, path = "/"): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  if (locale === defaultLocale) return clean === "" ? "/" : clean;
  if (clean === "/") return `/${locale}/`;
  return `/${locale}${clean.endsWith("/") ? clean : `${clean}/`}`.replace(
    /\/{2,}/g,
    "/",
  );
}

/** Swap locale in the current pathname. */
export function swapLocalePath(pathname: string, next: Locale): string {
  const parts = pathname.split("/").filter(Boolean);
  const currentIsPrefixed =
    parts[0] !== undefined && isPrefixedLocale(parts[0]);
  const rest = currentIsPrefixed ? parts.slice(1) : parts;
  const suffix = rest.length ? `/${rest.join("/")}/` : "/";
  return localePath(next, suffix);
}

export function localeFromPathname(pathname: string): Locale {
  const first = pathname.split("/").filter(Boolean)[0];
  if (first && isPrefixedLocale(first)) return first;
  return defaultLocale;
}

export function siteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "https://start.caredirect.com";
}

export function absoluteUrl(locale: Locale, path = "/"): string {
  const base = siteUrl().replace(/\/$/, "");
  return `${base}${localePath(locale, path)}`;
}

export function hreflangAlternates(path = "/"): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const locale of locales) {
    languages[locale] = absoluteUrl(locale, path);
  }
  languages["x-default"] = absoluteUrl(defaultLocale, path);
  return languages;
}
