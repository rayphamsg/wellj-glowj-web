# CLAUDE.md — GlowJ website

Official site for **GlowJ by WellJ** at `https://drinkglowj.com`. GlowJ is a **separate brand from IronJ**; only the technical foundation is shared in pattern. The maintainer is a non-technical founder: explain changes in plain language and keep them small.

## Current status
**Stage 1 Coming Soon design implemented.** Brand direction, visual system and Coming Soon copy are approved (see [docs/DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md)). Still open: consent/microcopy wording, favicon/OG, hosting, production secrets. See [docs/BRAND_PENDING.md](docs/BRAND_PENDING.md).

## Operating rules
- Work on a branch and never push to `main` directly. Do not open a PR unless asked.
- Before finishing any change, run `npm run lint`, `npm run typecheck`, `npm test` and `npm run build`. Report real results.
- Do NOT add a CMS, database, authentication, ecommerce engine, analytics or new dependencies without explicit approval.
- Do not go beyond the approved direction in `docs/DESIGN_SYSTEM.md`: no new brand colours, fonts, claims, category wording or invented assets (never draw a bottle). Use `AssetPlaceholder` / marked placeholders until approved material is provided. Copy marked DRAFT is not approved.
- Never copy anything from the IronJ repo into GlowJ except neutral technical code: no IronJ copy, colours, assets, J-device, motion language or category wording.
- All visible copy lives in `src/content/{vi,en}/`, not in components. Both languages share the `Dictionary` type in `src/content/types.ts`.
- Use semantic design tokens only (`src/app/globals.css`); never raw colours in components. Keep motion slow and reduced-motion safe.
- "Mix bù khoáng rạng ngời" is GlowJ's Vietnamese-only category phrase; never render it in the English locale.
- The official logo and droplet in `brand-assets/official/` are the single source of truth (used by `GlowJLogo.tsx` and `public/images/glowj-droplet.webp`). Never redraw, reinterpret, distort, recolour or approximate them; build effects around them.
- **Do NOT reveal the GlowJ bottle or packaging on Stage 1 / Coming Soon routes** (no bottle image, silhouette or recognisable packaging treatment). Keep bottle references out of `public/`.
- Server Components by default; `"use client"` only when interactivity requires it.
- Stage and features: `src/config/stage.ts`, `src/config/features.ts`. Indexing: `src/config/seo.ts` (off until approved go-live).
- Bilingual routes `/vi` and `/en` (`[locale]` segment); `/` redirects temporarily to `/vi`. No i18n library.
- Lead consent: `draft-0` is a placeholder. Nothing goes live on `drinkglowj.com` with a draft consent version or without production secrets being set deliberately.
- Claims review is a pre-publish gate: never publish unreviewed claims to production.

## Commands
`npm run dev` · `npm run lint` · `npm run typecheck` · `npm test` · `npm run build`

## Docs
- [docs/SITE_ARCHITECTURE.md](docs/SITE_ARCHITECTURE.md): structure, i18n, SEO, lead capture, deployment
- [docs/DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md): approved visual system, tokens, motion
- [docs/STAGES.md](docs/STAGES.md): stages and feature flags
- [docs/BRAND_PENDING.md](docs/BRAND_PENDING.md): what is still awaiting approval
