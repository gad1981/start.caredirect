"use client";

import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import styles from "./ProgramPage.module.css";

/** Title card overlapped so the hero photo ends partway through the card. */
export function HeroTitleBand({ children }: { children: ReactNode }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [hang, setHang] = useState(0);

  useLayoutEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const mq = window.matchMedia("(max-width: 820px)");
    const sync = () => {
      const h = el.getBoundingClientRect().height;
      /* Desktop CSS: translateY(-62%) → 38% hangs below photo.
         Mobile CSS: translateY(-50%) → 50% hangs below photo. */
      setHang(h * (mq.matches ? 0.5 : 0.38));
    };
    sync();

    const ro = new ResizeObserver(sync);
    ro.observe(el);
    mq.addEventListener("change", sync);
    return () => {
      ro.disconnect();
      mq.removeEventListener("change", sync);
    };
  }, []);

  return (
    <div className={styles.heroBand} style={{ marginBottom: -hang }}>
      <div ref={cardRef} className={styles.heroCard}>
        {children}
      </div>
    </div>
  );
}
