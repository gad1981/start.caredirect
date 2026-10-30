import Image from "next/image";
import { AppLink } from "@/components/AppLink";
import { BriefForm } from "@/components/BriefForm";
import { Button } from "@/components/Button";
import { getMessages, getStartHome, getTaglines } from "@/lib/content";
import { localePath, type Locale } from "@/lib/i18n";
import { getProgramBrand } from "@/lib/program-brands";
import { platformShotForUrl } from "@/lib/platforms";
import { getProgramById, padNum, programTileSrc } from "@/lib/programs";
import { withTbc } from "@/lib/tbc";
import { HowStepIcon } from "./HowStepIcon";
import { ProgramFlipTile } from "./ProgramFlipTile";
import { ProgramsScrollSection } from "./ProgramsScrollSection";
import styles from "./HomePage.module.css";

export async function HomePage({ locale }: { locale: Locale }) {
  const startHome = await getStartHome(locale);
  const messages = getMessages(locale);
  const taglines = await getTaglines(locale);

  const stages = startHome.stages
    .map((stage, i) => {
      const prog = getProgramById(stage.id);
      if (!prog) return null;
      return { ...stage, prog, n: padNum(i) };
    })
    .filter(Boolean) as {
    id: string;
    name: string;
    when: string;
    where: string;
    desc: string;
    tagline?: string;
    hands?: string[];
    online?: string[];
    prog: NonNullable<ReturnType<typeof getProgramById>>;
    n: string;
  }[];

  const faq = startHome.faq;

  return (
    <>
      <section className={styles.hero} aria-labelledby="home-h1">
        <div className={styles.photo}>
          <Image
            src="/assets/heroes/home-hero-authentic-family.png"
            alt="Five people at different life stages holding their START kits"
            fill
            priority
            quality={92}
            sizes="100vw"
          />
        </div>
        <div className={styles.wrap}>
          <div className={styles.card}>
            <div>
              <p className={styles.eye}>{startHome.eyebrow}</p>
              <h1 id="home-h1">{startHome.h1}</h1>
              <p className={styles.lead}>{startHome.lead}</p>
              <div className={styles.btns}>
                <Button href="#programs">{startHome.btn1}</Button>
                <Button href="#how">{startHome.btn2}</Button>
              </div>
            </div>
            <div className={styles.stats}>
              {startHome.stats.map(([n, label]) => (
                <div key={label} className={styles.stat}>
                  <b>{n}</b>
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <ProgramsScrollSection
        eyebrow={startHome.programs.eyebrow}
        headingId="programs-h2"
        heading={startHome.programs.h2}
        lead={startHome.programs.lead}
      >
        {stages.map((s) => {
          const brand = getProgramBrand(s.id);
          const href = localePath(locale, `/${s.prog.slug}/`);
          const tileSrc = programTileSrc(s.prog.assetKey);
          if (brand) {
            return (
              <ProgramFlipTile
                key={s.id}
                brand={brand}
                exploreLabel={messages.explore}
                stage={{
                  id: s.id,
                  name: s.name,
                  when: s.when,
                  where: s.where,
                  desc: s.desc,
                  tagline: taglines[s.id] ?? s.tagline,
                  hands: s.hands,
                  online: s.online,
                  n: s.n,
                  tileSrc,
                  href,
                }}
              />
            );
          }
          return (
            <AppLink key={s.id} className={styles.tile} href={href}>
              <Image
                src={tileSrc}
                alt=""
                fill
                quality={90}
                sizes="(max-width:600px) 100vw, (max-width:900px) 50vw, 25vw"
              />
              <span className={styles.tileShade} aria-hidden />
              <div className={styles.tileTop}>
                <span className={styles.num} aria-hidden>
                  {s.n}
                </span>
              </div>
              <div className={styles.tileBody}>
                <span className={styles.when}>{withTbc(s.when)}</span>
                <h3 className={styles.tileName}>{s.name}</h3>
                <p className={styles.tileDesc}>{withTbc(s.desc)}</p>
                <div className={styles.tileFoot}>
                  <span>{withTbc(s.where)}</span>
                  <span>{messages.explore}</span>
                </div>
              </div>
            </AppLink>
          );
        })}
      </ProgramsScrollSection>

      <section className={styles.section} id="how" aria-labelledby="how-h2">
        <div className={styles.wrap}>
          <p className={styles.eye}>{startHome.how.eyebrow}</p>
          <h2 id="how-h2">{startHome.how.h2}</h2>
          <div className={styles.steps}>
            {startHome.how.steps.map(([title, body], i) => (
              <article key={title} className={styles.step}>
                <div className={styles.ico} aria-hidden>
                  <HowStepIcon index={i} />
                </div>
                <h3 className={styles.stepTitle}>{title}</h3>
                <p>{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {faq?.items?.length ? (
        <section className={styles.section} id="faq" aria-labelledby="faq-h2">
          <div className={styles.wrap}>
            <p className={styles.eye}>{faq.eyebrow}</p>
            <h2 id="faq-h2">{faq.h2}</h2>
            <dl className={styles.faqList}>
              {faq.items.map((item) => (
                <div key={item.q} className={styles.faqItem}>
                  <dt>{item.q}</dt>
                  <dd>{item.a}</dd>
                </div>
              ))}
            </dl>
            <p className={styles.faqMore}>
              <AppLink href={localePath(locale, "/faq/")}>
                {messages.faqSeeAll}
              </AppLink>
            </p>
          </div>
        </section>
      ) : null}

      <section className={styles.section} id="live" aria-labelledby="live-h2">
        <div className={styles.wrap}>
          <p className={styles.eye}>{startHome.live.eyebrow}</p>
          <h2 id="live-h2">{startHome.live.h2}</h2>
          <div className={styles.live}>
            {startHome.live.cards.map((c) => {
              const shot = platformShotForUrl(c.url);
              return c.url ? (
                <a
                  key={c.name}
                  className={styles.liveCard}
                  href={c.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className={styles.liveBody}>
                    <span className={styles.tag}>{c.tag}</span>
                    <span className={styles.lname}>{c.name}</span>
                    <span>{c.desc}</span>
                    <span className={styles.more}>{c.link}</span>
                  </span>
                  {shot ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      className={styles.liveShot}
                      src={shot}
                      alt=""
                      width={390}
                      height={844}
                    />
                  ) : null}
                </a>
              ) : (
                <div key={c.name} className={`${styles.liveCard} ${styles.next}`}>
                  <span className={styles.liveBody}>
                    <span className={styles.tag}>{c.tag}</span>
                    <span className={styles.lname}>{withTbc(c.name)}</span>
                    <span>{c.desc}</span>
                    <AppLink
                      className={styles.more}
                      href={localePath(locale, "/plan/")}
                    >
                      {messages.talkToUs}
                    </AppLink>
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className={styles.brands} id="brands" aria-labelledby="brands-h2">
        <div className={styles.brandsInner}>
          <h2 id="brands-h2">{startHome.brands.h2}</h2>
          <p className={styles.secLead}>{startHome.brands.lead}</p>
          <BriefForm
            sourcePage={localePath(locale, "/")}
            markets={startHome.brands.markets}
            submitLabel={startHome.brands.button}
          />
        </div>
      </section>
    </>
  );
}
