import { mkdirSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import sharp from "sharp";
import {
  brandGetIconKind,
  type BrandGetIconKind,
} from "@/lib/brand-get-icon-kind";

/** SVG path bodies matching BrandGetIcon (viewBox 0 0 32 32). */
const PATHS: Record<BrandGetIconKind, string> = {
  sample: `<rect x="7" y="9" width="18" height="14" rx="2.5"/><path d="M11 9V7.5a5 5 0 0 1 10 0V9"/><path d="M7 14h18"/>`,
  guide: `<path d="M8 6.5h9.5a4 4 0 0 1 4 4V25l-4.2-2.2H8a2.5 2.5 0 0 1-2.5-2.5v-13A2.5 2.5 0 0 1 8 6.5Z"/><path d="M11 12h7.5M11 16h7.5M11 20h5"/>`,
  followup: `<rect x="5.5" y="8" width="21" height="15" rx="3"/><path d="m8 11.5 8 6 8-6"/>`,
  platform: `<rect x="5" y="7" width="22" height="14" rx="2.5"/><path d="M12 25h8M16 21v4"/><circle cx="11" cy="14" r="1.2" fill="#1A1A1A" stroke="none"/><circle cx="16" cy="14" r="1.2" fill="#1A1A1A" stroke="none"/><circle cx="21" cy="14" r="1.2" fill="#1A1A1A" stroke="none"/>`,
  delivery: `<path d="M4.5 18h15.5l3.2-6H28v10.5a2 2 0 0 1-2 2H6.5a2 2 0 0 1-2-2V18Z"/><path d="M4.5 18V10.5A2 2 0 0 1 6.5 8.5H18v9.5"/><circle cx="10" cy="24.5" r="2.2"/><circle cx="22.5" cy="24.5" r="2.2"/>`,
  promo: `<path d="M6 13v6a2 2 0 0 0 2 2h3l5 4V7l-5 4H8a2 2 0 0 0-2 2Z"/><path d="M20 11.5a5 5 0 0 1 0 9M23 9a8.5 8.5 0 0 1 0 14"/>`,
  reach: `<circle cx="16" cy="16" r="9"/><circle cx="16" cy="16" r="4.5"/><circle cx="16" cy="16" r="1.5" fill="#1A1A1A" stroke="none"/>`,
  default: `<path d="M8 10.5 16 6l8 4.5v9L16 24l-8-4.5v-9Z"/><path d="M16 14v10M8 10.5l8 3.5 8-3.5"/>`,
};

function svgFor(kind: BrandGetIconKind): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 32 32" fill="none"><g stroke="#1A1A1A" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${PATHS[kind]}</g></svg>`;
}

export type BrandGetIconFiles = Record<BrandGetIconKind, string>;

/** Rasterize site BrandGet icons once for the deck. */
export async function renderBrandGetIcons(): Promise<BrandGetIconFiles> {
  const dir = path.join(os.tmpdir(), "start-pptx-brand-icons");
  mkdirSync(dir, { recursive: true });
  const kinds = Object.keys(PATHS) as BrandGetIconKind[];
  const out = {} as BrandGetIconFiles;
  await Promise.all(
    kinds.map(async (kind) => {
      const file = path.join(dir, `brand-${kind}.png`);
      await sharp(Buffer.from(svgFor(kind))).png().toFile(file);
      out[kind] = file;
    }),
  );
  return out;
}

export function iconPathForTitle(
  title: string,
  files: BrandGetIconFiles,
): string {
  return files[brandGetIconKind(title)];
}

/** Simple channel / CRM chip icons. */
export async function renderChannelIcons(): Promise<Record<string, string>> {
  const dir = path.join(os.tmpdir(), "start-pptx-channel-icons");
  mkdirSync(dir, { recursive: true });
  const svgs: Record<string, string> = {
    email: `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 32 32" fill="none"><g stroke="#1A1A1A" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="5.5" y="8" width="21" height="15" rx="3"/><path d="m8 11.5 8 6 8-6"/></g></svg>`,
    sms: `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 32 32" fill="none"><g stroke="#1A1A1A" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="4" width="14" height="24" rx="3"/><path d="M13 25h6"/></g></svg>`,
    whatsapp: `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 32 32" fill="none"><g stroke="#1A1A1A" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M8 24.5 6.5 27.5l3.2-.8A10.5 10.5 0 1 0 8 24.5Z"/><path d="M12.5 14.5c.4 2.2 2.2 4 4.4 4.4"/></g></svg>`,
    general: `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 32 32" fill="none"><g stroke="#1A1A1A" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="16" cy="16" r="9"/><path d="M7.5 16h17M16 7.5c2.8 3 2.8 14 0 17M16 7.5c-2.8 3-2.8 14 0 17"/></g></svg>`,
  };
  const out: Record<string, string> = {};
  for (const [key, svg] of Object.entries(svgs)) {
    const file = path.join(dir, `channel-${key}.png`);
    await sharp(Buffer.from(svg)).png().toFile(file);
    out[key] = file;
  }
  return out;
}
