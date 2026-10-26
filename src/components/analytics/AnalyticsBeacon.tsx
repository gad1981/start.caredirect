"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useConsent } from "@/components/analytics/ConsentProvider";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { pushStartSiteContext, trackStartPageView } from "@/lib/analytics";

/**
 * Keeps dataLayer / gtag START context in sync on every App Router navigation.
 * GTM maps these fields onto GA4 so START can be filtered inside the shared property.
 */
export function AnalyticsBeacon() {
  const pathname = usePathname();
  const { locale } = useLocale();
  const { consent } = useConsent();
  const lastKey = useRef("");

  useEffect(() => {
    pushStartSiteContext();
  }, []);

  useEffect(() => {
    if (!pathname) return;
    // Queue before consent so GTM can read history; re-fire after accept so tags see it.
    const key = `${pathname}|${locale}|${consent.analytics ? "on" : "off"}`;
    if (lastKey.current === key) return;
    lastKey.current = key;
    trackStartPageView(pathname, locale);
  }, [pathname, locale, consent.analytics, consent.decided]);

  return null;
}
