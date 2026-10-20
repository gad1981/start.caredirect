"use client";

import Link from "next/link";
import { useState } from "react";
import { PROGRAMS } from "@/lib/programs";
import styles from "./Header.module.css";

export function Header() {
  const [open, setOpen] = useState(false);
  const [programsOpen, setProgramsOpen] = useState(false);

  return (
    <>
      <div className={styles.strip}>
        <div className={styles.stripInner}>
          <span>start.caredirect.com · the START site for brands</span>
          <a href="https://www.caredirect.com/" target="_blank" rel="noopener noreferrer">
            ← back to caredirect.com
          </a>
        </div>
      </div>
      <header className={styles.header}>
        <div className={styles.bar}>
          <Link className={styles.logo} href="/" onClick={() => setOpen(false)}>
            <span className={styles.mark} aria-hidden />
            <span className="visually-hidden">START</span>
            <span className={styles.by}>by Care Direct</span>
          </Link>
          <button
            className={styles.burger}
            type="button"
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
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
                Programs ▾
              </button>
              <div className={styles.drop}>
                {PROGRAMS.map((p) => (
                  <Link
                    key={p.id}
                    href={`/${p.slug}/`}
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
              href="/#how"
              onClick={() => setOpen(false)}
            >
              How it works
            </Link>
            <Link
              className={styles.top}
              href="/#live"
              onClick={() => setOpen(false)}
            >
              Live STARTs
            </Link>
            <Link
              className={styles.cta}
              href="/plan/"
              onClick={() => setOpen(false)}
            >
              Plan a START
            </Link>
          </nav>
        </div>
      </header>
    </>
  );
}
