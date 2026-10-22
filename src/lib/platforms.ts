/** Care Direct apps / online platforms shown in Insights by country. */

export type PlatformShot = {
  id: string;
  name: string;
  src: string;
  href: string;
  alt: string;
};

const PLATFORMS: {
  id: string;
  name: string;
  href: string;
  src: string;
  /** Match against insights `app` text (any locale). */
  match: RegExp;
}[] = [
  {
    id: "babyspace",
    name: "Babyspace",
    href: "https://babyspace.gr",
    src: "/assets/platforms/screen-pl-babyspace.jpg",
    match: /babyspace/i,
  },
  {
    id: "myparenthood",
    name: "Myparenthood",
    href: "https://myparenthood.gr",
    src: "/assets/platforms/screen-pl-myparenthood.jpg",
    match: /myparenthood/i,
  },
  {
    id: "mybabywinner",
    name: "Mybabywinner",
    href: "https://mybabywinner.com",
    src: "/assets/platforms/screen-pl-mybabywinner.jpg",
    match: /mybabywinner/i,
  },
  {
    id: "heymaa",
    name: "HeyMaa",
    href: "https://heymaa.ai",
    src: "/assets/platforms/screen-pl-heymaa.jpg",
    match: /heymaa/i,
  },
  {
    id: "myschoolwinner",
    name: "Myschoolwinner",
    href: "https://myschoolwinner.com",
    src: "/assets/platforms/screen-pl-myschoolwinner.jpg",
    match: /myschoolwinner/i,
  },
  {
    id: "start9",
    name: "START 9",
    href: "https://startliceu.life",
    src: "/assets/platforms/screen-pl-startliceu.jpg",
    match: /start\s*9|startliceu/i,
  },
  {
    id: "unistart",
    name: "UniStart+",
    href: "https://uni-start.com",
    src: "/assets/platforms/screen-pl-unistart.jpg",
    match: /unistart|uni-start|uni\s*start/i,
  },
  {
    id: "ladiesbook",
    name: "LadiesBook",
    href: "https://ladiesbook.gr",
    src: "/assets/platforms/screen-pl-ladiesbook.jpg",
    match: /ladiesbook/i,
  },
  {
    id: "momtag",
    name: "Momtag",
    href: "https://mom-tag.com",
    src: "/assets/platforms/screen-pl-momtag.jpg",
    match: /momtag|mom-tag/i,
  },
];

/** Resolve platform phone screenshots mentioned in an insights `app` string. */
export function platformsFromAppField(app: string | undefined): PlatformShot[] {
  if (!app || app === "—") return [];
  const found: PlatformShot[] = [];
  for (const p of PLATFORMS) {
    if (!p.match.test(app)) continue;
    found.push({
      id: p.id,
      name: p.name,
      src: p.src,
      href: p.href,
      alt: `${p.name} · ${p.href.replace(/^https?:\/\//, "")}`,
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
