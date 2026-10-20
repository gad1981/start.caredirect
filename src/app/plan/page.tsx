import type { Metadata } from "next";
import { BriefForm } from "@/components/BriefForm";
import { pages } from "@/lib/content";
import { withTbc } from "@/lib/tbc";
import styles from "./plan.module.css";

const page = pages["st-contact"];

export const metadata: Metadata = {
  title: page.t,
  description: page.m,
  alternates: { canonical: "/plan/" },
};

export default function PlanPage() {
  const form = page.sections.find((s) => s.comp === "brief-form");
  const next = page.sections.find((s) => s.comp === "steps");
  const contacts = page.sections.find((s) => s.comp === "contact-cards");

  return (
    <main className={styles.main}>
      <header className={styles.hero}>
        <h1>{page.h1}</h1>
        <p>{page.sections[0]?.copy}</p>
      </header>

      <section className={styles.block}>
        <h2>{form?.name}</h2>
        {form?.intro ? <p>{form.intro}</p> : null}
        <BriefForm sourcePage="/plan/" />
      </section>

      {next ? (
        <section className={styles.block}>
          <h2>{next.name}</h2>
          {next.intro ? <p>{next.intro}</p> : null}
          <ol className={styles.steps}>
            {next.copy.split("→").map((step) => (
              <li key={step.trim()}>{step.trim()}</li>
            ))}
          </ol>
        </section>
      ) : null}

      {contacts ? (
        <section className={styles.block}>
          <h2>{contacts.name}</h2>
          {contacts.intro ? <p>{contacts.intro}</p> : null}
          <ul className={styles.contacts}>
            {contacts.copy.split("·").map((line) => (
              <li key={line.trim()}>{withTbc(line.trim())}</li>
            ))}
          </ul>
        </section>
      ) : null}
    </main>
  );
}
