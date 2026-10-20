import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProgramPage } from "@/components/program/ProgramPage";
import { pages, siteUrl } from "@/lib/content";
import {
  getProgramBySlug,
  PROGRAMS,
  programHeroSrc,
  type ProgramSlug,
} from "@/lib/programs";

export function generateStaticParams() {
  return PROGRAMS.map((p) => ({ program: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ program: string }>;
}): Promise<Metadata> {
  const { program: slug } = await params;
  const prog = getProgramBySlug(slug);
  if (!prog) return {};
  const page = pages[prog.id];
  const hero = programHeroSrc(prog.assetKey);
  return {
    title: page.t,
    description: page.m,
    alternates: { canonical: `/${prog.slug}/` },
    openGraph: {
      title: page.t,
      description: page.m,
      images: [hero],
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ program: string }>;
}) {
  const { program: slug } = await params;
  const prog = getProgramBySlug(slug as ProgramSlug);
  if (!prog) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: prog.name,
    provider: {
      "@type": "Organization",
      name: "Care Direct",
      url: "https://www.caredirect.com/",
    },
    url: `${siteUrl()}/${prog.slug}/`,
    description: pages[prog.id]?.m,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProgramPage programId={prog.id} />
    </>
  );
}
