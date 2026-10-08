# GlowJ Design System (Stage 1)

Approved direction for the Coming Soon phase. Tokens live in `src/app/globals.css`; components use token names only, never raw colours.

## Brand frame
- **Category:** GlowJ — Mix bù khoáng rạng ngời (Vietnamese only; English uses "Natural hydration for active women.").
- **Positioning:** premium natural hydration for active women. Territory: hydration × mineral replenishment × beauty wellness. Progression: hydration → mineral replenishment → freshness → radiance → glow.
- **Personality:** fresh · premium · feminine · active · modern · radiant. Feminine but not girly; beauty-wellness but not cosmetic; active but not hardcore sport.
- **Never:** a beauty miracle drink, supplement-looking, pink soft drink, fruit juice, hardcore sports drink, or a recolour of another WellJ brand.

## Colour (semantic tokens)
| Token | Value | Use |
|---|---|---|
| `paper` | `#fbf6ef` | Dominant base (cream) |
| `surface` | `#fffdf9` | Raised surfaces, inputs (warm white) |
| `ink` | `#35192b` | Text (deep plum), 14.7:1 on paper |
| `muted` | `#6e5163` | Secondary text, 6.5:1 |
| `line` | `#ebddd0` | Hairlines |
| `brand` | `#f27b68` | Glow Coral fills; `brand-contrast` (plum) text on it is 5.9:1 |
| `brand-strong` | `#b63a27` | Coral for small text / focus rings, 5.4:1 |
| `glow-strong` | `#d9503c` | Large display use only (the J, headline accent), 3.8:1 |
| `glow`, `blush`, `champagne` | soft tints | Decorative light only, never text |
| `plum` | `#4a2540` | Premium anchor for large dark areas (reserved) |

Avoid candy pink, neon, black-heavy layouts, salon or fruit-juice looks.

## Typography
- **Display:** Fraunces (editorial serif, with optical size and soft axes), light weight; one italic coral accent word per headline. Token: `font-display`, size `text-display`, support line `text-lead`.
- **Body/UI:** Plus Jakarta Sans. Token: `font-sans`.
- Both load via `next/font/google` (self-hosted at build, no runtime request) and include Vietnamese.
- No script beauty fonts, no condensed or aggressive sport faces.

## Spacing, surfaces, shape
`py-section` is the vertical rhythm; `rounded-card` (1.75rem) for cards and `rounded-full` for inputs and buttons. `surface-glass` is the frosted-warm-white surface (blur + warm tinted glow shadow). Shadows are warm and tinted (`shadow-soft`, `shadow-glow`), never grey.

## Brand device
Faceted droplet (gem geometry) with refracted coral and champagne light, small satellite droplets and ripples beneath: `GlowDroplet`, over the soft diffusion field `RefractionField`. The coral J is the signature (`Wordmark`). This is abstract artwork, **not a bottle or product render**.

## Motion
Flow, light, ripple, diffusion: slow liquid drift (`motion-drift`, 22–38 s), gentle float (`motion-float`), soft ripple (`motion-ripple`), slow staggered reveal (`motion-reveal`), refracted-light sheen (`motion-sheen`). Easing `--ease-flow`. All motion is wrapped in `prefers-reduced-motion: no-preference`; reduced-motion visitors see the static composition. Avoid aggressive wipes, fast kinetic type, cyberpunk glow, bubble/gas effects.

## Layout
Website mode: airy, editorial, generous whitespace, little copy. Stage 1 is a single focused hero (droplet above copy on mobile; two columns from `lg`), no extra sections.

## Photography (not yet in repo)
Women about 30–50, natural dewy skin, lifestyle (pickleball, pilates, yoga, golf, light gym, cycling, outdoor/social wellness); pickleball is a cue, not the identity. Product shots: light condensation, translucent light, refraction, cream/coral/champagne light; premium hydration, not pink juice.
