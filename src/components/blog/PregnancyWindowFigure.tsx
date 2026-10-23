import type { Messages } from "@/lib/content";
import styles from "./BlogFigures.module.css";

type Props = {
  messages: Messages;
};

/** Finite annual cohort + third-trimester / first-days clinic window. */
export function PregnancyWindowFigure({ messages }: Props) {
  return (
    <figure
      className={styles.figure}
      aria-label={messages.blogFigurePregnancyWindowTitle}
    >
      <p className={styles.kicker}>{messages.blogFigurePregnancyWindowTitle}</p>
      <p className={styles.cohort}>
        <span className={styles.cohortNum}>68,467</span>
        <span className={styles.cohortLabel}>
          {messages.blogFigurePregnancyWindowCohort}
        </span>
      </p>
      <div
        className={`${styles.track} ${styles.trackWindow4}`}
        role="img"
        aria-hidden
      >
        <div className={styles.seg}>
          <span className={styles.segFill} data-tone="muted" />
          <span className={styles.segName}>
            {messages.blogFigurePregnancyWindowT1}
          </span>
        </div>
        <div className={styles.seg}>
          <span className={styles.segFill} data-tone="muted" />
          <span className={styles.segName}>
            {messages.blogFigurePregnancyWindowT2}
          </span>
        </div>
        <div className={styles.seg} data-active>
          <span className={styles.segFill} data-tone="hot" />
          <span className={styles.segName}>
            {messages.blogFigurePregnancyWindowT3}
          </span>
        </div>
        <div className={styles.seg} data-active>
          <span className={styles.segFill} data-tone="hot" />
          <span className={styles.segName}>
            {messages.blogFigurePregnancyWindowDays}
          </span>
        </div>
      </div>
      <p className={styles.miss}>{messages.blogFigurePregnancyWindowMiss}</p>
      <figcaption className={styles.caption}>
        {messages.blogFigurePregnancyWindowCaption}
      </figcaption>
    </figure>
  );
}
