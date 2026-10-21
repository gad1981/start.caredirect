"use client";

import type { ComponentProps, ReactNode } from "react";
import { FooterLink } from "@/components/FooterLink";
import styles from "./Button.module.css";

type Props = {
  href?: string;
  children: ReactNode;
  className?: string;
  /** Use program accent vars (--program-accent / --program-ink). */
  accent?: boolean;
  /** @deprecated Prefer accent — kept for Teen Girl call sites. */
  teen?: boolean;
  type?: "button" | "submit";
  external?: boolean;
} & Omit<ComponentProps<"button">, "type" | "className" | "children">;

export function Button({
  href,
  children,
  className = "",
  accent = false,
  teen = false,
  type = "button",
  external = false,
  ...rest
}: Props) {
  const cls = `${styles.btn} ${accent || teen ? styles.accent : ""} ${className}`.trim();

  if (href) {
    if (external || href.startsWith("http")) {
      return (
        <a
          className={cls}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
        >
          {children}
        </a>
      );
    }
    // In-page anchors keep native hash behavior.
    if (href.startsWith("#")) {
      return (
        <a className={cls} href={href}>
          {children}
        </a>
      );
    }
    return (
      <FooterLink className={cls} href={href}>
        {children}
      </FooterLink>
    );
  }

  return (
    <button className={cls} type={type} {...rest}>
      {children}
    </button>
  );
}
