/**
 * The single switch for which phase of the business the site is in.
 * See docs/STAGES.md before changing this.
 */
export const STAGES = ["coming-soon", "crowdfunding", "launch"] as const;

export type Stage = (typeof STAGES)[number];

export const stage: Stage = "coming-soon";
