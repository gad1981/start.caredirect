import type { Metadata } from "next";
import { absoluteUrl, siteUrl, type Locale } from "@/lib/i18n";

/** Default share image for pages without a program-specific hero. */
export const DEFAULT_OG_IMAGE = "/assets/heroes/home-hero-five-life-stages.png";

export function ogLocale(locale: Locale): string {
  return locale === "en" ? "en_GB" : locale;
}

/** Absolute asset URL on the START host (no locale prefix). */
export function absoluteAssetUrl(path: string): string {
  const base = siteUrl().replace(/\/$/, "");
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `${base}${clean}`;
}

type SocialArgs = {
  title: string;
  description: string;
  locale: Locale;
  path: string;
  images?: string[];
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
};

/** Open Graph + Twitter block shared across marketing pages. */
export function socialMetadata({
  title,
  description,
  locale,
  path,
  images = [DEFAULT_OG_IMAGE],
  type = "website",
  publishedTime,
  modifiedTime,
}: SocialArgs): Pick<Metadata, "openGraph" | "twitter"> {
  const url = absoluteUrl(locale, path);
  const imageUrls = images.map((src) =>
    src.startsWith("http") ? src : absoluteAssetUrl(src),
  );

  return {
    openGraph: {
      title,
      description,
      url,
      siteName: "START by Care Direct",
      type,
      locale: ogLocale(locale),
      images: imageUrls.map((imageUrl) => ({ url: imageUrl })),
      ...(publishedTime ? { publishedTime } : {}),
      ...(modifiedTime ? { modifiedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: imageUrls,
    },
  };
}
