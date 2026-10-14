# Site Architecture

## Stack
Next.js 16 (App Router, pinned exactly), React 19, TypeScript (strict), Tailwind CSS 4. No database, CMS, auth, ecommerce engine or analytics.

## Structure
```
src/
  app/[locale]/        layout.tsx (html lang, metadata), page.tsx
  app/                 robots.ts, sitemap.ts, globals.css
  public/__forms.html  Netlify Forms blueprint (never shown; Netlify reads it at deploy time)
  components/            brand/ (official logo), fill/ (liquid, droplet, headline), layout/, sections/, ui/
  scripts/               generate-halo.mjs (static halftone halo, output committed)
  config/              stage.ts, features.ts, seo.ts
  content/             site.ts (brand facts), types.ts (Dictionary), vi/, en/, signup-copy.ts
  lib/i18n/            locales, dictionary loader
  lib/lead-capture/    phone, consent, netlify-forms (+ tests)
  lib/seo.ts           absolute URLs, hreflang, sitemap entries
```
Layering: routes compose sections; `ui/` primitives know no copy; sections get copy via props; Server Components by default.

## Bilingual routing
- `/vi` and `/en` via `[locale]`; other values 404 (`dynamicParams = false`). Statically generated.
- `/` → `/vi` with a **temporary (307)** redirect in `next.config.ts` (default-locale policy not settled).
- `www.drinkglowj.com` → `https://drinkglowj.com` permanent redirect (configure the www → apex redirect at the hosting/DNS layer as well).
- No i18n library. `Dictionary` type means a missing key fails `typecheck`; a test checks vi/en key parity.
- Per locale: `<html lang>`, title/description, Open Graph (`vi_VN`/`en_US`), canonical `https://drinkglowj.com/{locale}`, hreflang `vi`, `en`, `x-default` → `/vi`.

## SEO
Indexing is **off** (`src/config/seo.ts`): `noindex, nofollow`, robots `Disallow: /`, empty sitemap. When on, robots allows all and the sitemap lists both locales with alternates. Add new public paths to `pagePaths` in `sitemap.ts`.

## Lead capture (Stage 1: Netlify Forms)
Stage 1 collects Zalo numbers into a **Netlify Forms inbox**, nothing more. No database, no secrets, no server code, no deduplication, no counters, no CRM logic.
`SignupForm` validates the number in the browser, then POSTs the form with `fetch` to the blueprint's own URL, `/__forms.html`; Netlify stores it under **Forms → `glowj-coming-soon`**.
- **Blueprint:** `public/__forms.html` is a hidden form (`name="glowj-coming-soon"`, `data-netlify="true"`, `netlify-honeypot="bot-field"`) that Netlify detects at build time and whose URL is the post target. Same pattern as the working DrinkIronJ site (`wellj-ironj-web`). Its name, honeypot and field names must match `src/lib/lead-capture/netlify-forms.ts` (a test checks this).
- **Success is only shown after Netlify accepts the post.** Netlify answers a stored submission with a redirect to its success page; the redirect is not followed and counts as success (`redirect: "manual"`, `response.ok || response.type === "opaqueredirect"`). Invalid number: nothing is sent. Any other answer (including Form detection being off, a 4xx/5xx or a network error) shows the "unavailable" message, keeps the typed number and allows an immediate retry. A second click while pending sends nothing. Local `next start` has no Netlify, so a post there fails (correctly).
- **Phone:** Vietnamese mobile numbers only, canonical `+84XXXXXXXXX` (`phone.ts`); `phone_raw` keeps what was typed. Unverified (no OTP).
- **Fields Netlify stores** (plain snake_case, CSV-friendly, so an export can later be mapped into Haravan): `phone_raw`, `phone_normalized`, `locale` (`vi`/`en`), `source` (`drinkglowj.com`), `campaign` (`coming-soon`, the stage), `consent_at` (ISO 8601 UTC, the visitor's browser clock), `consent_version` (`draft-0`). Netlify adds its own submission time.
- **Spam:** Netlify's honeypot (`bot-field`, hidden input) plus Netlify's built-in spam filtering. No reCAPTCHA in Stage 1.
- **Not done on purpose:** deduplication, `signup_count`, first/last seen, status, automation. Repeat signups are separate rows; clean up on export.
- **Trade-off:** the browser sets `source`, `campaign` and `consent_at`, and there is no server-side validation, so treat the inbox as unverified contact data. Haravan integration is a later, separate task.
- **Netlify setup:** Project configuration → Forms → enable **Form detection**; redeploy so the blueprint is parsed; add notifications (email) as wanted. Local `npm start` has no Netlify, so a real submission fails there ("unavailable"), which is correct.

**Consent versions**

| Version | Wording shown |
|---|---|
| `draft-0` | DRAFT, not approved. vi: "Bằng việc gửi số Zalo, bạn đồng ý để GlowJ liên hệ với bạn về lần ra mắt." en: "By submitting your Zalo number, you agree to be contacted by GlowJ about the launch." |

**Abuse protection:** Netlify honeypot and spam filtering. Form submissions themselves are free and unlimited on Netlify's credit-based plans; the account's other credit/usage limits still apply, and a project paused because account credits ran out stops serving web traffic and accepting form submissions.

## Deployment and CI
Deployed on **Netlify** (Next.js auto-detected, no `netlify.toml`). Stage 1 lead capture uses Netlify Forms (above), so no environment variables are required. The www → apex redirect is configured in Netlify's domain settings. CI (`.github/workflows/ci.yml`) runs lint, typecheck, test and build on PRs and pushes to `main`.
