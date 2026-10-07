# Pending Brand Approval

The GlowJ brand strategy, design system and Coming Soon copy are under Marketing Director review. Until approved, the repo contains **only technical scaffolding and neutral placeholders**. Do not treat anything below as a decision.

| Area | Current state | Where |
|---|---|---|
| Colours / brand tokens | Neutral grey/black placeholders | `src/app/globals.css` (`PENDING`) |
| Typography | System font stack | `src/app/globals.css` |
| Motion language | None | — |
| Logo / imagery | None; text wordmark only | `Header.tsx` |
| Category positioning | None | — |
| Copy (vi + en) | `[PENDING APPROVAL]` strings, same keys in both | `src/content/vi/`, `src/content/en/` |
| Consent notice wording | `draft-0` placeholder | `src/lib/lead-capture/consent.ts` |
| Home page | Foundation page: heading, placeholder text, unstyled form | `src/app/[locale]/page.tsx` |
| Favicon / OG image | Not provided | — |
| Contact / social links | `null` | `src/content/site.ts` |
| Search indexing | OFF (`noindex`, robots `Disallow: /`, empty sitemap) | `src/config/seo.ts` |

## When approved
1. Replace dictionary values in `src/content/{vi,en}/index.ts` (keep the keys; extend `Dictionary` if needed).
2. Replace tokens in `globals.css` and add approved assets under `public/images/`.
3. Add a new consent version in `consent.ts` (never edit `draft-0`) and record its wording in `SITE_ARCHITECTURE.md`.
4. Build the real home page; add favicon and OG image.
5. Set `indexable = true` in `src/config/seo.ts`.
6. Set production secrets in the hosting provider (production only; non-production environments use a test spreadsheet).
