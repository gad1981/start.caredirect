import Image from "next/image";
import { Button } from "@/components/Button";
import { BriefForm } from "@/components/BriefForm";
import {
  getDoodlePlan,
  getInsights,
  getKitFit,
  getMessages,
  getPages,
  getStartHome,
  getTaglines,
} from "@/lib/content";
import { localePath, type Locale } from "@/lib/i18n";
import { getProgramBrand } from "@/lib/program-brands";
import type { ProgramId } from "@/lib/programs";
import { getProgramById, programHeroSrc, programKitSrc } from "@/lib/programs";
import { withTbc } from "@/lib/tbc";
import { BrandGetIcon } from "./BrandGetIcon";
import { InsightsTabs } from "./InsightsTabs";
import { KitFitSection } from "./KitFitSection";
import styles from "./ProgramPage.module.css";

function doodleSrc(key: string) {
  return `/assets/start-doodles/st-teen-${key}-line.webp`;
}

function parseAbout(copy: string) {
  const [leadRaw, factsRaw = ""] = copy.split("||").map((s) => s.trim());
  const facts: { label: string; value: string }[] = [];
  for (const part of factsRaw.split("·")) {
    const [label, ...rest] = part.split(":").map((s) => s.trim());
    if (label && rest.length) facts.push({ label, value: rest.join(":").trim() });
  }
  return { lead: leadRaw, facts };
}

function parseCards(copy: string) {
  return copy.split("·").map((chunk) => {
    const [title, ...rest] = chunk.split(":").map((s) => s.trim());
    return { title, body: rest.join(":").trim() };
  });
}

export async function ProgramPage({
  programId,
  locale,
}: {
  programId: ProgramId;
  locale: Locale;
}) {
  const prog = getProgramById(programId);
  const pages = await getPages(locale);
  const page = pages[programId];
  if (!prog || !page) return null;

  const messages = getMessages(locale);
  const startHome = await getStartHome(locale);
  const doodlePlan = await getDoodlePlan(locale);
  const taglines = await getTaglines(locale);
  const insightsMap = await getInsights(locale);
  const kitFitMap = await getKitFit(locale);
  const brand = getProgramBrand(programId);
  const tone = brand?.tone;
  const plan = doodlePlan[programId];
  const aboutSec = page.sections.find((s) => s.comp === "program-about");
  const cardsSec = page.sections.find((s) => s.comp === "card-grid");
  const linkSecs = page.sections.filter((s) => s.comp === "link");
  const about = aboutSec ? parseAbout(aboutSec.copy) : null;
  const cards = cardsSec ? parseCards(cardsSec.copy) : [];
  const insightRows = insightsMap[programId] ?? [];
  const kitFit = kitFitMap[programId];
  const tagline = taglines[programId] ?? "";
  const planHref = localePath(locale, "/plan/");
  const kitSrc = programKitSrc(prog.assetKey);

  return (
    <div className={styles.page} data-tone={tone || undefined}>
      <section className={styles.hero}>
        <div className={styles.photo}>
          <Image
            src={programHeroSrc(prog.assetKey)}
            alt={prog.name}
            fill
            priority
            quality={92}
            sizes="100vw"
          />
        </div>
        <div className={styles.wrap}>
          <div className={styles.heroCard}>
            {plan?.hero ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                className={styles.sticker}
                src={doodleSrc(plan.hero)}
                alt=""
                width={88}
                height={88}
              />
            ) : null}
            <div className={styles.heroBrand}>
              {brand?.logoSrc ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  className={styles.heroLogo}
                  src={brand.logoSrc}
                  alt=""
                  width={220}
                  height={72}
                />
              ) : null}
              <h1>{page.h1}</h1>
              {tagline ? (
                <p className={styles.tagline}>{tagline}</p>
              ) : null}
            </div>
            <div className={styles.heroActions}>
              <Button href={planHref} accent={Boolean(tone)}>
                {page.cta}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {about ? (
        <section className={styles.section}>
          <div className={styles.wrap}>
            {plan?.sections?.[0] ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                className={`${styles.marginDoodle} ${styles.marginLeft} ${styles.mobileShow}`}
                src={doodleSrc(plan.sections[0])}
                alt=""
                width={64}
                height={64}
              />
            ) : null}
            <h2>{aboutSec?.name}</h2>
            <div className={styles.about}>
              <p className={styles.lead}>{withTbc(about.lead)}</p>
              <dl className={styles.facts}>
                {about.facts.map((f) => (
                  <div key={f.label} className={styles.fact}>
                    <dt>{f.label}</dt>
                    <dd>{withTbc(f.value)}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>
      ) : null}

      {cardsSec ? (
        <section className={styles.section}>
          <div className={styles.wrap}>
            {plan?.sections?.[1] ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                className={`${styles.marginDoodle} ${styles.marginRight}`}
                src={doodleSrc(plan.sections[1])}
                alt=""
                width={64}
                height={64}
              />
            ) : null}
            <h2>{cardsSec.name}</h2>
            {cardsSec.intro ? (
              <p className={styles.introLine}>{cardsSec.intro}</p>
            ) : null}
            <div className={styles.cards}>
              {cards.map((c) => (
                <article key={c.title} className={styles.card}>
                  <BrandGetIcon title={c.title} />
                  <div className={styles.cardCopy}>
                    <h3>{withTbc(c.title)}</h3>
                    <p>{withTbc(c.body)}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {kitFit?.categories?.length ? (
        <section className={styles.section}>
          <div className={styles.wrap}>
            <KitFitSection categories={kitFit.categories} messages={messages} />
          </div>
        </section>
      ) : null}

      {insightRows.length ? (
        <section className={styles.section}>
          <div className={styles.wrap}>
            {plan?.sections?.[2] ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                className={`${styles.marginDoodle} ${styles.marginLeft}`}
                src={doodleSrc(plan.sections[2])}
                alt=""
                width={64}
                height={64}
              />
            ) : null}
            <h2>{messages.insightsTitle}</h2>
            <p className={styles.introLine}>{messages.insightsLead}</p>
            <InsightsTabs
              rows={insightRows}
              locale={locale}
              labels={{
                reach: messages.insightsReach,
                cities: messages.insightsCities,
                channels: messages.insightsChannels,
                app: messages.insightsApp,
                guide: messages.insightsGuide,
                tirage: messages.insightsTirage,
                countries: messages.insightsCountries,
              }}
            />
          </div>
        </section>
      ) : null}

      {linkSecs.map((linkSec) => {
        const proof = linkSec.proof ?? "";
        const hrefMatch = proof.match(/Link to (\/[^\s/]+\/)/i);
        const href = hrefMatch
          ? localePath(locale, hrefMatch[1])
          : planHref;
        return (
          <section key={linkSec.name} className={styles.section}>
            <div className={styles.wrap}>
              <h2>{linkSec.name}</h2>
              {linkSec.intro ? (
                <p className={styles.introLine}>{withTbc(linkSec.intro)}</p>
              ) : null}
              <Button href={href} accent={Boolean(tone)}>
                {withTbc(linkSec.copy)}
              </Button>
            </div>
          </section>
        );
      })}

      {kitSrc ? (
        <section className={styles.kitView} aria-labelledby="kit-heading">
          <div className={styles.wrap}>
            <div className={styles.kitCopy}>
              <p className={styles.kitEye}>{messages.theKitEye}</p>
              <h2 id="kit-heading">{messages.theKit}</h2>
              <p className={styles.kitLead}>{messages.theKitLead}</p>
            </div>
            <div className={styles.kitPedestal}>
              <Image
                src={kitSrc}
                alt={`${prog.name} kit`}
                width={1536}
                height={1024}
                quality={90}
                sizes="(max-width: 900px) calc(100vw - 36px), 720px"
                className={styles.kitImg}
              />
            </div>
          </div>
        </section>
      ) : null}

      <div className={styles.wrap}>
        <div className={styles.band}>
          {plan?.band ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              className={styles.bandSticker}
              src={doodleSrc(plan.band)}
              alt=""
              width={72}
              height={72}
            />
          ) : null}
          <div className={styles.bandBrand}>
            {brand ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                className={styles.bandLogo}
                src={brand.logoSrc}
                alt=""
                width={200}
                height={70}
              />
            ) : null}
            <h2>{prog.name}</h2>
          </div>
          <Button href={planHref} accent={Boolean(tone)}>
            {page.cta}
          </Button>
        </div>
      </div>

      <section className={styles.brief} id="brief" aria-labelledby="brief-h2">
        <div className={styles.briefInner}>
          <h2 id="brief-h2">{messages.planMyStart}</h2>
          <p className={styles.introLine}>{startHome.brands.lead}</p>
          <BriefForm
            sourcePage={localePath(locale, `/${prog.slug}/`)}
            defaultProgram={programId}
            markets={startHome.brands.markets}
            submitLabel={startHome.brands.button}
          />
        </div>
      </section>
    </div>
  );
}
