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
  if (/follow|εγγραφ|consim|saglas|следв|crm|registration|kanal/.test(t)) {
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
