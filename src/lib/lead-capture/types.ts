/** Where a lead can come from / be sent. Add new channels here. */
export type LeadChannel = "email" | "zalo" | "messenger" | "haravan";

/** Site languages. Matches the /vi and /en routes. */
export type LeadLocale = "vi" | "en";

export type LeadPayload = {
  /**
   * The contact in its canonical form: an E.164 phone number such as
   * "+84912345678" for Zalo, or a trimmed email address. This is the
   * deduplication key. Treat it as unverified contact data, not identity.
   */
  contact: string;
  /** Exactly what the visitor typed (trimmed). Kept for support and audits. */
  contactRaw: string;
  channel: LeadChannel;
  locale: LeadLocale;
  /** Which site the lead came from, e.g. "drinkglowj.com". Set on the server. */
  source: string;
  /** Which campaign or stage, e.g. "coming-soon". Set on the server. */
  campaign: string;
  /** When the visitor submitted after seeing the consent notice (ISO 8601, UTC). */
  consentAt: string;
  /** Which version of the consent notice that visitor was shown. */
  consentVersion: string;
};

export type LeadResult =
  /** `duplicate` is for logs and tests only; the visitor always just sees success. */
  | { ok: true; duplicate?: boolean }
  | { ok: false; reason: "not-configured" | "invalid" | "failed" };

/** A provider connection. Implement this to connect a real provider. */
export type LeadAdapter = {
  name: string;
  submit(lead: LeadPayload): Promise<LeadResult>;
};
