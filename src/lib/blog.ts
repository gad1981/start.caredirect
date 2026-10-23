import type { Locale } from "@/lib/i18n";
import { defaultLocale } from "@/lib/i18n";
import enPosts from "../../content/en/blog/posts.json";

export type BlogBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "ul"; items: string[] };

export type BlogSource = {
  label: string;
  url: string;
  /** Short note on what we cite from it. */
  cites: string;
};

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  date: string;
  updated?: string;
  keywords: string[];
  /** Brand-manager search intent this article answers. */
  intent: string;
  relatedPrograms: string[];
  body: BlogBlock[];
  sources: BlogSource[];
  /** Absolute-path OG/share image under /public. */
  ogImage?: string;
};

const enList = enPosts as BlogPost[];

function deepMergePost(base: BlogPost, overlay: Partial<BlogPost>): BlogPost {
  return {
    ...base,
    ...overlay,
    keywords: overlay.keywords?.length ? overlay.keywords : base.keywords,
    relatedPrograms: base.relatedPrograms,
    sources: base.sources,
    ogImage: overlay.ogImage ?? base.ogImage,
    body: overlay.body?.length ? overlay.body : base.body,
  };
}

async function loadLocalePosts(
  locale: Locale,
): Promise<Partial<BlogPost>[] | null> {
  if (locale === defaultLocale) return null;
  try {
    const mod = await import(`../../content/${locale}/blog/posts.json`);
    const data = (mod.default ?? mod) as Partial<BlogPost>[];
    return Array.isArray(data) ? data : null;
  } catch {
    return null;
  }
}

export async function getBlogPosts(
  locale: Locale = defaultLocale,
): Promise<BlogPost[]> {
  const overlay = await loadLocalePosts(locale);
  const bySlug = new Map(
    (overlay ?? []).filter((p) => p.slug).map((p) => [p.slug as string, p]),
  );
  const merged = enList.map((post) => {
    const o = bySlug.get(post.slug);
    return o ? deepMergePost(post, o) : post;
  });
  return [...merged].sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getBlogPost(
  slug: string,
  locale: Locale = defaultLocale,
): Promise<BlogPost | undefined> {
  const posts = await getBlogPosts(locale);
  return posts.find((p) => p.slug === slug);
}

/** Articles tagged to a program slug — most specific tags first, then newest. */
export async function getBlogPostsForProgram(
  programSlug: string,
  locale: Locale = defaultLocale,
  limit = 2,
): Promise<BlogPost[]> {
  const posts = await getBlogPosts(locale);
  return posts
    .filter((p) => p.relatedPrograms?.includes(programSlug))
    .sort((a, b) => {
      const aLen = a.relatedPrograms?.length ?? 99;
      const bLen = b.relatedPrograms?.length ?? 99;
      if (aLen !== bLen) return aLen - bLen;
      return a.date < b.date ? 1 : -1;
    })
    .slice(0, limit);
}

export function getBlogSlugs(): string[] {
  return enList.map((p) => p.slug);
}
