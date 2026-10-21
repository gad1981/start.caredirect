export const CONSENT_STORAGE_KEY = "start_cd_consent";

export type ConsentState = {
  analytics: boolean;
  decided: boolean;
};

export const DEFAULT_CONSENT: ConsentState = {
  analytics: false,
  decided: false,
};

export function getGtmId() {
  return process.env.NEXT_PUBLIC_GTM_ID?.trim() || "";
}

export function getGa4Id() {
  return process.env.NEXT_PUBLIC_GA4_ID?.trim() || "";
}

export function getMetaPixelId() {
  return process.env.NEXT_PUBLIC_META_PIXEL_ID?.trim() || "";
}

/** Push a form lead so GTM/Ads/Meta can fire conversion tags. */
export function trackLeadSubmission(detail?: {
  program?: string;
  market?: string;
  source_page?: string;
}) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: "generate_lead",
    form_name: "start_brief",
    ...detail,
  });
  window.fbq?.("track", "Lead");
}

export function readStoredConsent(): ConsentState {
  if (typeof window === "undefined") return DEFAULT_CONSENT;
  try {
    const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return DEFAULT_CONSENT;
    const parsed = JSON.parse(raw) as Partial<ConsentState>;
    return {
      analytics: Boolean(parsed.analytics),
      decided: Boolean(parsed.decided),
    };
  } catch {
    return DEFAULT_CONSENT;
  }
}

export function writeStoredConsent(state: ConsentState) {
  window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(state));
}

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    _fbq?: (...args: unknown[]) => void;
  }
}

type FbqFn = ((...args: unknown[]) => void) & {
  callMethod?: (...args: unknown[]) => void;
  queue: unknown[];
  loaded: boolean;
  version: string;
  push: (...args: unknown[]) => void;
};

/** Meta Pixel base + PageView. Call only after analytics consent. */
export function loadMetaPixel(pixelId: string) {
  if (!pixelId || typeof window === "undefined") return;
  if (document.getElementById("meta-pixel")) {
    window.fbq?.("track", "PageView");
    return;
  }
  if (!window.fbq) {
    const n = function (...args: unknown[]) {
      const f = n as FbqFn;
      if (f.callMethod) f.callMethod(...args);
      else f.queue.push(args);
    } as FbqFn;
    n.queue = [];
    n.loaded = true;
    n.version = "2.0";
    n.push = n;
    window.fbq = n;
    window._fbq = n;
  }
  const script = document.createElement("script");
  script.id = "meta-pixel";
  script.async = true;
  script.src = "https://connect.facebook.net/en_US/fbevents.js";
  document.head.appendChild(script);
  window.fbq("init", pixelId);
  window.fbq("track", "PageView");
}

export function ensureGtag() {
  window.dataLayer = window.dataLayer || [];
  if (!window.gtag) {
    window.gtag = (...args: unknown[]) => {
      window.dataLayer?.push(args as unknown as Record<string, unknown>);
    };
  }
}

export function applyConsent(analytics: boolean) {
  ensureGtag();
  const value = analytics ? "granted" : "denied";
  window.gtag?.("consent", "update", {
    analytics_storage: value,
    ad_storage: value,
    ad_user_data: value,
    ad_personalization: value,
    functionality_storage: value,
    personalization_storage: value,
  });
}

/** Inline bootstrap: deny by default before any tags load. */
export const CONSENT_DEFAULT_SCRIPT = `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('consent', 'default', {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'denied',
  functionality_storage: 'denied',
  personalization_storage: 'denied',
  security_storage: 'granted',
  wait_for_update: 500
});
`.trim();
