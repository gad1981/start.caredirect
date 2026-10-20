"use client";

import { useMemo, useState } from "react";
import { withTbc } from "@/lib/tbc";
import styles from "./ProgramPage.module.css";

type Item = { country: string; label: string; href?: string };

export function CountryTabs({ items }: { items: Item[] }) {
  const countries = useMemo(
    () => [...new Set(items.map((i) => i.country))],
    [items],
  );
  const [active, setActive] = useState(countries[0] ?? "");
  const shown = items.filter((i) => i.country === active);

  if (!items.length) return null;

  return (
    <div>
      <div className={styles.tabs} role="tablist" aria-label="Countries">
        {countries.map((c) => (
          <button
            key={c}
            type="button"
            role="tab"
            className={styles.tab}
            aria-selected={c === active}
            onClick={() => setActive(c)}
          >
            {c}
          </button>
        ))}
      </div>
      <div className={styles.panel} role="tabpanel">
        <ul>
          {shown.map((item) => (
            <li key={`${item.country}-${item.label}`}>
              {item.href ? (
                <a href={item.href} target="_blank" rel="noopener noreferrer">
                  {withTbc(item.label)}
                </a>
              ) : (
                withTbc(item.label)
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
