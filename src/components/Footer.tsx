import Link from "next/link";
import { CookieSettingsButton } from "@/components/analytics/ConsentProvider";
import { PROGRAMS } from "@/lib/programs";
import { startHome } from "@/lib/content";
import styles from "./Footer.module.css";

export function Footer() {
  const mid = Math.ceil(PROGRAMS.length / 2);
  const left = PROGRAMS.slice(0, mid);
  const right = PROGRAMS.slice(mid);

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div>
          <span className={styles.mark} aria-hidden />
          <p className={styles.tag}>
            Every period in life has a first day. Be in it.
          </p>
        </div>
        <div className={styles.col}>
          <h2>Programs</h2>
          {left.map((p) => (
            <Link key={p.id} href={`/${p.slug}/`}>
              {p.name}
            </Link>
          ))}
        </div>
        <div className={styles.col}>
          <h2>Programs</h2>
          {right.map((p) => (
            <Link key={p.id} href={`/${p.slug}/`}>
              {p.name}
            </Link>
          ))}
        </div>
        <div className={styles.col}>
          <h2>For brands</h2>
          <Link href="/">START home</Link>
          <Link href="/order/">Order your samples</Link>
          <Link href="/plan/">Plan a START</Link>
        </div>
      </div>
      <div className={styles.base}>
        <div className={styles.baseInner}>
          <span>{startHome.footer} · </span>
          <a
            href="https://www.caredirect.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            caredirect.com
          </a>
          <span>·</span>
          <a
            href="https://www.caredirect.com/privacy/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Privacy
          </a>
          <span>·</span>
          <a
            href="https://www.caredirect.com/optout/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Stop messages
          </a>
          <span>·</span>
          <CookieSettingsButton className={styles.cookieBtn} />
        </div>
      </div>
    </footer>
  );
}
