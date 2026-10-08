# Approval Status

The GlowJ direction is **approved for the Stage 1 Coming Soon design** (see [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md)). The items below are still open.

| Area | State | Where |
|---|---|---|
| Headline, support, category, field label, CTA (vi + en) | Approved | `src/content/{vi,en}/index.ts` |
| Consent notice and success/error messages | **DRAFT microcopy, not approved** | `src/content/{vi,en}/index.ts` |
| Consent version | `draft-0` (wording is the draft above) | `src/lib/lead-capture/consent.ts` |
| Logo | Official vector, unchanged (`brand-assets/official/glowj-logo-vector.pdf`) | `src/components/brand/GlowJLogo.tsx` |
| Droplet | Official droplet (supplied raster; transparent margin trimmed, resized). Replace if a vector master exists | `public/images/glowj-droplet.webp` |
| Bottle / packaging | Deliberately **not shown** in Stage 1. Authoritative for future product work | — |
| Photography | None yet | — |
| Favicon / OG image | Not provided | — |
| Contact / social links | `null` | `src/content/site.ts` |
| Search indexing | OFF (`noindex`, robots `Disallow: /`, empty sitemap) | `src/config/seo.ts` |
| Production secrets | Not connected | `.env.example` |

## Before go-live
1. Approve final consent and microcopy wording; add a new consent version (never edit an existing one) and record it in `SITE_ARCHITECTURE.md`.
2. Add favicon and OG image (derive from the official assets).
3. Decide when the bottle and product photography are revealed (a later stage).
4. Set `indexable = true` in `src/config/seo.ts`.
5. Set production secrets in the chosen hosting provider (production only; non-production uses a test spreadsheet).
