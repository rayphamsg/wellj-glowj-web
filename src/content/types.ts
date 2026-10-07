import type { SignupCopy } from "./signup-copy";

/**
 * Shape every locale dictionary must satisfy. A missing key in either
 * language fails `npm run typecheck`.
 */
export type Dictionary = {
  /** PENDING APPROVAL: all strings below are placeholders from the technical foundation. */
  meta: { title: string; description: string };
  header: { languageSwitchLabel: string };
  home: { heading: string; body: string };
  footer: { note: string };
  signup: SignupCopy;
};
