"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { localePath } from "@/lib/i18n";
import { LISTED_PROGRAMS } from "@/lib/programs";
import styles from "./Header.module.css";

export function Header() {
  const { locale, messages } = useLocale();
  const [open, setOpen] = useState(false);
  const [programsOpen, setProgramsOpen] = useState(false);
  const home = localePath(locale, "/");

  return (
    <>
      <div className={styles.strip}>
        <div className={styles.stripInner}>
          <span>{messages.stripSite}</span>
          <div className={styles.stripRight}>
            <Suspense fallback={null}><LanguageSwitcher /></Suspense>
            <a
              href="https://www.caredirect.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              {messages.stripBack}
            </a>
          </div>
        </div>
      </div>
      <header className={styles.header}>
        <div className={styles.bar}>
          <Link
            className={styles.logo}
            href={home}
            onClick={() => setOpen(false)}
          >
            <span className={styles.mark} aria-hidden />
            <span className="visually-hidden">START</span>
            <span className={styles.by}>{messages.byCareDirect}</span>
          </Link>
          <button
            className={styles.burger}
            type="button"
            aria-expanded={open}
            aria-label={open ? messages.closeMenu : messages.openMenu}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? "×" : "☰"}
          </button>
          <nav className={`${styles.nav} ${open ? styles.navOpen : ""}`}>
            <div
              className={`${styles.item} ${programsOpen ? styles.itemOpen : ""}`}
            >
              <button
                className={styles.top}
                type="button"
                aria-expanded={programsOpen}
                onClick={() => setProgramsOpen((v) => !v)}
              >
                {messages.programs} ▾
              </button>
              <div className={styles.drop}>
                {LISTED_PROGRAMS.map((p) => (
                  <Link
                    key={p.id}
                    href={localePath(locale, `/${p.slug}/`)}
                    scroll
                    onClick={() => {
                      setOpen(false);
                      setProgramsOpen(false);
                    }}
                  >
                    {p.name}
                  </Link>
                ))}
              </div>
            </div>
            <Link
              className={styles.top}
              href={`${home}#how`}
              onClick={() => setOpen(false)}
            >
              {messages.howItWorks}
            </Link>
            <Link
              className={styles.top}
              href={`${home}#live`}
              onClick={() => setOpen(false)}
            >
              {messages.liveStarts}
            </Link>
            <Link
              className={styles.cta}
              href={localePath(locale, "/plan/")}
              onClick={() => setOpen(false)}
            >
              {messages.planAStart}
            </Link>
          </nav>
        </div>
      </header>
    </>
  );
}
