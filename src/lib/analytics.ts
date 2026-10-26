import {
  isPrefixedLocale,
  localeFromPathname,
  type Locale,
} from "@/lib/i18n";
import { PROGRAMS, type ProgramSlug } from "@/lib/programs";

export const CONSENT_STORAGE_KEY = "start_cd_consent";

/** Stable id for GA4/GTM filters — maps to custom dimension `site_id`. */
export const START_SITE_ID = "start";
export const START_SITE_NAME = "START by Care Direct";

export type ConsentState = {
  analytics: boolean;
  decided: boolean;
};

export const DEFAULT_CONSENT: ConsentState = {
  analytics: false,
  decided: false,
};

export type StartPageContext = {
  site_id: typeof START_SITE_ID;
  site_name: typeof START_SITE_NAME;
  page_locale: Locale;
  page_path: string;
  page_location: string;
  page_title: string;
  page_type: string;
  content_group: string;
  program_slug: string;
  article_slug: string;
};

const PROGRAM_SLUGS = new Set(PROGRAMS.map((p) => p.slug));

export function getGtmId() {
  return process.env.NEXT_PUBLIC_GTM_ID?.trim() || "";
}

export function getGa4Id() {
  return process.env.NEXT_PUBLIC_GA4_ID?.trim() || "";
}

export function getMetaPixelId() {
  return process.env.NEXT_PUBLIC_META_PIXEL_ID?.trim() || "";
}

export function classifyStartPath(
  pathname: string,
  locale: Locale = localeFromPathname(pathname),
): StartPageContext {
  const parts = pathname.split("/").filter(Boolean);
  const rest =
    parts[0] !== undefined && isPrefixedLocale(parts[0])
      ? parts.slice(1)
      : parts;
  const root = rest[0] ?? "";
  const second = rest[1] ?? "";

  let page_type = "other";
  let content_group = "START / Other";
  let program_slug = "";
  let article_slug = "";

  if (!root) {
    page_type = "home";
    content_group = "START / Home";
  } else if (root === "blog") {
    content_group = "START / Insights";
    if (second) {
      page_type = "blog_article";
      article_slug = second;
    } else {
      page_type = "blog_index";
    }
  } else if (root === "plan") {
    page_type = "plan";
    content_group = "START / Plan";
  } else if (root === "order") {
    page_type = "order";
    content_group = "START / Order";
  } else if (root === "faq") {
    page_type = "faq";
    content_group = "START / FAQ";
  } else if (root === "style") {
    page_type = "style";
    content_group = "START / Other";
  } else if (PROGRAM_SLUGS.has(root as ProgramSlug)) {
    page_type = "program";
    content_group = "START / Programs";
    program_slug = root;
  }

  const page_path = pathname.endsWith("/") ? pathname : `${pathname}/`;
  const origin =
    typeof window !== "undefined" ? window.location.origin : "";

  return {
    site_id: START_SITE_ID,
    site_name: START_SITE_NAME,
    page_locale: locale,
    page_path,
    page_location: origin ? `${origin}${page_path}` : page_path,
    page_title: typeof document !== "undefined" ? document.title : "",
    page_type,
    content_group,
    program_slug,
    article_slug,
  };
}

function pushDataLayer(payload: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(payload);
}

/** Persistent site keys for GTM Data Layer Variables (before any tags). */
export function pushStartSiteContext() {
  pushDataLayer({
    site_id: START_SITE_ID,
    site_name: START_SITE_NAME,
  });
}

/**
 * Fires on every route. GTM should map these DLVs onto the GA4 Config tag
 * (and/or a dedicated GA4 Event tag for `start_page_view`).
 */
export function trackStartPageView(pathname: string, locale: Locale) {
  const ctx = classifyStartPath(pathname, locale);
  pushDataLayer({
    event: "start_page_view",
    ...ctx,
  });
  // User property so Explorations can filter all events from START visitors.
  ensureGtag();
  window.gtag?.("set", "user_properties", {
    site_id: START_SITE_ID,
    site_name: START_SITE_NAME,
  });
  window.gtag?.("event", "start_page_view", {
    ...ctx,
  });
}

/** Push a form lead so GTM/Ads/Meta can fire conversion tags. */
export function trackLeadSubmission(detail?: {
  program?: string;
  market?: string;
  source_page?: string;
  locale?: Locale;
}) {
  if (typeof window === "undefined") return;
  const pathname =
    detail?.source_page ||
    (typeof window !== "undefined" ? window.location.pathname : "/");
  const locale = detail?.locale ?? localeFromPathname(pathname);
  const ctx = classifyStartPath(pathname, locale);
  pushDataLayer({
    event: "generate_lead",
    form_name: "start_brief",
    site_id: START_SITE_ID,
    site_name: START_SITE_NAME,
    page_locale: locale,
    page_type: ctx.page_type,
    content_group: ctx.content_group,
    program: detail?.program || ctx.program_slug || "",
    market: detail?.market || "",
    source_page: detail?.source_page || ctx.page_path,
  });
  ensureGtag();
  window.gtag?.("event", "generate_lead", {
    form_name: "start_brief",
    site_id: START_SITE_ID,
    currency: "EUR",
    program: detail?.program || ctx.program_slug || "",
    market: detail?.market || "",
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

/** Inline bootstrap: deny by default + mark traffic as START before any tags. */
export const CONSENT_DEFAULT_SCRIPT = `
window.dataLayer = window.dataLayer || [];
window.dataLayer.push({
  site_id: 'start',
  site_name: 'START by Care Direct'
});
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
