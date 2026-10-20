import { Button } from "@/components/Button";
import { BalancedGrid, Card } from "@/components/Card";
import styles from "./style.module.css";

export const metadata = {
  title: "Style | START",
  robots: { index: false, follow: false },
};

export default function StylePage() {
  return (
    <main className={styles.main}>
      <p className={styles.eye}>Design system</p>
      <h1>START tokens and UI</h1>
      <p className={styles.lead}>
        Quiet, neutral, playful. The kits carry the colour; the site stays
        neutral. No solid black blocks.
      </p>

      <section>
        <h2>Colours</h2>
        <div className={styles.swatches}>
          {[
            ["--bg", "Page"],
            ["--surface", "Surface"],
            ["--ink", "Ink"],
            ["--muted", "Muted"],
            ["--line", "Line"],
            ["--soft", "Soft"],
            ["--stdot", "Amber"],
            ["--p1", "Blush"],
            ["--p2", "Mint"],
            ["--p3", "Butter"],
            ["--p4", "Sky"],
            ["--p5", "Lilac"],
          ].map(([token, name]) => (
            <div key={token} className={styles.swatch}>
              <span style={{ background: `var(${token})` }} />
              <b>{name}</b>
              <code>{token}</code>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2>Type</h2>
        <p className={styles.display}>Bricolage Grotesque display</p>
        <p className={styles.body}>
          Figtree body. Short sentences, British spelling, no exclamation marks.
        </p>
        <p>
          Unconfirmed facts stay visible: <span className="tbc">[to confirm]</span>
        </p>
      </section>

      <section>
        <h2>Buttons</h2>
        <div className={styles.row}>
          <Button href="#">Plan a START</Button>
          <Button href="#">Ghost style</Button>
          <Button href="#" teen>
            Teen Girl accent
          </Button>
        </div>
      </section>

      <section>
        <h2>Cards · balanced grids</h2>
        <p className={styles.lead}>4 = 4 or 2+2. Never 3+1.</p>
        <BalancedGrid columns={4}>
          {[0, 1, 2, 3].map((i) => (
            <Card key={i} pastelIndex={i}>
              <h3>Card {i + 1}</h3>
              <p>Pastel tile rotating p1 → p2 → p3 → p4.</p>
            </Card>
          ))}
        </BalancedGrid>
      </section>
    </main>
  );
}
