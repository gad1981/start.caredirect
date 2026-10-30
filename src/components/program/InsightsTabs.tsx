"use client";

import Image from "next/image";
import { type ReactNode, useMemo, useState } from "react";
import {
  coversForCountry,
  guidesForCountry,
} from "@/lib/guide-covers";
import type { Locale } from "@/lib/i18n";
import { platformsFromAppField } from "@/lib/platforms";
import { withTbc } from "@/lib/tbc";
import { SeeHowToggle } from "./SeeHowToggle";
import styles from "./ProgramPage.module.css";

export type InsightRow = {
  country: string;
  reach: string;
  cities: string;
  channels: string;
  app: string;
  guide: string;
  tirage: string;
};

type Labels = {
  reach: string;
  cities: string;
  channels: string;
  app: string;
  guide: string;
  tirage: string;
  countries: string;
  openGuide?: string;
  seeApps: string;
  seeGuides: string;
  hide: string;
  marketsTitle: string;
  marketsLead: string;
};

const COUNTRY_NAMES: Record<Locale, Record<string, string>> = {
  en: {
    Greece: "Greece",
    Romania: "Romania",
    Bulgaria: "Bulgaria",
    Serbia: "Serbia",
    Cyprus: "Cyprus",
  },
  el: {
    Greece: "Ελλάδα",
    Romania: "Ρουμανία",
    Bulgaria: "Βουλγαρία",
    Serbia: "Σερβία",
    Cyprus: "Κύπρος",
  },
  ro: {
    Greece: "Grecia",
    Romania: "România",
    Bulgaria: "Bulgaria",
    Serbia: "Serbia",
    Cyprus: "Cipru",
  },
  sr: {
    Greece: "Grčka",
    Romania: "Rumunija",
    Bulgaria: "Bugarska",
    Serbia: "Srbija",
    Cyprus: "Kipar",
  },
  bg: {
    Greece: "Гърция",
    Romania: "Румъния",
    Bulgaria: "България",
    Serbia: "Сърбия",
    Cyprus: "Кипър",
  },
};

function localizeCountry(locale: Locale, country: string) {
  return COUNTRY_NAMES[locale]?.[country] ?? country;
}

function present(value: string | undefined) {
  return Boolean(value && value !== "—");
}

export function InsightsTabs({
  rows,
  labels,
  locale,
  programId,
  programGuides,
  insightsHeading,
}: {
  rows: InsightRow[];
  labels: Labels;
  locale: Locale;
  programId: string;
  programGuides?: [string, string, string][];
  insightsHeading?: ReactNode;
}) {
  const countries = useMemo(() => rows.map((r) => r.country), [rows]);
  const [active, setActive] = useState(countries[0] ?? "");
  const row = rows.find((r) => r.country === active) ?? rows[0];

  const covers = row
    ? coversForCountry(programId, row.country, programGuides)
    : [];
  const coverHrefs = new Set(
    covers.map((c) => c.href).filter((h): h is string => Boolean(h)),
  );
  const digitalGuides = row
    ? guidesForCountry(programGuides, row.country).filter(
        (g) => g.href && !coverHrefs.has(g.href),
      )
    : [];
  const platforms = row ? platformsFromAppField(row.app) : [];

  if (!rows.length || !row) return null;

  const facts = [
    { key: "reach", label: labels.reach, value: row.reach },
    { key: "channels", label: labels.channels, value: row.channels },
    { key: "cities", label: labels.cities, value: row.cities },
  ].filter((f) => present(f.value));

  const hasApps = present(row.app) || platforms.length > 0;
  const hasTirage = present(row.tirage);
  const hasGuides =
    present(row.guide) ||
    hasTirage ||
    covers.length > 0 ||
    digitalGuides.length > 0;
  const openLabel = labels.openGuide ?? "Open guide";

  return (
    <div className={styles.insights}>
      <div className={styles.marketsHead}>
        <h2 id="markets-heading">{labels.marketsTitle}</h2>
        <p className={styles.introLine}>{labels.marketsLead}</p>
      </div>

      <div
        className={styles.tabs}
        role="tablist"
        aria-labelledby="markets-heading"
        aria-label={labels.countries}
      >
        {countries.map((c) => (
          <button
            key={c}
            type="button"
            role="tab"
            className={styles.tab}
            aria-selected={c === active}
            onClick={() => setActive(c)}
          >
            {localizeCountry(locale, c)}
          </button>
        ))}
      </div>

      {(hasApps || hasGuides) && (
        <div className={styles.insightMedia} role="tabpanel">
          {hasApps ? (
            <div className={styles.insightDrawer}>
              <p className={styles.insightDrawerTitle}>{labels.app}</p>
              {present(row.app) ? (
                <p className={styles.insightDrawerLead}>{withTbc(row.app)}</p>
              ) : null}
              {platforms.length ? (
                <SeeHowToggle label={labels.seeApps} hideLabel={labels.hide}>
                  <div className={styles.platformShots}>
                    {platforms.map((p) => (
                      <a
                        key={p.id}
                        className={styles.platformShot}
                        href={p.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={`${p.name} — ${p.blurb}`}
                      >
                        <Image
                          src={p.src}
                          alt={p.alt}
                          width={390}
                          height={844}
                          className={styles.platformShotImg}
                          sizes="(max-width: 600px) 28vw, 110px"
                          unoptimized
                        />
                        <span className={styles.platformShotCaption}>
                          <span className={styles.platformShotName}>
                            {p.name}
                          </span>
                          <span className={styles.platformShotBlurb}>
                            {p.blurb}
                          </span>
                        </span>
                      </a>
                    ))}
                  </div>
                </SeeHowToggle>
              ) : null}
            </div>
          ) : null}

          {hasGuides ? (
            <div className={styles.insightDrawer}>
              <p className={styles.insightDrawerTitle}>{labels.guide}</p>
              {present(row.guide) ? (
                <p className={styles.insightDrawerLead}>
                  {withTbc(row.guide)}
                </p>
              ) : null}
              {hasTirage ? (
                <p className={styles.insightTirage}>{withTbc(row.tirage)}</p>
              ) : null}
              {covers.length || digitalGuides.length ? (
                <SeeHowToggle
                  label={labels.seeGuides}
                  hideLabel={labels.hide}
                >
                  <div className={styles.guideCell}>
                    {covers.length ? (
                      <div className={styles.guideCovers}>
                        {covers.map((cover) => {
                          const img = (
                            <Image
                              src={cover.src}
                              alt={cover.alt}
                              width={505}
                              height={752}
                              className={styles.guideCoverImg}
                              sizes="(max-width: 600px) 42vw, 140px"
                              unoptimized
                            />
                          );
                          return cover.href ? (
                            <a
                              key={cover.src}
                              className={styles.guideCover}
                              href={cover.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              title={cover.alt}
                            >
                              {img}
                            </a>
                          ) : (
                            <div
                              key={cover.src}
                              className={styles.guideCover}
                              title={cover.alt}
                            >
                              {img}
                            </div>
                          );
                        })}
                      </div>
                    ) : null}

                    {digitalGuides.length ? (
                      <ul className={styles.guideLinks}>
                        {digitalGuides.map((g) => (
                          <li key={`${g.title}-${g.href}`}>
                            <a
                              href={g.href}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {g.title || openLabel}
                            </a>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                </SeeHowToggle>
              ) : null}
            </div>
          ) : null}
        </div>
      )}

      {insightsHeading ? (
        <div className={styles.insightsHead}>{insightsHeading}</div>
      ) : null}

      {facts.length ? (
        <dl className={styles.insightFacts} role="tabpanel">
          {facts.map((f) => (
            <div key={f.key} className={styles.insightFact}>
              <dt>{f.label}</dt>
              <dd>{withTbc(f.value)}</dd>
            </div>
          ))}
        </dl>
      ) : null}
    </div>
  );
}
