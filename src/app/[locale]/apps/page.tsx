import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import styles from "@/components/apps/AppsPage.module.css";
import { getMessages } from "@/lib/content";
import {
  hreflangAlternates,
  isLocale,
  localePath,
  type Locale,
} from "@/lib/i18n";
import { allPlatforms } from "@/lib/platforms";
import { socialMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/apps">): Promise<Metadata> {
  const { locale: raw } = await params;
  if (!isLocale(raw)) return {};
  const locale = raw as Locale;
  const messages = getMessages(locale);
  const title = `${messages.appsTitle} | START by Care Direct`;
  const description = messages.appsLead;
  return {
    title,
    description,
    alternates: {
      canonical: localePath(locale, "/apps/"),
      languages: hreflangAlternates("/apps/"),
    },
    ...socialMetadata({
      title,
      description,
      locale,
      path: "/apps/",
    }),
  };
}

export default function AppsPage({ params }: PageProps<"/[locale]/apps">) {
  return (
    <Suspense fallback={null}>
      <AppsRoute params={params} />
    </Suspense>
  );
}

async function AppsRoute({
  params,
}: Pick<PageProps<"/[locale]/apps">, "params">) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const messages = getMessages(locale);
  const platforms = allPlatforms();

  return (
    <main className={styles.main}>
      <p className={styles.eye}>{messages.appsEyebrow}</p>
      <h1>{messages.appsTitle}</h1>
      <p className={styles.lead}>{messages.appsLead}</p>

      <div className={styles.grid}>
        {platforms.map((p) => {
          const host = p.href.replace(/^https?:\/\//, "");
          return (
            <a
              key={p.id}
              className={styles.card}
              href={p.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className={styles.shotWrap}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className={styles.shot}
                  src={p.src}
                  alt=""
                  width={390}
                  height={844}
                />
              </div>
              <div className={styles.body}>
                <p className={styles.host}>{host}</p>
                <h2 className={styles.name}>{p.name}</h2>
                <p className={styles.blurb}>{p.blurb}</p>
                <span className={styles.cta}>{messages.appsVisit}</span>
              </div>
            </a>
          );
        })}
      </div>
    </main>
  );
}
