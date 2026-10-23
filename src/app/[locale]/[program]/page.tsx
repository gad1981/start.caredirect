import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";
import { Suspense } from "react";
import { ProgramPage } from "@/components/program/ProgramPage";
import { getPages } from "@/lib/content";
import {
  absoluteUrl,
  hreflangAlternates,
  isLocale,
  localePath,
  locales,
  type Locale,
} from "@/lib/i18n";
import {
  getProgramBySlug,
  PROGRAMS,
  programHeroSrc,
  type ProgramSlug,
} from "@/lib/programs";
import { absoluteAssetUrl, socialMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    PROGRAMS.map((p) => ({ locale, program: p.slug })),
  );
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/[program]">): Promise<Metadata> {
  const { locale: raw, program: slug } = await params;
  if (!isLocale(raw)) return {};
  const locale = raw as Locale;
  const prog = getProgramBySlug(slug);
  if (!prog) return {};
  const pages = await getPages(locale);
  const page = pages[prog.id];
  const hero = programHeroSrc(prog.assetKey);
  const path = `/${prog.slug}/`;
  return {
    title: page.t,
    description: page.m,
    alternates: {
      canonical: localePath(locale, path),
      languages: hreflangAlternates(path),
    },
    ...socialMetadata({
      title: page.t,
      description: page.m,
      locale,
      path,
      images: [hero],
    }),
  };
}

export default function Page({
  params,
}: PageProps<"/[locale]/[program]">) {
  return (
    <Suspense fallback={null}>
      <ProgramRoute params={params} />
    </Suspense>
  );
}

async function ProgramRoute({
  params,
}: Pick<PageProps<"/[locale]/[program]">, "params">) {
  const { locale: raw, program: slug } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const prog = getProgramBySlug(slug as ProgramSlug);
  if (!prog) notFound();

  const pages = await getPages(locale);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: prog.name,
    serviceType:
      "Life-stage product sampling with Online Platform, CRM and targeted digital follow-up",
    provider: {
      "@type": "Organization",
      name: "Care Direct",
      url: "https://www.caredirect.com/",
    },
    areaServed: [
      { "@type": "Country", name: "Greece" },
      { "@type": "Country", name: "Cyprus" },
      { "@type": "Country", name: "Romania" },
      { "@type": "Country", name: "Bulgaria" },
      { "@type": "Country", name: "Serbia" },
    ],
    url: absoluteUrl(locale, `/${prog.slug}/`),
    description: pages[prog.id]?.m,
    image: absoluteAssetUrl(programHeroSrc(prog.assetKey)),
  };

  return (
    <>
      <Script
        id={`jsonld-${prog.slug}`}
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <ProgramPage programId={prog.id} locale={locale} />
    </>
  );
}
