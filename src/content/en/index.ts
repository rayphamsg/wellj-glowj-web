import type { Dictionary } from "../types";

/**
 * Stage 1 Coming Soon copy (English), written natively. Headline, support,
 * category, field and CTA are approved. The consent notice and the
 * success/error messages are DRAFT microcopy, not yet approved: replace them
 * when the final wording is provided (and add a new consent version; see
 * src/lib/lead-capture/consent.ts).
 */
export const en: Dictionary = {
  meta: {
    title: "GlowJ — Natural hydration for active women",
    description: "Natural hydration for active women. Hydrate your glow. Coming soon.",
  },
  header: { languageSwitchLabel: "Tiếng Việt" },
  home: {
    eyebrow: "COMING SOON",
    headline: "Hydrate Your Glow.",
    headlineAccent: "Glow",
    support: {
      moments: ["A busy day.", "A pickleball match.", "A workout.", "An afternoon in the heat."],
      body: "Your body loses more water and minerals than you notice. GlowJ helps you replenish in a more natural way — so you can stay fresh and radiant.",
    },
    category: "Natural hydration for active women.",
  },
  bottleAlt: "GlowJ bottle",
  signup: {
    label: "Your Zalo number",
    placeholder: "Your Zalo number",
    submitLabel: "Tell me when GlowJ launches",
    // DRAFT, not approved.
    consentNotice: "By submitting your Zalo number, you agree to be contacted by GlowJ about the launch.",
    // DRAFT, not approved.
    successMessage: "Thank you. GlowJ will message you when it launches.",
    errorMessages: {
      // DRAFT, not approved.
      invalid: "That Zalo number doesn't look right. Please check it and try again.",
      // DRAFT, not approved.
      unavailable: "We couldn't send that just now. Please try again in a few minutes.",
    },
  },
};
