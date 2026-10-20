import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  LOCALE_COOKIE,
  defaultLocale,
  isPrefixedLocale,
  type Locale,
  type PrefixedLocale,
} from "@/lib/i18n";

const PUBLIC_FILE = /\.[^/]+$/;

function negotiatePrefixedLocale(
  acceptLanguage: string | null,
): PrefixedLocale | null {
  if (!acceptLanguage) return null;
  const preferred = acceptLanguage
    .split(",")
    .map((part) => {
      const [tag, q] = part.trim().split(";q=");
      return { tag: tag.toLowerCase(), q: q ? Number(q) : 1 };
    })
    .sort((a, b) => b.q - a.q);

  for (const { tag } of preferred) {
    const base = tag.split("-")[0];
    if (isPrefixedLocale(base)) return base;
    if (tag.startsWith("sr")) return "sr";
    if (tag.startsWith("el") || tag.startsWith("gr")) return "el";
  }
  return null;
}

function withLocaleHeader(response: NextResponse, locale: Locale) {
  response.headers.set("x-start-locale", locale);
  return response;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/assets") ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  const segments = pathname.split("/").filter(Boolean);
  const first = segments[0];

  if (first && isPrefixedLocale(first)) {
    const response = NextResponse.next();
    response.cookies.set(LOCALE_COOKIE, first, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
    return withLocaleHeader(response, first);
  }

  // Soft-suggest: first visit to home only, never force away from EN deep links.
  const cookie = request.cookies.get(LOCALE_COOKIE)?.value;
  const isHome = pathname === "/" || pathname === "";
  if (!cookie && isHome) {
    const suggested = negotiatePrefixedLocale(
      request.headers.get("accept-language"),
    );
    if (suggested) {
      const url = request.nextUrl.clone();
      url.pathname = `/${suggested}/`;
      const response = NextResponse.redirect(url);
      response.cookies.set(LOCALE_COOKIE, suggested, {
        path: "/",
        maxAge: 60 * 60 * 24 * 365,
        sameSite: "lax",
      });
      return withLocaleHeader(response, suggested);
    }
  }

  // Rewrite unprefixed English URLs to the internal /en/... tree.
  const url = request.nextUrl.clone();
  url.pathname =
    pathname === "/" ? `/${defaultLocale}/` : `/${defaultLocale}${pathname}`;
  const response = NextResponse.rewrite(url);
  return withLocaleHeader(response, defaultLocale);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
