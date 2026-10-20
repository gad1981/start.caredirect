import type { ReactNode } from "react";
import styles from "./Card.module.css";

const pastel = [styles.pastel0, styles.pastel1, styles.pastel2, styles.pastel3];

export function Card({
  children,
  className = "",
  pastelIndex,
}: {
  children: ReactNode;
  className?: string;
  pastelIndex?: number;
}) {
  const tint =
    pastelIndex === undefined ? "" : pastel[pastelIndex % pastel.length];
  return (
    <div className={`${styles.card} ${tint} ${className}`.trim()}>{children}</div>
  );
}

export function BalancedGrid({
  children,
  columns = 4,
  className = "",
}: {
  children: ReactNode;
  columns?: 2 | 3 | 4;
  className?: string;
}) {
  const col =
    columns === 2 ? styles.g2 : columns === 3 ? styles.g3 : styles.g4;
  return (
    <div className={`${styles.grid} ${col} ${className}`.trim()}>{children}</div>
  );
}
