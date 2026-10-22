import type { Messages } from "@/lib/content";
import styles from "./KitFitSection.module.css";

type Props = {
  categories: string[];
  messages: Messages;
};

export function KitFitSection({ categories, messages }: Props) {
  const placements = [
    messages.kitFitPlaceFull,
    messages.kitFitPlaceSamples,
    messages.kitFitPlaceLeaflets,
    messages.kitFitPlaceGifts,
    messages.kitFitPlaceCoupons,
    messages.kitFitPlaceGuide,
    messages.kitFitPlaceStickers,
  ];

  return (
    <section className={styles.section} aria-labelledby="kit-fit-heading">
      <h2 id="kit-fit-heading">{messages.kitFitTitle}</h2>
      <p className={styles.lead}>{messages.kitFitLead}</p>

      <div className={styles.block}>
        <h3 className={styles.blockTitle}>{messages.kitFitCategoriesTitle}</h3>
        <ul className={styles.cats}>
          {categories.map((cat) => (
            <li key={cat}>{cat}</li>
          ))}
        </ul>
        <p className={styles.note}>{messages.kitFitExclusivity}</p>
      </div>

      <div className={styles.grid}>
        <div className={styles.block}>
          <h3 className={styles.blockTitle}>{messages.kitFitInKitTitle}</h3>
          <p className={styles.subLead}>{messages.kitFitInKitLead}</p>
          <ul className={styles.places}>
            {placements.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div className={styles.block}>
          <h3 className={styles.blockTitle}>{messages.kitFitBrandTitle}</h3>
          <p className={styles.subLead}>{messages.kitFitBrandLead}</p>
          <figure
            className={styles.diagram}
            aria-label={messages.kitFitBrandTitle}
          >
            <div className={styles.stage}>
              <div className={styles.kit}>
                <div className={styles.lid}>
                  <span className={styles.insideBrand}>
                    {messages.kitFitYourBrand}
                  </span>
                  <span className={styles.lidHint}>
                    {messages.kitFitInsideLabel}
                  </span>
                </div>
                <div className={styles.box}>
                  <span
                    className={styles.flapBrand}
                    title={messages.kitFitOutsideLabel}
                  >
                    {messages.kitFitYourBrand}
                  </span>
                  <span className={styles.startMark}>
                    {messages.kitFitStartLabel}
                  </span>
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
        </div>
      </div>
    </section>
  );
}
