import { stage, type Stage } from "./stage";

/**
 * Independent feature flags. Each can be switched on or off on its own,
 * regardless of stage. See docs/STAGES.md.
 */
export type FeatureFlags = {
  /** Lead capture (email / Zalo / Messenger / commerce platform). */
  waitlist: boolean;
  /** Pre-order entry points. */
  preorder: boolean;
  /** Crowdfunding progress display. */
  campaignProgress: boolean;
  /** Direct purchase entry points. */
  buyNow: boolean;
};

export type FeatureName = keyof FeatureFlags;

/** What each stage turns on by default. */
const stageDefaults: Record<Stage, FeatureFlags> = {
  "coming-soon": { waitlist: true, preorder: false, campaignProgress: false, buyNow: false },
  crowdfunding: { waitlist: true, preorder: true, campaignProgress: true, buyNow: false },
  launch: { waitlist: false, preorder: false, campaignProgress: false, buyNow: true },
};

/**
 * Manual overrides on top of the stage defaults.
 * Example: `{ waitlist: false }` hides the waitlist without changing stage.
 */
const overrides: Partial<FeatureFlags> = {};

export const features: FeatureFlags = { ...stageDefaults[stage], ...overrides };

export function isEnabled(name: FeatureName): boolean {
  return features[name];
}
