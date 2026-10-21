"use client";

import type { ReactNode } from "react";
import { AppLink } from "@/components/AppLink";

/** @deprecated Prefer AppLink — kept as a thin alias for existing imports. */
export function FooterLink({
  href,
  children,
  className,
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <AppLink href={href} className={className}>
      {children}
    </AppLink>
  );
}
