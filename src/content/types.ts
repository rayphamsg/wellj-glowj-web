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
    /** The last word of `headline`, set in coral (including its full stop). */
    headlineAccent: string;
    /**
     * Manual line breaks (presentation only). Each set, joined with spaces, must equal `headline`.
     * `wide` is used from the desktop breakpoint, `narrow` below it.
     */
    headlineLines: { wide: string[]; narrow: string[] };
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
