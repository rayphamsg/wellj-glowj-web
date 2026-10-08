# GlowJ Design System — Stage 1 Coming Soon: "THE FILL LINE"

**Status: APPROVED and IMPLEMENTED (Stage 1).**
This document is the single source of truth for the Stage 1 Coming Soon page. It replaces every earlier Coming Soon direction (soft ambient light, floating droplet with reflection, glass card, bottle hero), none of which remains in the code. See **§22 Implementation notes** for the file map and the (few) deliberate deviations.

**Design principle (use it to judge every decision):**
> If it couldn't be screen-printed in mineral white, coral and black and still read as a drink filling up, it doesn't belong on the page.

---

## 0. Brand frame and fixed constraints

- **Positioning:** premium hydration drink for active women. **Hydration first, glow second.** Glow is the *result* of replenishment and freshness, never a cosmetic effect. Mental territory: hydration → mineral replenishment → freshness → radiance → glow.
- **Audience:** women about 28–50 (sweet spot 30–45), urban, health- and appearance-conscious, active lifestyle (pickleball, pilates, yoga, light gym, golf, cycling, light running).
- **GlowJ is NOT:** IronJ for women, a beauty supplement, skincare, spa, a pink soft drink, fruit juice, or a hardcore sports drink.
- **Target feeling:** fresh / mineral / beverage / modern FMCG. **Not:** warm wellness / editorial / spa / "AI-premium".
- **Official assets are immutable** (`brand-assets/official/`, see `brand-assets/README.md`):
  - Logo: the official stacked glowJ logo, used as-is via `src/components/brand/GlowJLogo.tsx` (vector paths and colours unchanged). Size by height only.
  - Droplet: the official droplet, `public/images/glowj-droplet.webp`. Never redraw, recolour, re-saturate, distort, displace, rotate, blur, glow, shadow, float or animate it.
- **Absolutely no bottle or packaging reveal in Stage 1:** no bottle image, silhouette, outline, glass, or recognisable label/packaging layout (never stack "glow" over J over droplet like the label; never show pack legends such as volume). Bottle references stay out of `public/`.
- **Approved copy is unchanged** (`src/content/vi`, `src/content/en`). Typography may set it on manual line breaks; it may not reword it. Consent and success/error microcopy remain DRAFT.

---

## 1. Big idea

The screen is a container being filled. One hard, flat, horizontal **fill line** crosses the full viewport. **Above: mineral-white "air"** with black type. **Below: flat official coral "liquid"** — the drink. The official droplet **crosses the surface**: its upper part stays in the air, its lower part is seen *through* the liquid, as if the mix were dissolving into water. Above the surface, a printed halftone halo radiates from the droplet: glow, after hydration.

---

## 2. Colour system (flat, graphic; three colours)

| Token (suggested) | Hex | Role |
|---|---|---|
| `air` | **`#F7FAF9`** | Neutral-cool mineral white. Page above the line, input fill. |
| `air` fallback | `#FFFDFC` | **Only** if visual testing proves `#F7FAF9` too cold. |
| `coral` | **`#EF4650`** | Official coral. Liquid field, liquid veil, halo dots, headline accent word. |
| `ink` | **`#0B1212`** | Ink black (official wordmark black). All text, CTA block, rules, focus rings. |

- **Never use** warm cream, beige, ivory, bone, parchment, sand, or warm "Claude/Anthropic-style" off-white for the air.
- **Removed from Stage 1:** plum (black carries the premium anchor), `glow`, `blush`, `champagne`, `clear`/water tint, any pink or lighter coral tint.
- **No hydration tint.** Hydration is carried by the fill line, not by colour.
- **No gradients.** The only translucency is the functional liquid veil (§6).

---

## 3. Composition

### Desktop (reference 1440×900)
- **Fill line** at **58% of viewport height** (~522px), full bleed edge to edge (not container-limited).
- **Floor rule (all breakpoints):** the line never sits higher than *bottom of the air content + 32px*. Zoomed text, short or landscape screens push the line down; type never collides with liquid.
- **Grid:** 12 columns in a 1200–1280px container.
- **Logo:** top-left, column 1, in an 80px header.
- **Eyebrow:** ~60px below the header, column 1.
- **Headline:** columns 1–8 (≤ ~820px), 2 lines; its last baseline ~100px above the fill line.
- **Category line:** directly under the headline (~32px gap), still in the air.
- **Droplet:** height **66vh** (~594px); centre at ~74% of viewport width; its right edge extends **6–8% of its own width** beyond the container's right edge (a slight viewport crop at ≤ 1440px). The line crosses it at **58% of its own height**. Its apex aligns roughly with the headline cap height. Text never overlaps the droplet.
- **Below the line, columns 1–6:** form strip starting 40px under the line → consent → moments → body (the body may sit at or just past the fold).
- **Intentional negative space:** air between category line and fill line; air above the droplet (top-right); coral to the right of the form, under the submerged droplet. Never fill these.

### Tablet (820×1180 portrait)
- Fill line at **56%**, floor rule applies.
- Headline: 3 lines, columns 1–7 (breaks in §8).
- Droplet: **44vw** wide, anchored right, cropped ~10% by the right edge, crossing the line at 58% of its height; its upper part sits in the air to the right of the (short) headline lines. No text/droplet overlap.
- Below the line: form strip **≤ 58% width**, left, never in front of the submerged droplet; then moments and body at the same width.
- Landscape tablet uses desktop rules.

### Mobile (390×844) — exact vertical order
1. Header, 64px: logo left, language switch right.
2. Eyebrow, 24px below the header.
3. Headline, 3 lines (~166px at 56px).
4. Category line, left, **≤ 58% width** (wraps to 2 lines), beside the droplet apex in the air on the right.
5. **Fill line at ~51–54% of the first viewport** (~430–455px) → coral coverage **46–49%** (§4). Floor rule applies.
6. Droplet: **44vw** (~172px) wide, anchored right, **cropped 15–20%** by the right edge; ~58% of its height above the line, the rest below.
7. In the coral: the visible field label (left, beside the submerged droplet band) → input (full width) → CTA (full width). **CTA bottom edge ≤ ~670px** — visible without scrolling.
8. Consent.
9. Below the fold: moments → body → footer (on coral).

**Why mobile stays a poster:** the first screen is one image — air on top, coral below, the droplet breaking the surface at the edge, text left vs droplet right. Never a stack of padded sections.

---

## 4. Coral coverage (first viewport)

| Viewport | Coral | Air |
|---|---|---|
| Desktop | **38–42%** | 58–62% |
| Tablet | **42–46%** | 54–58% |
| Mobile | **46–49%** (never above 50% unless layout integrity requires it) | 51–54% |

How this prevents the "pink soft drink" read: air always sits on top and holds the biggest type; coral never surrounds the headline or logo; everything on coral is **black**; the coral is flat, matte, never highlighted, never tinted pink; mineral white (not warm cream) keeps the pairing fresh and beverage-like.

---

## 5. The fill line

- **Thickness: 0px.** The line is the hard top edge of the coral field, not a stroke. No feather, no shadow.
- **Meniscus:** one **2px air-coloured highlight line, 4px below the edge, at 45% opacity**. This is the only "wet" detail on the page.
- **Capillary rise:** where the surface meets the droplet, the coral edge curves **up 6–8px (desktop) / 4px (mobile)** over ~24px on each side, like water against a surface. This is what makes it read as liquid, not a section divider.
- **At rest:** perfectly horizontal.
- **Motion allowance:** idle swell **≤ 3px**, one wavelength across the full viewport, 7s period. Optional scroll tilt **≤ 1.5°** (see §13).
- **Must NOT look like:** a wave illustration, ocean, sine squiggle, ripple rings, gooey blob edge, gradient horizon, glossy jelly, drop shadow, or a generic website section divider.

---

## 6. Official droplet

- **Size:** desktop 66vh tall; tablet 44vw wide; mobile 44vw wide; never under 160px wide.
- **Crop:** right edge only, 6–20% of its width (viewport/container crop). Never crop the apex; never crop through the lower node.
- **Relation to the line:** the line always crosses at **58% of its height** (allowed 55–62%). Never floating above the line, never fully submerged.
- **Dissolve (layer order, bottom → top):** coral field → droplet (untouched) → **liquid veil** → meniscus.
  - **Liquid veil:** official coral at **55–65% opacity**, clipped to below the fill line only. The submerged lattice lines and dots stay visible but softened, "seen through liquid"; the silhouette edge nearly disappears.
  - **Colour mismatch** between the droplet's own coral and `#EF4650` is resolved by the veil: everything below the surface is tinted by the same coral layer. This is a scene effect; the asset is unchanged.
- **Forbidden:** redrawing, recolouring, re-saturating, distortion (including any sideways "refraction offset" of the submerged half), rotation, blur, glow, drop shadow, float/bobbing, idle animation. **The droplet is static; the liquid moves around it.**

---

## 7. Halftone halo (supporting system only)

- **Where:** one halo **in the air**, radiating from the droplet's dry upper part. Nowhere else; **never on the coral**; clipped at the fill line.
- **Maximum coverage:** radius ~0.75 × droplet height; ≤ 12% of the air area.
- **Dot scale:** pitch locked to the asset — **pitch = 4.2% of the displayed droplet width** (~20px desktop), same 45° staggered grid as the droplet's halftone. Dots nearest the droplet use the asset's own dot radius (~15% of pitch) and shrink to 0 at the halo edge (ease-out).
- **Colour:** official coral dots on air (light, not shadow).
- **Not generative particles:** fixed grid locked to the droplet; no random size/position/colour; no per-dot motion; no cursor interaction; no blur, no glow. It must read as print.
- **Future extension:** the same halo + pitch rule for social tiles and OOH around the droplet; printed halo walls for activations; at the Stage 2 reveal, the halo surrounds the product as it breaks the same fill line.

---

## 8. Typography

- **Primary:** **Be Vietnam Pro** (Vietnamese-first; correct stacked diacritics ể ổ ờ ạ; weights 100–900; Google Fonts). One family; contrast from weight and scale only.
- **Backup:** Plus Jakarta Sans ExtraBold (already integrated; Vietnamese subset; slightly rounder/less dense).
- **Dropped:** Montserrat display; Black (900) weight.
- **Headline personality: beauty × hydration.** The sentence is Be Vietnam Pro **Bold (700)**, upright and modern; the coral accent word ("tươi." / "Glow.") is **Fraunces SemiBold Italic (600)**, an elegant high-contrast serif with full Vietnamese support (horns and stacked marks verified). The beauty feeling comes from the contrast between the bold modern sans and the serif accent. This is the **only** serif/italic on the site (approved founder exception, pinned by a test). Accent set at 1.08em for optical size match, +0.04em optical gap before it, +0.04em right padding for the italic overhang. Not sport, spa, skincare luxury, handwritten or wedding/editorial: no script, no other serif, no italic elsewhere, no outline/3D type.
- **Headline scale:** mobile 390: 52–58px · tablet 820: 84–92px · desktop 1440: 124–132px · cap 144px; fluid between.
- **Line-height:** VI **1.04** (stacked marks and below-dots must never collide; verify at max size) · EN **0.98**.
- **Tracking:** VI **−0.02em** · EN **−0.03em** (sans); accent −0.005em.
- **Manual line breaks** (bold = official coral, including the full stop; everything else ink):

| | Desktop | Tablet / mobile |
|---|---|---|
| VI | `Bù lại để` / `luôn` **`tươi.`** | `Bù lại` / `để luôn` / **`tươi.`** |
| EN | `Hydrate` / `Your` **`Glow.`** | `Hydrate` / `Your` / **`Glow.`** |

- **Eyebrow** ("SẮP RA MẮT" / "COMING SOON"): SemiBold 13px, caps, tracking +0.2em, ink, preceded by a 24×2px ink rule.
- **Category line:** Bold, 22px desktop / 17px mobile, sentence case, ink, preceded by a **40×3px ink bar** (pack-legend logic). VI only: "GlowJ — Mix bù khoáng rạng ngời."; EN: "Natural hydration for active women." Never render the Vietnamese phrase in English.
- **Moments:** SemiBold 22px desktop / 19px mobile, line-height 1.3, ink on coral. Desktop: each sentence on its own line (four beats).
- **Body:** Medium 18px desktop / 16px mobile, line-height 1.55, ink, max 46ch.
- **Form:** field label SemiBold 14px ink; input Medium 18px (≥ 16px, no iOS zoom); CTA Bold 17px air on ink; consent Regular 13px, line-height 1.45, max 60ch, ink.

---

## 9. Surfaces

| Treatment | Applies to |
|---|---|
| Flat | Air field, coral field, ink CTA, rules, type |
| Matte | Everything. Nothing has sheen. |
| Transparent | Only the liquid veil over the submerged droplet |
| Glossy | Only the 2px meniscus highlight |
| Textured | Only the halftone halo (and the droplet's own print) |

Banned: shadows, blur, glass, inner glows, noise grain, soft-UI rounded surfaces.

---

## 10. Hydration signal

- **A vessel being filled:** the screen is the container; coral is the drink at a visible level. Drinkability without bottle or glass.
- **An object in liquid:** the submerged droplet seen through the veil; the meniscus climbs its edges. Real surface physics, not decoration.
- **Pour and rise:** the initial pour and the restrained post-signup rise act out filling and replenishing.
- **Category truth:** "Mix" + dissolving = the mineral mix entering water.
- Never: bottle, glass, splash, bubbles, floating droplets, cosmetic glow.

## 11. Glow signal

- The halftone halo appears **only after** the pour completes, and only in the air above the surface: hydrate, then radiate.
- A successful signup adds **one** halo ring (restrained): radiance grows after replenishment.
- "tươi." / "Glow." are the only coloured words, sitting just above the surface.
- No blur, light gradients, sparkles or shimmer. Glow is printed, not lit.

## 12. Active energy

Only through: Bold type at poster scale with hard full stops and a single coral serif-italic accent; the four moments as stacked staccato beats against the long body line; asymmetry (text left, droplet right breaking the frame, unbalanced negative space); the pour's single decisive overshoot; a physical CTA press (2px downward, no colour fade). **No athlete photography in Stage 1.**

---

## 13. Motion (four motions maximum, nothing else)

| Motion | Spec | Limits |
|---|---|---|
| Initial fill | Coral rises from the bottom edge to the line; halo then fades in over 400ms | ≤ 1.1s, one overshoot ≤ 8px, settles once |
| Idle surface | One long, low swell of the line | ≤ 3px, 7s period, paused when the tab is hidden |
| Scroll response (**optional**) | Line tilts with scroll velocity, damps back to level | ≤ 1.5°, back to level within 1.2s. **Omit entirely if it feels gimmicky in testing.** |
| Signup response | Level rises, halo adds one ring | **Restrained:** level +8–10px max, one ring, once, ~900ms. No celebration effects. |

- **Reduced motion:** final state rendered statically (level line, halo visible, no tilt); signup changes the level without animation.
- **Never animated:** the droplet, the logo, the headline (no fade-up reveals), individual halo dots, the background. No loops except the idle swell.

---

## 14. Form / lead capture (behaviour unchanged)

- **A flat strip in the liquid**, not a card. Desktop: `[ input | CTA ]` edge to edge, ~580px × 56px. Mobile: input above CTA, both full width, touching (no gap). **0 radius.**
- **Visible field label** above the strip: "Số Zalo của bạn" / "Your Zalo number", ink on coral. **No placeholder.**
- **Input:** air fill, no border, ink 18px text; focus = inset 3px ink outline.
- **CTA:** ink block, air Bold text. Hover: underline, no colour wash. Press: 2px down.
- **Consent:** ink 13px on coral, directly under the strip.
- **Error:** message under the strip in ink SemiBold with a leading "!", plus a 3px ink underline on the input. **Never red-on-coral** (invisible, colour-only).
- **Success:** the strip is replaced in place by an ink bar carrying the success message in air colour; restrained level rise + one halo ring (§13).
- Lead-capture logic, validation, consent versioning and honeypot do not change.

---

## 15. Header

- Height 80px desktop / 64px mobile; transparent; always on air; **not sticky** (a sticky header would put the coral J on coral).
- **Official logo** as-is: **56px tall desktop / 44px mobile**, grid column 1. The logo never sits on coral.
- **Language switch:** "VI / EN" text, SemiBold 14px, ink; current language ink, other underlined on hover; 44×44px square hit areas; no pill, no border.

---

## 16. Anti-soda guardrails

1. Coral ≤ 45% of the first viewport on desktop/tablet, 46–49% on mobile (never > 50% unless layout integrity requires it). Air always on top.
2. Coral is only `#EF4650`, flat. No tints, no pink, no pastel coral, no gradients.
3. No fizz vocabulary: no bubbles, sparkles, ice, splash, straws, glasses, condensation, fruit (including guava imagery).
4. Text on coral is **ink only**. Never white/air body text on coral.
5. No rounded, bubbly, script, 3D or outline type. No pill buttons.
6. No hearts, stars, emoji, sparkle icons, iridescence, pearl or rose-gold, skin or face close-ups.
7. Motion never springy or playful beyond the single pour overshoot.
8. The second colour is always ink black, never white or pink. Coral + black = mineral; pink + white = candy.
9. Air is neutral-cool mineral white, never warm cream (warm cream + coral drifts toward beauty/juice).

## 17. Anti-AI guardrails

1. No pastel/ambient gradients, no glow blobs. The background is two flat fields.
2. No cards, glassmorphism, blur or soft drop shadows anywhere.
3. No floating/bobbing object, no reflection under the droplet, no ripple rings.
4. No left/right split hero, no centred hero object. Composition is top/bottom with an off-axis crop.
5. Corner radius is 0 everywhere. The only curves belong to the official logo and droplet.
6. No fade-up text, staggered reveals, parallax or cursor-follow effects.
7. Every motion must change the liquid's level or surface; otherwise delete it.
8. No serif/italic anywhere except the single sanctioned headline accent word (§8). Never a second serif, never italic body or labels, never script.
9. Asymmetry is mandatory. If the layout mirrors cleanly, it is wrong.
10. No over-softened composition: hard edges, committed scale, real negative space.

---

## 18. Accessibility

| Pair | Ratio | Rule |
|---|---|---|
| Ink on air `#F7FAF9` | 18.0:1 | All air-zone text |
| Ink on coral | **5.1:1** | All coral-zone text, including 13px consent (AA) |
| Air on ink | 18.0:1 | CTA text, success bar |
| Coral on air | 3.53:1 | **Only** the headline accent word (≥ 54px, Fraunces SemiBold Italic) |
| Air on coral | 3.53:1 | **Never for text.** Meniscus line only |

(With the fallback air `#FFFDFC`: ink 18.7:1, coral 3.66:1; same rules.)

- **Minimum sizes:** 13px consent/footer; 16px mobile body; 18px input.
- **Focus:** 3px ink outline, 3px offset, on every control (≥ 3:1 non-text contrast on air and coral).
- **Form:** visible label programmatically linked; errors announced (aria-live) and never colour-only; touch targets ≥ 48px.
- **Decorative layers** (fill line, veil, meniscus, halo) hidden from assistive tech; droplet `alt=""`; the logo carries the accessible brand name.
- **Zoom/landscape:** the fill-line floor rule keeps text out of the liquid at 200% zoom and on landscape phones.
- **Reduced motion:** §13.

---

## 19. Implementation complexity

- **Pure CSS:** grid/layout, colours, type, header, form strip, coral field, liquid veil (clipped layer), pour animation, reduced-motion fallbacks, content-driven floor for the line.
- **SVG:** surface edge with meniscus highlight and idle swell (one wide path translated via CSS); the two capillary-rise pieces attached to the droplet's container so they move with it; the halftone halo generated once on the server as a static SVG scaled with the droplet so its pitch stays locked.
- **Client JS (small, isolated):** the optional scroll tilt (one passive listener + rAF, disabled under reduced motion); the signup-success signal that raises the level and adds the halo ring (a CSS variable or class set from the existing form's success state).
- **Do NOT build:** WebGL/canvas water, interactive dot fields, device-motion "shake", parallax, cursor effects, Lottie/video, time-of-day theming, scroll-jacking, preloaders, droplet displacement/refraction.

---

## 20. Final visual hierarchy (first read → last)

1. Headline, with coral "tươi." / "Glow."
2. The droplet breaking the surface, with the air/coral division
3. The ink CTA block in the liquid
4. Category line ("GlowJ — Mix bù khoáng rạng ngời." / "Natural hydration for active women.")
5. Official logo
6. Eyebrow
7. Halftone halo (felt more than read)
8. Moments (four beats)
9. Body
10. Consent
11. Language switch, footer

---

## 21. Final design principle

> If it couldn't be screen-printed in mineral white, coral and black and still read as a drink filling up, it doesn't belong on the page.

---

## 22. Implementation notes

**File map**

| Concern | File |
|---|---|
| Tokens (three colours), stage geometry, liquid layers, type, motion | `src/app/globals.css` |
| Page composition (air above, liquid below) | `src/app/[locale]/page.tsx` |
| Coral field, capillary rise, official droplet, halo, veil | `src/components/fill/FillLine.tsx` |
| Headline with manual breaks per breakpoint | `src/components/fill/Headline.tsx` |
| Official logo (unchanged paths and colours) | `src/components/brand/GlowJLogo.tsx` (via `layout/Wordmark.tsx`) |
| Header, language switch, footer | `src/components/layout/*` |
| Form strip (lead-capture logic untouched) | `src/components/sections/SignupForm.tsx`, `ui/Button.tsx` |
| Halo generator (static output, committed) | `scripts/generate-halo.mjs` -> `public/images/glowj-halo.svg`, `glowj-halo-ring.svg` |
| Guardrail tests | `src/brand.test.ts`, `src/content/content.test.ts` |

**Guardrails are enforced by tests** (`npm test` fails if any of these reappear in `src/`): gradients, backdrop/glass, shadows, blur, italic or serif outside the single sanctioned headline accent (pinned to `layout.tsx`, `globals.css` `.headline-accent` and `Headline.tsx`), retired fonts, rounded corners, warm off-whites, white, any colour other than the three approved, any bottle/packaging file or reference, any alteration of the droplet image.

**Geometry as built.** The stage is plain flow layout: `.air-zone` (min-height 52.5 / 56 / 58 svh, content-driven, so the floor rule holds by construction) above `.liquid`. The fill line is the top edge of `.liquid`; the droplet box is anchored to it and shifted up by 58% of its own height. Verified (VI and EN): coral share of the first viewport is 48% at 390x844 and 46-48% at 360x740, 44% on tablet, 42% at 1440x900 (shorter desktop windows get less, never more, because of the floor rule); the mobile CTA ends at ~666px; no horizontal overflow at any tested size.

**Deliberate deviations from this spec**

1. **Scroll tilt omitted** (it was optional). No scroll listener or client motion code exists.
2. **Idle swell is a slosh, not a travelling wave:** the liquid layers rotate +-0.14 degrees about a pivot under the droplet (about +-2.8px at the far edges of a 1440px screen, ~0 at the droplet). It meets the "<= 3px, 7s period" limit and keeps the capillary rise and the veil locked to the droplet, which a travelling wave could not.
3. **Droplet placement on desktop** follows the "right edge 7% beyond the content column" rule; its centre lands at about 78% of the viewport width at 1440 (the spec also said ~74%; the two statements disagree, and the edge rule keeps the headline clear).
4. **Halo coverage:** the 12% limit is read as printed dot coverage, not region area. The halo keeps the 0.75 x droplet-height radius but its dots shrink with a squared falloff so it is felt more than read, and it is cut off 0.25 droplet-widths left of the droplet so neither it nor the signup ring ever reaches the text column.
5. **Veil at 65%** (top of the 55-65% range) so the submerged silhouette nearly disappears.
6. **Mobile category line:** its 40px rule sits above the text (not beside it) so it wraps to two lines at 66% width.
7. **Form strip is stacked (input over CTA) below 1024px**, including tablet, because 58% of a tablet is too narrow for a side-by-side strip; from 1024px it is `[input | CTA]`.
8. **Content shape:** `headlineAccent` is now the last word including its full stop ("tuoi." / "Glow."), `headlineLines` carries the manual breaks, and the unused `placeholder` key was removed. The approved copy itself is unchanged.
9. **Signup response** is driven by a `data-signup` attribute that the form's success state sets on `<html>` (a one-line effect); CSS does the rest.
10. **"Paused when the tab is hidden"** relies on the browser pausing off-screen CSS animation; no JavaScript is used.
