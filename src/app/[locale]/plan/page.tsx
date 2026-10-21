import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { BriefForm } from "@/components/BriefForm";
import { getMessages, getPages, getStartHome } from "@/lib/content";
import {
  absoluteUrl,
  hreflangAlternates,
  isLocale,
  localePath,
  type Locale,
} from "@/lib/i18n";
import { withTbc } from "@/lib/tbc";
import styles from "./plan.module.css";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/plan">): Promise<Metadata> {
  const { locale: raw } = await params;
  if (!isLocale(raw)) return {};
  const locale = raw as Locale;
  const pages = await getPages(locale);
  const page = pages["st-contact"];
  return {
    title: page.t,
    description: page.m,
    alternates: {
      canonical: localePath(locale, "/plan/"),
      languages: hreflangAlternates("/plan/"),
    },
    openGraph: {
      title: page.t,
      description: page.m,
      url: absoluteUrl(locale, "/plan/"),
      locale: locale === "en" ? "en_GB" : locale,
    },
  };
}

export default function PlanPage({
  params,
}: PageProps<"/[locale]/plan">) {
  return (
    <Suspense fallback={null}>
      <PlanRoute params={params} />
    </Suspense>
  );
}

async function PlanRoute({
  params,
}: Pick<PageProps<"/[locale]/plan">, "params">) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const pages = await getPages(locale);
  const home = await getStartHome(locale);
  const messages = getMessages(locale);
  const page = pages["st-contact"];
  const form = page.sections.find((s) => s.comp === "brief-form");
  const next = page.sections.find((s) => s.comp === "steps");
  const contacts = page.sections.find((s) => s.comp === "contact-cards");

  return (
    <main className={styles.main}>
      <header className={styles.hero}>
        <h1>{page.h1}</h1>
        <p>{page.sections[0]?.copy}</p>
      </header>

      <section className={styles.block}>
        <h2>{form?.name}</h2>
        {form?.intro ? <p>{form.intro}</p> : null}
        <BriefForm
          sourcePage={localePath(locale, "/plan/")}
          markets={home.brands.markets}
          submitLabel={page.cta || messages.planAStart}
        />
      </section>

      {next ? (
        <section className={styles.block}>
          <h2>{next.name}</h2>
          {next.intro ? <p>{next.intro}</p> : null}
          <ol className={styles.steps}>
            {next.copy.split("→").map((step) => (
              <li key={step.trim()}>{step.trim()}</li>
            ))}
          </ol>
        </section>
      ) : null}

      {contacts ? (
        <section className={styles.block}>
          <h2>{contacts.name}</h2>
          {contacts.intro ? <p>{contacts.intro}</p> : null}
          <ul className={styles.contacts}>
            {contacts.copy.split("·").map((line) => (
              <li key={line.trim()}>{withTbc(line.trim())}</li>
            ))}
          </ul>
        </section>
      ) : null}
    </main>
  );
}
