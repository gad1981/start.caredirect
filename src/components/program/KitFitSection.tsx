import Image from "next/image";
import type { Messages } from "@/lib/content";
import { KitBrandFigure } from "./KitBrandFigure";
import styles from "./KitFitSection.module.css";
import { SeeHowToggle } from "./SeeHowToggle";

type Props = {
  categories: string[];
  messages: Messages;
  kitSrc?: string | null;
  kitAlt?: string;
};

export function KitFitSection({
  categories,
  messages,
  kitSrc,
  kitAlt = "START kit",
}: Props) {
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

      {categories.length ? (
        <div className={`${styles.panel} ${styles.panelCats}`}>
          <h3 className={styles.blockTitle}>{messages.kitFitCategoriesTitle}</h3>
          <ul className={styles.cats}>
            {categories.map((cat) => (
              <li key={cat}>{cat}</li>
            ))}
          </ul>
          <p className={styles.note}>{messages.kitFitExclusivity}</p>
        </div>
      ) : null}

      <div className={`${styles.panel} ${styles.panelKit}`}>
        {kitSrc ? (
          <div className={styles.kitPhoto}>
            <div className={styles.kitCopy}>
              <p className={styles.kitEye}>{messages.theKitEye}</p>
              <h3 className={styles.kitHeading}>{messages.theKit}</h3>
              <p className={styles.kitLead}>{messages.theKitLead}</p>
            </div>
            <div className={styles.kitPedestal}>
              <Image
                src={kitSrc}
                alt={kitAlt}
                width={1536}
                height={1024}
                quality={90}
                sizes="(max-width: 900px) calc(100vw - 72px), 480px"
                className={styles.kitImg}
              />
            </div>
          </div>
        ) : null}

        <div className={styles.grid}>
          <div className={styles.block}>
            <h3 className={styles.blockTitle}>{messages.kitFitInKitTitle}</h3>
            <p className={styles.subLead}>{messages.kitFitInKitLead}</p>
            <SeeHowToggle
              label={messages.seeHowOptions}
              hideLabel={messages.seeHowHide}
            >
              <ul className={styles.places}>
                {placements.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </SeeHowToggle>
          </div>

          <div className={styles.block}>
            <h3 className={styles.blockTitle}>{messages.kitFitBrandTitle}</h3>
            <p className={styles.subLead}>{messages.kitFitBrandLead}</p>
            <SeeHowToggle
              label={messages.seeHowDiagram}
              hideLabel={messages.seeHowHide}
            >
              <KitBrandFigure messages={messages} />
            </SeeHowToggle>
          </div>
        </div>

        <div className={styles.guideBrand}>
          <h3 className={styles.blockTitle}>{messages.kitFitGuideBrandTitle}</h3>
          <p className={styles.subLead}>{messages.kitFitGuideBrandLead}</p>
          <SeeHowToggle
            label={messages.seeHowLayouts}
            hideLabel={messages.seeHowHide}
          >
            <figure
              className={styles.diagram}
              aria-label={messages.kitFitGuideBrandTitle}
            >
              <div className={`${styles.stage} ${styles.guideStage}`}>
                <div className={styles.guideOptions}>
                  <div className={styles.guideOption}>
                    <div className={styles.guideBook} data-kind="full">
                      <div className={styles.guideSpine} aria-hidden />
                      <div className={`${styles.guidePage} ${styles.guideLeft}`}>
                        <span className={styles.guideBrandMark}>
                          {messages.kitFitYourBrand}
                        </span>
                        <span className={styles.guideLines} aria-hidden />
                      </div>
                      <div
                        className={`${styles.guidePage} ${styles.guideRight} ${styles.guidePageMuted}`}
                      >
                        <span className={styles.guideLines} aria-hidden />
                      </div>
                    </div>
                    <p className={styles.guideOptionLabel}>
                      {messages.kitFitGuideFullPage}
                    </p>
                  </div>

                  <div className={styles.guideOption}>
                    <div className={styles.guideBook} data-kind="back">
                      <div className={styles.guideClosed}>
                        <span className={styles.guideCoverTitle}>START</span>
                        <span className={styles.guideBrandMark}>
                          {messages.kitFitYourBrand}
                        </span>
                      </div>
                    </div>
                    <p className={styles.guideOptionLabel}>
                      {messages.kitFitGuideBackCover}
                    </p>
                  </div>

                  <div className={styles.guideOption}>
                    <div className={styles.guideBook} data-kind="salon">
                      <div className={styles.guideSpine} aria-hidden />
                      <div className={`${styles.guidePage} ${styles.guideLeft}`}>
                        <span className={styles.guideBrandMark}>
                          {messages.kitFitYourBrand}
                        </span>
                      </div>
                      <div className={`${styles.guidePage} ${styles.guideRight}`}>
                        <span className={styles.guideBrandMark}>
                          {messages.kitFitYourBrand}
                        </span>
                      </div>
                    </div>
                    <p className={styles.guideOptionLabel}>
                      {messages.kitFitGuideSalon}
                    </p>
                  </div>
                </div>
              </div>
              <figcaption className={styles.caption}>
                <span>
                  <i className={styles.dotInside} aria-hidden />
                  {messages.kitFitGuideFullPage}
                </span>
                <span>
                  <i className={styles.dotOutside} aria-hidden />
                  {messages.kitFitGuideBackCover}
                </span>
                <span>
                  <i
                    className={`${styles.dotOutside} ${styles.dotSalon}`}
                    aria-hidden
                  />
                  {messages.kitFitGuideSalon}
                </span>
              </figcaption>
            </figure>
          </SeeHowToggle>
        </div>

        <div className={styles.pricing}>
          <h3 className={styles.blockTitle}>{messages.kitFitPricingTitle}</h3>
          <p className={styles.subLead}>{messages.kitFitPricingLead}</p>
        </div>
      </div>
    </section>
  );
}
