import type { Metadata } from "next";
import { notFound } from "next/navigation";
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
    openGraph: {
      title: page.t,
      description: page.m,
      url: absoluteUrl(locale, "/"),
      images: ["/assets/heroes/home-hero-five-life-stages.png"],
      locale: locale === "en" ? "en_GB" : locale,
    },
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
  return <HomePage locale={raw} />;
}
