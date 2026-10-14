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
| Favicon | Official droplet, cropped and resized only (`src/app/favicon.ico` 16/32/48, `src/app/apple-icon.png` 180; `scripts/generate-favicon.py`). The lowercase g of the wordmark was evaluated and rejected: it reads as a "9" at 16 px and vanishes on dark tabs | `src/app/` |
| OG image | Not provided | — |
| Zalo Official Account link + QR | **Not provided.** The post-signup Zalo step is not rendered at all until both are set (then it appears automatically) | `src/content/site.ts` (`social.zalo`, `social.zaloQr`) |
| Contact / social links | `null` | `src/content/site.ts` |
| Search indexing | OFF (`noindex`, robots `Disallow: /`, empty sitemap) | `src/config/seo.ts` |
| Lead inbox | Netlify Forms `glowj-coming-soon` (no secrets). Enable Form detection in Netlify and check a real submission | `docs/SITE_ARCHITECTURE.md` |

## Before go-live
1. Approve final consent and microcopy wording; add a new consent version (never edit an existing one) and record it in `SITE_ARCHITECTURE.md`.
2. Add the OG image (derive from the official assets). The favicon is done.
2b. Provide the real Zalo OA link and its QR image (`site.social.zalo`, `site.social.zaloQr`); until then the post-signup Zalo step is simply not shown.
3. Decide when the bottle and product photography are revealed (a later stage).
4. Set `indexable = true` in `src/config/seo.ts`.
5. In Netlify: enable Form detection, set up submission notifications (email), and confirm a real test submission appears under Forms.
