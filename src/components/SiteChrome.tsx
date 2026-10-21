import { ConsentProvider } from "@/components/analytics/ConsentProvider";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { LocaleProvider } from "@/components/i18n/LocaleProvider";
import { ScrollToTop } from "@/components/ScrollToTop";
import { getGa4Id, getGtmId, getMetaPixelId } from "@/lib/analytics";
import { getMessages, getStartHome } from "@/lib/content";
import type { Locale } from "@/lib/i18n";
import type { ReactNode } from "react";

export async function SiteChrome({
  locale,
  children,
}: {
  locale: Locale;
  children: ReactNode;
}) {
  const messages = getMessages(locale);
  const home = await getStartHome(locale);

  return (
    <ConsentProvider
      gtmId={getGtmId()}
      ga4Id={getGa4Id()}
      metaPixelId={getMetaPixelId()}
      messages={messages}
    >
      <LocaleProvider locale={locale} messages={messages}>
        <ScrollToTop />
        <Header />
        <div className="shell">{children}</div>
        <Footer footerLine={home.footer} />
      </LocaleProvider>
    </ConsentProvider>
  );
}
