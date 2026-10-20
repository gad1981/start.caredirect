import type { Metadata } from "next";
import { Bricolage_Grotesque, Figtree } from "next/font/google";
import { ConsentProvider } from "@/components/analytics/ConsentProvider";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { CONSENT_DEFAULT_SCRIPT, getGa4Id, getGtmId } from "@/lib/analytics";
import { siteUrl } from "@/lib/content";
import "./globals.css";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["700", "800"],
  variable: "--font-display",
  display: "swap",
});

const body = Figtree({
  subsets: ["latin"],
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
    "Every period in life has a first day. Be in it. START puts your product in people's hands as they begin something new.",
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Care Direct",
  url: "https://www.caredirect.com/",
  sameAs: ["https://start.caredirect.com/"],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  const gtmId = getGtmId();
  const ga4Id = getGa4Id();

  return (
    <html lang="en-GB" className={`${display.variable} ${body.variable}`}>
      <head>
        <script
          id="consent-default"
          dangerouslySetInnerHTML={{ __html: CONSENT_DEFAULT_SCRIPT }}
        />
      </head>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <ConsentProvider gtmId={gtmId} ga4Id={ga4Id}>
          <Header />
          <div className="shell">{children}</div>
          <Footer />
        </ConsentProvider>
      </body>
    </html>
  );
}
