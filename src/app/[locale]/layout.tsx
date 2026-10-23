import type { Metadata } from "next";
import { Manrope, Source_Sans_3 } from "next/font/google";
import { notFound } from "next/navigation";
import Script from "next/script";
import { SiteChrome } from "@/components/SiteChrome";
import { CONSENT_DEFAULT_SCRIPT } from "@/lib/analytics";
import { siteUrl } from "@/lib/content";
import { htmlLang, isLocale, type Locale } from "@/lib/i18n";
import "../globals.css";

/** Preview: Recommended pairing (Manrope + Source Sans 3). Switch back to Literata if Editorial wins. */
const display = Manrope({
  subsets: ["latin", "latin-ext", "cyrillic", "greek"],
  weight: ["600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

const body = Source_Sans_3({
  subsets: ["latin", "latin-ext", "cyrillic", "greek"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    default: "START by Care Direct",
    template: "%s",
  },
  description:
    "START complete life-stage experiences across Southeast Europe: product sampling that expands digitally — Online Platforms, CRM, loyalty and targeted email — in Greece, Cyprus, Romania, Bulgaria and Serbia.",
  openGraph: {
    siteName: "START by Care Direct",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Care Direct",
  url: "https://www.caredirect.com/",
  description:
    "Care Direct runs START complete life-stage experiences across Southeast Europe: sampling kits plus Online Platforms, CRM and targeted digital follow-up.",
  areaServed: [
    { "@type": "Country", name: "Greece" },
    { "@type": "Country", name: "Cyprus" },
    { "@type": "Country", name: "Romania" },
    { "@type": "Country", name: "Bulgaria" },
    { "@type": "Country", name: "Serbia" },
  ],
  sameAs: ["https://start.caredirect.com/", "https://www.caredirect.com/"],
};

export function generateStaticParams() {
  return [
    { locale: "en" },
    { locale: "el" },
    { locale: "ro" },
    { locale: "sr" },
    { locale: "bg" },
  ];
}

/** html[lang] must await locale params; allow this segment to block. */
export const instant = false;

export default async function LocaleRootLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;

  return (
    <html
      lang={htmlLang[locale]}
      className={`${display.variable} ${body.variable}`}
      data-theme="light"
    >
      <body>
        <Script
          id="consent-default"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: CONSENT_DEFAULT_SCRIPT }}
        />
        <Script
          id="org-jsonld"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(orgJsonLd).replace(/</g, "\\u003c"),
          }}
        />
        <SiteChrome locale={locale}>{children}</SiteChrome>
      </body>
    </html>
  );
}
