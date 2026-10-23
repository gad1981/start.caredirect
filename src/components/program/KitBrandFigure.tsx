import type { Messages } from "@/lib/content";
import styles from "./KitFitSection.module.css";

type Props = {
  messages: Messages;
};

/** Open-kit diagram: brand outside + inside lid, START identity stays. */
export function KitBrandFigure({ messages }: Props) {
  return (
    <figure className={styles.diagram} aria-label={messages.kitFitBrandTitle}>
      <div className={styles.stage}>
        <div className={styles.kit}>
          <div className={styles.lid}>
            <span className={styles.insideBrand}>{messages.kitFitYourBrand}</span>
            <span className={styles.lidHint}>{messages.kitFitInsideLabel}</span>
          </div>
          <div className={styles.box}>
            <span
              className={styles.flapBrand}
              title={messages.kitFitOutsideLabel}
            >
              {messages.kitFitYourBrand}
            </span>
            <span className={styles.startMark}>{messages.kitFitStartLabel}</span>
            <span
              className={styles.cornerBrand}
              title={messages.kitFitOutsideLabel}
            >
              {messages.kitFitYourBrand}
            </span>
          </div>
        </div>
      </div>
      <figcaption className={styles.caption}>
        <span>
          <i className={styles.dotOutside} aria-hidden />
          {messages.kitFitOutsideLabel}
        </span>
        <span>
          <i className={styles.dotInside} aria-hidden />
          {messages.kitFitInsideLabel}
        </span>
      </figcaption>
    </figure>
  );
}
