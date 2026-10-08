# GlowJ Design System (Stage 1)

Approved direction for the Coming Soon phase. Tokens live in `src/app/globals.css`; components use token names only, never raw colours.

## Brand frame
- **Category:** GlowJ — Mix bù khoáng rạng ngời (Vietnamese only; English uses "Natural hydration for active women.").
- **Positioning:** premium natural hydration for active women. **Hydration first, glow second.** Glow comes from replenishment, freshness and natural hydration, not from a cosmetic or spa look. Territory: hydration × mineral replenishment × beauty wellness.
- **Personality:** fresh · premium · feminine · active · modern · radiant.
- **Never:** spa, skincare, cosmetics, beauty supplement, a pink soft drink, fruit juice, a hardcore sports drink, or a recolour of another WellJ brand.

## Source of truth: the official assets
The official GlowJ logo and droplet are the **single source of truth** (`brand-assets/official/`). They supersede every earlier extracted, recreated or inferred version. Never redraw, reinterpret, distort, recolour or approximate them.
- **Logo:** `src/components/brand/GlowJLogo.tsx` carries the official vector paths and colours unchanged (stacked "glow" over the coral J), sized by height only. The header uses it via `Wordmark`.
- **Droplet:** `public/images/glowj-droplet.webp` is the official droplet (the supplied 1396×1712 transparent file; only the empty margin was trimmed and the size reduced). It is the primary hero brand device, shown unaltered.
- **No bottle in Stage 1:** the bottle mockup is authoritative for future product work but must **not** appear on the Coming Soon routes: no bottle image, silhouette or recognisable packaging treatment. Keep bottle references outside `public/`.
- **Official coral:** `#ef4650` (logo J and droplet nodes).

## Colour (semantic tokens)
| Token | Value | Use |
|---|---|---|
| `paper` | `#fffaf4` | Dominant base: cream |
| `surface` | `#fffdf9` | Cards, inputs |
| `ink` | `#35192b` | Text (deep plum) |
| `muted` | `#6e5163` | Secondary text |
| `line` | `#ebddd0` | Hairlines |
| `brand` | `#ef4650` | Glow Coral, the official logo coral (fills) |
| `brand-strong` | `#b62233` | Coral for small text / focus rings, 6.2:1 |
| `glow-strong` | `#d93a48` | Large display use only (headline accent) |
| `plum` | `#4a2540` | Category label, dark anchor |
| `clear` | `#dcedf2` | Clear, cool water light: freshness only, never text or brand fill |
| `glow`, `blush`, `champagne` | soft tints | Decorative light only |

Avoid blush-wash backgrounds, candy pink, neon and black-heavy layouts.

## Typography
- **Display:** Montserrat (heavy geometric sans, the voice of the label's type), extra-bold, tight tracking. Token `font-display`.
- **Accent:** Fraunces italic, used only for the single coral headline accent ("luôn tươi" / "Glow"). Token `font-accent`.
- **Body/UI:** Plus Jakarta Sans. Token `font-sans`.
- All load via `next/font/google` (self-hosted at build) and include Vietnamese. No script fonts, no condensed sport faces.

## Hero visual
`HeroVisual.tsx`: the official droplet, unaltered, floating just above clear water. The hydration feeling is built **around** it, never by changing it:
- **Transparency and depth:** soft light/shade overlays clipped to the droplet's own silhouette (light from upper left, deeper lower right) and a thin cool rim.
- **Refraction:** a pale cool band of light passes slowly through the liquid body; light pools and drifts at the base.
- **Water:** a rippled reflection beneath (SVG turbulence displacement; static if reduced motion), slow ripple rings, a soft shadow and a restrained coral glow.
- **Light:** clear, cool light behind (`clear`), faint shafts of light, cream stays dominant.
Not spa, skincare or cosmetic; not a gem or a serum drop; no bottle.

## Motion
Flow, light, ripple, diffusion; slow. `motion-float` (the droplet, 10 s) with `droplet-reflection` mirroring it, `motion-ripple` (9 s), `droplet-refract` (light through the body), `droplet-caustic` (light at the base), `motion-reveal`, `motion-drift` (background). All wrapped in `prefers-reduced-motion: no-preference`; reduced-motion visitors see the static composition. Avoid aggressive wipes, fast kinetic type, cyberpunk glow, bubble/gas effects.

## Layout
Airy, little copy, one focused hero (droplet above copy on mobile; two columns from `lg`). Hierarchy: eyebrow, headline, category label (plum pill: the product definition, not form helper text), lifestyle moments, supporting sentence, then a compact signup card (input, CTA, consent only).

## Photography (not yet in repo)
Women about 30–50, natural dewy skin, lifestyle (pickleball, pilates, yoga, golf, light gym, cycling, outdoor/social wellness); pickleball is a cue, not the identity. Product shots: light condensation, translucent light, refraction; premium hydration, not pink juice.
