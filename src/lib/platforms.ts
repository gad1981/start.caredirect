/** Care Direct apps / online platforms shown in Insights by country. */

export type PlatformShot = {
  id: string;
  name: string;
  src: string;
  href: string;
  alt: string;
  /** Short hover line — what the Online Platform is for. */
  blurb: string;
};

const PLATFORMS: {
  id: string;
  name: string;
  href: string;
  src: string;
  blurb: string;
  /** Match against insights `app` text (any locale). */
  match: RegExp;
}[] = [
  {
    id: "babyspace",
    name: "Babyspace",
    href: "https://babyspace.gr",
    src: "/assets/platforms/screen-pl-babyspace.png",
    blurb:
      "Greece’s pregnancy and new-mum Online Platform — guides, community and partner offers after the kit.",
    match: /babyspace/i,
  },
  {
    id: "myparenthood",
    name: "Myparenthood",
    href: "https://myparenthood.gr",
    src: "/assets/platforms/screen-pl-myparenthood.png",
    blurb:
      "Cyprus parenthood hub for expecting and new parents — content and CRM follow-up in market.",
    match: /myparenthood/i,
  },
  {
    id: "mybabywinner",
    name: "Mybabywinner",
    href: "https://mybabywinner.com",
    src: "/assets/platforms/screen-pl-mybabywinner.png",
    blurb:
      "Romania’s baby and toddler community — keeps parents close after sampling with digital content.",
    match: /mybabywinner/i,
  },
  {
    id: "heymaa",
    name: "HeyMaa",
    href: "https://heymaa.ai",
    src: "/assets/platforms/screen-pl-heymaa.png",
    blurb:
      "AI companion and content for new mothers — extends the START moment online.",
    match: /heymaa/i,
  },
  {
    id: "myschoolwinner",
    name: "Myschoolwinner",
    href: "https://myschoolwinner.com",
    src: "/assets/platforms/screen-pl-myschoolwinner.png",
    blurb:
      "School-age family platform — tips, community and partner space for parents and kids.",
    match: /myschoolwinner/i,
  },
  {
    id: "start9",
    name: "START 9",
    href: "https://startliceu.life",
    src: "/assets/platforms/screen-pl-startliceu.png",
    blurb:
      "Interactive guide for Romanian students starting high school — new class, new people, still you.",
    match: /start\s*9|startliceu/i,
  },
  {
    id: "unistart",
    name: "UniStart+",
    href: "https://uni-start.com",
    src: "/assets/platforms/screen-pl-unistart.png",
    blurb:
      "Student guidebook and partner box for university freshers — built with UNSS Sofia.",
    match: /unistart|uni-start|uni\s*start/i,
  },
  {
    id: "ladiesbook",
    name: "LadiesBook",
    href: "https://ladiesbook.gr",
    src: "/assets/platforms/screen-pl-ladiesbook.png",
    blurb:
      "Community and content for women entering a new life stage — digital follow-up after the kit.",
    match: /ladiesbook/i,
  },
  {
    id: "momtag",
    name: "Momtag",
    href: "https://mom-tag.com",
    src: "/assets/platforms/screen-pl-momtag.png",
    blurb:
      "Parent community and digital content around early family life — sampling that expands online.",
    match: /momtag|mom-tag/i,
  },
];

/** Resolve platform phone screenshots mentioned in an insights `app` string. */
export function platformsFromAppField(app: string | undefined): PlatformShot[] {
  if (!app || app === "—") return [];
  const found: PlatformShot[] = [];
  for (const p of PLATFORMS) {
    if (!p.match.test(app)) continue;
    const host = p.href.replace(/^https?:\/\//, "");
    found.push({
      id: p.id,
      name: p.name,
      src: p.src,
      href: p.href,
      alt: `${p.name} · ${host}`,
      blurb: p.blurb,
    });
  }
  return found;
}

/** Screenshot path for a Live STARTs external URL, if known. */
export function platformShotForUrl(url: string | undefined): string | null {
  if (!url) return null;
  const lower = url.toLowerCase();
  for (const p of PLATFORMS) {
    if (lower.includes(p.href.replace(/^https?:\/\//, ""))) return p.src;
  }
  return null;
}
