export type ProgramId =
  | "st-pregnancy"
  | "st-natal"
  | "st-next"
  | "st-school"
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
  | "baby"
  | "first-foods"
  | "first-grade"
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
}[] = [
  { id: "st-pregnancy", slug: "pregnancy", name: "START Pregnancy", assetKey: "pregnancy" },
  { id: "st-natal", slug: "baby", name: "START Baby", assetKey: "natal" },
  { id: "st-next", slug: "first-foods", name: "START First Foods", assetKey: "next" },
  { id: "st-school", slug: "first-grade", name: "START First Grade", assetKey: "school" },
  { id: "st-teen", slug: "teen-girl", name: "START Teen Girl", assetKey: "teen" },
  { id: "st-high", slug: "high-school", name: "START High School", assetKey: "high" },
  { id: "st-uni", slug: "university", name: "START University", assetKey: "uni" },
  { id: "st-army", slug: "army", name: "START Army", assetKey: "army" },
  { id: "st-marriage", slug: "marriage", name: "START Marriage", assetKey: "marriage" },
  { id: "st-pet", slug: "pet", name: "START Pet", assetKey: "pet" },
  { id: "st-silver", slug: "ladies", name: "START Ladies", assetKey: "silver" },
  { id: "st-seniors", slug: "seniors", name: "START Seniors", assetKey: "seniors" },
];

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

export function programHeroSrc(assetKey: string) {
  const webp = assetKey === "teen";
  return `/assets/start-stages/hero-st-${assetKey}.${webp ? "webp" : "jpg"}`;
}

export function programTileSrc(assetKey: string) {
  const webp = assetKey === "teen";
  return `/assets/start-stages/tile-st-${assetKey}.${webp ? "webp" : "jpg"}`;
}

export function padNum(index: number) {
  return String(index + 1).padStart(2, "0");
}
