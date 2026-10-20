import casesJson from "../../content/cases.json";
import doodlePlanJson from "../../content/doodle-plan.json";
import pagesJson from "../../content/pages.json";
import programsDataJson from "../../content/programs-data.json";
import routesJson from "../../content/routes.json";
import startHomeJson from "../../content/start-home.json";

export const startHome = startHomeJson;
export const pages = pagesJson as Record<
  string,
  {
    t: string;
    m: string;
    h1: string;
    cta: string;
    sections: {
      name: string;
      comp: string;
      copy: string;
      intro?: string;
      hidden?: boolean;
      proof?: string;
    }[];
  }
>;
export const programsData = programsDataJson as unknown as {
  START_PLATFORMS: Record<string, string>;
  START_GUIDES: Record<string, [string, string, string][]>;
  START_PROGRAMS: Record<
    string,
    { name: string; when: string; where: string; desc: string }
  >;
  START_REACH?: Record<string, unknown>;
};
export const cases = casesJson as {
  slug: string;
  client: string;
  where: string;
  year: string;
  h1: string;
  line: string;
  brief: string;
  tags: string[];
  src?: string;
}[];
export const doodlePlan = doodlePlanJson as Record<
  string,
  {
    hero: string;
    sections: string[];
    band: string;
    mobile: (string | null)[];
  }
>;
export const routes = routesJson as {
  id: string;
  name: string;
  url: string;
  redirect_from_caredirect_com: string[];
}[];

export function casesForProgram(programId: string) {
  return cases.filter((c) => c.tags.includes(programId));
}

export function siteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "https://start.caredirect.com";
}
