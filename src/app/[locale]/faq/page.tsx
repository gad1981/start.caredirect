import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";
import { Suspense } from "react";
import { Button } from "@/components/Button";
import styles from "@/components/faq/Faq.module.css";
import { getFaq, getMessages } from "@/lib/content";
import {
  hreflangAlternates,
  isLocale,
  localePath,
  type Locale,
} from "@/lib/i18n";
import { socialMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/faq">): Promise<Metadata> {
  const { locale: raw } = await params;
  if (!isLocale(raw)) return {};
  const locale = raw as Locale;
  const faq = await getFaq(locale);
  return {
    title: faq.title,
    description: faq.description,
    alternates: {
      canonical: localePath(locale, "/faq/"),
      languages: hreflangAlternates("/faq/"),
    },
    ...socialMetadata({
      title: faq.title,
      description: faq.description,
      locale,
      path: "/faq/",
    }),
  };
}

export default function FaqPage({ params }: PageProps<"/[locale]/faq">) {
  return (
    <Suspense fallback={null}>
      <FaqRoute params={params} />
    </Suspense>
  );
}

async function FaqRoute({
  params,
}: Pick<PageProps<"/[locale]/faq">, "params">) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const faq = await getFaq(locale);
  const messages = getMessages(locale);

  const allItems = faq.groups.flatMap((g) => g.items);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: allItems.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  return (
    <main className={styles.main}>
      <Script
        id="faq-page-jsonld"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <p className={styles.eye}>{faq.eyebrow}</p>
      <h1>{faq.h1}</h1>
      <p className={styles.lead}>{faq.lead}</p>
      <nav className={styles.toc} aria-label={messages.faqToc}>
        {faq.groups.map((group) => (
          <a key={group.id} href={`#${group.id}`}>
            {group.title}
          </a>
        ))}
      </nav>

      {faq.groups.map((group) => (
        <section
          key={group.id}
          className={styles.group}
          id={group.id}
          aria-labelledby={`${group.id}-h2`}
        >
          <h2 id={`${group.id}-h2`}>{group.title}</h2>
          <dl className={styles.list}>
            {group.items.map((item) => (
              <div key={item.q} className={styles.item}>
                <dt>{item.q}</dt>
                <dd>{item.a}</dd>
              </div>
            ))}
          </dl>
        </section>
      ))}

      <aside className={styles.cta}>
        <h2>{messages.faqCtaTitle}</h2>
        <p>{messages.faqCtaLead}</p>
        <div className={styles.ctaActions}>
          <Button href={localePath(locale, "/plan/")} accent>
            {messages.planAStart}
          </Button>
          <Button href={localePath(locale, "/blog/")}>
            {messages.blog}
          </Button>
        </div>
      </aside>
    </main>
  );
}
