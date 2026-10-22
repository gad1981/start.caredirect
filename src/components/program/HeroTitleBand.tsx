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
      /* Must match CSS translateY(-lift): transform leaves `lift` of the
         layout box empty below the visual card — pull the next section up
         by that amount so the gap under the card stays small. */
      const lift = mq.matches ? 0.5 : 0.62;
      setHang(h * lift);
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
