import type { ProgramId } from "@/lib/programs";

/**
 * Program palettes mirrored from ProgramPage.module.css `data-tone` rules —
 * same soft pods / bg / accent the live site uses across programs.
 */
export type ProgramTone = {
  accent: string;
  ink: string;
  soft: string;
  bg: string;
  /** Soft pastel pods used for fact chips, insight tiles, icon wells. */
  pods: [string, string, string, string];
};

function hex(h: string) {
  return h.replace("#", "").toUpperCase();
}

export const PROGRAM_TONES: Record<ProgramId, ProgramTone> = {
  "st-pregnancy": {
    accent: hex("#e48478"),
    ink: hex("#8a4540"),
    soft: hex("#fff1ed"),
    bg: hex("#faf2ef"),
    pods: [hex("#f8ddd8"), hex("#fff4ef"), hex("#e8edd9"), hex("#f5cfc8")],
  },
  "st-natal": {
    accent: hex("#789c9c"),
    ink: hex("#3d5c5c"),
    soft: hex("#eef5f3"),
    bg: hex("#f3f6f3"),
    pods: [hex("#d9ebe8"), hex("#f4f8f4"), hex("#f5ebe0"), hex("#c5d9d6")],
  },
  "st-luxury": {
    accent: hex("#cbb89a"),
    ink: hex("#5a5348"),
    soft: hex("#faf7f0"),
    bg: hex("#faf7f1"),
    pods: [hex("#f3eee4"), hex("#fffcf5"), hex("#e8e0d2"), hex("#efe8dc")],
  },
  "st-next": {
    accent: hex("#fc7860"),
    ink: hex("#7a3d28"),
    soft: hex("#fff3e8"),
    bg: hex("#faf4ec"),
    pods: [hex("#ffe5c8"), hex("#fff6ea"), hex("#fcccc0"), hex("#d4e0c8")],
  },
  "st-school": {
    accent: hex("#54b4e4"),
    ink: hex("#5a3d78"),
    soft: hex("#f3f6fa"),
    bg: hex("#f5f4f8"),
    pods: [hex("#e8f4fb"), hex("#faf6e8"), hex("#f0e4f6"), hex("#fad8d8")],
  },
  "st-school-xmas": {
    accent: hex("#d81824"),
    ink: hex("#186c30"),
    soft: hex("#fff2ef"),
    bg: hex("#faf3f0"),
    pods: [hex("#f8d8d8"), hex("#fff6f0"), hex("#d8eedc"), hex("#f0e0c8")],
  },
  "st-teen": {
    accent: hex("#e85a9b"),
    ink: hex("#6b3fa0"),
    soft: hex("#f8eef8"),
    bg: hex("#f6eef6"),
    pods: [hex("#f5d8ea"), hex("#f4e8fa"), hex("#e8d4f0"), hex("#f8c8dc")],
  },
  "st-high": {
    accent: hex("#f09c18"),
    ink: hex("#242424"),
    soft: hex("#fff4dc"),
    bg: hex("#f7f2e6"),
    pods: [hex("#ffe4a8"), hex("#fff6e0"), hex("#f0d898"), hex("#e8e0d0")],
  },
  "st-uni": {
    accent: hex("#7860a8"),
    ink: hex("#241818"),
    soft: hex("#f0ecf6"),
    bg: hex("#f2eef5"),
    pods: [hex("#e4dcf0"), hex("#f4f0f8"), hex("#f5e6c0"), hex("#d8d0e8")],
  },
  "st-army": {
    accent: hex("#545430"),
    ink: hex("#243018"),
    soft: hex("#efeee4"),
    bg: hex("#f1f0e8"),
    pods: [hex("#e4e0c8"), hex("#f2f0e6"), hex("#d4d4b8"), hex("#c8c8a8")],
  },
  "st-marriage": {
    accent: hex("#d89090"),
    ink: hex("#7a5a3d"),
    soft: hex("#f7f0ea"),
    bg: hex("#f7f2ed"),
    pods: [hex("#f0ddd0"), hex("#faf4ee"), hex("#f0d0c8"), hex("#e4d0bc")],
  },
  "st-pet": {
    accent: hex("#b07a5a"),
    ink: hex("#3c2418"),
    soft: hex("#f3ebe4"),
    bg: hex("#f3eee8"),
    pods: [hex("#e8d8c8"), hex("#f6efe8"), hex("#dcc8b4"), hex("#e8d0c0")],
  },
  "st-silver": {
    accent: hex("#e43c48"),
    ink: hex("#181818"),
    soft: hex("#f6eeee"),
    bg: hex("#f4efef"),
    pods: [hex("#f5d8de"), hex("#f8f4f4"), hex("#ead0d4"), hex("#e8e0e0")],
  },
  "st-seniors": {
    accent: hex("#f0b448"),
    ink: hex("#244848"),
    soft: hex("#eef3ee"),
    bg: hex("#f1f4f0"),
    pods: [hex("#d8e8e0"), hex("#f4f6f0"), hex("#f5e4b8"), hex("#c8d8d0")],
  },
};

export const DEFAULT_TONE: ProgramTone = {
  accent: "E84B4B",
  ink: "1A1A1A",
  soft: "F5F5F5",
  bg: "F6F5F2",
  pods: ["FDE8EC", "E3F4EA", "FFF1D2", "E4EEFB"],
};
