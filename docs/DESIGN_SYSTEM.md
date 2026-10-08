# GlowJ Design System (Stage 1)

Approved direction for the Coming Soon phase. Tokens live in `src/app/globals.css`; components use token names only, never raw colours.

## Brand frame
- **Category:** GlowJ — Mix bù khoáng rạng ngời (Vietnamese only; English uses "Natural hydration for active women.").
- **Positioning:** premium natural hydration for active women. **Hydration first, glow second.** Glow comes from replenishment, freshness and natural hydration, not from a cosmetic or spa look. Territory: hydration × mineral replenishment × beauty wellness.
- **Personality:** fresh · premium · feminine · active · modern · radiant.
- **Never:** spa, skincare, cosmetics, beauty supplement, a pink soft drink, fruit juice, a hardcore sports drink, or a recolour of another WellJ brand.

## Source of truth: the label
The logo and droplet already exist on the product label and are **core brand assets that must not be redesigned**. The website extends them; it does not reinvent them.
- **Wordmark and J:** `src/components/brand/logo-paths.ts` holds the "glow" wordmark and the coral J, **vectorised from the label artwork** (not redrawn). Replace with the official vector files when supplied. The label stacks "glow" over the J; `Wordmark` is a derived inline arrangement for the header (J at the wordmark's ascender height), to be confirmed against an official horizontal lockup if one exists.
- **Droplet:** `GlowDroplet.tsx` rebuilds the label's geometry from measurements (label coordinates): a round bead (centre 177,475, r 142) whose top is cut by the J's underside with a cream gap; three coral nodes with white rings (two high, one low); the same 13 white edge lines; staggered halftone dots; peach-to-coral gradient. The lower hook of the J is drawn above it, as on the label.
- **Bottle:** `public/images/glowj-bottle.webp` is the approved bottle mockup (clear PET, translucent pink/coral liquid), cut out from the supplied image (its black backdrop removed; shape, label and liquid untouched). It supersedes the earlier yellow/green bottle reference. Never redraw it or change the liquid colour; replace it with approved product photography when available.
- **Colours from the label:** coral `#f46a60`, cream `#fffaf4`, black `#121212` (wordmark only).

## Colour (semantic tokens)
| Token | Value | Use |
|---|---|---|
| `paper` | `#fffaf4` | Dominant base: the label cream |
| `surface` | `#fffdf9` | Cards, inputs |
| `ink` | `#35192b` | Text (deep plum) |
| `muted` | `#6e5163` | Secondary text |
| `line` | `#ebddd0` | Hairlines |
| `brand` | `#f46a60` | Glow Coral, exactly as on the label (fills, the J) |
| `brand-strong` | `#b63a27` | Coral for small text / focus rings |
| `glow-strong` | `#d9503c` | Large display use only (headline accent) |
| `wordmark` | `#121212` | The "glow" wordmark only |
| `plum` | `#4a2540` | Category label, dark anchor |
| `liquid`, `liquid-deep` | pale pink | The drink's own liquid colour (sampled from the bottle: about `#f5afb1`), as soft light only; never text or brand fill |
| `glow`, `blush`, `champagne` | soft tints | Decorative light only |

Avoid blush-wash backgrounds, candy pink, neon and black-heavy layouts.

## Typography
- **Display:** Montserrat (heavy geometric sans, the voice of the label's type), extra-bold, tight tracking. Token `font-display`.
- **Accent:** Fraunces italic, used only for the single coral headline accent ("luôn tươi" / "Glow"). Token `font-accent`.
- **Body/UI:** Plus Jakarta Sans. Token `font-sans`.
- All load via `next/font/google` (self-hosted at build) and include Vietnamese. No script fonts, no condensed sport faces.

## Hero visual
`HeroVisual.tsx`: the real bottle leads, with the living droplet beside it as if lifted off the label, both standing on one clear surface with a contact shadow and pink light cast through the liquid. Fresh pale-liquid light sits behind the pair. The only effect on the bottle is a slow pass of light over its own silhouette.
The droplet (`GlowDroplet.tsx`) is the label's droplet as a living hydration device, not a gem or serum drop:
- **Water-like:** clear and light at the top, deep coral below; rim of light, inner depth, specular highlight, refracted caustic at the base, a few condensation beads.
- **Halftone becomes liquid shimmer:** the printed dots stay; a slow band of light passes through them.
- **Internal flow:** light travels along the white lines between the nodes; nodes breathe.
- **Hydration cue:** a bead forms at the base and drops to the surface with one ripple.

## Motion
Flow, light, ripple, diffusion; slow. `motion-float` (10 s), `motion-pulse` (light along lines), `motion-node`, `motion-shimmer`, `motion-sheen`, `motion-drip` and `motion-surface-ripple` (9 s cycle), `bottle-sheen` (light over the bottle), `motion-reveal`, `motion-drift` (background). All wrapped in `prefers-reduced-motion: no-preference`; reduced-motion visitors see the static composition. Avoid aggressive wipes, fast kinetic type, cyberpunk glow, bubble/gas effects.

## Layout
Airy, little copy, one focused hero (bottle and droplet above copy on mobile; two columns from `lg`). Hierarchy: eyebrow, headline, category label (plum pill: the product definition, not form helper text), lifestyle moments, supporting sentence, then a compact signup card (input, CTA, consent only).

## Photography (not yet in repo)
Women about 30–50, natural dewy skin, lifestyle (pickleball, pilates, yoga, golf, light gym, cycling, outdoor/social wellness); pickleball is a cue, not the identity. Product shots: light condensation, translucent light, refraction; premium hydration, not pink juice.
