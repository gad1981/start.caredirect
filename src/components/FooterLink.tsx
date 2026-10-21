"use client";

import { useRouter } from "next/navigation";
import type { MouseEvent, ReactNode } from "react";

function jumpTop() {
  if (typeof window === "undefined") return;
  const html = document.documentElement;
  const prev = html.style.scrollBehavior;
  html.style.scrollBehavior = "auto";
  window.scrollTo(0, 0);
  html.scrollTop = 0;
  document.body.scrollTop = 0;
  html.style.scrollBehavior = prev;
}

/**
 * Footer nav that always navigates on the first tap and lands at the top.
 * Native <a> + router.push avoids the iOS/Next soft-nav “second tap” feel.
 */
export function FooterLink({
  href,
  children,
  className,
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  const router = useRouter();

  function onClick(e: MouseEvent<HTMLAnchorElement>) {
    // Allow modified clicks (new tab, etc.)
    if (
      e.defaultPrevented ||
      e.button !== 0 ||
      e.metaKey ||
      e.ctrlKey ||
      e.shiftKey ||
      e.altKey
    ) {
      return;
    }
    e.preventDefault();
    jumpTop();
    router.push(href);
    requestAnimationFrame(jumpTop);
    window.setTimeout(jumpTop, 40);
    window.setTimeout(jumpTop, 120);
  }

  return (
    <a className={className} href={href} onClick={onClick}>
      {children}
    </a>
  );
}
