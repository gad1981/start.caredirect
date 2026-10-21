"use client";

import Link from "next/link";
import { Suspense } from "react";
import { CookieSettingsButton } from "@/components/analytics/ConsentProvider";
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { localePath } from "@/lib/i18n";
import { LISTED_PROGRAMS } from "@/lib/programs";
import styles from "./Footer.module.css";

export function Footer({ footerLine }: { footerLine: string }) {
  const { locale, messages } = useLocale();

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div>
          <span className={styles.mark} aria-hidden />
          <p className={styles.tag}>{messages.tagline}</p>
        </div>
        <div className={`${styles.col} ${styles.programs}`}>
          <h2>{messages.programs}</h2>
          <div className={styles.programLinks}>
            {LISTED_PROGRAMS.map((p) => (
              <Link
                key={p.id}
                href={localePath(locale, `/${p.slug}/`)}
                scroll
                prefetch={false}
              >
                {p.name}
              </Link>
            ))}
          </div>
        </div>
        <div className={styles.col}>
          <h2>{messages.forBrands}</h2>
          <Link href={localePath(locale, "/")} scroll prefetch={false}>
            {messages.startHome}
          </Link>
          <Link href={localePath(locale, "/order/")} scroll prefetch={false}>
            {messages.orderSamples}
          </Link>
          <Link href={localePath(locale, "/plan/")} scroll prefetch={false}>
            {messages.planAStart}
          </Link>
        </div>
      </div>
      <div className={styles.base}>
        <div className={styles.baseInner}>
          <Suspense fallback={null}><LanguageSwitcher /></Suspense>
          <span>·</span>
          <span>{footerLine} · </span>
          <a
            href="https://www.caredirect.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            caredirect.com
          </a>
          <span>·</span>
          <a
            href="https://www.caredirect.com/privacy/"
            target="_blank"
            rel="noopener noreferrer"
          >
            {messages.privacy}
          </a>
          <span>·</span>
          <a
            href="https://www.caredirect.com/optout/"
            target="_blank"
            rel="noopener noreferrer"
          >
            {messages.stopMessages}
          </a>
          <span>·</span>
          <CookieSettingsButton
            className={styles.cookieBtn}
            label={messages.cookieSettings}
          />
        </div>
      </div>
    </footer>
  );
}
