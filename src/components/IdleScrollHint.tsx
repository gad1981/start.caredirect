"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./IdleScrollHint.module.css";

/**
 * Dcode-style idle nudge: one fixed dark pill that fades in when the
 * visitor pauses below the hero (not on the first screen, not near the end).
 * Caps how often it shows so it stays a hint, not a nag.
 */
export function IdleScrollHint({
  label = "Keep scrolling to explore",
  idleMs = 2800,
  maxShows = 3,
  autoHideMs = 5200,
  heroSelector = ".hero, [data-hero]",
}: {
  label?: string;
  idleMs?: number;
  maxShows?: number;
  autoHideMs?: number;
  heroSelector?: string;
}) {
  const [visible, setVisible] = useState(false);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const shownCount = useRef(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    function clearIdle() {
      if (idleTimer.current) clearTimeout(idleTimer.current);
      idleTimer.current = null;
    }

    function clearHide() {
      if (hideTimer.current) clearTimeout(hideTimer.current);
      hideTimer.current = null;
    }

    function hide() {
      setVisible(false);
      clearHide();
    }

    function inHintZone() {
      const hero = document.querySelector(heroSelector);
      const y = window.scrollY;
      const viewH = window.innerHeight;
      const docH = document.documentElement.scrollHeight;

      if (hero) {
        const heroBottom =
          hero.getBoundingClientRect().bottom + window.scrollY;
        // Still on / barely past the hero — leave room for the hero SCROLL cue.
        if (y + viewH < heroBottom + 40) return false;
      } else if (y < viewH * 0.55) {
        return false;
      }

      // Near the page end — no need to nudge further scroll.
      if (y + viewH > docH - viewH * 0.35) return false;
      return true;
    }

    function show() {
      if (shownCount.current >= maxShows || !inHintZone()) return;
      shownCount.current += 1;
      setVisible(true);
      clearHide();
      hideTimer.current = setTimeout(hide, autoHideMs);
    }

    function armIdle() {
      clearIdle();
      hide();
      if (shownCount.current >= maxShows) return;
      idleTimer.current = setTimeout(() => {
        if (inHintZone()) show();
      }, idleMs);
    }

    function onKey(e: KeyboardEvent) {
      if (
        e.key === "ArrowDown" ||
        e.key === "ArrowUp" ||
        e.key === "PageDown" ||
        e.key === "PageUp" ||
        e.key === " "
      ) {
        hide();
      }
    }

    armIdle();
    window.addEventListener("scroll", armIdle, { passive: true });
    window.addEventListener("wheel", hide, { passive: true });
    window.addEventListener("touchmove", hide, { passive: true });
    window.addEventListener("keydown", onKey);

    return () => {
      clearIdle();
      clearHide();
      window.removeEventListener("scroll", armIdle);
      window.removeEventListener("wheel", hide);
      window.removeEventListener("touchmove", hide);
      window.removeEventListener("keydown", onKey);
    };
  }, [autoHideMs, heroSelector, idleMs, maxShows]);

  return (
    <div
      className={`${styles.nudge}${visible ? ` ${styles.visible}` : ""}`}
      role="status"
      aria-live="polite"
    >
      <span className={styles.mouse} aria-hidden="true">
        <span className={styles.wheel} />
      </span>
      <span>{label}</span>
    </div>
  );
}
