/**
 * Versions of the consent/privacy notice shown next to the signup button.
 *
 * The form posts the version of the notice it displayed; the server records
 * it with the lead (`consent_version`) next to `consent_at`, so each lead can
 * be traced to the exact wording that was on screen.
 *
 * Rules:
 * - Add a new entry whenever the notice wording changes. Never reuse or edit one.
 * - Keep a note of what each version said in docs/SITE_ARCHITECTURE.md.
 * - The last entry is the version the form shows now.
 *
 * PLACEHOLDER: "draft-0" is not reviewed wording. The final GlowJ notice and
 * version are set after approval and before production launch.
 */
export const CONSENT_VERSIONS = ["draft-0"] as const;

export const CURRENT_CONSENT_VERSION: string = CONSENT_VERSIONS[CONSENT_VERSIONS.length - 1];

export function isKnownConsentVersion(value: string): boolean {
  return (CONSENT_VERSIONS as readonly string[]).includes(value);
}
