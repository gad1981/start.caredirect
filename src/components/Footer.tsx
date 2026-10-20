"use client";

import Link from "next/link";
import { Suspense } from "react";
import { CookieSettingsButton } from "@/components/analytics/ConsentProvider";
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { localePath } from "@/lib/i18n";
import { PROGRAMS } from "@/lib/programs";
import styles from "./Footer.module.css";

export function Footer({ footerLine }: { footerLine: string }) {
  const { locale, messages } = useLocale();
  const mid = Math.ceil(PROGRAMS.length / 2);
  const left = PROGRAMS.slice(0, mid);
  const right = PROGRAMS.slice(mid);

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div>
          <span className={styles.mark} aria-hidden />
          <p className={styles.tag}>{messages.tagline}</p>
        </div>
        <div className={styles.col}>
          <h2>{messages.programs}</h2>
          {left.map((p) => (
            <Link key={p.id} href={localePath(locale, `/${p.slug}/`)}>
              {p.name}
            </Link>
          ))}
        </div>
        <div className={styles.col}>
          <h2>{messages.programs}</h2>
          {right.map((p) => (
            <Link key={p.id} href={localePath(locale, `/${p.slug}/`)}>
              {p.name}
            </Link>
          ))}
        </div>
        <div className={styles.col}>
          <h2>{messages.forBrands}</h2>
          <Link href={localePath(locale, "/")}>{messages.startHome}</Link>
          <Link href={localePath(locale, "/order/")}>{messages.orderSamples}</Link>
          <Link href={localePath(locale, "/plan/")}>{messages.planAStart}</Link>
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
