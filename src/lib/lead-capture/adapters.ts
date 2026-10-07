import { createGoogleSheetsAdapter, googleSheetsConfigFromEnv } from "./google-sheets-adapter";
import type { LeadAdapter } from "./types";

/** Default: no provider connected. Never pretends a signup succeeded. */
const noopAdapter: LeadAdapter = {
  name: "none",
  async submit() {
    return { ok: false, reason: "not-configured" };
  },
};

let googleSheets: LeadAdapter | null | undefined;

/**
 * The one place a provider gets connected. Today: Google Sheets when its
 * environment variables are set, otherwise the no-op above. To switch to
 * a commerce platform, Zalo, Messenger or an email service, create an adapter file next to
 * this one and return it here. The UI does not change.
 * See docs/SITE_ARCHITECTURE.md.
 */
export function getLeadAdapter(): LeadAdapter {
  if (googleSheets === undefined) {
    const config = googleSheetsConfigFromEnv();
    googleSheets = config ? createGoogleSheetsAdapter(config) : null;
  }
  return googleSheets ?? noopAdapter;
}
