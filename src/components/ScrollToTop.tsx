"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { jumpTopSoon } from "@/lib/navigate";

function ScrollToTopInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams?.toString() ?? "";

  useEffect(() => {
    jumpTopSoon();
  }, [pathname, search]);

  return null;
}

/** Ensure client navigations always land at the top of the new page. */
export function ScrollToTop() {
  return (
    <Suspense fallback={null}>
      <ScrollToTopInner />
    </Suspense>
  );
}
