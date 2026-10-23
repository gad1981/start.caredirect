import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { BriefForm } from "@/components/BriefForm";
import {
  getMessages,
  getOffices,
  getPages,
  getStartHome,
} from "@/lib/content";
import {
  hreflangAlternates,
  isLocale,
  localePath,
  type Locale,
} from "@/lib/i18n";
import { socialMetadata } from "@/lib/seo";
import styles from "./plan.module.css";

const countryLabels: Record<Locale, Record<string, string>> = {
  en: {
    greece: "Greece",
    cyprus: "Cyprus",
    romania: "Romania",
    bulgaria: "Bulgaria",
    serbia: "Serbia",
  },
  el: {
    greece: "Ελλάδα",
    cyprus: "Κύπρος",
    romania: "Ρουμανία",
    bulgaria: "Βουλγαρία",
    serbia: "Σερβία",
  },
  ro: {
    greece: "Grecia",
    cyprus: "Cipru",
    romania: "România",
    bulgaria: "Bulgaria",
    serbia: "Serbia",
  },
  sr: {
    greece: "Grčka",
    cyprus: "Kipar",
    romania: "Rumunija",
    bulgaria: "Bugarska",
    serbia: "Srbija",
  },
  bg: {
    greece: "Гърция",
    cyprus: "Кипър",
    romania: "Румъния",
    bulgaria: "България",
    serbia: "Сърбия",
  },
};

function telHref(tel: string) {
  return `tel:${tel.replace(/[^\d+]/g, "")}`;
}

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
    ...socialMetadata({
      title: page.t,
      description: page.m,
      locale,
      path: "/plan/",
    }),
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
  const offices = await getOffices(locale);
  const page = pages["st-contact"];
  const form = page.sections.find((s) => s.comp === "brief-form");
  const next = page.sections.find((s) => s.comp === "steps");
  const contacts = page.sections.find((s) => s.comp === "contact-cards");
  const labels = countryLabels[locale] ?? countryLabels.en;

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
            {offices.map((office) => (
              <li key={office.id} className={styles.office}>
                <h3>{labels[office.id] ?? office.country}</h3>
                <address className={styles.address}>
                  {office.lines.map((line) => (
                    <span key={line}>{line}</span>
                  ))}
                </address>
                <a className={styles.tel} href={telHref(office.tel)}>
                  Tel. {office.tel}
                </a>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </main>
  );
}
