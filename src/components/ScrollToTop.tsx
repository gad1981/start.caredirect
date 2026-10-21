"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

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

/** Ensure client navigations always land at the top of the new page. */
export function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    jumpTop();
    const raf = requestAnimationFrame(jumpTop);
    const t0 = window.setTimeout(jumpTop, 0);
    const t1 = window.setTimeout(jumpTop, 50);
    const t2 = window.setTimeout(jumpTop, 150);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(t0);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [pathname]);

  return null;
}
