"use client";

import { useEffect, useState } from "react";
import styles from "./HomePage.module.css";

/** Always-on first-screen SCROLL cue — mirrors dcode.gr `hero__scroll`. */
export function HeroScrollCue({ href = "#programs" }: { href?: string }) {
  const [onHero, setOnHero] = useState(true);

  useEffect(() => {
    function update() {
      const hero = document.querySelector("[data-hero]");
      if (!hero) {
        setOnHero(window.scrollY < window.innerHeight * 0.55);
        return;
      }
      const bottom = hero.getBoundingClientRect().bottom;
      // Stay visible while the hero still owns most of the viewport.
      setOnHero(bottom > window.innerHeight * 0.55);
    }

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <a
      className={`${styles.heroScroll}${onHero ? ` ${styles.heroScrollOn}` : ""}`}
      href={href}
      aria-label="Scroll"
      tabIndex={onHero ? 0 : -1}
    >
      <span className={styles.heroScrollMouse} aria-hidden="true">
        <span className={styles.heroScrollWheel} />
      </span>
      <span>Scroll</span>
      <span className={styles.heroScrollLine} aria-hidden="true" />
    </a>
  );
}
