# Stages and Feature Flags

## Stages
Set in `src/config/stage.ts`:
| Stage | Purpose |
|---|---|
| `coming-soon` | Pre-launch: build awareness, collect leads |
| `crowdfunding` | Campaign: pre-orders and progress |
| `launch` | Full product launch: buy now |

## Feature flags
Defined in `src/config/features.ts`. Each flag works independently:
| Flag | Controls |
|---|---|
| `waitlist` | Lead capture (email / Zalo / Messenger / Haravan) |
| `preorder` | Pre-order entry points |
| `campaignProgress` | Crowdfunding progress display |
| `buyNow` | Direct purchase entry points |

Each stage sets defaults for the flags. To change one flag without changing stage, add it to `overrides` (e.g. `{ waitlist: false }`).

Use in code: `if (isEnabled("waitlist")) { ... }`. Components for a disabled feature must render nothing.

## Moving between stages
1. Confirm the narrative and copy for the new stage exist in `src/content/`.
2. Change `stage` in `src/config/stage.ts`.
3. Adjust `overrides` if the defaults are not what you want.
4. Run lint, typecheck and build, then check the Vercel preview before merging.

Flags only control what shows; they do not wire up providers. Preorder and buy-now need a real checkout destination (e.g. Haravan or a crowdfunding platform), which is a separate approved task.
