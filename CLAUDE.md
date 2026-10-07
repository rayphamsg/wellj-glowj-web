# CLAUDE.md — GlowJ website

Official site for **GlowJ by WellJ** at `https://drinkglowj.com`. GlowJ is a **separate brand from IronJ**; only the technical foundation is shared in pattern. The maintainer is a non-technical founder: explain changes in plain language and keep them small.

## Current status
**Technical foundation only.** Brand strategy, design system and Coming Soon copy are under Marketing Director review. Everything brand-facing is a placeholder marked `PENDING`. See [docs/BRAND_PENDING.md](docs/BRAND_PENDING.md).

## Operating rules
- Work on a branch and never push to `main` directly. Do not open a PR unless asked.
- Before finishing any change, run `npm run lint`, `npm run typecheck`, `npm test` and `npm run build`. Report real results.
- Do NOT add a CMS, database, authentication, ecommerce engine, analytics or new dependencies without explicit approval.
- Never invent GlowJ branding, copy, claims, colours, fonts, motion, category positioning or assets. Use `AssetPlaceholder` / `PENDING` values until approved material is provided.
- Never copy anything from the IronJ repo into GlowJ except neutral technical code: no IronJ copy, colours, assets, J-device, motion language or category wording.
- All visible copy lives in `src/content/{vi,en}/`, not in components. Both languages share the `Dictionary` type in `src/content/types.ts`.
- Use semantic design tokens only (`src/app/globals.css`); never raw colours in components. Current token values are neutral placeholders, not a design.
- Server Components by default; `"use client"` only when interactivity requires it.
- Stage and features: `src/config/stage.ts`, `src/config/features.ts`. Indexing: `src/config/seo.ts` (off until approved go-live).
- Bilingual routes `/vi` and `/en` (`[locale]` segment); `/` redirects temporarily to `/vi`. No i18n library.
- Lead consent: `draft-0` is a placeholder. Nothing goes live on `drinkglowj.com` with a draft consent version or without production secrets being set deliberately.
- Claims review is a pre-publish gate: never publish unreviewed claims to production.

## Commands
`npm run dev` · `npm run lint` · `npm run typecheck` · `npm test` · `npm run build`

## Docs
- [docs/SITE_ARCHITECTURE.md](docs/SITE_ARCHITECTURE.md): structure, i18n, SEO, lead capture, deployment
- [docs/STAGES.md](docs/STAGES.md): stages and feature flags
- [docs/BRAND_PENDING.md](docs/BRAND_PENDING.md): what is awaiting approval
