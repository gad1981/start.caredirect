import Image from "next/image";
import { Button } from "@/components/Button";
import { BriefForm } from "@/components/BriefForm";
import {
  casesForProgram,
  doodlePlan,
  pages,
  programsData,
  startHome,
} from "@/lib/content";
import type { ProgramId } from "@/lib/programs";
import { getProgramById, programHeroSrc } from "@/lib/programs";
import { withTbc } from "@/lib/tbc";
import { CountryTabs } from "./CountryTabs";
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

function parseStats(copy: string) {
  return copy.split("·").map((chunk) => {
    const text = chunk.trim();
    const m = text.match(/^(\S+)\s+(.*)$/);
    if (!m) return { n: text, label: "" };
    return { n: m[1], label: m[2] };
  });
}

function guidesFor(programId: string) {
  const guides = programsData.START_GUIDES[programId] ?? [];
  const fromCopy: { country: string; label: string; href?: string }[] = [];
  for (const [country, label, href] of guides) {
    fromCopy.push({ country, label, href });
  }
  return fromCopy;
}

function platformsFromAbout(facts: { label: string; value: string }[]) {
  return facts.find((f) => f.label.toLowerCase() === "platform")?.value ?? "";
}

export function ProgramPage({ programId }: { programId: ProgramId }) {
  const prog = getProgramById(programId);
  const page = pages[programId];
  if (!prog || !page) return null;

  const isTeen = programId === "st-teen";
  const plan = doodlePlan[programId];
  const stage = startHome.stages.find((s) => s.id === programId);
  const programCases = casesForProgram(programId);
  const aboutSec = page.sections.find((s) => s.comp === "program-about");
  const cardsSec = page.sections.find((s) => s.comp === "card-grid");
  const tabsSec = page.sections.find(
    (s) => s.comp === "country-tabs" && !s.hidden,
  );
  const statsSec = page.sections.find((s) => s.comp === "stat-row");
  const casesSec = page.sections.find((s) => s.comp.includes("case-cards"));
  const about = aboutSec ? parseAbout(aboutSec.copy) : null;
  const cards = cardsSec ? parseCards(cardsSec.copy) : [];
  const stats = statsSec ? parseStats(statsSec.copy) : [];
  const guideItems = guidesFor(programId);
  const heroIntro =
    stage?.desc ??
    page.sections.find((s) => s.comp === "program-hero")?.copy ??
    "";

  return (
    <div className={isTeen ? styles.teen : undefined}>
      <section className={styles.hero}>
        <div className={styles.photo}>
          <Image
            src={programHeroSrc(prog.assetKey)}
            alt={`${prog.name} kit`}
            fill
            priority
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
            <h1>{page.h1}</h1>
            <div>
              <p className={styles.intro}>{withTbc(heroIntro)}</p>
              <Button href="/plan/" teen={isTeen}>
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
                  <h3>{withTbc(c.title)}</h3>
                  <p>{withTbc(c.body)}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {tabsSec ? (
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
            <h2>{tabsSec.name}</h2>
            {tabsSec.intro ? (
              <p className={styles.introLine}>{tabsSec.intro}</p>
            ) : null}
            {guideItems.length ? (
              <CountryTabs items={guideItems} />
            ) : (
              <div className={styles.panel}>
                <p style={{ margin: 0 }}>{withTbc(tabsSec.copy)}</p>
                {platformsFromAbout(about?.facts ?? []) ? (
                  <p style={{ margin: "10px 0 0" }}>
                    Platform: {withTbc(platformsFromAbout(about?.facts ?? []))}
                  </p>
                ) : null}
              </div>
            )}
          </div>
        </section>
      ) : null}

      {statsSec ? (
        <section className={styles.section}>
          <div className={styles.wrap}>
            <h2>{statsSec.name}</h2>
            <div className={styles.stats}>
              {stats.map((s) => (
                <div key={`${s.n}-${s.label}`} className={styles.stat}>
                  <b>{s.n}</b>
                  <span>{withTbc(s.label)}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {casesSec ? (
        <section className={styles.section}>
          <div className={styles.wrap}>
            <h2>{casesSec.name}</h2>
            {casesSec.intro ? (
              <p className={styles.introLine}>{casesSec.intro}</p>
            ) : null}
            {programCases.length ? (
              <div className={styles.cases}>
                {programCases.map((c) => (
                  <article key={c.slug} className={styles.case}>
                    <h3>{c.h1}</h3>
                    <p>
                      {c.client} · {c.where} · {c.year}
                    </p>
                    <p>{withTbc(c.line)}</p>
                    <p>{withTbc(c.brief)}</p>
                    {c.src ? (
                      <a href={c.src} target="_blank" rel="noopener noreferrer">
                        Read the case →
                      </a>
                    ) : null}
                  </article>
                ))}
              </div>
            ) : (
              <div className={styles.founding}>
                <h3>Be the founding brand</h3>
                <p>
                  No case yet for {prog.name}. Plan the first one with us.
                </p>
                <Button href="/plan/" teen={isTeen}>
                  {page.cta}
                </Button>
              </div>
            )}
          </div>
        </section>
      ) : null}

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
        <h2>{prog.name}</h2>
        <Button href="/plan/" teen={isTeen}>
          {page.cta}
        </Button>
      </div>

      <section className={styles.section} id="brief">
        <div className={styles.wrap}>
          <h2>Plan my START</h2>
          <p className={styles.introLine}>{startHome.brands.lead}</p>
          <BriefForm
            sourcePage={`/${prog.slug}/`}
            defaultProgram={programId}
            teen={isTeen}
          />
        </div>
      </section>
    </div>
  );
}
