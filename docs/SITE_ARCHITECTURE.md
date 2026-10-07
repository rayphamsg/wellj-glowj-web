# Site Architecture

## Stack
Next.js 16 (App Router, pinned exactly), React 19, TypeScript (strict), Tailwind CSS 4. No database, CMS, auth, ecommerce engine or analytics. Dependency versions match the IronJ site so patterns carry over.

## Structure
```
src/
  app/[locale]/        layout.tsx (html lang, metadata), page.tsx
  app/                 robots.ts, sitemap.ts, globals.css
  components/ui|layout|sections/
  config/              stage.ts, features.ts, seo.ts
  content/             site.ts (brand facts), types.ts (Dictionary), vi/, en/, signup-copy.ts
  lib/i18n/            locales, dictionary loader
  lib/lead-capture/    phone, consent, process, adapters, google-sheets-adapter (+ tests)
  lib/seo.ts           absolute URLs, hreflang, sitemap entries
```
Layering: routes compose sections; `ui/` primitives know no copy; sections get copy via props; Server Components by default.

## Bilingual routing
- `/vi` and `/en` via `[locale]`; other values 404 (`dynamicParams = false`). Statically generated.
- `/` → `/vi` with a **temporary (307)** redirect in `next.config.ts` (default-locale policy not settled).
- `www.drinkglowj.com` → `https://drinkglowj.com` permanent redirect (also configure on the Vercel domain).
- No i18n library. `Dictionary` type means a missing key fails `typecheck`; a test checks vi/en key parity.
- Per locale: `<html lang>`, title/description, Open Graph (`vi_VN`/`en_US`), canonical `https://drinkglowj.com/{locale}`, hreflang `vi`, `en`, `x-default` → `/vi`.

## SEO
Indexing is **off** (`src/config/seo.ts`): `noindex, nofollow`, robots `Disallow: /`, empty sitemap. When on, robots allows all and the sitemap lists both locales with alternates. Add new public paths to `pagePaths` in `sitemap.ts`.

## Lead capture (provider-agnostic)
`SignupForm` → server action `submitLead` → `processSubmission` (validation) → `getLeadAdapter()` → adapter.
- `getLeadAdapter()` returns the Google Sheets adapter when its env vars are set, otherwise a no-op that reports `not-configured`; it never fakes success. To switch provider, add an adapter implementing `LeadAdapter` and return it there.
- Honeypot field (`company`) returns a silent fake success; server sets `source`/`campaign`/`consent_at`; unknown consent versions store nothing.
- **Phone:** Vietnamese mobile numbers only, canonical `+84XXXXXXXXX`; `phone_raw` keeps typed input. Unverified (no OTP).
- **Dedup:** one row per normalized phone; repeats only update `last_seen_at` and `signup_count`. Concurrent first submissions from different instances could rarely duplicate; merge by hand.
- **Failures** show a generic message; logs name only the failing step.

**Sheet columns** (row 1 of the `Leads` tab, exact order; the adapter refuses to write otherwise): `phone_normalized`, `phone_raw`, `locale`, `source`, `campaign`, `consent_at`, `consent_version`, `first_seen_at`, `last_seen_at`, `signup_count`, `status`. Format A and B as Plain text. Defaults: `source` = `drinkglowj.com`, `campaign` = `coming-soon` (the stage), `status` = `new`. Times ISO 8601 UTC.

**Secrets:** none connected. Setup later (Vercel env vars, see `.env.example`): enable Sheets API, create a service account, share a spreadsheet with it as Editor, set the three variables. Use a separate test spreadsheet for local and Preview.

**Consent versions**

| Version | Wording shown |
|---|---|
| `draft-0` | PLACEHOLDER, not reviewed |

**Abuse protection:** honeypot plus a recommended Vercel Firewall rate limit (POST to page routes, ~10/min/IP, respond 429). No CAPTCHA yet.

## Deployment and CI
Vercel auto-detects Next.js; `main` deploys to production, other branches preview. CI (`.github/workflows/ci.yml`) runs lint, typecheck, test and build on PRs and pushes to `main`.
