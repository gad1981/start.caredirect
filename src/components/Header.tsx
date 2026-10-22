"use client";

import { Suspense, useState } from "react";
import { AppLink } from "@/components/AppLink";
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

  function closeMenus() {
    setOpen(false);
    setProgramsOpen(false);
  }

  return (
    <>
      <div className={styles.strip}>
        <div className={styles.stripInner}>
          <span>{messages.stripSite}</span>
          <div className={styles.stripRight}>
            <Suspense fallback={null}>
              <LanguageSwitcher />
            </Suspense>
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
          <AppLink className={styles.logo} href={home} onClick={closeMenus}>
            <span className={styles.mark} aria-hidden />
            <span className="visually-hidden">START by Care Direct</span>
            <span className={styles.lockup} aria-hidden>
              <span className={styles.by}>by</span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className={styles.cdLogo}
                src="/assets/brand/caredirect-logo.png"
                alt=""
                width={249}
                height={38}
              />
            </span>
          </AppLink>
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
                  <AppLink
                    key={p.id}
                    href={localePath(locale, `/${p.slug}/`)}
                    onClick={closeMenus}
                  >
                    {p.name}
                  </AppLink>
                ))}
              </div>
            </div>
            <AppLink
              className={styles.top}
              href={`${home}#how`}
              onClick={closeMenus}
            >
              {messages.howItWorks}
            </AppLink>
            <AppLink
              className={styles.top}
              href={`${home}#live`}
              onClick={closeMenus}
            >
              {messages.liveStarts}
            </AppLink>
            <AppLink
              className={styles.cta}
              href={localePath(locale, "/plan/")}
              onClick={closeMenus}
            >
              {messages.planAStart}
            </AppLink>
          </nav>
        </div>
      </header>
    </>
  );
}
