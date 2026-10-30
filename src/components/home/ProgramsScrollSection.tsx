"use client";

import {
  Children,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import styles from "./HomePage.module.css";

const DESKTOP_MQ = "(min-width: 901px)";
const MOTION_MQ = "(prefers-reduced-motion: reduce)";
/** Focus line as a fraction of the rail viewport width (left of center). */
const FOCUS_INSET = 0.22;
/** Pull focus forward so the next card (from the right) takes over sooner. */
const FOCUS_LEAD = 0.45;

type PinMode = "before" | "pinning" | "after";

/**
 * Desktop: pins the whole programs block (title stays) and maps vertical
 * scroll to a horizontal card rail. Focused card grows inside the rail only.
 */
export function ProgramsScrollSection({
  eyebrow,
  headingId,
  heading,
  lead,
  children,
}: {
  eyebrow: string;
  headingId: string;
  heading: string;
  lead: string;
  children: ReactNode;
}) {
  const pinRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const metricsRef = useRef({
    header: 0,
    stickyH: 0,
    overflow: 0,
    focusInset: 0,
    heroScale: 1.25,
  });
  const [enabled, setEnabled] = useState(false);
  const [pinMode, setPinMode] = useState<PinMode>("before");

  useEffect(() => {
    const desktopMq = window.matchMedia(DESKTOP_MQ);
    const motionMq = window.matchMedia(MOTION_MQ);

    function syncMode() {
      setEnabled(desktopMq.matches && !motionMq.matches);
    }

    syncMode();
    desktopMq.addEventListener("change", syncMode);
    motionMq.addEventListener("change", syncMode);
    window.addEventListener("resize", syncMode);
    return () => {
      desktopMq.removeEventListener("change", syncMode);
      motionMq.removeEventListener("change", syncMode);
      window.removeEventListener("resize", syncMode);
    };
  }, []);

  useEffect(() => {
    const pinEl = pinRef.current;
    const stickyEl = stickyRef.current;
    const head = headRef.current;
    const viewportEl = viewportRef.current;
    const trackEl = trackRef.current;
    const fill = fillRef.current;
    if (!pinEl || !stickyEl || !viewportEl || !trackEl) return;

    // Re-bind as definite HTMLElements so nested closures keep non-null types.
    const pin: HTMLElement = pinEl;
    const sticky: HTMLElement = stickyEl;
    const viewport: HTMLElement = viewportEl;
    const track: HTMLElement = trackEl;

    function cardNodes() {
      return [...track.querySelectorAll<HTMLElement>("[data-rail-card]")];
    }

    function clearCardFocus() {
      for (const card of cardNodes()) {
        card.style.removeProperty("--card-focus");
        card.style.removeProperty("--card-bright");
        card.style.removeProperty("--card-gray");
        card.style.removeProperty("z-index");
        card.removeAttribute("data-hero");
      }
    }

    function resetInline() {
      pin.style.height = "";
      sticky.style.height = "";
      sticky.style.top = "";
      sticky.style.width = "";
      viewport.style.height = "";
      track.style.removeProperty("--rail-x");
      track.style.removeProperty("--rail-hero-scale");
      track.style.paddingLeft = "";
      track.style.paddingRight = "";
      fill?.style.setProperty("--rail-progress", "0");
      clearCardFocus();
      setPinMode("before");
    }

    if (!enabled) {
      resetInline();
      return;
    }

    let frame = 0;
    let roQuietUntil = 0;

    function headerHeight() {
      return document.querySelector("header")?.getBoundingClientRect().height ?? 0;
    }

    function pageScroll() {
      return document.scrollingElement?.scrollTop ?? window.scrollY;
    }

    function layoutMid(card: HTMLElement) {
      // Layout center (ignores the card's own scale transform).
      const trackLeft = track.getBoundingClientRect().left;
      return trackLeft + card.offsetLeft + card.offsetWidth / 2;
    }

    function layout() {
      const header = headerHeight();
      const stickyH = Math.max(window.innerHeight - header, 420);
      sticky.style.height = `${stickyH}px`;

      track.style.setProperty("--rail-x", "0px");
      track.style.paddingLeft = "0px";
      track.style.paddingRight = "16px";

      const headH = head?.offsetHeight ?? 0;
      const topPad = 4;
      const bottomPad = 88;
      const stageGap = 10;
      const stageH = Math.max(
        260,
        stickyH - headH - topPad - bottomPad - stageGap - 8,
      );
      viewport.style.height = `${stageH}px`;

      const view = viewport.getBoundingClientRect();
      const focusInset = view.width * FOCUS_INSET;
      const focusX = view.left + focusInset;
      const cards = cardNodes();
      const cardW = Math.max(cards[0]?.offsetWidth ?? 0, 200);
      const cardH = Math.max(cards[0]?.offsetHeight ?? 0, cardW * 1.25);

      // Grow as much as fits inside the rail stage — never outside.
      const byH = (stageH * 0.94) / cardH;
      const byW = (view.width * 0.7) / cardW;
      const heroScale = Math.max(1.15, Math.min(byH, byW));
      // Widen gaps before measuring travel so scale never collapses spacing.
      track.style.setProperty("--rail-hero-scale", heroScale.toFixed(4));

      const first = cards[0];
      const last = cards[cards.length - 1];

      // Park the first card on the focus line at progress 0, then travel
      // exactly first→last so each card hits focus on an even scroll share.
      if (first && last) {
        const firstMid = layoutMid(first);
        const leftPad = Math.max(0, Math.round(focusX - firstMid));
        if (leftPad > 0) {
          track.style.paddingLeft = `${leftPad}px`;
        }

        const lastMid = layoutMid(last);
        // Stop once the last card is near focus — don't drag the finale.
        const travel = Math.max(0, lastMid - focusX - cardW * 0.55);
        let overflow = Math.max(0, track.scrollWidth - viewport.clientWidth);
        if (travel > overflow) {
          track.style.paddingRight = `${16 + (travel - overflow)}px`;
          overflow = Math.max(0, track.scrollWidth - viewport.clientWidth);
        } else if (overflow > travel && travel > 0) {
          // Natural track was longer than needed; cap so the right ends earlier.
          overflow = travel;
        }

        roQuietUntil = performance.now() + 80;
        pin.style.height = `${stickyH + overflow}px`;

        metricsRef.current = {
          header,
          stickyH,
          overflow,
          focusInset,
          heroScale,
        };
      } else {
        const overflow = Math.max(0, track.scrollWidth - viewport.clientWidth);
        roQuietUntil = performance.now() + 80;
        pin.style.height = `${stickyH + overflow}px`;
        metricsRef.current = {
          header,
          stickyH,
          overflow,
          focusInset,
          heroScale,
        };
      }
      update();
    }

    function updateFocus(progress: number) {
      const cards = cardNodes();
      if (!cards.length) return;

      const { heroScale } = metricsRef.current;
      const n = cards.length;
      // Even scroll share, edged forward so cards from the right start sooner.
      const best = Math.min(
        n - 1,
        Math.max(0, Math.round(progress * (n - 1) + FOCUS_LEAD)),
      );

      for (let i = 0; i < n; i++) {
        const node = cards[i];
        const isHero = i === best;
        node.toggleAttribute("data-hero", isHero);
        node.style.setProperty(
          "--card-focus",
          isHero ? heroScale.toFixed(4) : "1",
        );
        node.style.setProperty("--card-bright", isHero ? "1.02" : "1");
        node.style.setProperty("--card-gray", isHero ? "0" : "1");
        node.style.zIndex = isHero ? "5" : "1";
      }
    }

    function update() {
      const { header, overflow } = metricsRef.current;
      const y = pageScroll();
      const start = pin.getBoundingClientRect().top + y;
      const end = start + overflow;

      let mode: PinMode = "before";
      let progress = 0;

      if (overflow <= 0 || y < start) {
        mode = "before";
        progress = 0;
      } else if (y >= end) {
        mode = "after";
        progress = 1;
      } else {
        mode = "pinning";
        progress = (y - start) / overflow;
      }

      setPinMode((prev) => (prev === mode ? prev : mode));
      if (mode === "pinning") {
        sticky.style.top = `${header}px`;
        sticky.style.width = `${pin.clientWidth}px`;
      } else {
        sticky.style.top = "";
        sticky.style.width = "";
      }

      track.style.setProperty("--rail-x", `${-(progress * overflow)}px`);
      fill?.style.setProperty("--rail-progress", String(progress));
      updateFocus(progress);
    }

    function onScroll() {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    }

    function onResize() {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(layout);
    }

    function onRo() {
      if (performance.now() < roQuietUntil) return;
      onResize();
    }

    layout();
    document.addEventListener("scroll", onScroll, {
      passive: true,
      capture: true,
    });
    window.addEventListener("resize", onResize);
    const ro = new ResizeObserver(onRo);
    ro.observe(track);
    ro.observe(viewport);
    if (head) ro.observe(head);

    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onResize);
      ro.disconnect();
      resetInline();
    };
  }, [enabled]);

  const modeClass =
    enabled && pinMode === "pinning"
      ? ` ${styles.programsPinning}`
      : enabled && pinMode === "after"
        ? ` ${styles.programsAfter}`
        : "";

  const cards = Children.toArray(children);

  return (
    <section
      ref={pinRef}
      className={`${styles.section}${enabled ? ` ${styles.programsPin}` : ""}${modeClass}`}
      id="programs"
      aria-labelledby={headingId}
    >
      <div
        ref={stickyRef}
        className={enabled ? styles.programsSticky : undefined}
      >
        <div className={styles.wrap}>
          <div ref={headRef} className={styles.programsHead}>
            <p className={styles.eye}>{eyebrow}</p>
            <h2 id={headingId}>{heading}</h2>
            <p className={styles.secLead}>{lead}</p>
          </div>

          <div
            ref={viewportRef}
            className={enabled ? styles.tilesViewport : undefined}
          >
            <div
              ref={trackRef}
              className={`${styles.tiles}${enabled ? ` ${styles.tilesRail}` : ""}`}
            >
              {enabled ? (
                <aside
                  className={styles.railBookend}
                  data-rail-bookend="intro"
                  aria-hidden="true"
                >
                  <div className={styles.railBookendArt}>
                    <span className={styles.railOrbit} />
                    <span
                      className={`${styles.railOrbit} ${styles.railOrbit2}`}
                    />
                    <span className={styles.railPulse} />
                    <div className={styles.railBookendCopy}>
                      <p className={styles.railBookendEye}>Life stages</p>
                      <p className={styles.railBookendTitle}>
                        Scroll through
                        <br />
                        every first day
                      </p>
                    </div>
                  </div>
                </aside>
              ) : null}

              {enabled
                ? cards.map((child, i) => (
                    <div key={i} className={styles.railCard} data-rail-card>
                      {child}
                    </div>
                  ))
                : children}

              {enabled ? (
                <aside
                  className={`${styles.railBookend} ${styles.railBookendOutro}`}
                  data-rail-bookend="outro"
                  aria-hidden="true"
                >
                  <div className={styles.railBookendArt}>
                    <span className={styles.railOrbit} />
                    <span
                      className={`${styles.railOrbit} ${styles.railOrbit2}`}
                    />
                    <span className={styles.railPulse} />
                    <div className={styles.railBookendCopy}>
                      <p className={styles.railBookendEye}>
                        Ready when you are
                      </p>
                      <p className={styles.railBookendTitle}>
                        Pick a START
                        <br />
                        and go deeper
                      </p>
                    </div>
                  </div>
                </aside>
              ) : null}
            </div>
          </div>

          {enabled ? (
            <div
              className={styles.railScrollbar}
              role="presentation"
              aria-hidden="true"
            >
              <div ref={fillRef} className={styles.railScrollbarFill} />
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
