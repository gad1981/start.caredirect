import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { AppLink } from "@/components/AppLink";
import styles from "@/components/blog/Blog.module.css";
import { getBlogPosts } from "@/lib/blog";
import { getMessages } from "@/lib/content";
import {
  hreflangAlternates,
  isLocale,
  localePath,
  type Locale,
} from "@/lib/i18n";
import { socialMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/blog">): Promise<Metadata> {
  const { locale: raw } = await params;
  if (!isLocale(raw)) return {};
  const locale = raw as Locale;
  const messages = getMessages(locale);
  const title = `${messages.blogTitle} | START by Care Direct`;
  const description = messages.blogLead;
  return {
    title,
    description,
    alternates: {
      canonical: localePath(locale, "/blog/"),
      languages: hreflangAlternates("/blog/"),
    },
    ...socialMetadata({
      title,
      description,
      locale,
      path: "/blog/",
    }),
  };
}

export default function BlogIndexPage({
  params,
}: PageProps<"/[locale]/blog">) {
  return (
    <Suspense fallback={null}>
      <BlogIndexRoute params={params} />
    </Suspense>
  );
}

async function BlogIndexRoute({
  params,
}: Pick<PageProps<"/[locale]/blog">, "params">) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const messages = getMessages(locale);
  const posts = await getBlogPosts(locale);

  return (
    <main className={styles.main}>
      <p className={styles.eye}>{messages.blogEyebrow}</p>
      <h1>{messages.blogTitle}</h1>
      <p className={styles.lead}>{messages.blogLead}</p>
      <div className={styles.grid}>
        {posts.map((post) => (
          <AppLink
            key={post.slug}
            className={styles.card}
            href={localePath(locale, `/blog/${post.slug}/`)}
          >
            {post.ogImage ? (
              <div
                className={styles.cardMedia}
                style={{ backgroundImage: `url(${post.ogImage})` }}
                aria-hidden
              />
            ) : null}
            <div className={styles.cardCopy}>
              <p className={styles.cardMeta}>{post.date}</p>
              <h2>{post.title}</h2>
              <p>{post.description}</p>
              <span className={styles.cardMore}>{messages.blogRead}</span>
            </div>
          </AppLink>
        ))}
      </div>
    </main>
  );
}
