"use client";

import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import styles from "./ProgramPage.module.css";

/** Title card overlapped so the hero photo ends at mid-card height. */
export function HeroTitleBand({ children }: { children: ReactNode }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [half, setHalf] = useState(0);

  useLayoutEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const sync = () => setHalf(el.getBoundingClientRect().height / 2);
    sync();

    const ro = new ResizeObserver(sync);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div className={styles.heroBand} style={{ marginBottom: -half }}>
      <div ref={cardRef} className={styles.heroCard}>
        {children}
      </div>
    </div>
  );
}
