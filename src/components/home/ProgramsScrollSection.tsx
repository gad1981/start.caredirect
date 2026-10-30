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
const FOCUS_LEAD = 0.15;
/** Extra scroll at the start while the first card stays put. */
const START_HOLD_PX = 240;

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
  const stageRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const metricsRef = useRef({
    header: 0,
    stickyH: 0,
    overflow: 0,
    travel: 0,
    stickyInset: 0,
    focusInset: 0,
    heroScale: 1.25,
  });
  const pinModeRef = useRef<PinMode>("before");
  const pinStartYRef = useRef(0);
  const pinTopRef = useRef(0);
  const [enabled, setEnabled] = useState(false);

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
    const stage = stageRef.current;
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

    function applyPinMode(mode: PinMode) {
      pinModeRef.current = mode;
      pin.classList.toggle(styles.programsPinning, mode === "pinning");
      pin.classList.toggle(styles.programsAfter, mode === "after");
    }

    function clearStickyPinStyles() {
      sticky.style.position = "";
      sticky.style.top = "";
      sticky.style.bottom = "";
      sticky.style.left = "";
      sticky.style.right = "";
      sticky.style.width = "";
      sticky.style.zIndex = "";
      sticky.style.margin = "";
    }

    function resetInline() {
      pin.style.height = "";
      sticky.style.height = "";
      clearStickyPinStyles();
      viewport.style.height = "";
      track.style.removeProperty("--rail-x");
      track.style.removeProperty("--rail-hero-scale");
      track.style.paddingLeft = "";
      track.style.paddingRight = "";
      fill?.style.setProperty("--rail-progress", "0");
      stage?.style.setProperty("--rail-progress", "0");
      setRailChrome(false);
      clearCardFocus();
      applyPinMode("before");
      pinStartYRef.current = 0;
      pinTopRef.current = 0;
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

    function setRailChrome(active: boolean) {
      document.documentElement.toggleAttribute("data-programs-rail", active);
      sticky.style.removeProperty("--programs-chrome");
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
      // Sit under the header — avoids a padding jump/clip when pinning starts.
      const stickyH = Math.max(window.innerHeight - header, 420);
      sticky.style.height = `${stickyH}px`;

      track.style.setProperty("--rail-x", "0px");
      track.style.paddingLeft = "0px";
      track.style.paddingRight = "16px";

      const headH = head?.offsetHeight ?? 0;
      const topPad = 4;
      const bottomPad = 88;
      const stageGap = 10;
      const maxStage = Math.max(
        260,
        stickyH - headH - topPad - bottomPad - stageGap - 8,
      );

      // Measure cards at natural size first (stage height set below).
      viewport.style.height = `${Math.min(maxStage, 420)}px`;
      const view = viewport.getBoundingClientRect();
      const focusInset = view.width * FOCUS_INSET;
      const focusX = view.left + focusInset;
      const cards = cardNodes();
      const cardW = Math.max(cards[0]?.offsetWidth ?? 0, 200);
      const cardH = Math.max(cards[0]?.offsetHeight ?? 0, cardW * 1.25);

      // Size stage to the scaled hero + air so top/bottom never clip.
      const byW = (view.width * 0.55) / cardW;
      let heroScale = Math.max(1.12, Math.min(1.28, byW));
      const air = 48;
      let stageH = Math.ceil(cardH * heroScale + air);
      if (stageH > maxStage) {
        heroScale = Math.max(1.08, (maxStage - air) / cardH);
        stageH = Math.min(maxStage, Math.ceil(cardH * heroScale + air));
      }
      viewport.style.height = `${stageH}px`;

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
        // Park the last card near focus; pin adds a start hold for card one.
        const travel = Math.max(0, lastMid - focusX - cardW * 0.7);
        let natural = Math.max(0, track.scrollWidth - viewport.clientWidth);
        if (travel > natural) {
          track.style.paddingRight = `${16 + (travel - natural)}px`;
          natural = Math.max(0, track.scrollWidth - viewport.clientWidth);
        }
        const railTravel = travel > 0 ? travel : natural;
        const overflow =
          railTravel + (railTravel > 0 ? START_HOLD_PX : 0);

        roQuietUntil = performance.now() + 80;
        pin.style.height = `${stickyH + overflow}px`;

        metricsRef.current = {
          header,
          stickyH,
          overflow,
          travel: railTravel,
          // Capture while relative — offsetTop is wrong once fixed.
          stickyInset: sticky.offsetTop,
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
          travel: overflow,
          stickyInset: sticky.offsetTop,
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
      const { header, overflow, travel } = metricsRef.current;
      const y = pageScroll();
      const railTravel = travel > 0 ? travel : overflow;
      let mode = pinModeRef.current;
      let pinProgress = 0;

      if (overflow <= 0) {
        mode = "before";
        pinProgress = 0;
      } else if (mode === "before") {
        // Engage only when the sticky itself hits the header — freeze that
        // exact Y/top so switching to fixed does not nudge content down.
        const liveTop = sticky.getBoundingClientRect().top;
        if (liveTop <= header + 0.5) {
          pinStartYRef.current = y;
          pinTopRef.current = liveTop;
          mode = "pinning";
          pinProgress = 0;
        }
      } else if (mode === "pinning") {
        pinProgress = (y - pinStartYRef.current) / overflow;
        if (pinProgress >= 1) {
          mode = "after";
          pinProgress = 1;
        } else if (pinProgress < 0 || y < pinStartYRef.current) {
          mode = "before";
          pinProgress = 0;
        }
      } else {
        // after
        pinProgress = 1;
        if (y < pinStartYRef.current + overflow) {
          mode = "pinning";
          pinProgress = Math.max(
            0,
            Math.min(1, (y - pinStartYRef.current) / overflow),
          );
        }
        if (y < pinStartYRef.current) {
          mode = "before";
          pinProgress = 0;
        }
      }

      if (mode !== pinModeRef.current) {
        applyPinMode(mode);
      }

      if (mode === "pinning") {
        sticky.style.position = "fixed";
        sticky.style.top = `${pinTopRef.current}px`;
        sticky.style.bottom = "auto";
        sticky.style.left = "0";
        sticky.style.right = "0";
        sticky.style.width = `${pin.clientWidth}px`;
        sticky.style.zIndex = "5";
        sticky.style.margin = "0 auto";
        setRailChrome(true);
      } else if (mode === "after") {
        sticky.style.position = "absolute";
        sticky.style.top = "auto";
        sticky.style.bottom = "0";
        sticky.style.left = "0";
        sticky.style.right = "0";
        sticky.style.width = "";
        sticky.style.zIndex = "5";
        sticky.style.margin = "";
        setRailChrome(true);
      } else {
        clearStickyPinStyles();
        setRailChrome(false);
      }

      // First card holds still through START_HOLD_PX, then the rail moves 1:1.
      const scrolled = Math.max(0, y - pinStartYRef.current);
      const hold = railTravel > 0 ? START_HOLD_PX : 0;
      const railProgress =
        mode === "before"
          ? 0
          : railTravel <= 0
            ? pinProgress
            : Math.min(1, Math.max(0, (scrolled - hold) / railTravel));

      track.style.setProperty("--rail-x", `${-(railProgress * railTravel)}px`);
      fill?.style.setProperty("--rail-progress", String(pinProgress));
      stage?.style.setProperty("--rail-progress", String(pinProgress));
      updateFocus(railProgress);
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

  const cards = Children.toArray(children);

  return (
    <section
      ref={pinRef}
      className={`${styles.section}${enabled ? ` ${styles.programsPin}` : ""}`}
      id="programs"
      aria-labelledby={headingId}
    >
      <div
        ref={stickyRef}
        className={`${styles.scrollHintHost}${enabled ? ` ${styles.programsSticky}` : ""}`}
      >
        <div className={styles.wrap}>
          <div ref={headRef} className={styles.programsHead}>
            <p className={styles.eye}>{eyebrow}</p>
            <h2 id={headingId}>{heading}</h2>
            <p className={styles.secLead}>{lead}</p>
          </div>

          <div
            ref={stageRef}
            className={enabled ? styles.railStage : undefined}
          >
            {enabled ? (
              <span className={`${styles.railArrow} ${styles.railArrowPrev}`} aria-hidden="true">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden="true">
                  <path
                    d="M15 5L8 12l7 7"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            ) : null}

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
                        <span className={styles.railBookendLogo} />
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
                        <span className={styles.railBookendLogo} />
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
              <span className={`${styles.railArrow} ${styles.railArrowNext}`} aria-hidden="true">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden="true">
                  <path
                    d="M9 5l7 7-7 7"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            ) : null}
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
