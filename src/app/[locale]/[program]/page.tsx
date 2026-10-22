import type { Metadata } from "next";
import { notFound } from "next/navigation";
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
    openGraph: {
      title: page.t,
      description: page.m,
      url: absoluteUrl(locale, path),
      images: [hero],
      locale: locale === "en" ? "en_GB" : locale,
    },
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
    provider: {
      "@type": "Organization",
      name: "Care Direct",
      url: "https://www.caredirect.com/",
    },
    url: absoluteUrl(locale, `/${prog.slug}/`),
    description: pages[prog.id]?.m,
  };

  return (
    <>
      <script
        id={`jsonld-${prog.slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <ProgramPage programId={prog.id} locale={locale} />
    </>
  );
}
