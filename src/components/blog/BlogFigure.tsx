import type { Messages } from "@/lib/content";
import { KitBrandFigure } from "@/components/program/KitBrandFigure";
import { PregnancyWindowFigure } from "./PregnancyWindowFigure";
import styles from "./BlogFigures.module.css";
import blogStyles from "./Blog.module.css";

export type BlogFigureVariant =
  | "kit-brand"
  | "pregnancy-window"
  | "trial-lift"
  | "first-days"
  | "media-contrast"
  | "start-stack"
  | "diagnosticity"
  | "hybrid-layers"
  | "see-markets"
  | "school-day"
  | "campus-day"
  | "brief-must"
  | "deloitte-hybrid";

type Props = {
  variant: BlogFigureVariant;
  messages: Messages;
  caption?: string;
};

export function BlogFigure({ variant, messages, caption }: Props) {
  switch (variant) {
    case "kit-brand":
      return (
        <div className={blogStyles.figure}>
          <KitBrandFigure messages={messages} />
          <p className={blogStyles.figureNote}>
            {caption ?? messages.blogFigureKitBrand}
          </p>
        </div>
      );
    case "pregnancy-window":
      return <PregnancyWindowFigure messages={messages} />;
    case "trial-lift":
      return (
        <figure
          className={styles.figure}
          aria-label={messages.blogFigureTrialLiftTitle}
        >
          <p className={styles.kicker}>{messages.blogFigureTrialLiftTitle}</p>
          <div className={styles.stats}>
            <div className={styles.stat}>
              <span className={styles.statValue}>35%</span>
              <span className={styles.statLabel}>
                {messages.blogFigureTrialLiftSameTrip}
              </span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statValue}>58%</span>
              <span className={styles.statLabel}>
                {messages.blogFigureTrialLiftAgain}
              </span>
            </div>
          </div>
          <figcaption className={styles.caption}>
            {caption ?? messages.blogFigureTrialLiftCaption}
          </figcaption>
        </figure>
      );
    case "first-days":
      return (
        <figure
          className={styles.figure}
          aria-label={messages.blogFigureFirstDaysTitle}
        >
          <p className={styles.kicker}>{messages.blogFigureFirstDaysTitle}</p>
          <p className={styles.cohort}>
            <span className={styles.cohortNum}>48–72h</span>
            <span className={styles.cohortLabel}>
              {messages.blogFigureFirstDaysLead}
            </span>
          </p>
          <div
            className={`${styles.track} ${styles.trackWindow3}`}
            role="img"
            aria-hidden
          >
            <div className={styles.seg}>
              <span className={styles.segFill} data-tone="muted" />
              <span className={styles.segName}>
                {messages.blogFigureFirstDaysBefore}
              </span>
            </div>
            <div className={styles.seg} data-active>
              <span className={styles.segFill} data-tone="hot" />
              <span className={styles.segName}>
                {messages.blogFigureFirstDaysWindow}
              </span>
            </div>
            <div className={styles.seg}>
              <span className={styles.segFill} data-tone="muted" />
              <span className={styles.segName}>
                {messages.blogFigureFirstDaysAfter}
              </span>
            </div>
          </div>
          <p className={styles.miss}>{messages.blogFigureFirstDaysMiss}</p>
          <figcaption className={styles.caption}>
            {caption ?? messages.blogFigureFirstDaysCaption}
          </figcaption>
        </figure>
      );
    case "media-contrast":
      return (
        <figure
          className={styles.figure}
          aria-label={messages.blogFigureMediaTitle}
        >
          <p className={styles.kicker}>{messages.blogFigureMediaTitle}</p>
          <div className={styles.contrast}>
            <div className={styles.panel} data-tone="fast">
              <p className={styles.panelEye}>
                {messages.blogFigureMediaDigitalEye}
              </p>
              <p className={styles.panelTitle}>
                {messages.blogFigureMediaDigitalTitle}
              </p>
              <p className={styles.panelText}>
                {messages.blogFigureMediaDigitalText}
              </p>
            </div>
            <div className={styles.panel} data-tone="deep">
              <p className={styles.panelEye}>
                {messages.blogFigureMediaPhysicalEye}
              </p>
              <p className={styles.panelTitle}>
                {messages.blogFigureMediaPhysicalTitle}
              </p>
              <p className={styles.panelText}>
                {messages.blogFigureMediaPhysicalText}
              </p>
            </div>
          </div>
          <figcaption className={styles.caption}>
            {caption ?? messages.blogFigureMediaCaption}
          </figcaption>
        </figure>
      );
    case "start-stack":
      return (
        <figure
          className={styles.figure}
          aria-label={messages.blogFigureStackTitle}
        >
          <p className={styles.kicker}>{messages.blogFigureStackTitle}</p>
          <div className={styles.flow} role="list">
            {(
              [
                messages.blogFigureStack1,
                messages.blogFigureStack2,
                messages.blogFigureStack3,
                messages.blogFigureStack4,
              ] as const
            ).map((label, i) => (
              <div key={label} className={styles.step} role="listitem">
                <span className={styles.stepNum}>0{i + 1}</span>
                <span className={styles.stepLabel}>{label}</span>
              </div>
            ))}
          </div>
          <figcaption className={styles.caption}>
            {caption ?? messages.blogFigureStackCaption}
          </figcaption>
        </figure>
      );
    case "diagnosticity":
      return (
        <figure
          className={styles.figure}
          aria-label={messages.blogFigureDiagTitle}
        >
          <p className={styles.kicker}>{messages.blogFigureDiagTitle}</p>
          <div className={styles.contrast}>
            <div className={styles.panel} data-tone="deep">
              <p className={styles.panelEye}>{messages.blogFigureDiagLearnEye}</p>
              <p className={styles.panelTitle}>
                {messages.blogFigureDiagLearnTitle}
              </p>
              <p className={styles.panelText}>
                {messages.blogFigureDiagLearnText}
              </p>
            </div>
            <div className={styles.panel} data-tone="fast">
              <p className={styles.panelEye}>{messages.blogFigureDiagGiftEye}</p>
              <p className={styles.panelTitle}>
                {messages.blogFigureDiagGiftTitle}
              </p>
              <p className={styles.panelText}>
                {messages.blogFigureDiagGiftText}
              </p>
            </div>
          </div>
          <figcaption className={styles.caption}>
            {caption ?? messages.blogFigureDiagCaption}
          </figcaption>
        </figure>
      );
    case "hybrid-layers":
      return (
        <figure
          className={styles.figure}
          aria-label={messages.blogFigureLayersTitle}
        >
          <p className={styles.kicker}>{messages.blogFigureLayersTitle}</p>
          <div className={styles.layers}>
            <div className={styles.layer} data-n="1">
              <span className={styles.layerMark} aria-hidden />
              <p className={styles.layerTitle}>
                {messages.blogFigureLayers1Title}
              </p>
              <p className={styles.layerText}>
                {messages.blogFigureLayers1Text}
              </p>
            </div>
            <div className={styles.layer} data-n="2">
              <span className={styles.layerMark} aria-hidden />
              <p className={styles.layerTitle}>
                {messages.blogFigureLayers2Title}
              </p>
              <p className={styles.layerText}>
                {messages.blogFigureLayers2Text}
              </p>
            </div>
            <div className={styles.layer} data-n="3">
              <span className={styles.layerMark} aria-hidden />
              <p className={styles.layerTitle}>
                {messages.blogFigureLayers3Title}
              </p>
              <p className={styles.layerText}>
                {messages.blogFigureLayers3Text}
              </p>
            </div>
          </div>
          <figcaption className={styles.caption}>
            {caption ?? messages.blogFigureLayersCaption}
          </figcaption>
        </figure>
      );
    case "see-markets":
      return (
        <figure
          className={styles.figure}
          aria-label={messages.blogFigureMarketsTitle}
        >
          <p className={styles.kicker}>{messages.blogFigureMarketsTitle}</p>
          <div className={styles.markets}>
            {(
              [
                messages.blogFigureMarketGR,
                messages.blogFigureMarketCY,
                messages.blogFigureMarketRO,
                messages.blogFigureMarketBG,
                messages.blogFigureMarketRS,
              ] as const
            ).map((m) => (
              <span key={m} className={styles.market}>
                {m}
              </span>
            ))}
          </div>
          <p className={styles.note}>{messages.blogFigureMarketsNote}</p>
          <figcaption className={styles.caption}>
            {caption ?? messages.blogFigureMarketsCaption}
          </figcaption>
        </figure>
      );
    case "school-day":
    case "campus-day": {
      const isCampus = variant === "campus-day";
      const title = isCampus
        ? messages.blogFigureCampusTitle
        : messages.blogFigureSchoolTitle;
      const day = isCampus
        ? messages.blogFigureCampusDay
        : messages.blogFigureSchoolDay;
      const lead = isCampus
        ? messages.blogFigureCampusLead
        : messages.blogFigureSchoolLead;
      const before = isCampus
        ? messages.blogFigureCampusBefore
        : messages.blogFigureSchoolBefore;
      const moment = isCampus
        ? messages.blogFigureCampusMoment
        : messages.blogFigureSchoolMoment;
      const after = isCampus
        ? messages.blogFigureCampusAfter
        : messages.blogFigureSchoolAfter;
      const figCaption =
        caption ??
        (isCampus
          ? messages.blogFigureCampusCaption
          : messages.blogFigureSchoolCaption);
      return (
        <figure className={styles.figure} aria-label={title}>
          <p className={styles.kicker}>{title}</p>
          <p className={styles.cohort}>
            <span className={styles.cohortNum}>{day}</span>
            <span className={styles.cohortLabel}>{lead}</span>
          </p>
          <div
            className={`${styles.track} ${styles.trackWindow3}`}
            role="img"
            aria-hidden
          >
            <div className={styles.seg}>
              <span className={styles.segFill} data-tone="muted" />
              <span className={styles.segName}>{before}</span>
            </div>
            <div className={styles.seg} data-active>
              <span className={styles.segFill} data-tone="hot" />
              <span className={styles.segName}>{moment}</span>
            </div>
            <div className={styles.seg}>
              <span className={styles.segFill} data-tone="muted" />
              <span className={styles.segName}>{after}</span>
            </div>
          </div>
          <figcaption className={styles.caption}>{figCaption}</figcaption>
        </figure>
      );
    }
    case "brief-must":
      return (
        <figure
          className={styles.figure}
          aria-label={messages.blogFigureBriefTitle}
        >
          <p className={styles.kicker}>{messages.blogFigureBriefTitle}</p>
          <div className={styles.split}>
            <ul className={styles.splitList} data-tone="must">
              <li className={styles.splitTitle}>
                {messages.blogFigureBriefMustTitle}
              </li>
              <li>{messages.blogFigureBriefMust1}</li>
              <li>{messages.blogFigureBriefMust2}</li>
              <li>{messages.blogFigureBriefMust3}</li>
              <li>{messages.blogFigureBriefMust4}</li>
            </ul>
            <ul className={styles.splitList} data-tone="later">
              <li className={styles.splitTitle}>
                {messages.blogFigureBriefLaterTitle}
              </li>
              <li>{messages.blogFigureBriefLater1}</li>
              <li>{messages.blogFigureBriefLater2}</li>
              <li>{messages.blogFigureBriefLater3}</li>
            </ul>
          </div>
          <figcaption className={styles.caption}>
            {caption ?? messages.blogFigureBriefCaption}
          </figcaption>
        </figure>
      );
    case "deloitte-hybrid":
      return (
        <figure
          className={styles.figure}
          aria-label={messages.blogFigureDeloitteTitle}
        >
          <p className={styles.kicker}>{messages.blogFigureDeloitteTitle}</p>
          <p className={styles.cohort}>
            <span className={styles.cohortNum}>75%</span>
            <span className={styles.cohortLabel}>
              {messages.blogFigureDeloitteStat}
            </span>
          </p>
          <p className={styles.note}>{messages.blogFigureDeloitteGoals}</p>
          <figcaption className={styles.caption}>
            {caption ?? messages.blogFigureDeloitteCaption}
          </figcaption>
        </figure>
      );
    default:
      return null;
  }
}
