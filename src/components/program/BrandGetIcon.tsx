import styles from "./ProgramPage.module.css";

export type BrandGetIconKind =
  | "sample"
  | "guide"
  | "followup"
  | "platform"
  | "delivery"
  | "promo"
  | "reach"
  | "default";

function norm(title: string) {
  return title
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase();
}

/** Pick an icon from the card title across locales. */
export function brandGetIconKind(title: string): BrandGetIconKind {
  const t = norm(title);

  if (
    /sample|δειγμα|mostr|uzorak|мостр|regular-size|regular size|produkt/.test(t)
  ) {
    return "sample";
  }
  if (
    /guide|οδηγ|ghid|vodic|гид|ad in|book|educational|σχολικ|natal|breastfeed|boom|ladies guide/.test(
      t,
    )
  ) {
    return "guide";
  }
  if (
    /follow|εγγραφ|consim|saglas|следв|crm|registration|kanal/.test(t)
  ) {
    return "followup";
  }
  if (
    /platform|πλατφορ|platforma|communit|κοινοτ|babyspace|myschool|unistart|start 9|ladiesbook|heymaa|myparent|online/.test(
      t,
    )
  ) {
    return "platform";
  }
  if (/courier|deliver|παραδο|livrar|dostav|достав|home by/.test(t)) {
    return "delivery";
  }
  if (/promo|promotional|διαφημ|reklam/.test(t)) {
    return "promo";
  }
  if (/reach|target|upper|αποκλεισ|core/.test(t)) {
    return "reach";
  }
  return "default";
}

function IconPaths({ kind }: { kind: BrandGetIconKind }) {
  switch (kind) {
    case "sample":
      return (
        <>
          <rect x="7" y="9" width="18" height="14" rx="2.5" />
          <path d="M11 9V7.5a5 5 0 0 1 10 0V9" />
          <path d="M7 14h18" />
        </>
      );
    case "guide":
      return (
        <>
          <path d="M8 6.5h9.5a4 4 0 0 1 4 4V25l-4.2-2.2H8a2.5 2.5 0 0 1-2.5-2.5v-13A2.5 2.5 0 0 1 8 6.5Z" />
          <path d="M11 12h7.5M11 16h7.5M11 20h5" />
        </>
      );
    case "followup":
      return (
        <>
          <rect x="5.5" y="8" width="21" height="15" rx="3" />
          <path d="m8 11.5 8 6 8-6" />
        </>
      );
    case "platform":
      return (
        <>
          <rect x="5" y="7" width="22" height="14" rx="2.5" />
          <path d="M12 25h8M16 21v4" />
          <circle cx="11" cy="14" r="1.2" fill="currentColor" stroke="none" />
          <circle cx="16" cy="14" r="1.2" fill="currentColor" stroke="none" />
          <circle cx="21" cy="14" r="1.2" fill="currentColor" stroke="none" />
        </>
      );
    case "delivery":
      return (
        <>
          <path d="M4.5 18h15.5l3.2-6H28v10.5a2 2 0 0 1-2 2H6.5a2 2 0 0 1-2-2V18Z" />
          <path d="M4.5 18V10.5A2 2 0 0 1 6.5 8.5H18v9.5" />
          <circle cx="10" cy="24.5" r="2.2" />
          <circle cx="22.5" cy="24.5" r="2.2" />
        </>
      );
    case "promo":
      return (
        <>
          <path d="M6 13v6a2 2 0 0 0 2 2h3l5 4V7l-5 4H8a2 2 0 0 0-2 2Z" />
          <path d="M20 11.5a5 5 0 0 1 0 9M23 9a8.5 8.5 0 0 1 0 14" />
        </>
      );
    case "reach":
      return (
        <>
          <circle cx="16" cy="16" r="9" />
          <circle cx="16" cy="16" r="4.5" />
          <circle cx="16" cy="16" r="1.5" fill="currentColor" stroke="none" />
        </>
      );
    default:
      return (
        <>
          <path d="M8 10.5 16 6l8 4.5v9L16 24l-8-4.5v-9Z" />
          <path d="M16 14v10M8 10.5l8 3.5 8-3.5" />
        </>
      );
  }
}

export function BrandGetIcon({ title }: { title: string }) {
  const kind = brandGetIconKind(title);
  return (
    <span className={styles.cardIcon} data-kind={kind} aria-hidden="true">
      <svg viewBox="0 0 32 32" width="22" height="22" fill="none">
        <g
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <IconPaths kind={kind} />
        </g>
      </svg>
    </span>
  );
}
