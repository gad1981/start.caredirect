"use client";

import { useState, type FormEvent } from "react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { trackLeadSubmission } from "@/lib/analytics";
import { LISTED_PROGRAMS } from "@/lib/programs";
import { Button } from "./Button";
import styles from "./BriefForm.module.css";

type Props = {
  sourcePage: string;
  markets: string[];
  submitLabel: string;
  defaultProgram?: string;
  accent?: boolean;
  teen?: boolean;
};

export function BriefForm({
  sourcePage,
  markets,
  submitLabel,
  defaultProgram = "",
  accent = false,
  teen = false,
}: Props) {
  const { locale, messages } = useLocale();
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
          consent_text: messages.formConsent,
        }),
      });
      const json = (await res.json()) as { error?: string; ok?: boolean };
      if (!res.ok) {
        setStatus("err");
        setMessage(json.error ?? messages.formError);
        return;
      }
      trackLeadSubmission({
        program: String(data.get("program") || ""),
        market: String(data.get("market") || ""),
        source_page: sourcePage,
        locale,
      });
      setStatus("ok");
      setMessage(messages.formSuccess);
      form.reset();
    } catch {
      setStatus("err");
      setMessage(messages.formError);
    }
  }

  return (
    <form className={styles.form} onSubmit={onSubmit} noValidate>
      <div className={styles.row}>
        <label className={styles.field}>
          {messages.formName}
          <input className={styles.control} name="name" required autoComplete="name" />
        </label>
        <label className={styles.field}>
          {messages.formCompany}
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
          {messages.formEmail}
          <input
            className={styles.control}
            name="email"
            type="email"
            required
            autoComplete="email"
          />
        </label>
        <label className={styles.field}>
          {messages.formMarket}
          <select className={styles.control} name="market" required defaultValue="">
            <option value="" disabled>
              {messages.formMarketPlaceholder}
            </option>
            {markets.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
            <option value="Other">{messages.formOther}</option>
          </select>
        </label>
      </div>
      <label className={styles.field}>
        {messages.formProgram}
        <select
          className={styles.control}
          name="program"
          defaultValue={defaultProgram || "help-me"}
        >
          <option value="help-me">{messages.formHelpMe}</option>
          {LISTED_PROGRAMS.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </label>
      <label className={styles.field}>
        {messages.formMessage}
        <textarea className={styles.control} name="message" rows={3} />
      </label>
      <label className={styles.hp} aria-hidden="true">
        Website
        <input name="website" tabIndex={-1} autoComplete="off" />
      </label>
      <label className={styles.consent}>
        <input className={styles.check} name="consent" type="checkbox" required />
        <span>
          {messages.formConsent}{" "}
          <a
            href="https://www.caredirect.com/privacy/"
            target="_blank"
            rel="noopener noreferrer"
          >
            {messages.privacy}
          </a>
          .
        </span>
      </label>
      <div>
        <Button
          type="submit"
          accent={accent || teen}
          disabled={status === "loading"}
        >
          {status === "loading" ? messages.formSending : submitLabel}
        </Button>
      </div>
      {status === "ok" ? <p className={`${styles.msg} ${styles.ok}`}>{message}</p> : null}
      {status === "err" ? <p className={`${styles.msg} ${styles.err}`}>{message}</p> : null}
    </form>
  );
}
