import PptxGenJS from "pptxgenjs";
import {
  getInsights,
  getKitFit,
  getMessages,
  getOffices,
  getPages,
  getProgramsData,
  getStartHome,
  getTaglines,
} from "@/lib/content";
import { localePath, siteUrl, type Locale } from "@/lib/i18n";
import { getProgramBrand } from "@/lib/program-brands";
import {
  getProgramById,
  programHeroSrc,
  programKitSrc,
  type ProgramId,
} from "@/lib/programs";
import { getGuideCovers } from "@/lib/guide-covers";
import {
  platformsFromAppField,
  type PlatformShot,
} from "@/lib/platforms";
import {
  cropCoverAsset,
  fitContain,
  lightenLogoAsset,
  resolveImageAsset,
  tintLogoAsset,
  type ImageAsset,
} from "./asset-file";
import { DECK } from "./deck-theme";
import {
  iconPathForTitle,
  renderBrandGetIcons,
  renderChannelIcons,
} from "./brand-get-icons";
import { fixPptxContentTypes } from "./fix-pptx";
import { parseAbout, parseCards } from "./parse-page";
import { renderHowStepIcons } from "./step-icons";
import { DEFAULT_TONE, PROGRAM_TONES, type ProgramTone } from "./tones";

const W = 13.333;
const H = 7.5;
const M = 0.5;
const FONT = DECK.font;

type Tone = ProgramTone;
type Slide = PptxGenJS.Slide;
type Box = { x: number; y: number; w: number; h: number };

function stripTbc(text: string) {
  return text.replace(/\s*·?\s*TBC\b/gi, "").trim();
}

const softShadow = {
  type: "outer" as const,
  color: "000000",
  blur: 10,
  offset: 2,
  opacity: 0.08,
};

/** Site page canvas — program `--bg`, no hard top rule. */
const noLine = { color: "FFFFFF", pt: 0 };

function brandCanvas(slide: Slide, tone: Tone) {
  slide.addShape("rect", {
    x: 0,
    y: 0,
    w: W,
    h: H,
    fill: { color: tone.bg },
    line: noLine,
  });
}

function creamCanvas(slide: Slide) {
  slide.addShape("rect", {
    x: 0,
    y: 0,
    w: W,
    h: H,
    fill: { color: DECK.bg },
    line: noLine,
  });
}

/** Floating white card — same language as program page panels. */
function addSiteCard(slide: Slide, box: Box, fill = "FFFFFF") {
  slide.addShape("roundRect", {
    x: box.x,
    y: box.y,
    w: box.w,
    h: box.h,
    fill: { color: fill },
    line: noLine,
    shadow: softShadow,
  });
}

/** Soft pastel pod (When / Where / insight tiles on the site). */
function addSoftPod(slide: Slide, box: Box, fill: string) {
  slide.addShape("roundRect", {
    x: box.x,
    y: box.y,
    w: box.w,
    h: box.h,
    fill: { color: fill },
    line: noLine,
  });
}

/** White category pill with lift — KitFit suggested categories. */
function addPill(
  slide: Slide,
  box: Box,
  label: string,
  ink: string,
) {
  slide.addShape("roundRect", {
    x: box.x,
    y: box.y,
    w: box.w,
    h: box.h,
    fill: { color: "FFFFFF" },
    line: { color: "FFFFFF" },
    shadow: {
      type: "outer",
      color: "000000",
      blur: 5,
      offset: 1,
      opacity: 0.1,
    },
  });
  slide.addText(label, {
    x: box.x + 0.12,
    y: box.y + 0.06,
    w: box.w - 0.24,
    h: box.h - 0.12,
    fontSize: 12,
    color: ink,
    fontFace: FONT,
    align: "center",
    valign: "middle",
  });
}

function placeContain(
  slide: Slide,
  img: ImageAsset,
  box: { x: number; y: number; w: number; h: number },
  align: "center" | "left" | "right" | "top" | "bottom" = "center",
) {
  const fitted = fitContain(img, box, align);
  slide.addImage({
    path: img.path,
    x: fitted.x,
    y: fitted.y,
    w: fitted.w,
    h: fitted.h,
  });
  return fitted;
}

function placeExact(
  slide: Slide,
  img: ImageAsset,
  box: { x: number; y: number; w: number; h: number },
) {
  slide.addImage({
    path: img.path,
    x: box.x,
    y: box.y,
    w: box.w,
    h: box.h,
  });
}

type FooterLogos = {
  start: ImageAsset | null;
  startOnDark: ImageAsset | null;
  caredirect: ImageAsset | null;
  caredirectOnDark: ImageAsset | null;
};

/**
 * Site lockup built from transparent assets: start wordmark + “by” + CAREDIRECT >>.
 * No composite PNG / white pill — logos keep their own alpha.
 */
function addFooter(
  slide: Slide,
  logos: FooterLogos,
  page: number,
  total: number,
  opts: { light?: boolean } = {},
) {
  const light = Boolean(opts.light);
  const pageColor = light ? "FFFFFF" : "666666";
  const byColor = light ? "DDDDDD" : "777777";
  const start = light ? logos.startOnDark ?? logos.start : logos.start;
  const cd =
    light ? logos.caredirectOnDark ?? logos.caredirect : logos.caredirect;

  const baseY = H - 0.68;
  let x = M;

  if (start) {
    const startH = 0.3;
    const startW = startH * (start.width / start.height);
    placeContain(
      slide,
      start,
      { x, y: baseY, w: startW, h: startH },
      "left",
    );
    x += startW + 0.08;
  }

  if (cd) {
    const cdH = 0.14;
    // Wide enough that “by” never wraps to a stacked b/y.
    const byW = 0.38;
    const cdW = cdH * (cd.width / cd.height);
    const rowY = baseY + 0.3 - cdH - 0.02;
    slide.addText("by", {
      x,
      y: rowY,
      w: byW,
      h: cdH + 0.02,
      fontSize: 9,
      color: byColor,
      fontFace: FONT,
      align: "center",
      valign: "middle",
    });
    x += byW + 0.06;
    placeContain(slide, cd, { x, y: rowY, w: cdW, h: cdH }, "left");
  }

  slide.addText(`${page} / ${total}`, {
    x: W - M - 1.1,
    y: H - 0.55,
    w: 1.1,
    h: 0.28,
    fontSize: 10,
    color: pageColor,
    fontFace: FONT,
    align: "right",
  });
}

function sectionEyebrow(
  slide: Slide,
  text: string,
  accent: string,
  y = 0.38,
) {
  slide.addText(text.toUpperCase(), {
    x: M,
    y,
    w: W - M * 2,
    h: 0.28,
    fontSize: 11,
    bold: true,
    color: accent,
    fontFace: FONT,
    charSpacing: 4,
  });
}

function sectionTitle(slide: Slide, text: string, ink: string, y = 0.62) {
  slide.addText(text, {
    x: M,
    y,
    w: W - M * 2,
    h: 0.6,
    fontSize: 28,
    bold: true,
    color: ink,
    fontFace: FONT,
  });
}

function uniquePlatforms(
  insightApps: string[],
  catalogApp: string | undefined,
): PlatformShot[] {
  const seen = new Set<string>();
  const out: PlatformShot[] = [];
  for (const field of [...insightApps, catalogApp ?? ""]) {
    for (const p of platformsFromAppField(field)) {
      if (seen.has(p.id)) continue;
      seen.add(p.id);
      out.push(p);
    }
  }
  return out;
}

export type BuiltDeck = {
  buffer: Buffer;
  filename: string;
  programName: string;
};

export async function buildProgramPptx(
  programId: ProgramId,
  locale: Locale,
): Promise<BuiltDeck | null> {
  const prog = getProgramById(programId);
  const pages = await getPages(locale);
  const page = pages[programId];
  if (!prog || !page) return null;

  const messages = getMessages(locale);
  const taglines = await getTaglines(locale);
  const startHome = await getStartHome(locale);
  const insightsMap = await getInsights(locale);
  const kitFitMap = await getKitFit(locale);
  const programsData = await getProgramsData(locale);
  const insightRows = insightsMap[programId] ?? [];
  const kitFit = kitFitMap[programId];
  const tagline = taglines[programId] ?? "";
  const aboutSec = page.sections.find((s) => s.comp === "program-about");
  const cardsSec = page.sections.find((s) => s.comp === "card-grid");
  const about = aboutSec ? parseAbout(aboutSec.copy) : null;
  const cards = cardsSec ? parseCards(cardsSec.copy) : [];
  const brand = getProgramBrand(programId);
  const tone = PROGRAM_TONES[programId] ?? DEFAULT_TONE;
  const kitSrc = programKitSrc(prog.assetKey);

  const platforms = uniquePlatforms(
    insightRows.map((r) => r.app),
    programsData.START_PLATFORMS?.[programId],
  );

  const firstGuideSrc =
    insightRows
      .map((r) => getGuideCovers(programId, r.country)[0]?.src)
      .find(Boolean) ?? null;

  const [
    hero,
    kit,
    programLogo,
    startLogo,
    caredirectLogo,
    guideCover,
    stepIcons,
    brandGetIcons,
    channelIcons,
    offices,
  ] = await Promise.all([
    resolveImageAsset(programHeroSrc(prog.assetKey)),
    resolveImageAsset(kitSrc),
    resolveImageAsset(brand?.logoSrc),
    resolveImageAsset("/assets/brand/start-logo.png"),
    resolveImageAsset("/assets/brand/caredirect-logo.png"),
    resolveImageAsset(firstGuideSrc),
    renderHowStepIcons(),
    renderBrandGetIcons(),
    renderChannelIcons(),
    getOffices(locale),
  ]);

  const startOnDark = startLogo
    ? await tintLogoAsset(startLogo, [255, 255, 255], "start-white")
    : null;
  const caredirectOnDark = caredirectLogo
    ? await lightenLogoAsset(caredirectLogo, "caredirect")
    : null;
  const footerLogos: FooterLogos = {
    start: startLogo,
    startOnDark,
    caredirect: caredirectLogo,
    caredirectOnDark,
  };
  const planPage = pages["st-contact"];
  const contactsSec = planPage?.sections.find((s) => s.comp === "contact-cards");
  const nextSec = planPage?.sections.find((s) => s.comp === "steps");

  const platformImages = (
    await Promise.all(
      platforms.map(async (p) => ({
        platform: p,
        img: await resolveImageAsset(p.src),
      })),
    )
  ).filter((x): x is { platform: PlatformShot; img: ImageAsset } =>
    Boolean(x.img),
  );

  const primaryLogo = programLogo ?? startLogo;
  const base = siteUrl().replace(/\/$/, "");
  const planUrl = `${base}${localePath(locale, "/plan/")}`;
  const programUrl = `${base}${localePath(locale, `/${prog.slug}/`)}`;

  const titleHero = hero
    ? await cropCoverAsset(hero, W, H, `title-${prog.slug}`)
    : null;
  const backCoverHero = hero
    ? await cropCoverAsset(hero, W, H, `back-${prog.slug}`)
    : null;

  const pptx = new PptxGenJS();
  pptx.defineLayout({ name: "LAYOUT_16x9", width: W, height: H });
  pptx.layout = "LAYOUT_16x9";
  pptx.author = "Care Direct";
  pptx.title = `${prog.name} — START by Care Direct`;
  pptx.subject = tagline || page.m;

  type SlideFn = (slide: Slide, index: number, total: number) => void;
  const builders: SlideFn[] = [];

  // ── 1. Title (program brand) ───────────────────────────────
  builders.push((slide, i, total) => {
    if (titleHero) {
      placeExact(slide, titleHero, { x: 0, y: 0, w: W, h: H });
      slide.addShape("rect", {
        x: 0,
        y: 0,
        w: W * 0.56,
        h: H,
        fill: { color: tone.ink, transparency: 28 },
        line: { color: tone.ink, transparency: 100 },
      });
    } else {
      brandCanvas(slide, tone);
    }
    slide.addShape("rect", {
      x: 0,
      y: 0,
      w: 0.18,
      h: H,
      fill: { color: tone.accent },
      line: { color: tone.accent },
    });

    if (primaryLogo) {
      placeContain(
        slide,
        primaryLogo,
        { x: 0.55, y: 0.4, w: 2.6, h: 0.85 },
        "left",
      );
    }

    const titleColor = titleHero ? "FFFFFF" : tone.ink;
    const subColor = titleHero ? "F2F2F2" : "444444";
    slide.addText("COMPLETE LIFE-STAGE EXPERIENCE", {
      x: 0.55,
      y: 2.05,
      w: 6.6,
      h: 0.3,
      fontSize: 11,
      bold: true,
      color: tone.accent,
      fontFace: FONT,
      charSpacing: 3,
    });
    slide.addText(prog.name, {
      x: 0.55,
      y: 2.4,
      w: 6.8,
      h: 1.05,
      fontSize: 42,
      bold: true,
      color: titleColor,
      fontFace: FONT,
    });
    if (tagline) {
      slide.addText(tagline, {
        x: 0.55,
        y: 3.55,
        w: 6.5,
        h: 0.85,
        fontSize: 18,
        color: subColor,
        fontFace: FONT,
      });
    }
    // Outlined pill CTA — same language as Join a START / Insights by Market.
    slide.addShape("roundRect", {
      x: 0.55,
      y: 4.7,
      w: 3.4,
      h: 0.55,
      fill: { color: "FFFFFF" },
      line: { color: tone.accent, pt: 1.5 },
    });
    slide.addText("START by Care Direct", {
      x: 0.55,
      y: 4.78,
      w: 3.4,
      h: 0.4,
      fontSize: 13,
      bold: true,
      color: tone.accent,
      align: "center",
      fontFace: FONT,
    });
    addFooter(slide, footerLogos, i, total, {
      light: Boolean(titleHero),
    });
  });

  // ── 2. Strategic model ONLY in pastels (same every program)
  builders.push((slide, i, total) => {
    creamCanvas(slide);
    sectionEyebrow(slide, startHome.how.eyebrow, DECK.accent);
    sectionTitle(slide, startHome.how.h2, DECK.ink, 0.62);

    const steps = startHome.how.steps;
    const gap = 0.22;
    const cardW = (W - M * 2 - gap * 3) / 4;
    const cardY = 2.0;
    const cardH = 4.5;

    steps.forEach(([title, body], idx) => {
      const x = M + idx * (cardW + gap);
      const pastel = DECK.pastels[idx % DECK.pastels.length];
      slide.addShape("roundRect", {
        x,
        y: cardY,
        w: cardW,
        h: cardH,
        fill: { color: pastel },
        line: { color: pastel },
      });
      slide.addShape("ellipse", {
        x: x + 0.28,
        y: cardY + 0.32,
        w: 0.62,
        h: 0.62,
        fill: { color: DECK.white },
        line: { color: DECK.white },
        shadow: {
          type: "outer",
          color: "000000",
          blur: 6,
          offset: 1,
          opacity: 0.12,
        },
      });
      const icon = stepIcons[idx];
      if (icon) {
        slide.addImage({
          path: icon,
          x: x + 0.38,
          y: cardY + 0.42,
          w: 0.42,
          h: 0.42,
        });
      }
      slide.addText(title, {
        x: x + 0.28,
        y: cardY + 1.15,
        w: cardW - 0.56,
        h: 0.7,
        fontSize: 16,
        bold: true,
        color: DECK.ink,
        fontFace: FONT,
      });
      slide.addText(body, {
        x: x + 0.28,
        y: cardY + 1.95,
        w: cardW - 0.56,
        h: 2.2,
        fontSize: 12,
        color: DECK.muted,
        fontFace: FONT,
        valign: "top",
      });
    });
    addFooter(slide, footerLogos, i, total);
  });

  // ── 3. About — same lead + fact pods split as the program page
  if (about) {
    builders.push((slide, i, total) => {
      brandCanvas(slide, tone);
      sectionTitle(slide, aboutSec?.name || "About", tone.ink, 0.45);

      const leadW = about.facts.length ? 7.5 : W - M * 2;
      slide.addText(stripTbc(about.lead), {
        x: M,
        y: 1.25,
        w: leadW,
        h: 4.6,
        fontSize: 17,
        color: tone.ink,
        fontFace: FONT,
        valign: "top",
      });

      about.facts.forEach((f, idx) => {
        const y = 1.25 + idx * 1.5;
        const pod = tone.pods[idx % tone.pods.length];
        addSoftPod(slide, { x: 8.4, y, w: 4.4, h: 1.35 }, pod);
        slide.addText(f.label, {
          x: 8.65,
          y: y + 0.22,
          w: 3.9,
          h: 0.28,
          fontSize: 12,
          bold: true,
          color: tone.accent,
          fontFace: FONT,
        });
        slide.addText(stripTbc(f.value), {
          x: 8.65,
          y: y + 0.55,
          w: 3.9,
          h: 0.6,
          fontSize: 15,
          color: tone.ink,
          fontFace: FONT,
          valign: "top",
        });
      });
      addFooter(slide, footerLogos, i, total);
    });
  }

  // ── 4. Brand gets — site card grid with real icons
  if (cards.length) {
    builders.push((slide, i, total) => {
      brandCanvas(slide, tone);
      sectionTitle(slide, cardsSec?.name || "Your brand gets", tone.ink, 0.45);
      if (cardsSec?.intro) {
        slide.addText(stripTbc(cardsSec.intro), {
          x: M,
          y: 1.1,
          w: W - M * 2,
          h: 0.4,
          fontSize: 14,
          color: "555555",
          fontFace: FONT,
        });
      }

      const top = cardsSec?.intro ? 1.65 : 1.25;
      // Match program page: 4 across when possible, else 2–3.
      const cols = cards.length <= 4 ? Math.max(2, cards.length) : 3;
      const gapX = 0.2;
      const gapY = 0.2;
      const cardW = (W - M * 2 - gapX * (cols - 1)) / cols;
      const rows = Math.ceil(cards.length / cols);
      const cardH = Math.min(2.55, (5.55 - top) / rows - gapY);

      cards.forEach((c, idx) => {
        const col = idx % cols;
        const row = Math.floor(idx / cols);
        const x = M + col * (cardW + gapX);
        const y = top + row * (cardH + gapY);
        addSiteCard(slide, { x, y, w: cardW, h: cardH });

        const well = { x: x + 0.22, y: y + 0.24, w: 0.52, h: 0.52 };
        addSoftPod(slide, well, tone.pods[idx % tone.pods.length]);
        const iconFile = iconPathForTitle(c.title, brandGetIcons);
        slide.addImage({
          path: iconFile,
          x: well.x + 0.1,
          y: well.y + 0.1,
          w: 0.32,
          h: 0.32,
        });

        // Copy column beside icon — same as site .card / .cardCopy
        const copyX = x + 0.88;
        const copyW = cardW - 1.1;
        slide.addText(stripTbc(c.title), {
          x: copyX,
          y: y + 0.22,
          w: copyW,
          h: 0.55,
          fontSize: 14,
          bold: true,
          color: tone.ink,
          fontFace: FONT,
          valign: "top",
        });
        slide.addText(stripTbc(c.body), {
          x: copyX,
          y: y + 0.82,
          w: copyW,
          h: cardH - 1.05,
          fontSize: 12,
          color: "555555",
          fontFace: FONT,
          valign: "top",
        });
      });
      addFooter(slide, footerLogos, i, total);
    });
  }

  // ── 5. Step 1 · The box ───────────────────────────────────
  if (kitFit?.categories?.length || kit) {
    builders.push((slide, i, total) => {
      brandCanvas(slide, tone);
      sectionEyebrow(slide, messages.step1Eyebrow, tone.accent);
      sectionTitle(slide, messages.step1Title, tone.ink);

      const leftW = kit ? 7.0 : W - M * 2;
      slide.addText(messages.kitFitLead, {
        x: M,
        y: 1.3,
        w: leftW,
        h: 0.55,
        fontSize: 14,
        color: "555555",
        fontFace: FONT,
      });

      const cats = kitFit?.categories ?? [];
      if (cats.length) {
        const panelH = kit ? 5.15 : 4.6;
        addSoftPod(slide, { x: M, y: 1.95, w: leftW, h: panelH }, tone.soft);
        slide.addText(messages.kitFitCategoriesTitle.toUpperCase(), {
          x: M + 0.3,
          y: 2.15,
          w: leftW - 0.6,
          h: 0.3,
          fontSize: 12,
          bold: true,
          color: tone.accent,
          fontFace: FONT,
          charSpacing: 2,
        });
        let chipX = M + 0.3;
        let chipY = 2.6;
        const maxX = M + leftW - 0.3;
        cats.forEach((c) => {
          const label = stripTbc(c);
          const chipW = Math.min(
            3.2,
            Math.max(1.55, label.length * 0.11 + 0.5),
          );
          if (chipX + chipW > maxX) {
            chipX = M + 0.3;
            chipY += 0.52;
          }
          addPill(
            slide,
            { x: chipX, y: chipY, w: chipW, h: 0.42 },
            label,
            tone.ink,
          );
          chipX += chipW + 0.14;
        });
        slide.addText(messages.kitFitExclusivity, {
          x: M + 0.3,
          y: 1.95 + panelH - 0.7,
          w: leftW - 0.6,
          h: 0.55,
          fontSize: 10,
          color: "777777",
          fontFace: FONT,
        });
      }

      if (kit) {
        addSiteCard(slide, { x: 8.0, y: 1.25, w: 4.75, h: 5.3 });
        placeContain(
          slide,
          kit,
          { x: 8.2, y: 1.45, w: 4.35, h: 4.9 },
          "center",
        );
      }
      addFooter(slide, footerLogos, i, total);
    });

    builders.push((slide, i, total) => {
      brandCanvas(slide, tone);
      sectionEyebrow(slide, messages.step1Eyebrow, tone.accent);
      sectionTitle(slide, messages.kitFitInKitTitle, tone.ink);
      slide.addText(messages.kitFitInKitLead, {
        x: M,
        y: 1.3,
        w: W - M * 2,
        h: 0.4,
        fontSize: 14,
        color: "555555",
        fontFace: FONT,
      });
      const placements = [
        messages.kitFitPlaceFull,
        messages.kitFitPlaceSamples,
        messages.kitFitPlaceLeaflets,
        messages.kitFitPlaceGifts,
        messages.kitFitPlaceCoupons,
        messages.kitFitPlaceGuide,
        messages.kitFitPlaceStickers,
      ];
      placements.forEach((label, idx) => {
        const col = idx % 2;
        const row = Math.floor(idx / 2);
        const x = M + col * 6.25;
        const y = 1.9 + row * 1.15;
        addSiteCard(slide, { x, y, w: 6.05, h: 1.0 });
        addSoftPod(
          slide,
          { x: x + 0.22, y: y + 0.22, w: 0.56, h: 0.56 },
          tone.pods[idx % tone.pods.length],
        );
        slide.addText(String(idx + 1), {
          x: x + 0.22,
          y: y + 0.3,
          w: 0.56,
          h: 0.4,
          fontSize: 14,
          bold: true,
          color: tone.ink,
          align: "center",
          fontFace: FONT,
        });
        slide.addText(label, {
          x: x + 0.95,
          y: y + 0.3,
          w: 4.8,
          h: 0.42,
          fontSize: 15,
          color: tone.ink,
          fontFace: FONT,
          valign: "middle",
        });
      });
      addFooter(slide, footerLogos, i, total);
    });
  }

  // ── 6. Step 2 · The guide ─────────────────────────────────
  builders.push((slide, i, total) => {
    brandCanvas(slide, tone);
    sectionEyebrow(slide, messages.step2Eyebrow, tone.accent);
    sectionTitle(slide, messages.step2Title, tone.ink);
    slide.addText(messages.step2Lead, {
      x: M,
      y: 1.3,
      w: guideCover ? 7.2 : W - M * 2,
      h: 0.7,
      fontSize: 14,
      color: "555555",
      fontFace: FONT,
    });

    const guideCards = [
      {
        title: messages.step2PrintTitle,
        body: messages.step2PrintBody,
        icon: brandGetIcons.guide,
      },
      {
        title: messages.step2DigitalTitle,
        body: messages.step2DigitalBody,
        icon: brandGetIcons.platform,
      },
      {
        title: messages.step2BrandTitle,
        body: messages.step2BrandBody,
        icon: brandGetIcons.promo,
      },
    ];
    const leftW = guideCover ? 7.2 : W - M * 2;
    const cardH = 1.35;
    guideCards.forEach((c, idx) => {
      const y = 2.15 + idx * (cardH + 0.18);
      addSiteCard(slide, { x: M, y, w: leftW, h: cardH });
      addSoftPod(
        slide,
        { x: M + 0.22, y: y + 0.35, w: 0.5, h: 0.5 },
        tone.pods[idx % tone.pods.length],
      );
      slide.addImage({
        path: c.icon,
        x: M + 0.31,
        y: y + 0.44,
        w: 0.32,
        h: 0.32,
      });
      slide.addText(c.title, {
        x: M + 0.9,
        y: y + 0.18,
        w: leftW - 1.15,
        h: 0.32,
        fontSize: 14,
        bold: true,
        color: tone.ink,
        fontFace: FONT,
      });
      slide.addText(c.body, {
        x: M + 0.9,
        y: y + 0.55,
        w: leftW - 1.15,
        h: 0.65,
        fontSize: 13,
        color: "444444",
        fontFace: FONT,
      });
    });

    if (guideCover) {
      addSiteCard(slide, { x: 8.15, y: 1.35, w: 4.55, h: 5.35 });
      placeContain(
        slide,
        guideCover,
        { x: 8.4, y: 1.6, w: 4.05, h: 4.85 },
        "center",
      );
    }

    addFooter(slide, footerLogos, i, total);
  });

  // ── 7. Step 3 · Digital follow-up ─────────────────────────
  builders.push((slide, i, total) => {
    brandCanvas(slide, tone);
    sectionEyebrow(slide, messages.crmSlideEyebrow, tone.accent);
    sectionTitle(slide, messages.crmSlideTitle, tone.ink);
    slide.addText(messages.crmSlideLead, {
      x: M,
      y: 1.3,
      w: W - M * 2,
      h: 0.7,
      fontSize: 14,
      color: "555555",
      fontFace: FONT,
    });

    const crmCards = [
      {
        title: messages.crmSlideConsentTitle,
        body: messages.crmSlideConsentBody,
        icon: brandGetIcons.followup,
      },
      {
        title: messages.crmSlideDataTitle,
        body: messages.crmSlideDataBody,
        icon: brandGetIcons.reach,
      },
      {
        title: messages.crmSlideChannelsTitle,
        body: messages.crmSlideChannelsLead,
        icon: brandGetIcons.platform,
      },
    ];
    const crmGap = 0.22;
    const crmCardW = (W - M * 2 - crmGap * 2) / 3;
    crmCards.forEach((c, idx) => {
      const x = M + idx * (crmCardW + crmGap);
      addSiteCard(slide, { x, y: 2.15, w: crmCardW, h: 2.55 });
      addSoftPod(
        slide,
        { x: x + 0.22, y: 2.35, w: 0.5, h: 0.5 },
        tone.pods[idx % tone.pods.length],
      );
      slide.addImage({
        path: c.icon,
        x: x + 0.31,
        y: 2.44,
        w: 0.32,
        h: 0.32,
      });
      slide.addText(c.title, {
        x: x + 0.85,
        y: 2.38,
        w: crmCardW - 1.1,
        h: 0.45,
        fontSize: 14,
        bold: true,
        color: tone.ink,
        fontFace: FONT,
        valign: "middle",
      });
      slide.addText(c.body, {
        x: x + 0.25,
        y: 3.05,
        w: crmCardW - 0.5,
        h: 1.4,
        fontSize: 12,
        color: "444444",
        fontFace: FONT,
        valign: "top",
      });
    });

    const channels = [
      { label: messages.crmSlideChannelEmail, icon: channelIcons.email },
      { label: messages.crmSlideChannelSms, icon: channelIcons.sms },
      { label: messages.crmSlideChannelWhatsapp, icon: channelIcons.whatsapp },
      { label: messages.crmSlideChannelGeneral, icon: channelIcons.general },
    ];
    const chipGap = 0.18;
    const chipW = (W - M * 2 - chipGap * 3) / 4;
    channels.forEach((ch, idx) => {
      const x = M + idx * (chipW + chipGap);
      addSiteCard(slide, { x, y: 5.0, w: chipW, h: 0.85 });
      addSoftPod(
        slide,
        { x: x + 0.18, y: 5.2, w: 0.42, h: 0.42 },
        tone.pods[idx % tone.pods.length],
      );
      slide.addImage({
        path: ch.icon,
        x: x + 0.25,
        y: 5.27,
        w: 0.28,
        h: 0.28,
      });
      slide.addText(ch.label, {
        x: x + 0.75,
        y: 5.22,
        w: chipW - 0.95,
        h: 0.4,
        fontSize: 14,
        bold: true,
        color: tone.ink,
        fontFace: FONT,
        valign: "middle",
      });
    });

    addFooter(slide, footerLogos, i, total);
  });

  // ── 8. Step 4 · Online Platform (one slide per app) ───────
  if (platformImages.length) {
    platformImages.forEach(({ platform, img }, appIdx) => {
      builders.push((slide, i, total) => {
        brandCanvas(slide, tone);
        sectionEyebrow(slide, messages.step4Eyebrow, tone.accent);
        sectionTitle(slide, platform.name, tone.ink);

        // Details left / phone right — same as Insights “Online app” on site.
        const lx = M;
        const lw = 6.6;
        slide.addText(
          `${appIdx + 1} / ${platformImages.length} · ${messages.insightsApp || "Online app"}`,
          {
            x: lx,
            y: 1.4,
            w: lw,
            h: 0.3,
            fontSize: 12,
            bold: true,
            color: tone.accent,
            fontFace: FONT,
            charSpacing: 1,
          },
        );
        slide.addText(platform.name, {
          x: lx,
          y: 1.85,
          w: lw,
          h: 0.55,
          fontSize: 32,
          bold: true,
          color: tone.ink,
          fontFace: FONT,
        });

        addSoftPod(slide, { x: lx, y: 2.6, w: lw, h: 1.15 }, tone.pods[0]);
        slide.addText("Website", {
          x: lx + 0.3,
          y: 2.75,
          w: lw - 0.55,
          h: 0.25,
          fontSize: 11,
          bold: true,
          color: tone.accent,
          fontFace: FONT,
        });
        slide.addText(platform.href.replace(/^https?:\/\//, ""), {
          x: lx + 0.3,
          y: 3.1,
          w: lw - 0.55,
          h: 0.4,
          fontSize: 16,
          color: tone.ink,
          fontFace: FONT,
        });

        addSoftPod(slide, { x: lx, y: 3.95, w: lw, h: 2.25 }, tone.pods[2]);
        slide.addText("About this platform", {
          x: lx + 0.3,
          y: 4.15,
          w: lw - 0.55,
          h: 0.3,
          fontSize: 11,
          bold: true,
          color: tone.accent,
          fontFace: FONT,
        });
        slide.addText(platform.blurb, {
          x: lx + 0.3,
          y: 4.55,
          w: lw - 0.55,
          h: 1.4,
          fontSize: 15,
          color: tone.ink,
          fontFace: FONT,
          valign: "top",
        });

        const phonePanel = { x: 7.6, y: 1.35, w: 5.15, h: 5.35 };
        addSiteCard(slide, phonePanel);
        placeContain(
          slide,
          img,
          {
            x: phonePanel.x + 0.45,
            y: phonePanel.y + 0.25,
            w: phonePanel.w - 0.9,
            h: phonePanel.h - 0.5,
          },
          "center",
        );

        addFooter(slide, footerLogos, i, total);
      });
    });
  }

  // ── 7. Markets — all countries for this program
  if (insightRows.length) {
    builders.push((slide, i, total) => {
      brandCanvas(slide, tone);
      sectionEyebrow(slide, "Markets", tone.accent);
      sectionTitle(slide, messages.marketsTitle, tone.ink);
      slide.addText(messages.marketsLead, {
        x: M,
        y: 1.3,
        w: W - M * 2,
        h: 0.35,
        fontSize: 13,
        color: "555555",
        fontFace: FONT,
      });

      const cols = Math.min(3, insightRows.length);
      const gap = 0.22;
      const cardW = (W - M * 2 - gap * (cols - 1)) / cols;
      const cardH = 2.35;

      insightRows.forEach((r, idx) => {
        const col = idx % cols;
        const row = Math.floor(idx / cols);
        const x = M + col * (cardW + gap);
        const y = 1.85 + row * (cardH + 0.2);
        addSiteCard(slide, { x, y, w: cardW, h: cardH });
        addSoftPod(
          slide,
          { x: x + 0.2, y: y + 0.2, w: cardW - 0.4, h: 0.7 },
          tone.pods[idx % tone.pods.length],
        );
        slide.addText(r.country, {
          x: x + 0.35,
          y: y + 0.35,
          w: cardW - 0.7,
          h: 0.4,
          fontSize: 16,
          bold: true,
          color: tone.ink,
          fontFace: FONT,
        });
        slide.addText(
          [
            stripTbc(r.reach) && `${messages.insightsReach}: ${stripTbc(r.reach)}`,
            stripTbc(r.channels) &&
              `${messages.insightsChannels}: ${stripTbc(r.channels)}`,
            stripTbc(r.cities) &&
              `${messages.insightsCities}: ${stripTbc(r.cities)}`,
          ]
            .filter(Boolean)
            .join("\n"),
          {
            x: x + 0.3,
            y: y + 1.05,
            w: cardW - 0.6,
            h: 1.15,
            fontSize: 12,
            color: "444444",
            fontFace: FONT,
            valign: "top",
          },
        );
      });
      addFooter(slide, footerLogos, i, total);
    });

    for (const row of insightRows) {
      builders.push((slide, i, total) => {
        brandCanvas(slide, tone);
        sectionEyebrow(slide, messages.marketsTitle, tone.accent);
        sectionTitle(slide, row.country, tone.ink);

        const blocks = [
          { label: messages.insightsReach, value: row.reach },
          { label: messages.insightsChannels, value: row.channels },
          { label: messages.insightsCities, value: row.cities },
          { label: messages.insightsApp, value: row.app },
          { label: messages.insightsGuide, value: row.guide },
          { label: messages.insightsTirage, value: row.tirage },
        ].filter((b) => b.value && b.value !== "—");

        const cols = blocks.length <= 3 ? blocks.length : 3;
        const gap = 0.22;
        const cardW = (W - M * 2 - gap * (cols - 1)) / cols;
        const cardH = 2.2;

        blocks.forEach((b, idx) => {
          const col = idx % cols;
          const r = Math.floor(idx / cols);
          const x = M + col * (cardW + gap);
          const y = 1.4 + r * (cardH + 0.22);
          addSoftPod(
            slide,
            { x, y, w: cardW, h: cardH },
            tone.pods[idx % tone.pods.length],
          );
          slide.addText(b.label.toUpperCase(), {
            x: x + 0.3,
            y: y + 0.3,
            w: cardW - 0.55,
            h: 0.3,
            fontSize: 11,
            bold: true,
            color: tone.accent,
            fontFace: FONT,
            charSpacing: 2,
          });
          slide.addText(stripTbc(b.value), {
            x: x + 0.3,
            y: y + 0.75,
            w: cardW - 0.55,
            h: cardH - 1.05,
            fontSize: 15,
            color: tone.ink,
            fontFace: FONT,
            valign: "top",
          });
        });
        addFooter(slide, footerLogos, i, total);
      });
    }
  }

  // ── 8. Contact + CTA (before back cover) ───────────────────
  builders.push((slide, i, total) => {
    brandCanvas(slide, tone);
    sectionEyebrow(
      slide,
      messages.contactSlideEyebrow,
      tone.accent,
    );
    sectionTitle(
      slide,
      contactsSec?.name || messages.contactSlideTitle,
      tone.ink,
    );
    slide.addText(
      contactsSec?.intro || messages.contactSlideLead,
      {
        x: M,
        y: 1.25,
        w: 7.6,
        h: 0.55,
        fontSize: 14,
        color: "555555",
        fontFace: FONT,
      },
    );

    const cols = Math.min(5, Math.max(1, offices.length));
    const gap = 0.18;
    const cardW = (W - M * 2 - gap * (cols - 1)) / cols;
    offices.forEach((office, idx) => {
      const x = M + idx * (cardW + gap);
      const y = 1.95;
      addSiteCard(slide, { x, y, w: cardW, h: 3.15 });
      addSoftPod(
        slide,
        { x: x + 0.16, y: y + 0.16, w: cardW - 0.32, h: 0.55 },
        tone.pods[idx % tone.pods.length],
      );
      slide.addText(office.country, {
        x: x + 0.28,
        y: y + 0.26,
        w: cardW - 0.56,
        h: 0.35,
        fontSize: 14,
        bold: true,
        color: tone.ink,
        fontFace: FONT,
      });
      slide.addText(office.lines.join("\n"), {
        x: x + 0.22,
        y: y + 0.9,
        w: cardW - 0.44,
        h: 1.45,
        fontSize: 11,
        color: "444444",
        fontFace: FONT,
        valign: "top",
      });
      slide.addText(`${messages.contactSlideTel} ${office.tel}`, {
        x: x + 0.22,
        y: y + 2.5,
        w: cardW - 0.44,
        h: 0.45,
        fontSize: 12,
        bold: true,
        color: tone.accent,
        fontFace: FONT,
        valign: "middle",
      });
    });

    // CTA row — Join a START + plan URL (site pill language).
    const ctaLabel = planPage?.cta || messages.planAStart;
    slide.addShape("roundRect", {
      x: M,
      y: 5.35,
      w: 2.85,
      h: 0.55,
      fill: { color: "FFFFFF" },
      line: { color: tone.accent, pt: 1.5 },
    });
    slide.addText(ctaLabel, {
      x: M,
      y: 5.42,
      w: 2.85,
      h: 0.4,
      fontSize: 13,
      bold: true,
      color: tone.accent,
      align: "center",
      fontFace: FONT,
    });
    slide.addText(planUrl.replace(/^https?:\/\//, ""), {
      x: M + 3.1,
      y: 5.42,
      w: 5.5,
      h: 0.4,
      fontSize: 14,
      color: tone.ink,
      fontFace: FONT,
      valign: "middle",
    });
    if (nextSec?.intro) {
      slide.addText(nextSec.intro, {
        x: M + 8.7,
        y: 5.35,
        w: W - M * 2 - 8.7,
        h: 0.55,
        fontSize: 11,
        color: "666666",
        fontFace: FONT,
        valign: "middle",
      });
    }
    addFooter(slide, footerLogos, i, total);
  });

  // ── 9. Back cover — full-bleed photo ───────────────────────
  builders.push((slide, i, total) => {
    if (backCoverHero) {
      placeExact(slide, backCoverHero, { x: 0, y: 0, w: W, h: H });
      slide.addShape("rect", {
        x: 0,
        y: 0,
        w: W,
        h: H,
        fill: { color: tone.ink, transparency: 38 },
        line: { color: tone.ink, transparency: 100 },
      });
    } else {
      brandCanvas(slide, tone);
    }

    slide.addShape("rect", {
      x: 0,
      y: 0,
      w: 0.18,
      h: H,
      fill: { color: tone.accent },
      line: { color: tone.accent },
    });

    if (primaryLogo) {
      placeContain(
        slide,
        primaryLogo,
        { x: 0.7, y: 0.55, w: 2.8, h: 0.9 },
        "left",
      );
    }

    const onPhoto = Boolean(backCoverHero);
    slide.addText("THANK YOU", {
      x: 0.7,
      y: 2.45,
      w: 11.5,
      h: 0.35,
      fontSize: 13,
      bold: true,
      color: tone.accent,
      fontFace: FONT,
      charSpacing: 5,
    });
    slide.addText(prog.name, {
      x: 0.7,
      y: 2.9,
      w: 11.5,
      h: 0.75,
      fontSize: 40,
      bold: true,
      color: onPhoto ? "FFFFFF" : tone.ink,
      fontFace: FONT,
    });
    slide.addText(messages.tagline, {
      x: 0.7,
      y: 3.8,
      w: 10,
      h: 0.55,
      fontSize: 18,
      color: onPhoto ? "F2F2F2" : "555555",
      fontFace: FONT,
    });
    slide.addText(programUrl.replace(/^https?:\/\//, ""), {
      x: 0.7,
      y: 4.6,
      w: 10,
      h: 0.35,
      fontSize: 14,
      color: onPhoto ? "DDDDDD" : "666666",
      fontFace: FONT,
    });

    addFooter(slide, footerLogos, i, total, { light: onPhoto });
  });

  const total = builders.length;
  builders.forEach((build, idx) => {
    const slide = pptx.addSlide();
    build(slide, idx + 1, total);
  });

  const raw = (await pptx.write({
    outputType: "nodebuffer",
  })) as Buffer;
  const buffer = await fixPptxContentTypes(raw);

  return {
    buffer,
    filename: `START-${prog.slug}-${locale}.pptx`,
    programName: prog.name,
  };
}
