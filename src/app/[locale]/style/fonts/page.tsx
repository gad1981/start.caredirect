import {
  Bricolage_Grotesque,
  Figtree,
  Literata,
  Manrope,
  Source_Sans_3,
} from "next/font/google";
import styles from "./fonts.module.css";

export const metadata = {
  title: "Font options | START",
  robots: { index: false, follow: false },
};

const currentDisplay = Bricolage_Grotesque({
  subsets: ["latin", "latin-ext"],
  weight: ["800"],
  variable: "--preview-a-display",
  display: "swap",
});

const currentBody = Figtree({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "600"],
  variable: "--preview-a-body",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin", "latin-ext", "cyrillic", "greek"],
  weight: ["600", "700", "800"],
  variable: "--preview-b-display",
  display: "swap",
});

const sourceSans = Source_Sans_3({
  subsets: ["latin", "latin-ext", "cyrillic", "greek"],
  weight: ["400", "600", "700"],
  variable: "--preview-b-body",
  display: "swap",
});

const literata = Literata({
  subsets: ["latin", "latin-ext", "cyrillic", "greek"],
  weight: ["600", "700"],
  variable: "--preview-c-display",
  display: "swap",
});

const pairs = [
  {
    id: "current",
    label: "Current",
    displayName: "Bricolage Grotesque",
    bodyName: "Figtree",
    note: "What the site used before. Fine, but Figtree is common and Bricolage leans playful-startup.",
    className: `${currentDisplay.variable} ${currentBody.variable} ${styles.pairA}`,
    scripts: "Latin · Latin-ext",
  },
  {
    id: "recommended",
    label: "Recommended (live)",
    displayName: "Manrope",
    bodyName: "Source Sans 3",
    note: "Fresh geometric display, calm body, solid Greek + Cyrillic for EL / SR / BG. This is what the site uses now.",
    className: `${manrope.variable} ${sourceSans.variable} ${styles.pairB}`,
    scripts: "Latin · Latin-ext · Greek · Cyrillic",
  },
  {
    id: "editorial",
    label: "Editorial",
    displayName: "Literata",
    bodyName: "Source Sans 3",
    note: "More premium and literary. Softer authority for a B2B life-stage brand.",
    className: `${literata.variable} ${sourceSans.variable} ${styles.pairC}`,
    scripts: "Latin · Latin-ext · Greek · Cyrillic",
  },
] as const;

export default function FontsPreviewPage() {
  return (
    <main
      className={`${styles.main} ${currentDisplay.variable} ${currentBody.variable} ${manrope.variable} ${sourceSans.variable} ${literata.variable}`}
    >
      <p className={styles.eye}>Typography preview</p>
      <h1 className={styles.pageTitle}>Font options for START</h1>
      <p className={styles.lead}>
        Same headline and body in three pairings. Pick the mood that feels correct,
        fresh and elegant — then we can apply it site-wide.
      </p>

      <div className={styles.grid}>
        {pairs.map((pair) => (
          <article key={pair.id} className={`${styles.card} ${pair.className}`}>
            <header className={styles.cardHead}>
              <span className={styles.badge}>{pair.label}</span>
              <h2 className={styles.pairName}>
                {pair.displayName}
                <span> + {pair.bodyName}</span>
              </h2>
              <p className={styles.note}>{pair.note}</p>
              <p className={styles.scripts}>{pair.scripts}</p>
            </header>

            <p className={styles.sampleDisplay}>
              Every period in life has a first day.
            </p>
            <p className={styles.sampleBody}>
              START puts your product in people&apos;s hands as they begin something
              new: a newborn, a first school day, university, a wedding.
            </p>
            <p className={styles.sampleMulti}>
              Ελλάδα · România · Србија · България
            </p>
            <p className={styles.sampleUi}>Plan my START · Explore programs</p>
          </article>
        ))}
      </div>
    </main>
  );
}
