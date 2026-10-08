# Approval Status

The GlowJ direction is **approved for the Stage 1 Coming Soon design** (see [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md)). The items below are still open.

| Area | State | Where |
|---|---|---|
| Headline, support, category, field label, CTA (vi + en) | Approved | `src/content/{vi,en}/index.ts` |
| Consent notice and success/error messages | **DRAFT microcopy, not approved** | `src/content/{vi,en}/index.ts` |
| Consent version | `draft-0` (wording is the draft above) | `src/lib/lead-capture/consent.ts` |
| Logo | Vectorised from the official label artwork (inline header arrangement). Replace with official vector files / confirm horizontal lockup | `src/components/brand/logo-paths.ts`, `Wordmark.tsx` |
| Droplet | Rebuilt from measured label geometry (not an official vector). Replace with official file if supplied | `src/components/visual/GlowDroplet.tsx` |
| Product imagery / bottle | None yet: the website does not draw a bottle. Add approved product photography | — |
| Photography | None yet | — |
| Favicon / OG image | Not provided | — |
| Contact / social links | `null` | `src/content/site.ts` |
| Search indexing | OFF (`noindex`, robots `Disallow: /`, empty sitemap) | `src/config/seo.ts` |
| Production secrets | Not connected | `.env.example` |

## Before go-live
1. Approve final consent and microcopy wording; add a new consent version (never edit an existing one) and record it in `SITE_ARCHITECTURE.md`.
2. Replace the wordmark with the approved logo; add favicon and OG image.
3. Add approved product photography (the website shows no bottle yet).
4. Set `indexable = true` in `src/config/seo.ts`.
5. Set production secrets in the chosen hosting provider (production only; non-production uses a test spreadsheet).
