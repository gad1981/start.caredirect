import type { Locale } from "@/lib/i18n";
import { defaultLocale } from "@/lib/i18n";

import enDoodlePlan from "../../content/en/doodle-plan.json";
import enInsights from "../../content/en/insights.json";
import enOffices from "../../content/en/offices.json";
import enPages from "../../content/en/pages.json";
import enProgramsData from "../../content/en/programs-data.json";
import enRoutes from "../../content/en/routes.json";
import enStartHome from "../../content/en/start-home.json";
import enTaglines from "../../content/en/taglines.json";

import enMessages from "../../messages/en.json";
import elMessages from "../../messages/el.json";
import roMessages from "../../messages/ro.json";
import srMessages from "../../messages/sr.json";
import bgMessages from "../../messages/bg.json";

export type PageRecord = {
  t: string;
  m: string;
  h1: string;
  cta: string;
  sections: {
    name: string;
    comp: string;
    copy: string;
    intro?: string;
    hidden?: boolean;
    proof?: string;
  }[];
};

export type StartHome = typeof enStartHome;
export type Messages = typeof enMessages;

const messageMap: Record<Locale, Messages> = {
  en: enMessages,
  el: elMessages,
  ro: roMessages,
  sr: srMessages,
  bg: bgMessages,
};

function deepMerge<T>(base: T, overlay: unknown): T {
  if (overlay === null || overlay === undefined) return base;
  if (Array.isArray(base)) {
    return (Array.isArray(overlay) && overlay.length ? overlay : base) as T;
  }
  if (typeof base !== "object" || base === null) {
    return (overlay as T) ?? base;
  }
  if (typeof overlay !== "object" || overlay === null) return base;
  const out: Record<string, unknown> = {
    ...(base as Record<string, unknown>),
  };
  for (const [key, value] of Object.entries(overlay as Record<string, unknown>)) {
    if (key in out) {
      out[key] = deepMerge(out[key], value);
    } else {
      out[key] = value;
    }
  }
  return out as T;
}

async function loadLocaleJson<T>(locale: Locale, file: string): Promise<T | null> {
  if (locale === defaultLocale) return null;
  try {
    const mod = await import(`../../content/${locale}/${file}.json`);
    return (mod.default ?? mod) as T;
  } catch {
    return null;
  }
}

export async function getStartHome(locale: Locale = defaultLocale): Promise<StartHome> {
  const overlay = await loadLocaleJson<Partial<StartHome>>(locale, "start-home");
  return deepMerge(enStartHome, overlay);
}

export async function getPages(
  locale: Locale = defaultLocale,
): Promise<Record<string, PageRecord>> {
  const base = enPages as Record<string, PageRecord>;
  const overlay = await loadLocaleJson<Record<string, PageRecord>>(locale, "pages");
  return deepMerge(base, overlay);
}

export async function getProgramsData(locale: Locale = defaultLocale) {
  const base = enProgramsData as unknown as {
    START_PLATFORMS: Record<string, string>;
    START_GUIDES: Record<string, [string, string, string][]>;
    START_PROGRAMS: Record<
      string,
      { name: string; when: string; where: string; desc: string }
    >;
    START_REACH?: Record<string, unknown>;
  };
  const overlay = await loadLocaleJson<typeof base>(locale, "programs-data");
  return deepMerge(base, overlay);
}

export async function getDoodlePlan(locale: Locale = defaultLocale) {
  type Plan = {
    hero: string;
    sections: string[];
    band: string;
    mobile: (string | null)[];
  };
  const base = enDoodlePlan as Record<string, Plan>;
  const overlay = await loadLocaleJson<Record<string, Plan>>(locale, "doodle-plan");
  return deepMerge(base, overlay);
}

export type ProgramTaglines = Record<string, string>;

export async function getTaglines(
  locale: Locale = defaultLocale,
): Promise<ProgramTaglines> {
  const base = enTaglines as ProgramTaglines;
  const overlay = await loadLocaleJson<ProgramTaglines>(locale, "taglines");
  return deepMerge(base, overlay);
}

export type InsightRow = {
  country: string;
  reach: string;
  cities: string;
  channels: string;
  app: string;
  guide: string;
  tirage: string;
};

export async function getInsights(
  locale: Locale = defaultLocale,
): Promise<Record<string, InsightRow[]>> {
  const base = enInsights as Record<string, InsightRow[]>;
  const overlay = await loadLocaleJson<Record<string, InsightRow[]>>(
    locale,
    "insights",
  );
  return overlay ? deepMerge(base, overlay) : base;
}

export type Office = {
  id: string;
  country: string;
  lines: string[];
  tel: string;
};

export async function getOffices(
  locale: Locale = defaultLocale,
): Promise<Office[]> {
  const base = enOffices as Office[];
  const overlay = await loadLocaleJson<Office[]>(locale, "offices");
  return overlay && overlay.length ? overlay : base;
}

export function getRoutes() {
  return enRoutes as {
    id: string;
    name: string;
    url: string;
    redirect_from_caredirect_com: string[];
  }[];
}

export function getMessages(locale: Locale = defaultLocale): Messages {
  return messageMap[locale] ?? messageMap.en;
}

/** @deprecated Prefer getStartHome(locale) */
export const startHome = enStartHome;
/** @deprecated Prefer getPages(locale) */
export const pages = enPages as Record<string, PageRecord>;
/** @deprecated Prefer getProgramsData(locale) */
export const programsData = enProgramsData as unknown as Awaited<
  ReturnType<typeof getProgramsData>
>;
/** @deprecated Prefer getDoodlePlan(locale) */
export const doodlePlan = enDoodlePlan as Awaited<ReturnType<typeof getDoodlePlan>>;
export const routes = getRoutes();

export { siteUrl } from "@/lib/i18n";
