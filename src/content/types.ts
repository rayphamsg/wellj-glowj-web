import type { SignupCopy } from "./signup-copy";

/**
 * Shape every locale dictionary must satisfy. A missing key in either
 * language fails `npm run typecheck`.
 */
export type Dictionary = {
  meta: { title: string; description: string };
  header: { languageSwitchLabel: string };
  home: {
    /** Small caps line above the headline. */
    eyebrow: string;
    /** Full headline. */
    headline: string;
    /** The part of `headline` set in the italic accent. Must be a substring of it. */
    headlineAccent: string;
    support: {
      /** Short moments, shown as one flowing line. */
      moments: string[];
      body: string;
    };
    /** Category line shown with the signup. */
    category: string;
  };
  signup: SignupCopy;
};
