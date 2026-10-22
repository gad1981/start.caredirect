/** Printed guide covers + helpers for Insights “Printed / digital guide”. */

export type GuideCover = {
  src: string;
  alt: string;
  href?: string;
};

export type GuideEntry = {
  country: string;
  title: string;
  href: string;
};

const COUNTRY_KEY: Record<string, string> = {
  Greece: "Greece",
  Ελλάδα: "Greece",
  Grecia: "Greece",
  Grčka: "Greece",
  Гърция: "Greece",
  Romania: "Romania",
  Ρουμανία: "Romania",
  România: "Romania",
  Rumunija: "Romania",
  Румъния: "Romania",
  Bulgaria: "Bulgaria",
  Βουλγαρία: "Bulgaria",
  Bugarska: "Bulgaria",
  България: "Bulgaria",
  Serbia: "Serbia",
  Σερβία: "Serbia",
  Srbija: "Serbia",
  Сърбия: "Serbia",
  Cyprus: "Cyprus",
  Κύπρος: "Cyprus",
  Cipru: "Cyprus",
  Kipar: "Cyprus",
  Кипър: "Cyprus",
};

/** Normalize localized country labels to a stable English key. */
export function insightCountryKey(country: string): string {
  return COUNTRY_KEY[country] ?? country;
}

const COVERS: Record<string, Record<string, GuideCover[]>> = {
  "st-pregnancy": {
    Greece: [
      {
        src: "/assets/guides/greece-pregnancy-sxeseis-storgis-boom.png",
        alt: "Σχέσεις Στοργής · Η ΠΙΟ ΓΛΥΚΙΑ ΑΝΑΜΟΝΗ (the BOOM edition)",
      },
    ],
  },
  "st-natal": {
    Greece: [
      {
        src: "/assets/guides/greece-newborn-sxeseis-storgis-boom.png",
        alt: "Σχέσεις Στοργής · the BOOM edition",
      },
    ],
    Romania: [
      {
        src: "/assets/guides/romania-newborn-relatii-afectuoase.png",
        alt: "Relații Afectuoase",
        href: "https://heyzine.com/flip-book/af6388abac.html",
      },
      {
        src: "/assets/guides/romania-breastfeeding-scurt-ghid-alaptare.png",
        alt: "Scurt ghid practic pentru alăptare",
        href: "https://heyzine.com/flip-book/e34cc9b492.html",
      },
    ],
    Bulgaria: [
      {
        src: "/assets/guides/bulgaria-breastfeeding-kratko-praktichesko-rakovodstvo.png",
        alt: "Кратко практическо ръководство за кърмене",
        href: "https://heyzine.com/flip-book/0b1c5e2f26.html",
      },
    ],
    Serbia: [
      {
        src: "/assets/guides/serbia-breastfeeding-prakticni-vodic-dojenje.png",
        alt: "Praktični vodič za uspešno dojenje",
        href: "https://heyzine.com/flip-book/8e724472cf.html",
      },
    ],
  },
  "st-next": {
    Romania: [
      {
        src: "/assets/guides/romania-breastfeeding-scurt-ghid-alaptare.png",
        alt: "Scurt ghid practic pentru alăptare",
        href: "https://heyzine.com/flip-book/e34cc9b492.html",
      },
    ],
    Bulgaria: [
      {
        src: "/assets/guides/bulgaria-breastfeeding-kratko-praktichesko-rakovodstvo.png",
        alt: "Кратко практическо ръководство за кърмене",
        href: "https://heyzine.com/flip-book/0b1c5e2f26.html",
      },
    ],
    Serbia: [
      {
        src: "/assets/guides/serbia-breastfeeding-prakticni-vodic-dojenje.png",
        alt: "Praktični vodič za uspešno dojenje",
        href: "https://heyzine.com/flip-book/8e724472cf.html",
      },
    ],
  },
  "st-school": {
    Romania: [
      {
        src: "/assets/guides/romania-school-prima-zi-la-scoala.png",
        alt: "Prima zi la școală",
        href: "https://heyzine.com/flip-book/381377db30.html",
      },
    ],
    Bulgaria: [
      {
        src: "/assets/guides/bulgaria-school-parvi-ucheben-den.png",
        alt: "Първи Учебен Ден",
        href: "https://heyzine.com/flip-book/59a24288dc.html",
      },
    ],
    Serbia: [
      {
        src: "/assets/guides/serbia-school-prvi-dan-skole.png",
        alt: "Prvi dan škole",
        href: "https://heyzine.com/flip-book/f6ae2642bc.html",
      },
    ],
  },
};

export function getGuideCovers(
  programId: string,
  country: string,
): GuideCover[] {
  const key = insightCountryKey(country);
  return COVERS[programId]?.[key] ?? [];
}

/** Guides from programs-data for the selected market. */
export function guidesForCountry(
  entries: [string, string, string][] | undefined,
  country: string,
): GuideEntry[] {
  if (!entries?.length) return [];
  const key = insightCountryKey(country);
  return entries
    .filter(([c]) => insightCountryKey(c) === key)
    .map(([c, title, href]) => ({
      country: c,
      title,
      href: href?.trim() ?? "",
    }));
}

/** Covers with flipbook href filled from matching START_GUIDES when possible. */
export function coversForCountry(
  programId: string,
  country: string,
  entries: [string, string, string][] | undefined,
): GuideCover[] {
  const covers = getGuideCovers(programId, country).map((c) => ({ ...c }));
  const guides = guidesForCountry(entries, country).filter((g) => g.href);
  if (!covers.length || !guides.length) return covers;

  return covers.map((cover, i) => ({
    ...cover,
    href: cover.href || guides[Math.min(i, guides.length - 1)]?.href || "",
  }));
}
