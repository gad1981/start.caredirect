"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import {
  coversForCountry,
  guidesForCountry,
} from "@/lib/guide-covers";
import type { Locale } from "@/lib/i18n";
import { platformsFromAppField } from "@/lib/platforms";
import { withTbc } from "@/lib/tbc";
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

export function InsightsTabs({
  rows,
  labels,
  locale,
  programId,
  programGuides,
}: {
  rows: InsightRow[];
  labels: Labels;
  locale: Locale;
  programId: string;
  /** START_GUIDES rows for this program: [country, title, url] */
  programGuides?: [string, string, string][];
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

  if (!rows.length || !row) return null;

  const fields: { key: keyof InsightRow; label: string }[] = [
    { key: "reach", label: labels.reach },
    { key: "cities", label: labels.cities },
    { key: "channels", label: labels.channels },
    { key: "app", label: labels.app },
    { key: "guide", label: labels.guide },
    { key: "tirage", label: labels.tirage },
  ];

  const openLabel = labels.openGuide ?? "Open guide";

  return (
    <div>
      <div className={styles.tabs} role="tablist" aria-label={labels.countries}>
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
      <div className={styles.insightPanel} role="tabpanel">
        <dl className={styles.insightTable}>
          {fields.map(({ key, label }) => {
            const value = row[key];
            if (key !== "guide" && key !== "app" && (!value || value === "—")) {
              return null;
            }

            if (key === "app") {
              const platforms = platformsFromAppField(value);
              if ((!value || value === "—") && !platforms.length) return null;

              return (
                <div
                  key={key}
                  className={`${styles.insightRow} ${styles.appRow}`}
                >
                  <dt>{label}</dt>
                  <dd>
                    <div className={styles.appCell}>
                      {value && value !== "—" ? (
                        <p className={styles.appText}>{withTbc(value)}</p>
                      ) : null}
                      {platforms.length ? (
                        <div className={styles.platformShots}>
                          {platforms.map((p) => (
                            <a
                              key={p.id}
                              className={styles.platformShot}
                              href={p.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              title={p.alt}
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
                              <span className={styles.platformShotName}>
                                {p.name}
                              </span>
                            </a>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  </dd>
                </div>
              );
            }

            if (key === "guide") {
              const hasGuide =
                (value && value !== "—") ||
                covers.length > 0 ||
                digitalGuides.length > 0;
              if (!hasGuide) return null;

              return (
                <div key={key} className={`${styles.insightRow} ${styles.guideRow}`}>
                  <dt>{label}</dt>
                  <dd>
                    <div className={styles.guideCell}>
                      {value && value !== "—" ? (
                        <p className={styles.guideText}>{withTbc(value)}</p>
                      ) : null}

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
                  </dd>
                </div>
              );
            }

            return (
              <div key={key} className={styles.insightRow}>
                <dt>{label}</dt>
                <dd>{withTbc(value)}</dd>
              </div>
            );
          })}
        </dl>
      </div>
    </div>
  );
}
