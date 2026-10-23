import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import Script from "next/script";
import { Suspense } from "react";
import { AppLink } from "@/components/AppLink";
import { Button } from "@/components/Button";
import styles from "@/components/blog/Blog.module.css";
import { BlogFigure } from "@/components/blog/BlogFigure";
import { getBlogPost, getBlogSlugs } from "@/lib/blog";
import { getMessages } from "@/lib/content";
import {
  absoluteUrl,
  hreflangAlternates,
  isLocale,
  localePath,
  locales,
  type Locale,
} from "@/lib/i18n";
import { getProgramBySlug } from "@/lib/programs";
import { absoluteAssetUrl, DEFAULT_OG_IMAGE, socialMetadata } from "@/lib/seo";

const PUBLISHER_LOGO = "/assets/brand/caredirect-logo.png";

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    getBlogSlugs().map((slug) => ({ locale, slug })),
  );
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/blog/[slug]">): Promise<Metadata> {
  const { locale: raw, slug } = await params;
  if (!isLocale(raw)) return {};
  const locale = raw as Locale;
  const post = await getBlogPost(slug, locale);
  if (!post) return {};
  const path = `/blog/${post.slug}/`;
  const title = `${post.title} | START by Care Direct`;
  const image = post.ogImage ?? DEFAULT_OG_IMAGE;
  return {
    title,
    description: post.description,
    keywords: post.keywords,
    alternates: {
      canonical: localePath(locale, path),
      languages: hreflangAlternates(path),
    },
    ...socialMetadata({
      title: post.title,
      description: post.description,
      locale,
      path,
      type: "article",
      publishedTime: post.date,
      modifiedTime: post.updated ?? post.date,
      images: [image],
    }),
  };
}

export default function BlogArticlePage({
  params,
}: PageProps<"/[locale]/blog/[slug]">) {
  return (
    <Suspense fallback={null}>
      <BlogArticleRoute params={params} />
    </Suspense>
  );
}

async function BlogArticleRoute({
  params,
}: Pick<PageProps<"/[locale]/blog/[slug]">, "params">) {
  const { locale: raw, slug } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const post = await getBlogPost(slug, locale);
  if (!post) notFound();
  const messages = getMessages(locale);

  const related = post.relatedPrograms
    .map((s) => getProgramBySlug(s))
    .filter(Boolean);

  const image = absoluteAssetUrl(post.ogImage ?? DEFAULT_OG_IMAGE);
  const articleUrl = absoluteUrl(locale, `/blog/${post.slug}/`);
  const blogUrl = absoluteUrl(locale, "/blog/");
  const homeUrl = absoluteUrl(locale, "/");

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: post.title,
      description: post.description,
      datePublished: post.date,
      dateModified: post.updated ?? post.date,
      inLanguage: locale === "en" ? "en-GB" : locale,
      author: {
        "@type": "Organization",
        name: "Care Direct",
        url: "https://www.caredirect.com/",
        sameAs: [
          "https://www.caredirect.com/",
          "https://start.caredirect.com/",
        ],
      },
      publisher: {
        "@type": "Organization",
        name: "Care Direct",
        url: "https://www.caredirect.com/",
        logo: {
          "@type": "ImageObject",
          url: absoluteAssetUrl(PUBLISHER_LOGO),
        },
        sameAs: [
          "https://www.caredirect.com/",
          "https://start.caredirect.com/",
        ],
      },
      isPartOf: {
        "@type": "Blog",
        name: messages.blogTitle,
        url: blogUrl,
        publisher: {
          "@type": "Organization",
          name: "Care Direct",
          url: "https://www.caredirect.com/",
        },
      },
      about: {
        "@type": "Thing",
        name: "Life-stage product sampling and hybrid brand activation",
      },
      mainEntityOfPage: articleUrl,
      keywords: post.keywords.join(", "),
      image: [image],
      citation: post.sources?.map((s) => s.url),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "START",
          item: homeUrl,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: messages.blogTitle,
          item: blogUrl,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: post.title,
          item: articleUrl,
        },
      ],
    },
  ];

  return (
    <main className={`${styles.main} ${styles.mainArticle}`}>
      <Script
        id={`blog-jsonld-${post.slug}`}
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <div className={styles.rail}>
        <AppLink className={styles.back} href={localePath(locale, "/blog/")}>
          ← {messages.blogTitle}
        </AppLink>
        <header className={styles.articleHeader}>
          <p className={styles.eye}>{messages.blogEyebrow}</p>
          <h1>{post.title}</h1>
        </header>
      </div>

      {post.ogImage ? (
        <figure className={styles.hero}>
          <Image
            src={post.ogImage}
            alt={post.title}
            width={1672}
            height={941}
            priority
            sizes="100vw"
            className={styles.heroImg}
          />
        </figure>
      ) : null}

      <div className={styles.rail}>
        <div className={styles.articleMeta}>
          <div className={styles.metaRow}>
            <span>
              {messages.blogPublished} {post.date}
            </span>
            {post.updated ? (
              <span>
                {messages.blogUpdated} {post.updated}
              </span>
            ) : null}
            <span>{messages.blogForBrands}</span>
          </div>
          <p className={styles.byline}>
            <strong>{messages.blogByline}</strong>
            <span> — {messages.blogBylineDetail}</span>
          </p>
          <p className={styles.lead}>{post.description}</p>
        </div>

        <article className={styles.body}>
          {post.body.map((block, i) => {
            if (block.type === "h2") {
              return <h2 key={`${block.text}-${i}`}>{block.text}</h2>;
            }
            if (block.type === "ul") {
              return (
                <ul key={`ul-${i}`}>
                  {block.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              );
            }
            if (block.type === "figure") {
              return (
                <BlogFigure
                  key={`figure-${i}`}
                  variant={block.variant}
                  messages={messages}
                  caption={block.caption}
                />
              );
            }
            if (block.type === "p") {
              return <p key={`p-${i}`}>{block.text}</p>;
            }
            return null;
          })}
        </article>

        {post.practice ? (
          <section className={styles.practice} aria-labelledby="practice-h2">
            <h2 id="practice-h2">{messages.blogPracticeTitle}</h2>
            <p>{post.practice}</p>
          </section>
        ) : null}

        <p className={styles.expertise}>{messages.blogExpertise}</p>

        {post.sources?.length ? (
          <section className={styles.sources} aria-labelledby="sources-h2">
            <h2 id="sources-h2">{messages.blogSources}</h2>
            <ol className={styles.sourceList}>
              {post.sources.map((source) => (
                <li key={source.url}>
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {source.label}
                  </a>
                  <span> — {source.cites}</span>
                </li>
              ))}
            </ol>
          </section>
        ) : null}

        <aside className={styles.related}>
          <h2>{messages.blogNextStep}</h2>
          <p>{messages.blogNextStepLead}</p>
          <div className={styles.relatedLinks}>
            {related.map((prog) =>
              prog ? (
                <Button
                  key={prog.id}
                  href={localePath(locale, `/${prog.slug}/`)}
                >
                  {prog.name}
                </Button>
              ) : null,
            )}
            <Button href={localePath(locale, "/plan/")} accent>
              {messages.planAStart}
            </Button>
          </div>
        </aside>
      </div>
    </main>
  );
}
