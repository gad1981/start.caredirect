"use client";

import { useState, type FormEvent } from "react";
import { PROGRAMS } from "@/lib/programs";
import { startHome } from "@/lib/content";
import { Button } from "./Button";
import styles from "./BriefForm.module.css";

const CONSENT =
  "I agree that Care Direct may use these details to reply about START programs. See the privacy policy on caredirect.com.";

type Props = {
  sourcePage: string;
  defaultProgram?: string;
  teen?: boolean;
};

export function BriefForm({ sourcePage, defaultProgram = "", teen }: Props) {
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "err">(
    "idle",
  );
  const [message, setMessage] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          company: data.get("company"),
          email: data.get("email"),
          market: data.get("market"),
          program: data.get("program"),
          message: data.get("message"),
          website: data.get("website"),
          source_page: sourcePage,
          consent_text: CONSENT,
        }),
      });
      const json = (await res.json()) as { error?: string; ok?: boolean };
      if (!res.ok) {
        setStatus("err");
        setMessage(json.error ?? "Something went wrong. Please try again.");
        return;
      }
      setStatus("ok");
      setMessage("Thank you. Your brief is with the team for your market.");
      form.reset();
    } catch {
      setStatus("err");
      setMessage("Something went wrong. Please try again.");
    }
  }

  return (
    <form className={styles.form} onSubmit={onSubmit} noValidate>
      <div className={styles.row}>
        <label className={styles.field}>
          Name
          <input className={styles.control} name="name" required autoComplete="name" />
        </label>
        <label className={styles.field}>
          Company / brand
          <input
            className={styles.control}
            name="company"
            required
            autoComplete="organization"
          />
        </label>
      </div>
      <div className={styles.row}>
        <label className={styles.field}>
          Work email
          <input
            className={styles.control}
            name="email"
            type="email"
            required
            autoComplete="email"
          />
        </label>
        <label className={styles.field}>
          Market
          <select className={styles.control} name="market" required defaultValue="">
            <option value="" disabled>
              Choose a market
            </option>
            {startHome.brands.markets.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
            <option value="Other">Other</option>
          </select>
        </label>
      </div>
      <label className={styles.field}>
        Which START
        <select
          className={styles.control}
          name="program"
          defaultValue={defaultProgram || "help-me"}
        >
          <option value="help-me">Help me choose</option>
          {PROGRAMS.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </label>
      <label className={styles.field}>
        Message (optional)
        <textarea className={styles.control} name="message" rows={3} />
      </label>
      <label className={styles.hp} aria-hidden="true">
        Website
        <input name="website" tabIndex={-1} autoComplete="off" />
      </label>
      <label className={styles.consent}>
        <input className={styles.check} name="consent" type="checkbox" required />
        <span>
          {CONSENT}{" "}
          <a
            href="https://www.caredirect.com/privacy/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Privacy
          </a>
          .
        </span>
      </label>
      <div>
        <Button type="submit" teen={teen} disabled={status === "loading"}>
          {status === "loading" ? "Sending…" : startHome.brands.button}
        </Button>
      </div>
      {status === "ok" ? <p className={`${styles.msg} ${styles.ok}`}>{message}</p> : null}
      {status === "err" ? <p className={`${styles.msg} ${styles.err}`}>{message}</p> : null}
    </form>
  );
}
