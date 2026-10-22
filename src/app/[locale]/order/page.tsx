import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Button } from "@/components/Button";
import { getMessages, getPages, getProgramsData } from "@/lib/content";
import {
  absoluteUrl,
  hreflangAlternates,
  isLocale,
  localePath,
  type Locale,
} from "@/lib/i18n";
import {
  LISTED_PROGRAMS,
  programKitSrc,
  programTileSrc,
} from "@/lib/programs";
import { withTbc } from "@/lib/tbc";
import { OrderHowIcon } from "./OrderHowIcon";
import {
  OrderSampleFields,
  OrderSampleProvider,
  type OrderStageOption,
} from "./OrderSamplePreview";
import styles from "./order.module.css";

const ORDER_HERO_SRC = "/assets/heroes/order-sample-hero.jpg";

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

const ORDER_MARKETS_EN = [
  "Greece",
  "Cyprus",
  "Romania",
  "Bulgaria",
  "Serbia",
];

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
      images: [ORDER_HERO_SRC],
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
  const programsData = await getProgramsData(locale);
  const page = pages["st-order"];

  const hero = page.sections.find((s) => s.comp === "hero");
  const proof = page.sections.find((s) => s.comp === "statement");
  const steps = page.sections.find((s) => s.comp === "steps");
  const gets = page.sections.find((s) => s.comp === "card-grid");
  const faq = page.sections.find((s) => s.comp === "faq");

  const getCards = gets ? parseCards(gets.copy) : [];
  const faqItems = faq ? parseFaq(faq.copy) : [];
  const stepItems = steps
    ? steps.copy.split("→").map((s) => s.trim()).filter(Boolean)
    : [];

  const stages: OrderStageOption[] = LISTED_PROGRAMS.map((program) => ({
    id: program.id,
    name: programsData.START_PROGRAMS[program.id]?.name ?? program.name,
    kitSrc:
      programKitSrc(program.assetKey) ?? programTileSrc(program.assetKey),
  }));

  return (
    <OrderSampleProvider stages={stages}>
      <main className={styles.main}>
        <section className={styles.hero}>
          <div className={styles.heroMedia}>
            <Image
              src={ORDER_HERO_SRC}
              alt=""
              fill
              sizes="100vw"
              quality={90}
              className={styles.heroPhoto}
              priority
            />
          </div>
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
        </section>

        <div className={styles.body}>
          {proof ? (
            <aside className={styles.proof}>
              <p>{withTbc(proof.copy)}</p>
              {proof.proof ? <span>{proof.proof}</span> : null}
            </aside>
          ) : null}

          {steps ? (
            <section className={styles.section}>
              <h2>{steps.name}</h2>
              {steps.intro ? (
                <p className={styles.intro}>{steps.intro}</p>
              ) : null}
              <ol className={styles.stepRail}>
                {stepItems.map((step, i) => (
                  <li key={step} className={styles.stepRailItem}>
                    {i > 0 ? (
                      <span className={styles.stepRailArrow} aria-hidden>
                        →
                      </span>
                    ) : null}
                    <div className={styles.stepRailCard}>
                      <span
                        className={styles.stepRailIco}
                        data-tone={String((i % 4) + 1)}
                        aria-hidden
                      >
                        <OrderHowIcon index={i} />
                      </span>
                      <span className={styles.stepRailNum}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className={styles.stepRailLabel}>
                        {withTbc(step)}
                      </span>
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          ) : null}

          {gets ? (
            <section className={styles.section}>
              <h2>{gets.name}</h2>
              {gets.intro ? (
                <p className={styles.intro}>{gets.intro}</p>
              ) : null}
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
            <OrderSampleFields
              stageLabel={messages.orderStage}
              stagePlaceholder={messages.orderStagePlaceholder}
              marketLabel={messages.formMarket}
              marketPlaceholder={messages.formMarketPlaceholder}
              markets={ORDER_MARKETS_EN}
            />
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
        </div>
      </main>
    </OrderSampleProvider>
  );
}
