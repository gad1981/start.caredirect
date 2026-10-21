"use client";

import { useMemo, useState } from "react";
import type { Locale } from "@/lib/i18n";
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
}: {
  rows: InsightRow[];
  labels: Labels;
  locale: Locale;
}) {
  const countries = useMemo(() => rows.map((r) => r.country), [rows]);
  const [active, setActive] = useState(countries[0] ?? "");
  const row = rows.find((r) => r.country === active) ?? rows[0];

  if (!rows.length || !row) return null;

  const fields: { key: keyof InsightRow; label: string }[] = [
    { key: "reach", label: labels.reach },
    { key: "cities", label: labels.cities },
    { key: "channels", label: labels.channels },
    { key: "app", label: labels.app },
    { key: "guide", label: labels.guide },
    { key: "tirage", label: labels.tirage },
  ];

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
            if (!value || value === "—") return null;
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
