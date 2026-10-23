import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";
import { Suspense } from "react";
import { HomePage } from "@/components/home/HomePage";
import { getPages } from "@/lib/content";
import {
  absoluteUrl,
  hreflangAlternates,
  isLocale,
  localePath,
  type Locale,
} from "@/lib/i18n";
import { socialMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]">): Promise<Metadata> {
  const { locale: raw } = await params;
  if (!isLocale(raw)) return {};
  const locale = raw as Locale;
  const pages = await getPages(locale);
  const page = pages["st-parents"];
  return {
    title: page.t,
    description: page.m,
    alternates: {
      canonical: localePath(locale, "/"),
      languages: hreflangAlternates("/"),
    },
    ...socialMetadata({
      title: page.t,
      description: page.m,
      locale,
      path: "/",
    }),
  };
}

export default function Home({ params }: PageProps<"/[locale]">) {
  return (
    <Suspense fallback={null}>
      <HomeRoute params={params} />
    </Suspense>
  );
}

async function HomeRoute({
  params,
}: Pick<PageProps<"/[locale]">, "params">) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const pages = await getPages(locale);
  const page = pages["st-parents"];
  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "START by Care Direct",
    url: absoluteUrl(locale, "/"),
    description: page.m,
    publisher: {
      "@type": "Organization",
      name: "Care Direct",
      url: "https://www.caredirect.com/",
    },
    inLanguage: locale === "en" ? "en-GB" : locale,
  };

  return (
    <>
      <Script
        id="website-jsonld"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <HomePage locale={locale} />
    </>
  );
}
