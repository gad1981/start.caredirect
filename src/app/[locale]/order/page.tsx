import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Button } from "@/components/Button";
import { getMessages, getPages } from "@/lib/content";
import {
  absoluteUrl,
  hreflangAlternates,
  isLocale,
  localePath,
  type Locale,
} from "@/lib/i18n";
import { withTbc } from "@/lib/tbc";
import styles from "./order.module.css";

function parseCards(copy: string) {
  return copy.split("·").map((chunk) => {
    const [title, ...rest] = chunk.split(":").map((s) => s.trim());
    return { title, body: rest.join(":").trim() };
  });
}

function parseFaq(copy: string) {
  return copy.split("·").map((chunk) => {
    const qEnd = chunk.indexOf("?");
    if (qEnd === -1) {
      return { q: chunk.trim(), a: "" };
    }
    return {
      q: `${chunk.slice(0, qEnd + 1).trim()}`,
      a: chunk.slice(qEnd + 1).trim(),
    };
  });
}

function parseTrust(copy: string) {
  return copy.split("·").map((chunk) => {
    const [title, ...rest] = chunk.split(":").map((s) => s.trim());
    return { title, body: rest.join(":").trim() };
  });
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/order">): Promise<Metadata> {
  const { locale: raw } = await params;
  if (!isLocale(raw)) return {};
  const locale = raw as Locale;
  const pages = await getPages(locale);
  const page = pages["st-order"];
  return {
    title: page.t,
    description: page.m,
    alternates: {
      canonical: localePath(locale, "/order/"),
      languages: hreflangAlternates("/order/"),
    },
    openGraph: {
      title: page.t,
      description: page.m,
      url: absoluteUrl(locale, "/order/"),
      images: ["/assets/kits/kit-st-pregnancy.png"],
      locale: locale === "en" ? "en_GB" : locale,
    },
  };
}

export default function OrderPage({
  params,
}: PageProps<"/[locale]/order">) {
  return (
    <Suspense fallback={null}>
      <OrderRoute params={params} />
    </Suspense>
  );
}

async function OrderRoute({
  params,
}: Pick<PageProps<"/[locale]/order">, "params">) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const pages = await getPages(locale);
  const messages = getMessages(locale);
  const page = pages["st-order"];

  const hero = page.sections.find((s) => s.comp === "hero");
  const proof = page.sections.find((s) => s.comp === "statement");
  const steps = page.sections.find((s) => s.comp === "steps");
  const gets = page.sections.find((s) => s.comp === "card-grid");
  const trust = page.sections.find((s) => s.comp === "trust-panel");
  const faq = page.sections.find((s) => s.comp === "faq");

  const getCards = gets ? parseCards(gets.copy) : [];
  const trustItems = trust ? parseTrust(trust.copy) : [];
  const faqItems = faq ? parseFaq(faq.copy) : [];
  const stepItems = steps
    ? steps.copy.split("→").map((s) => s.trim()).filter(Boolean)
    : [];

  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.eye}>{messages.orderForParents}</p>
          <h1>{page.h1}</h1>
          <p className={styles.lead}>{hero?.copy ?? messages.orderLead}</p>
          <div className={styles.heroActions}>
            <Button href="#order-panel">{page.cta}</Button>
            <a
              className={styles.secondary}
              href="https://www.babyspace.gr/"
              target="_blank"
              rel="noopener noreferrer"
            >
              {messages.orderBabyspace}
            </a>
          </div>
        </div>
        <div className={styles.heroVisual}>
          <Image
            src="/assets/kits/kit-st-pregnancy.png"
            alt=""
            width={960}
            height={640}
            quality={90}
            className={styles.heroKit}
            priority
          />
        </div>
      </section>

      {proof ? (
        <aside className={styles.proof}>
          <p>{withTbc(proof.copy)}</p>
          {proof.proof ? <span>{proof.proof}</span> : null}
        </aside>
      ) : null}

      {steps ? (
        <section className={styles.section}>
          <h2>{steps.name}</h2>
          {steps.intro ? <p className={styles.intro}>{steps.intro}</p> : null}
          <ol className={styles.steps}>
            {stepItems.map((step, i) => (
              <li key={step}>
                <span className={styles.stepNum}>{String(i + 1).padStart(2, "0")}</span>
                <span>{withTbc(step)}</span>
              </li>
            ))}
          </ol>
        </section>
      ) : null}

      {gets ? (
        <section className={styles.section}>
          <h2>{gets.name}</h2>
          {gets.intro ? <p className={styles.intro}>{gets.intro}</p> : null}
          <div className={styles.cards}>
            {getCards.map((card) => (
              <article key={card.title} className={styles.card}>
                <h3>{withTbc(card.title)}</h3>
                <p>{withTbc(card.body)}</p>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      <section className={styles.panel} id="order-panel">
        <p className={styles.eye}>{messages.orderPhase}</p>
        <h2>{messages.orderComingTitle}</h2>
        <p className={styles.intro}>{messages.orderComingLead}</p>
        <div className={styles.preview}>
          <label className={styles.field}>
            <span>{messages.orderStage}</span>
            <select disabled defaultValue="">
              <option value="">{messages.orderStagePlaceholder}</option>
              <option>START Pregnancy</option>
              <option>START Newborn</option>
              <option>START First Foods</option>
            </select>
          </label>
          <label className={styles.field}>
            <span>{messages.formMarket}</span>
            <select disabled defaultValue="">
              <option value="">{messages.formMarketPlaceholder}</option>
              <option>Greece</option>
              <option>Cyprus</option>
              <option>Romania</option>
              <option>Bulgaria</option>
              <option>Serbia</option>
            </select>
          </label>
        </div>
        <p className={styles.note}>{messages.orderComingNote}</p>
        <div className={styles.heroActions}>
          <a
            className={styles.primaryLink}
            href="https://www.babyspace.gr/"
            target="_blank"
            rel="noopener noreferrer"
          >
            {messages.orderBabyspace}
          </a>
        </div>
      </section>

      {trust ? (
        <section className={styles.section}>
          <h2>{trust.name}</h2>
          {trust.intro ? <p className={styles.intro}>{trust.intro}</p> : null}
          <ul className={styles.trust}>
            {trustItems.map((item) => (
              <li key={item.title}>
                <strong>{withTbc(item.title)}</strong>
                <span>{withTbc(item.body)}</span>
              </li>
            ))}
          </ul>
          {trust.proof ? (
            <p className={styles.iso}>{trust.proof}</p>
          ) : null}
        </section>
      ) : null}

      {faq ? (
        <section className={styles.section}>
          <h2>{faq.name}</h2>
          {faq.intro ? <p className={styles.intro}>{faq.intro}</p> : null}
          <div className={styles.faq}>
            {faqItems.map((item) => (
              <details key={item.q} className={styles.faqItem}>
                <summary>{withTbc(item.q)}</summary>
                <p>{withTbc(item.a)}</p>
              </details>
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
