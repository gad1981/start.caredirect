export type ProgramId =
  | "st-pregnancy"
  | "st-natal"
  | "st-luxury"
  | "st-next"
  | "st-school"
  | "st-school-xmas"
  | "st-teen"
  | "st-high"
  | "st-uni"
  | "st-army"
  | "st-marriage"
  | "st-pet"
  | "st-silver"
  | "st-seniors";

export type ProgramSlug =
  | "pregnancy"
  | "newborn"
  | "newbornluxury"
  | "first-foods"
  | "first-grade"
  | "first-grade-christmas"
  | "teen-girl"
  | "high-school"
  | "university"
  | "army"
  | "marriage"
  | "pet"
  | "ladies"
  | "seniors";

export const PROGRAMS: {
  id: ProgramId;
  slug: ProgramSlug;
  name: string;
  assetKey: string;
  /** When false, keep the route/page but hide from home tiles, nav, footer, forms. */
  listed?: boolean;
}[] = [
  { id: "st-pregnancy", slug: "pregnancy", name: "START Pregnancy", assetKey: "pregnancy" },
  { id: "st-natal", slug: "newborn", name: "START Newborn", assetKey: "natal" },
  {
    id: "st-luxury",
    slug: "newbornluxury",
    name: "START Luxury Moments",
    assetKey: "natal-luxury",
  },
  { id: "st-next", slug: "first-foods", name: "START First Foods", assetKey: "next" },
  { id: "st-school", slug: "first-grade", name: "START First Grade", assetKey: "school" },
  {
    id: "st-school-xmas",
    slug: "first-grade-christmas",
    name: "START First Grade Christmas",
    assetKey: "school-christmas",
  },
  { id: "st-teen", slug: "teen-girl", name: "START Teen Girl", assetKey: "teen" },
  { id: "st-high", slug: "high-school", name: "START High School", assetKey: "high" },
  { id: "st-uni", slug: "university", name: "START University", assetKey: "uni" },
  { id: "st-army", slug: "army", name: "START Army", assetKey: "army" },
  { id: "st-marriage", slug: "marriage", name: "START Marriage", assetKey: "marriage" },
  { id: "st-pet", slug: "pet", name: "START Pet", assetKey: "pet" },
  { id: "st-silver", slug: "ladies", name: "START Ladies", assetKey: "silver" },
  { id: "st-seniors", slug: "seniors", name: "START Seniors", assetKey: "seniors" },
];

/** Programs shown in nav, footer, brief form, and home tiles. */
export const LISTED_PROGRAMS = PROGRAMS.filter((p) => p.listed !== false);

const bySlug = Object.fromEntries(PROGRAMS.map((p) => [p.slug, p])) as Record<
  ProgramSlug,
  (typeof PROGRAMS)[number]
>;

const byId = Object.fromEntries(PROGRAMS.map((p) => [p.id, p])) as Record<
  ProgramId,
  (typeof PROGRAMS)[number]
>;

export function getProgramBySlug(slug: string) {
  return bySlug[slug as ProgramSlug] ?? null;
}

export function getProgramById(id: string) {
  return byId[id as ProgramId] ?? null;
}

function stageHeroExt(assetKey: string) {
  if (assetKey === "teen") return "webp";
  if (
    assetKey === "pregnancy" ||
    assetKey === "pet" ||
    assetKey === "natal" ||
    assetKey === "natal-luxury" ||
    assetKey === "uni" ||
    assetKey === "next" ||
    assetKey === "marriage" ||
    assetKey === "school-christmas" ||
    assetKey === "school" ||
    assetKey === "seniors" ||
    assetKey === "high" ||
    assetKey === "army" ||
    assetKey === "silver"
  ) {
    return "png";
  }
  return "jpg";
}

function stageTileExt(assetKey: string) {
  if (assetKey === "teen") return "webp";
  if (
    assetKey === "pregnancy" ||
    assetKey === "pet" ||
    assetKey === "natal" ||
    assetKey === "natal-luxury" ||
    assetKey === "uni" ||
    assetKey === "next" ||
    assetKey === "marriage" ||
    assetKey === "school-christmas" ||
    assetKey === "school" ||
    assetKey === "seniors" ||
    assetKey === "high" ||
    assetKey === "army" ||
    assetKey === "silver"
  ) {
    return "png";
  }
  return "jpg";
}

export function programHeroSrc(assetKey: string) {
  const key = assetKey === "pregnancy" ? "pregnancy-v3" : assetKey;
  return `/assets/start-stages/hero-st-${key}.${stageHeroExt(assetKey)}`;
}

export function programTileSrc(assetKey: string) {
  const key = assetKey === "pregnancy" ? "pregnancy-v3" : assetKey;
  return `/assets/start-stages/tile-st-${key}.${stageTileExt(assetKey)}`;
}

/** Kit cutouts for program pages (black studio field keyed transparent). */
const KIT_KEYS = new Set([
  "pregnancy",
  "natal",
  "natal-luxury",
  "next",
  "school",
  "school-christmas",
  "teen",
  "high",
  "uni",
  "army",
  "marriage",
  "pet",
  "silver",
  "seniors",
]);

export function programKitSrc(assetKey: string): string | null {
  if (!KIT_KEYS.has(assetKey)) return null;
  return `/assets/kits/kit-st-${assetKey}.png`;
}

export function padNum(index: number) {
  return String(index + 1).padStart(2, "0");
}
