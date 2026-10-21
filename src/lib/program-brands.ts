import type { ProgramId } from "@/lib/programs";

export type ProgramBrand = {
  logoSrc: string;
  /** Soft key visual derived from the logo colour story. */
  kvSrc: string;
  /** CSS data-tone key shared with flip tiles / program pages. */
  tone: string;
};

/** Programs with a flip-card logo + page key visual. */
export const PROGRAM_BRANDS: Partial<Record<ProgramId, ProgramBrand>> = {
  "st-pregnancy": {
    logoSrc: "/assets/brand/logo-st-pregnancy.webp",
    kvSrc: "/assets/brand/kv/kv-pregnancy.webp",
    tone: "pregnancy",
  },
  "st-natal": {
    logoSrc: "/assets/brand/logo-st-natal.webp",
    kvSrc: "/assets/brand/kv/kv-natal.webp",
    tone: "natal",
  },
  "st-luxury": {
    logoSrc: "/assets/brand/logo-st-luxury.webp",
    kvSrc: "/assets/brand/kv/kv-luxury.webp",
    tone: "luxury",
  },
  "st-next": {
    logoSrc: "/assets/brand/logo-st-next.webp",
    kvSrc: "/assets/brand/kv/kv-next.webp",
    tone: "next",
  },
  "st-school": {
    logoSrc: "/assets/brand/logo-st-school.webp",
    kvSrc: "/assets/brand/kv/kv-school.webp",
    tone: "school",
  },
  "st-school-xmas": {
    logoSrc: "/assets/brand/logo-st-school-xmas.webp",
    kvSrc: "/assets/brand/kv/kv-schoolXmas.webp",
    tone: "schoolXmas",
  },
  "st-teen": {
    logoSrc: "/assets/brand/logo-st-teen.webp",
    kvSrc: "/assets/brand/kv/kv-teen.webp",
    tone: "teen",
  },
  "st-high": {
    logoSrc: "/assets/brand/logo-st-high.webp",
    kvSrc: "/assets/brand/kv/kv-high.webp",
    tone: "high",
  },
  "st-uni": {
    logoSrc: "/assets/brand/logo-st-uni.webp",
    kvSrc: "/assets/brand/kv/kv-uni.webp",
    tone: "uni",
  },
  "st-army": {
    logoSrc: "/assets/brand/logo-st-army.webp",
    kvSrc: "/assets/brand/kv/kv-army.webp",
    tone: "army",
  },
  "st-marriage": {
    logoSrc: "/assets/brand/logo-st-marriage.webp",
    kvSrc: "/assets/brand/kv/kv-marriage.webp",
    tone: "marriage",
  },
  "st-pet": {
    logoSrc: "/assets/brand/logo-st-pet.webp",
    kvSrc: "/assets/brand/kv/kv-pet.webp",
    tone: "pet",
  },
  "st-silver": {
    logoSrc: "/assets/brand/logo-st-silver.webp",
    kvSrc: "/assets/brand/kv/kv-silver.webp",
    tone: "silver",
  },
  "st-seniors": {
    logoSrc: "/assets/brand/logo-st-seniors.webp",
    kvSrc: "/assets/brand/kv/kv-seniors.webp",
    tone: "seniors",
  },
};

export function getProgramBrand(id: string): ProgramBrand | null {
  return PROGRAM_BRANDS[id as ProgramId] ?? null;
}
