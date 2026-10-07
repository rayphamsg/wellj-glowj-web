import { isKnownConsentVersion } from "./consent.ts";
import { normalizeVietnamesePhone } from "./phone.ts";
import type { LeadAdapter, LeadChannel, LeadLocale, LeadResult } from "./types.ts";

export type SignupState =
  | { status: "idle" }
  | { status: "success" }
  | { status: "error"; reason: Exclude<LeadResult, { ok: true }>["reason"] };

/** Server-controlled values and collaborators. Never taken from the browser. */
export type ProcessContext = {
  /** e.g. "drinkglowj.com" */
  source: string;
  /** The current stage, e.g. "coming-soon". */
  campaign: string;
  waitlistEnabled: boolean;
  adapter: LeadAdapter;
  now: () => Date;
};

const CHANNELS: readonly LeadChannel[] = ["email", "zalo", "messenger", "haravan"];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const LOCALES: readonly LeadLocale[] = ["vi", "en"];

/**
 * Validation + normalization for a signup. Pure apart from the adapter call,
 * so it is unit-tested without Next.js. See src/lib/lead-capture/actions.ts.
 */
export async function processSubmission(formData: FormData, ctx: ProcessContext): Promise<SignupState> {
  // Honeypot: real visitors leave this hidden field empty. Bots get a fake success.
  if (formData.get("company")) return { status: "success" };
  if (!ctx.waitlistEnabled) return { status: "error", reason: "not-configured" };

  const raw = String(formData.get("contact") ?? "").trim();
  const channel = String(formData.get("channel") ?? "zalo") as LeadChannel;

  if (!CHANNELS.includes(channel) || raw.length === 0 || raw.length > 200) {
    return { status: "error", reason: "invalid" };
  }

  // Canonical contact. For Zalo this is the +84 number, normalized on the
  // server; the browser's formatting is never trusted.
  let contact = raw;
  if (channel === "email" && !EMAIL_RE.test(raw)) return { status: "error", reason: "invalid" };
  if (channel === "zalo") {
    const phone = normalizeVietnamesePhone(raw);
    if (!phone) return { status: "error", reason: "invalid" };
    contact = phone;
  }

  // A missing or unknown version means the notice was not shown: store nothing.
  const consentVersion = String(formData.get("consentVersion") ?? "");
  if (!isKnownConsentVersion(consentVersion)) return { status: "error", reason: "failed" };

  const submittedLocale = String(formData.get("locale") ?? "");
  const locale: LeadLocale = (LOCALES as readonly string[]).includes(submittedLocale) ? (submittedLocale as LeadLocale) : "vi";

  try {
    const result = await ctx.adapter.submit({
      contact,
      contactRaw: raw,
      channel,
      locale,
      source: ctx.source,
      campaign: ctx.campaign,
      consentAt: ctx.now().toISOString(),
      consentVersion,
    });
    return result.ok ? { status: "success" } : { status: "error", reason: result.reason };
  } catch {
    return { status: "error", reason: "failed" };
  }
}
