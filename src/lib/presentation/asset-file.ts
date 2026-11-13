import { existsSync, mkdirSync, readFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import sharp from "sharp";

const IMAGE_OK = /\.(png|jpe?g|gif|webp)$/i;
const RASTER_NATIVE = /\.(png|jpe?g|gif)$/i;

export type ImageAsset = {
  path: string;
  width: number;
  height: number;
};

function resolveExistingFile(publicSrc: string): string | null {
  const rel = publicSrc.replace(/^\//, "");
  const candidates = [
    path.join(process.cwd(), "public", rel),
    path.join(process.cwd(), rel),
  ];
  for (const file of candidates) {
    if (existsSync(file)) return file;
  }
  return null;
}

/**
 * Resolve a public `/assets/...` URL to a local file pptxgenjs can embed.
 * Prefers `public/`, then source `assets/`. WebP is converted to PNG via sharp.
 */
export async function resolveImageAsset(
  publicSrc: string | null | undefined,
): Promise<ImageAsset | null> {
  if (!publicSrc || !IMAGE_OK.test(publicSrc)) return null;
  const file = resolveExistingFile(publicSrc);
  if (!file) return null;

  if (RASTER_NATIVE.test(file)) {
    const size = readImageSize(file) ?? (await sharpSize(file));
    if (!size) return null;
    return { path: file, width: size.width, height: size.height };
  }

  // WebP (and anything sharp can decode) → cached PNG for PowerPoint.
  try {
    const meta = await sharp(file).metadata();
    if (!meta.width || !meta.height) return null;
    const cacheDir = path.join(os.tmpdir(), "start-pptx-assets");
    mkdirSync(cacheDir, { recursive: true });
    const out = path.join(
      cacheDir,
      `${path.basename(file, path.extname(file))}.png`,
    );
    const srcStat = readFileSync(file);
    // Rebuild when missing or source changed (hash via size + mtime not needed — overwrite cheap).
    await sharp(srcStat).png().toFile(out);
    return { path: out, width: meta.width, height: meta.height };
  } catch {
    return null;
  }
}

async function sharpSize(
  filePath: string,
): Promise<{ width: number; height: number } | null> {
  try {
    const meta = await sharp(filePath).metadata();
    if (!meta.width || !meta.height) return null;
    return { width: meta.width, height: meta.height };
  } catch {
    return null;
  }
}

/** Natural pixel size for PNG / JPEG (fast path without sharp). */
export function readImageSize(
  filePath: string,
): { width: number; height: number } | null {
  try {
    const buf = readFileSync(filePath);
    if (buf.length < 24) return null;
    if (
      buf[0] === 0x89 &&
      buf[1] === 0x50 &&
      buf[2] === 0x4e &&
      buf[3] === 0x47
    ) {
      return {
        width: buf.readUInt32BE(16),
        height: buf.readUInt32BE(20),
      };
    }
    if (buf[0] === 0xff && buf[1] === 0xd8) {
      let i = 2;
      while (i + 9 < buf.length) {
        if (buf[i] !== 0xff) break;
        const marker = buf[i + 1];
        const len = buf.readUInt16BE(i + 2);
        if (marker >= 0xc0 && marker <= 0xc3) {
          return {
            height: buf.readUInt16BE(i + 5),
            width: buf.readUInt16BE(i + 7),
          };
        }
        i += 2 + len;
      }
    }
  } catch {
    return null;
  }
  return null;
}

export type FitBox = {
  x: number;
  y: number;
  w: number;
  h: number;
};

/** Fit an image inside a box without cropping or stretching. */
export function fitContain(
  img: Pick<ImageAsset, "width" | "height">,
  box: FitBox,
  align: "center" | "left" | "right" | "top" | "bottom" = "center",
): FitBox {
  const scale = Math.min(box.w / img.width, box.h / img.height);
  const w = img.width * scale;
  const h = img.height * scale;
  let x = box.x;
  let y = box.y;
  if (align === "center" || align === "top" || align === "bottom") {
    x = box.x + (box.w - w) / 2;
  } else if (align === "right") {
    x = box.x + box.w - w;
  }
  if (align === "center" || align === "left" || align === "right") {
    y = box.y + (box.h - h) / 2;
  } else if (align === "bottom") {
    y = box.y + box.h - h;
  }
  return { x, y, w, h };
}

/** Fill a box, cropping overflow — still no stretch. */
export function fitCover(
  img: Pick<ImageAsset, "width" | "height">,
  box: FitBox,
): FitBox {
  const scale = Math.max(box.w / img.width, box.h / img.height);
  const w = img.width * scale;
  const h = img.height * scale;
  return {
    x: box.x + (box.w - w) / 2,
    y: box.y + (box.h - h) / 2,
    w,
    h,
  };
}

/** Sync PNG/JPEG path lookup (no WebP). Prefer resolveImageAsset for decks. */
export function resolveImageFile(
  publicSrc: string | null | undefined,
): string | null {
  if (!publicSrc || !RASTER_NATIVE.test(publicSrc)) return null;
  return resolveExistingFile(publicSrc);
}

/**
 * Recolor opaque (and semi-opaque) pixels to a solid RGB while keeping alpha.
 * Used for the black START wordmark → white on photo slides.
 */
export async function tintLogoAsset(
  img: ImageAsset,
  rgb: [number, number, number],
  label: string,
): Promise<ImageAsset | null> {
  try {
    const cacheDir = path.join(os.tmpdir(), "start-pptx-assets");
    mkdirSync(cacheDir, { recursive: true });
    const out = path.join(
      cacheDir,
      `tint-${label}-${rgb.join("x")}-${path.basename(img.path, path.extname(img.path))}.png`,
    );
    const { data, info } = await sharp(img.path)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });
    const [tr, tg, tb] = rgb;
    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] === 0) continue;
      data[i] = tr;
      data[i + 1] = tg;
      data[i + 2] = tb;
    }
    await sharp(data, {
      raw: {
        width: info.width,
        height: info.height,
        channels: 4,
      },
    })
      .png()
      .toFile(out);
    return { path: out, width: info.width, height: info.height };
  } catch {
    return null;
  }
}

/**
 * Lighten dark/gray logo ink for use on dark photo slides, keeping saturated
 * accents (e.g. CareDirect orange chevrons).
 */
export async function lightenLogoAsset(
  img: ImageAsset,
  label: string,
): Promise<ImageAsset | null> {
  try {
    const cacheDir = path.join(os.tmpdir(), "start-pptx-assets");
    mkdirSync(cacheDir, { recursive: true });
    const out = path.join(
      cacheDir,
      `light-${label}-${path.basename(img.path, path.extname(img.path))}.png`,
    );
    const { data, info } = await sharp(img.path)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });
    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] === 0) continue;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      const sat = max === 0 ? 0 : (max - min) / max;
      // Keep warm brand accents; lift gray ink toward white.
      if (sat > 0.35 && (r > g || r > b)) continue;
      data[i] = Math.min(255, Math.round(r + (255 - r) * 0.82));
      data[i + 1] = Math.min(255, Math.round(g + (255 - g) * 0.82));
      data[i + 2] = Math.min(255, Math.round(b + (255 - b) * 0.82));
    }
    await sharp(data, {
      raw: {
        width: info.width,
        height: info.height,
        channels: 4,
      },
    })
      .png()
      .toFile(out);
    return { path: out, width: info.width, height: info.height };
  } catch {
    return null;
  }
}

/**
 * Pre-crop an image to an exact slide box aspect (cover). The result has the
 * same aspect as the box, so placing it at box.w × box.h cannot stretch.
 */
export async function cropCoverAsset(
  img: ImageAsset,
  boxWIn: number,
  boxHIn: number,
  label: string,
): Promise<ImageAsset | null> {
  try {
    const pxPerIn = 150;
    const tw = Math.max(2, Math.round(boxWIn * pxPerIn));
    const th = Math.max(2, Math.round(boxHIn * pxPerIn));
    const cacheDir = path.join(os.tmpdir(), "start-pptx-assets");
    mkdirSync(cacheDir, { recursive: true });
    const out = path.join(
      cacheDir,
      `cover-${label}-${tw}x${th}-${path.basename(img.path, path.extname(img.path))}.png`,
    );
    await sharp(img.path)
      .resize(tw, th, { fit: "cover", position: "centre" })
      .png()
      .toFile(out);
    return { path: out, width: tw, height: th };
  } catch {
    return null;
  }
}
