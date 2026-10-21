"use client";

import { usePathname } from "next/navigation";
import { AppLink } from "@/components/AppLink";
import {
  LOCALE_COOKIE,
  localeLabels,
  locales,
  swapLocalePath,
  type Locale,
} from "@/lib/i18n";
import { useLocale } from "./LocaleProvider";
import styles from "./LanguageSwitcher.module.css";

export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const { locale, messages } = useLocale();
  const pathname = usePathname() || "/";

  function remember(next: Locale) {
    document.cookie = `${LOCALE_COOKIE}=${next};path=/;max-age=31536000;samesite=lax`;
  }

  return (
    <nav
      className={`${styles.wrap} ${className}`.trim()}
      aria-label={messages.language}
    >
      <span className={styles.label}>{messages.language}</span>
      {locales.map((code) => {
        const href = swapLocalePath(pathname, code);
        const active = code === locale;
        return (
          <AppLink
            key={code}
            href={href}
            className={`${styles.btn} ${active ? styles.active : ""}`}
            hrefLang={code === "sr" ? "sr-Latn" : code}
            aria-current={active ? "page" : undefined}
            onClick={() => remember(code)}
          >
            {localeLabels[code]}
          </AppLink>
        );
      })}
    </nav>
  );
}
