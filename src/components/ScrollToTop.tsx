"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/** Ensure client navigations always land at the top of the new page. */
export function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;
    // Path-only navigations (footer / CTAs / program links) should start at top.
    // Same-page hash links do not change pathname, so anchors still work.
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname]);

  return null;
}
