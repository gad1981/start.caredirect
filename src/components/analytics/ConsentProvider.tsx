"use client";

import {
  createContext,
  startTransition,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google";
import {
  applyConsent,
  DEFAULT_CONSENT,
  getGa4Id,
  getGtmId,
  getMetaPixelId,
  loadMetaPixel,
  readStoredConsent,
  writeStoredConsent,
  type ConsentState,
} from "@/lib/analytics";
import type { Messages } from "@/lib/content";
import styles from "./ConsentBanner.module.css";

type ConsentContextValue = {
  consent: ConsentState;
  openSettings: () => void;
  acceptAnalytics: () => void;
  rejectAnalytics: () => void;
};

const ConsentContext = createContext<ConsentContextValue | null>(null);

export function useConsent() {
  const ctx = useContext(ConsentContext);
  if (!ctx) {
    throw new Error("useConsent must be used within ConsentProvider");
  }
  return ctx;
}

export function ConsentProvider({
  children,
  gtmId,
  ga4Id,
  metaPixelId,
  messages,
}: {
  children: ReactNode;
  gtmId: string;
  ga4Id: string;
  metaPixelId?: string;
  messages?: Pick<
    Messages,
    | "cookieBody"
    | "cookieAccept"
    | "cookieReject"
    | "cookieDialog"
    | "privacy"
    | "stopMessages"
    | "cookieSettings"
  >;
}) {
  const [consent, setConsent] = useState<ConsentState>(DEFAULT_CONSENT);
  const [ready, setReady] = useState(false);
  const [forceOpen, setForceOpen] = useState(false);

  useEffect(() => {
    const stored = readStoredConsent();
    if (stored.decided) {
      applyConsent(stored.analytics);
    }
    startTransition(() => {
      setConsent(stored);
      setReady(true);
    });
  }, []);

  const acceptAnalytics = useCallback(() => {
    const next = { analytics: true, decided: true };
    writeStoredConsent(next);
    setConsent(next);
    setForceOpen(false);
    applyConsent(true);
  }, []);

  const rejectAnalytics = useCallback(() => {
    const next = { analytics: false, decided: true };
    writeStoredConsent(next);
    setConsent(next);
    setForceOpen(false);
    applyConsent(false);
  }, []);

  const openSettings = useCallback(() => {
    setForceOpen(true);
  }, []);

  const value = useMemo(
    () => ({ consent, openSettings, acceptAnalytics, rejectAnalytics }),
    [consent, openSettings, acceptAnalytics, rejectAnalytics],
  );

  const showBanner = ready && (!consent.decided || forceOpen);
  const loadTags = ready && consent.decided && consent.analytics;
  const resolvedGtm = gtmId || getGtmId();
  const resolvedGa4 = ga4Id || getGa4Id();
  const resolvedMeta = metaPixelId || getMetaPixelId();

  useEffect(() => {
    if (!loadTags || !resolvedMeta) return;
    loadMetaPixel(resolvedMeta);
  }, [loadTags, resolvedMeta]);

  return (
    <ConsentContext.Provider value={value}>
      {children}
      {loadTags && resolvedGtm ? <GoogleTagManager gtmId={resolvedGtm} /> : null}
      {loadTags && resolvedGa4 ? <GoogleAnalytics gaId={resolvedGa4} /> : null}
      {showBanner ? (
        <div
          className={styles.banner}
          role="dialog"
          data-consent-banner
          aria-label={messages?.cookieDialog ?? "Cookie preferences"}
        >
          <p className={styles.copy}>
            {messages?.cookieBody ??
              "We use cookies for site analytics and to improve START. Essential cookies keep the site working. Analytics cookies load only after you accept. See our Privacy policy and Stop messages."}{" "}
            <a
              href="https://www.caredirect.com/privacy/"
              target="_blank"
              rel="noopener noreferrer"
            >
              {messages?.privacy ?? "Privacy"}
            </a>{" "}
            ·{" "}
            <a
              href="https://www.caredirect.com/optout/"
              target="_blank"
              rel="noopener noreferrer"
            >
              {messages?.stopMessages ?? "Stop messages"}
            </a>
            .
          </p>
          <div className={styles.actions}>
            <button
              type="button"
              className={`${styles.btn} ${styles.primary}`}
              onClick={acceptAnalytics}
            >
              {messages?.cookieAccept ?? "Accept analytics"}
            </button>
            <button
              type="button"
              className={styles.btn}
              onClick={rejectAnalytics}
            >
              {messages?.cookieReject ?? "Reject"}
            </button>
          </div>
        </div>
      ) : null}
    </ConsentContext.Provider>
  );
}

export function CookieSettingsButton({
  className,
  label = "Cookie settings",
}: {
  className?: string;
  label?: string;
}) {
  const { openSettings } = useConsent();
  return (
    <button type="button" className={className} onClick={openSettings}>
      {label}
    </button>
  );
}
