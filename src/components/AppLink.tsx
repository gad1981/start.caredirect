"use client";

import { useRouter } from "next/navigation";
import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from "react";

type Props = {
  href: string;
  children: ReactNode;
  className?: string;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "onClick"> & {
    onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
  };

/**
 * In-app link that navigates on first tap. ScrollToTop lands at the top of
 * the destination page (hash targets scroll into view when the URL includes #…).
 */
export function AppLink({
  href,
  children,
  className,
  onClick,
  ...rest
}: Props) {
  const router = useRouter();

  function handleClick(e: MouseEvent<HTMLAnchorElement>) {
    onClick?.(e);
    if (e.defaultPrevented) return;
    if (
      e.button !== 0 ||
      e.metaKey ||
      e.ctrlKey ||
      e.shiftKey ||
      e.altKey
    ) {
      return;
    }

    // Pure in-page hash (#how) — keep native scroll.
    if (href.startsWith("#")) return;

    e.preventDefault();

    const hashIdx = href.indexOf("#");
    if (hashIdx >= 0) {
      const hash = href.slice(hashIdx + 1);
      router.push(href);
      window.setTimeout(() => {
        document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" });
      }, 80);
      window.setTimeout(() => {
        document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" });
      }, 220);
      return;
    }

    // Do not scroll the current page first — that flashes the home hero
    // before the destination mounts. ScrollToTop jumps after the route changes.
    router.push(href);
  }

  return (
    <a className={className} href={href} onClick={handleClick} {...rest}>
      {children}
    </a>
  );
}
