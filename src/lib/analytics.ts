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
  }
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
