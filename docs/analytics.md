# START analytics (shared caredirect.com GTM / GA4)

START loads the same GTM container as caredirect.com (`GTM-5DVP4NM`). GA4 (`G-91XVB9XE1K`) should fire through that container. The site already stamps every hit with START context so you can analyse without splitting the property.

## What the site sends (after cookie accept)

| Field | Example | Use |
| --- | --- | --- |
| `site_id` | `start` | Filter / compare START vs corporate |
| `site_name` | `START by Care Direct` | Readable label |
| `page_locale` | `en`, `el`, `ro`, `sr`, `bg` | Language mix |
| `page_type` | `home`, `program`, `blog_article`, `plan`, … | Funnel stages |
| `content_group` | `START / Programs` | GA4 content grouping |
| `program_slug` | `teen-girl` | Program demand |
| `article_slug` | `phygital-marketing-for-brands` | Insights interest |
| Event `start_page_view` | — | Explicit START pageviews |
| Event `generate_lead` | form `start_brief` | Brief form conversions |

Also usable without custom setup: GA4 **Hostname** = `start.caredirect.com`.

## GTM checklist (one-time)

1. **Variables** → Data Layer Variables: `site_id`, `site_name`, `page_locale`, `page_type`, `content_group`, `program_slug`, `article_slug`.
2. **GA4 Configuration** tag (shared property):
   - User properties: `site_id`, `site_name`
   - Fields to set / event parameters on Config: `content_group` ← DLV `content_group`, plus the other DLVs you care about
3. **Optional GA4 Event** tag: event name `start_page_view`, trigger = Custom Event `start_page_view`, same parameters.
4. **Trigger note:** container must fire on `start.caredirect.com` (no hostname block). Preview on START and confirm `site_id=start` in the data layer.
5. Map `generate_lead` to your existing conversion / Ads / Meta tags; include `program` + `market` + `site_id`.

## GA4 checklist (one-time)

1. **Admin → Custom definitions** (event-scoped unless noted):
   - `site_id` (also as **user**-scoped if you set the user property)
   - `page_type`, `page_locale`, `program_slug`, `article_slug`
   - Confirm `content_group` is collecting
2. **Do not** filter START out of the property. Keep one property; slice with comparisons.
3. **Comparisons** (or segments):
   - START: `Hostname` exactly `start.caredirect.com` **or** `site_id` exactly `start`
   - Corporate: hostname `www.caredirect.com` (and exclude START)
4. **Explorations worth saving:**
   - START traffic by `page_type` / `content_group`
   - Programs by `program_slug` (pageviews + `generate_lead`)
   - Insights by `article_slug`
   - Locale mix (`page_locale`)
5. **Key events:** mark `generate_lead` (and `start_page_view` if you want START-only engagement).

## Quick sanity check

1. Open `https://start.caredirect.com/`, accept cookies.
2. GTM Preview → see `site_id=start` and `start_page_view`.
3. GA4 Realtime → filter hostname or `site_id` → confirm the session.
