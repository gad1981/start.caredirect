import Image from "next/image";
import Link from "next/link";
import { BriefForm } from "@/components/BriefForm";
import { Button } from "@/components/Button";
import { getMessages, getStartHome } from "@/lib/content";
import { localePath, type Locale } from "@/lib/i18n";
import { getProgramBrand } from "@/lib/program-brands";
import { getProgramById, padNum, programTileSrc } from "@/lib/programs";
import { withTbc } from "@/lib/tbc";
import styles from "./HomePage.module.css";

export async function HomePage({ locale }: { locale: Locale }) {
  const startHome = await getStartHome(locale);
  const messages = getMessages(locale);

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

  return (
    <>
      <section className={styles.hero} aria-labelledby="home-h1">
        <div className={styles.photo}>
          <Image
            src="/assets/heroes/home-hero-five-life-stages.png"
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

      <section className={styles.section} id="programs" aria-labelledby="programs-h2">
        <div className={styles.wrap}>
          <p className={styles.eye}>{startHome.programs.eyebrow}</p>
          <h2 id="programs-h2">{startHome.programs.h2}</h2>
          <p className={styles.secLead}>{startHome.programs.lead}</p>
          <div className={styles.tiles}>
            {stages.map((s) => {
              const brand = getProgramBrand(s.id);
              return (
                <Link
                  key={s.id}
                  className={`${styles.tile} ${brand ? styles.tileFlip : ""}`}
                  href={localePath(locale, `/${s.prog.slug}/`)}
                >
                  {brand ? (
                    <span className={styles.flipScene}>
                      <span className={styles.flipInner}>
                        <span className={styles.flipFront}>
                          <Image
                            src={programTileSrc(s.prog.assetKey)}
                            alt=""
                            fill
                            quality={90}
                            sizes="(max-width:600px) 100vw, (max-width:900px) 50vw, 25vw"
                          />
                          <span className={styles.tileShade} aria-hidden />
                          <span className={styles.tileTop}>
                            <span className={styles.num} aria-hidden>
                              {s.n}
                            </span>
                          </span>
                          <span className={styles.tileBody}>
                            <span className={styles.when}>{withTbc(s.when)}</span>
                            <h3 className={styles.tileName}>{s.name}</h3>
                            <span className={styles.tileFoot}>
                              <span>{messages.explore}</span>
                            </span>
                          </span>
                        </span>
                        <span
                          className={styles.flipBack}
                          data-tone={brand.tone}
                          aria-hidden="true"
                        >
                          <span className={styles.flipBrand}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              className={styles.flipLogo}
                              src={brand.logoSrc}
                              alt=""
                              width={160}
                              height={63}
                            />
                            <span className={styles.flipTag}>
                              {withTbc(s.tagline ?? s.when)}
                            </span>
                          </span>
                          <span className={styles.flipCopy}>
                            <p className={styles.flipDesc}>{withTbc(s.desc)}</p>
                            <ul className={styles.flipList}>
                              {(s.hands ?? []).slice(0, 3).map((item) => (
                                <li key={item}>{withTbc(item)}</li>
                              ))}
                            </ul>
                          </span>
                        </span>
                      </span>
                    </span>
                  ) : (
                    <>
                      <Image
                        src={programTileSrc(s.prog.assetKey)}
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
                    </>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className={styles.section} id="how" aria-labelledby="how-h2">
        <div className={styles.wrap}>
          <p className={styles.eye}>{startHome.how.eyebrow}</p>
          <h2 id="how-h2">{startHome.how.h2}</h2>
          <div className={styles.steps}>
            {startHome.how.steps.map(([title, body], i) => (
              <article key={title} className={styles.step}>
                <div className={styles.ico} aria-hidden>
                  {i + 1}
                </div>
                <h3>{title}</h3>
                <p>{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.section} id="live" aria-labelledby="live-h2">
        <div className={styles.wrap}>
          <p className={styles.eye}>{startHome.live.eyebrow}</p>
          <h2 id="live-h2">{startHome.live.h2}</h2>
          <div className={styles.live}>
            {startHome.live.cards.map((c) =>
              c.url ? (
                <a
                  key={c.name}
                  className={styles.liveCard}
                  href={c.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className={styles.tag}>{c.tag}</span>
                  <span className={styles.lname}>{c.name}</span>
                  <span>{c.desc}</span>
                  <span className={styles.more}>{c.link}</span>
                </a>
              ) : (
                <div key={c.name} className={`${styles.liveCard} ${styles.next}`}>
                  <span className={styles.tag}>{c.tag}</span>
                  <span className={styles.lname}>{withTbc(c.name)}</span>
                  <span>{c.desc}</span>
                  <Link
                    className={styles.more}
                    href={localePath(locale, "/plan/")}
                  >
                    {messages.talkToUs}
                  </Link>
                </div>
              ),
            )}
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
