import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Button } from "@/components/Button";
import { getMessages, getPages } from "@/lib/content";
import {
  absoluteUrl,
  hreflangAlternates,
  isLocale,
  localePath,
  type Locale,
} from "@/lib/i18n";
import styles from "./order.module.css";

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
      locale: locale === "en" ? "en_GB" : locale,
    },
    robots: { index: false, follow: false },
  };
}

export default async function OrderPage({
  params,
}: PageProps<"/[locale]/order">) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const pages = await getPages(locale);
  const messages = getMessages(locale);
  const page = pages["st-order"];

  return (
    <main className={styles.main}>
      <p className={styles.eye}>{messages.orderPhase}</p>
      <h1>{page.h1}</h1>
      <p className={styles.lead}>{messages.orderLead}</p>
      <Button href={localePath(locale, "/plan/")}>{messages.planAStart}</Button>
    </main>
  );
}
