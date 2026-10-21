"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useRef,
  useState,
  type MouseEvent,
  type PointerEvent,
} from "react";
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

export function ProgramFlipTile({
  stage,
  brand,
  exploreLabel,
  swipeHint,
}: {
  stage: Stage;
  brand: ProgramBrand;
  exploreLabel: string;
  swipeHint: string;
}) {
  const [flipped, setFlipped] = useState(false);
  const startX = useRef<number | null>(null);
  const startY = useRef<number | null>(null);
  const swiping = useRef(false);
  const suppressClick = useRef(false);

  function onPointerDown(e: PointerEvent<HTMLAnchorElement>) {
    if (e.pointerType === "mouse") return;
    startX.current = e.clientX;
    startY.current = e.clientY;
    swiping.current = false;
  }

  function onPointerMove(e: PointerEvent<HTMLAnchorElement>) {
    if (startX.current == null || startY.current == null) return;
    const dx = e.clientX - startX.current;
    const dy = e.clientY - startY.current;
    if (Math.abs(dx) > 12 && Math.abs(dx) > Math.abs(dy) * 1.2) {
      swiping.current = true;
    }
  }

  function onPointerUp(e: PointerEvent<HTMLAnchorElement>) {
    if (startX.current == null) return;
    const dx = e.clientX - startX.current;
    const dy = e.clientY - (startY.current ?? e.clientY);
    startX.current = null;
    startY.current = null;

    if (!swiping.current || Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(dy)) {
      swiping.current = false;
      return;
    }

    // Swipe left → show back; swipe right → show front
    if (dx < 0 && !flipped) setFlipped(true);
    if (dx > 0 && flipped) setFlipped(false);
    suppressClick.current = true;
    swiping.current = false;
  }

  function onClick(e: MouseEvent<HTMLAnchorElement>) {
    if (suppressClick.current) {
      e.preventDefault();
      suppressClick.current = false;
    }
  }

  return (
    <Link
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
      onClick={onClick}
      aria-label={`${stage.name}. ${flipped ? exploreLabel : swipeHint}`}
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
                <span className={styles.swipeHint} aria-hidden="true">
                  <span className={styles.swipeHintText}>{swipeHint}</span>
                  <span className={styles.swipeChevrons} aria-hidden>
                    <span>‹</span>
                    <span>‹</span>
                    <span>‹</span>
                  </span>
                </span>
                <span className={styles.exploreLabel}>{exploreLabel}</span>
              </span>
            </span>
          </span>
          <span className={styles.flipBack} aria-hidden="true">
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
    </Link>
  );
}
