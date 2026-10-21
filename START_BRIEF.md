# start.caredirect.com — build brief for Cursor

**What it is:** the START site, Care Direct's B2B site for its family of 12 life-stage programs (START Pregnancy, Baby, First Foods, First Grade, Teen Girl, High School, University, Army, Marriage, Pet, Ladies, Seniors). Audience: **brand and marketing managers**. Goal: show the programs and get a brief.
**Source of truth:** caredirect.com Website Manual v173 + the clickable prototype (`reference/care-direct-prototype.html`, open in a browser; START routes start with `#st-`, home = `#st-parents`).
**Stack (client decision):** Next.js (App Router, TypeScript) on **Vercel** + **Supabase** (Postgres, Auth, Storage). Not WordPress.
**caredirect.com** stays on WordPress (separate brief). The two sites share tracking, cookie rules and the opt-out flow.

---

## 0. Ground rules

1. **Copy comes from `content/` word for word.** Anything in `[square brackets]` is an unconfirmed fact: render it as-is with the class `tbc` (yellow highlight) so the client can find it. Never fill it in.
2. **Short sentences, British spelling, no exclamation marks, no emoji.**
3. **Accounts belong to Care Direct**, not a person: GitHub org repo, Vercel team, Supabase org. Add George as owner; keep credentials in Vercel env vars only.
4. **EU data:** Supabase project in **Frankfurt (eu-central-1)**; Vercel functions region **fra1**.
5. **Work in small steps (section 9).** After each step: push a preview deployment, report the URL and the checks from section 10. Do not start the next step until approved.
6. **Phase 2 (`/order/`, mums ordering samples) is designed but not built** until the client approves it (consent, minors, logistics). Build phase 1 only.

## 1. Files in this pack

| Path | What it is |
|---|---|
| `START_BRIEF.md` | This file |
| `reference/care-direct-prototype.html` | Clickable prototype. Match it page by page |
| `content/start-home.json` | START home: hero, 4 stats, the 12 stages (name, when, where, desc, tagline, "in their hands", "online and after"), How START works, Live STARTs, brand form |
| `content/pages.json` | Every START page (`st-…`): SEO title `t`, meta `m`, H1, CTA, sections in order (`name`, `comp`, `copy`, `intro`, `hidden`) |
| `content/programs-data.json` | Per-program platforms, printed guides by country (with flip-book links), confirmed reach per country |
| `content/routes.json` | Every route + the old caredirect.com URLs that must 301 here |
| `content/doodle-plan.json` | Which kit drawing goes where, per program (Teen Girl only so far) |
| `content/taglines.json` | Catchy hero tagline per program (localized) |
| `content/insights.json` | Per-program, per-country reach / cities / app / guide / tirage |
| `assets/brand/` | START logo (black on transparent, use as a CSS mask so it takes the text colour), Care Direct logo |
| `assets/heroes/` | Home hero (five life stages holding their kits), kit pyramid |
| `assets/start-stages/` | Per program: `hero-st-….jpg/webp` (page hero) and `tile-st-….jpg/webp` (home grid tile) |
| `assets/start-doodles/` | Teen Girl kit drawings: `-line` (transparent, light mode) and `-glow` (dark mode) |
| `assets/platforms/` | Platform phone screenshots (Babyspace, Myparenthood, Mybabywinner, HeyMaa, Myschoolwinner…) |

**Reading `pages.json`:** items in `copy` are separated by ` · `; `Title: text` = a card with title and one line; ` → ` separates steps; `hidden: true` = do not build (e.g. the removed "Where START runs" section).

## 2. Project setup

```
npx create-next-app@latest start-caredirect --ts --app --eslint --src-dir --import-alias "@/*"
```
- Styling: **CSS Modules + one `tokens.css`** (or Tailwind with the tokens below as theme values; pick one and stay consistent).
- Fonts via `next/font/google`: **Bricolage Grotesque** (display, 700/800) and **Figtree** (body, 400–700). [confirm against brand guidelines]
- Images via `next/image` (WebP/AVIF, sizes set, hero `priority`).
- Content: load the JSON files from `/content` at build time (static generation). See section 7 for editing.
- Env vars (Vercel): `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` (server only), `RESEND_API_KEY` or SMTP for notifications, `LEAD_NOTIFY_TO` (per market, see section 6), `NEXT_PUBLIC_GA4_ID`.
- Domain: `start.caredirect.com` → Vercel (CNAME at the caredirect.com DNS). HTTPS on.

## 3. Design system (approved look)

Quiet, neutral, playful. **The kits carry the colour; the site stays neutral. No solid black blocks.**

```css
:root{
  --bg:#F6F5F2;      /* warm off-white page */
  --surface:#FFFFFF; /* cards, header, footer */
  --ink:#161618;     /* text */
  --muted:#5F5E63;
  --line:#E5E3DE;
  --soft:#EEEDE8;
  --stdot:#F5B222;   /* only the amber dot / small accents */
  /* pastels (used light, so kits stay the loudest colour) */
  --p1:#FDE8EC; /* blush */ --p2:#E3F4EA; /* mint */ --p3:#FFF1D2; /* butter */ --p4:#E4EEFB; /* sky */ --p5:#EFE7FA; /* lilac */
  /* Teen Girl kit colours (only on Teen Girl) */
  --teen-pink:#FF2E93; --teen-purple:#8A3FD1;
  --display:"Bricolage Grotesque",system-ui,sans-serif; --body:"Figtree",system-ui,sans-serif;
}
```

- **Header:** white, thin bottom line. Left: START logo (mask, 26px high) + "by Care Direct" (muted). Right: Programs ▾ (dropdown of the 12), How it works, Live STARTs, **Plan a START** (button). A thin strip above: "start.caredirect.com · the START site for brands" + "← back to caredirect.com".
- **Buttons:** white fill, **1px solid ink border**, ink text, fully rounded (999px), 11px 16px. Hover: light grey `#E7E6E2` (**not black**). Same on every button.
- **Cards:** white, 1px line, radius 20–24px. Pastel tiles rotate p1 → p2 → p3 → p4.
- **Footer:** **white** (not black): START logo + "Every period in life has a first day. Be in it.", two columns of the 12 programs, "For brands" (START home, Order your samples (phase 2), Plan a START), bottom line "START. A Care Direct program family · caredirect.com · Privacy · Stop messages" (Privacy and Stop messages link to caredirect.com `/privacy/` and `/optout/`).
- **Balanced grids:** a row never ends with a lonely card. 4 = 4 or 2+2 (never 3+1); 5 = 3+2; 6 = 3+3; 12 = 4+4+4 or 3+3+3+3. Phones: one column.
- **Scale:** body 15px/1.55; H1 clamp(32px,4.2vw,58px) 800; H2 clamp(27px,3.6vw,43px) 800; content width ~1008px.
- **Accessibility:** contrast ≥ 4.5:1, visible focus ring, alt text on every image, `prefers-reduced-motion` stops floating doodles and tilt animations. Dark mode: optional, tokens in the prototype.

## 4. Pages and routes

| Route | Page (`id` in pages.json) | Notes |
|---|---|---|
| `/` | START home (`st-parents` + `start-home.json`) | See 5.1 |
| `/pregnancy/` `/baby/` `/first-foods/` `/first-grade/` `/teen-girl/` `/high-school/` `/university/` `/army/` `/marriage/` `/pet/` `/ladies/` `/seniors/` | Program pages (`st-pregnancy`, `st-natal`, `st-next`, `st-school`, `st-teen`, `st-high`, `st-uni`, `st-army`, `st-marriage`, `st-pet`, `st-silver`, `st-seniors`) | One dynamic route `app/[program]/page.tsx` with `generateStaticParams`. See 5.2 |
| `/plan/` | Plan a START (`st-contact`) | Brief form → Supabase. See 6 |
| `/order/` | Order your samples (`st-order`) | **Phase 2: not in phase 1.** Until then, do not link it publicly (or show "coming soon") |
| `/privacy/` | → 301 to `https://www.caredirect.com/privacy/` | Shared policy |
| `/sitemap.xml`, `/robots.txt` | Generated (`app/sitemap.ts`, `app/robots.ts`) | |

Per page: `generateMetadata` from `t` (title) and `m` (description), canonical URL, Open Graph image = the page hero.

## 5. Components

### 5.1 START home (`/`)
1. **Hero:** full-width photo `assets/heroes/home-hero-five-life-stages.webp` (five people at different life stages holding their kits). Below its lower edge, overlapping it, a **white card**: eyebrow, H1, lead, two buttons ("Find your START" → `#programs`, "How a START works" → `#how`), and **4 stat tiles** in pastels (p3, p2, p1, p4). On phones the photo shows in full above the card.
2. **The START family (`#programs`):** eyebrow + H2 + lead, then **12 photo tiles** (`tile-st-….`), 4 per row. Each tile: photo, soft dark shade at the bottom, icon top-left, number top-right ("01"), "when" chip, program name, one line, footer line "where" + "Explore →". Photo guideline: square 1200 × 1200, faces and kit in the upper half. Links to the program page.
3. **How a START works (`#how`):** 4 steps on white, pastel cards slightly tilted (−0.6° / +0.6°) that straighten on hover; white round icons.
4. **Live STARTs (`#live`):** live program cards with tag, name, description, external link; a dashed "next" card.
5. **Plan a START (`#brands`):** soft pastel gradient band (p1 → p3 → p4) with H2, lead and the brief form (section 6).
- The old "Two regions. One playbook." markets section is **removed**.

### 5.2 Program page (`/[program]/`)
1. **Hero:** program photo `hero-st-….` shown **clean (no dark overlay)**; a white card on the photo's lower edge holds the program logo above the H1, a catchy tagline (from `taglines.json`), and "Plan my START" — no long description in the hero (detail stays in About and below).
2. **About START …** (`program-about`): two sentences on the left; three pastel fact tiles on the right: When · Where · Platform.
3. **Your brand gets** (`card-grid`): 4 cards (Samples in the box, An ad in the guide, Consented follow-up, Our platform).
4. **Insights per country:** tabs for the five SEE markets with reach, cities, execution, app, guide and tirage (from `insights.json`).
5. **Closing band:** soft pastel gradient, H2 = program name, button "Plan my START".
- **Kit doodles** (where `doodle-plan.json` has a plan; Teen Girl now): a few kit line drawings placed on purpose, not scattered: one as a sticker on the hero card corner, one per section in the side margin (alternating left/right), one as a sticker on the closing band. Phones: only hero sticker, one next to a section title, closing sticker. Gentle float animation; none with reduced motion. Same approach for every program once its drawings arrive.
- **Teen Girl only:** accents use the kit colours (`--teen-pink`, `--teen-purple`): step badge, card top lines, icons, button. All other programs stay neutral.

## 6. Data: Supabase (phase 1)

**Table `leads`** (brand briefs from `/plan/` and the home form)
```sql
create table public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  company text not null,
  email text not null,
  market text not null,            -- Greece, Cyprus, Romania, Bulgaria, Serbia, Other
  program text,                    -- st-… id or 'advise-me'
  message text,
  source_page text,                -- route the form was sent from
  utm jsonb,
  consent_text text not null,      -- exact consent wording shown
  consent_at timestamptz not null,
  status text not null default 'new'  -- new / contacted / won / lost
);
alter table public.leads enable row level security;
-- no public select; inserts only through the server route
```
- **Insert only from a Next.js Route Handler / Server Action** with the service-role key (never from the browser). Validate with zod; honeypot field + rate limit (e.g. Upstash or a simple Supabase function); reject disposable emails.
- **Notify** the right country team by email on every new lead (`LEAD_NOTIFY_TO` per market, [addresses to confirm]); send the sender a short confirmation.
- **Admin view:** Supabase dashboard is enough for phase 1; optional protected `/admin` (Supabase Auth, Care Direct staff only) listing leads with status.
- **Consent:** B2B form, but store exactly what was shown. Privacy link → caredirect.com `/privacy/`.

**Phase 2 (`/order/`, not now):** mums choose stage and country, check eligibility, register for a box. Needs: `registrations` table (stage, country, due/birth date, address, consents per purpose), double opt-in, export to the fulfilment partner (Dcode), opt-out sync with caredirect.com `/optout/`, and **no data on minors without verified parent consent**. Write a separate design note before building.

## 7. Content editing

Phase 1: content lives in the JSON files in `/content` (edited by developers, reviewed by George). Keep components reading from these files only, so a CMS can be plugged in later without touching layouts.
Phase 1.5 [client to choose]: Sanity or Payload as headless CMS, or a `content` table in Supabase with a small admin. Do not hard-code copy in components.

## 8. SEO, tracking, redirects

- Metadata per page from `pages.json`; `sitemap.xml`; `robots.txt`; schema.org `Organization` (Care Direct) and `Service` per program.
- GA4 + consent banner with the **same rules and wording as caredirect.com** (no tracking before consent).
- **Redirects from caredirect.com** (set on the WordPress side, after this site is live): see `routes.json` → `redirect_from_caredirect_com`. Old gift-box pages there get **many parent visitors** (e.g. the Baby Gift Box page: ~1,000 search clicks a year). Ask the client how parents should be routed (link to Babyspace, or phase 2 `/order/`) before those redirects go live; do not add a parents' link on your own.
- Performance: Lighthouse mobile ≥ 90 performance, ≥ 95 accessibility; hero images ≤ 250 KB.

## 9. Build order (one preview deploy per step)

| Step | Task | Done when |
|---|---|---|
| 1 | Repo, Vercel project, Supabase project (EU), env vars, domain on a preview URL | Empty app deployed; accounts owned by Care Direct |
| 2 | Tokens, fonts, header, footer, buttons, cards, balanced grid | Style page shows every element |
| 3 | START home (5.1) | Matches prototype `#st-parents` |
| 4 | Program page template (5.2) + all 12 programs | Match prototype `#st-…` pages |
| 5 | Teen Girl kit colours + doodles | Matches `#st-teen` |
| 6 | `/plan/` + home form → Supabase `leads` + email notify | Test lead arrives in table and inbox |
| 7 | SEO (metadata, sitemap, schema), GA4 + consent | Checks in 10 pass |
| 8 | QA, then client review; then DNS to start.caredirect.com | Approved |
| 9 | (after approval) Ask the WordPress team to add the 301s from caredirect.com | Redirect test sheet green |

## 10. Acceptance checks (every page)

- No horizontal scroll at 1440, 1100, 900, 700, 390px.
- No grid row ends with a lonely card.
- No solid black blocks; buttons are white with a thin ink border, grey on hover.
- Copy matches `content/` word for word; `[brackets]` visible with the `tbc` class.
- All links work; external links open in a new tab.
- One H1 per page; title and meta set; images have alt text.
- Form: validation, honeypot, success message, row in Supabase, notification email.

## 11. Open items (keep as [brackets])

- Teen Girl: channel ([Schools, pharmacies]) and platform [to confirm]; hero photo shows a "10" cake, which reads younger than "start of puberty".
- Army, Marriage, Pet, Seniors: platform [to confirm]; Marriage, Pet, Seniors channel [to confirm].
- High School / University: printed guide [to confirm].
- Kit drawings for the other 11 programs; real case photos; client logo permissions.
- Lead notification addresses per market.
- Parents' route on program pages (link to Babyspace or the phase 2 `/order/` page).
- Brand fonts [confirm].
