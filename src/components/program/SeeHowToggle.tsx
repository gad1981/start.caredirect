"use client";

import { useId, useState, type ReactNode } from "react";
import styles from "./KitFitSection.module.css";

export function SeeHowToggle({
  label,
  hideLabel,
  children,
}: {
  label: string;
  hideLabel: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  return (
    <div className={styles.seeHow} data-open={open ? "true" : "false"}>
      <button
        type="button"
        className={styles.seeHowBtn}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
      >
        <span className={styles.seeHowOrb} aria-hidden>
          <span className={styles.seeHowChevron} />
        </span>
        <span className={styles.seeHowKicker}>
          {open ? hideLabel : label}
        </span>
      </button>

      <div className={styles.seeHowRail} aria-hidden />

      <div id={panelId} className={styles.seeHowPanel} aria-hidden={!open}>
        <div className={styles.seeHowPanelInner}>{children}</div>
      </div>
    </div>
  );
}
