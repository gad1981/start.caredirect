"use client";

import Image from "next/image";
import {
  useRef,
  useState,
  type MouseEvent,
  type PointerEvent,
  type TouchEvent,
} from "react";
import { AppLink } from "@/components/AppLink";
import type { ProgramBrand } from "@/lib/program-brands";
import { withTbc } from "@/lib/tbc";
import styles from "./HomePage.module.css";

type Stage = {
  id: string;
  name: string;
  when: string;
  where: string;
  desc: string;
  tagline?: string;
  hands?: string[];
  n: string;
  tileSrc: string;
  href: string;
};

const SWIPE_PX = 36;

export function ProgramFlipTile({
  stage,
  brand,
  exploreLabel,
}: {
  stage: Stage;
  brand: ProgramBrand;
  exploreLabel: string;
}) {
  const [flipped, setFlipped] = useState(false);
  const startX = useRef<number | null>(null);
  const startY = useRef<number | null>(null);
  const swiping = useRef(false);
  const suppressClick = useRef(false);

  function beginSwipe(x: number, y: number) {
    startX.current = x;
    startY.current = y;
    swiping.current = false;
  }

  function moveSwipe(x: number, y: number) {
    if (startX.current == null || startY.current == null) return;
    const dx = x - startX.current;
    const dy = y - startY.current;
    if (Math.abs(dx) > 10 && Math.abs(dx) > Math.abs(dy) * 1.1) {
      swiping.current = true;
    }
  }

  function endSwipe(x: number, y: number) {
    if (startX.current == null) return;
    const dx = x - startX.current;
    const dy = y - (startY.current ?? y);
    startX.current = null;
    startY.current = null;

    if (!swiping.current || Math.abs(dx) < SWIPE_PX || Math.abs(dx) < Math.abs(dy)) {
      swiping.current = false;
      return;
    }

    if (dx < 0) setFlipped(true);
    else setFlipped(false);
    suppressClick.current = true;
    swiping.current = false;
  }

  function onPointerDown(e: PointerEvent<HTMLAnchorElement>) {
    if (e.pointerType === "mouse") return;
    beginSwipe(e.clientX, e.clientY);
  }

  function onPointerMove(e: PointerEvent<HTMLAnchorElement>) {
    if (e.pointerType === "mouse") return;
    moveSwipe(e.clientX, e.clientY);
  }

  function onPointerUp(e: PointerEvent<HTMLAnchorElement>) {
    if (e.pointerType === "mouse") return;
    endSwipe(e.clientX, e.clientY);
  }

  function onTouchStart(e: TouchEvent<HTMLAnchorElement>) {
    const t = e.changedTouches[0];
    if (!t) return;
    beginSwipe(t.clientX, t.clientY);
  }

  function onTouchMove(e: TouchEvent<HTMLAnchorElement>) {
    const t = e.changedTouches[0];
    if (!t) return;
    moveSwipe(t.clientX, t.clientY);
  }

  function onTouchEnd(e: TouchEvent<HTMLAnchorElement>) {
    const t = e.changedTouches[0];
    if (!t) return;
    endSwipe(t.clientX, t.clientY);
  }

  function onClick(e: MouseEvent<HTMLAnchorElement>) {
    if (suppressClick.current) {
      e.preventDefault();
      suppressClick.current = false;
    }
  }

  function pickSide(e: MouseEvent, next: boolean) {
    e.preventDefault();
    e.stopPropagation();
    suppressClick.current = true;
    setFlipped(next);
  }

  function pickSidePointer(
    e: PointerEvent<HTMLSpanElement> | MouseEvent<HTMLSpanElement>,
    next: boolean,
  ) {
    e.preventDefault();
    e.stopPropagation();
    suppressClick.current = true;
    setFlipped(next);
  }

  return (
    <AppLink
      className={`${styles.tile} ${styles.tileFlip}${flipped ? ` ${styles.isFlipped}` : ""}`}
      href={stage.href}
      data-tone={brand.tone}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={() => {
        startX.current = null;
        startY.current = null;
        swiping.current = false;
      }}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onClick={onClick}
      aria-label={`${stage.name}. ${exploreLabel}`}
    >
      <span className={styles.flipScene}>
        <span className={styles.flipInner}>
          <span className={styles.flipFront}>
            <Image
              src={stage.tileSrc}
              alt=""
              fill
              quality={90}
              sizes="(max-width:600px) 100vw, (max-width:900px) 50vw, 25vw"
            />
            <span className={styles.tileShade} aria-hidden />
            <span className={styles.tileTop}>
              <span className={styles.num} aria-hidden>
                {stage.n}
              </span>
            </span>
            <span className={styles.tileBody}>
              <span className={styles.when}>{withTbc(stage.when)}</span>
              <h3 className={styles.tileName}>{stage.name}</h3>
              {stage.tagline ? (
                <p className={styles.tileTagline}>{stage.tagline}</p>
              ) : null}
              <span className={styles.tileFoot}>
                <span className={styles.exploreLabel}>{exploreLabel}</span>
              </span>
            </span>
          </span>
          <span className={styles.flipBack} aria-hidden={!flipped}>
            <span className={styles.flipBrand}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className={styles.flipLogo}
                src={brand.logoSrc}
                alt=""
                width={160}
                height={63}
              />
              <span className={styles.flipTag}>
                {withTbc(stage.tagline ?? stage.when)}
              </span>
            </span>
            <span className={styles.flipCopy}>
              <p className={styles.flipDesc}>{withTbc(stage.desc)}</p>
              <ul className={styles.flipList}>
                {(stage.hands ?? []).slice(0, 3).map((item) => (
                  <li key={item}>{withTbc(item)}</li>
                ))}
              </ul>
            </span>
            <span className={styles.flipCta}>{exploreLabel}</span>
          </span>
        </span>
      </span>
      <span
        className={styles.flipDots}
        aria-hidden="true"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          suppressClick.current = true;
        }}
        onPointerDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
          suppressClick.current = true;
        }}
      >
        <span
          className={`${styles.flipDot}${!flipped ? ` ${styles.flipDotActive}` : ""}`}
          onPointerDown={(e) => pickSidePointer(e, false)}
          onClick={(e) => pickSide(e, false)}
        />
        <span
          className={`${styles.flipDot}${flipped ? ` ${styles.flipDotActive}` : ""}`}
          onPointerDown={(e) => pickSidePointer(e, true)}
          onClick={(e) => pickSide(e, true)}
        />
      </span>
    </AppLink>
  );
}
