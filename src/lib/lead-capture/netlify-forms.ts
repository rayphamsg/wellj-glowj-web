import { normalizeVietnamesePhone } from "./phone.ts";

/**
 * Stage 1 lead inbox: Netlify Forms. No database, no secrets, no server code.
 *
 * Netlify detects the form from the static blueprint `public/__forms.html` at deploy time (it exists
 * only for that). The visible React form (components/sections/SignupForm.tsx) posts the same fields
 * to a normal site path, "/", with `fetch`: Netlify's documented AJAX pattern for forms rendered by
 * JavaScript. Success is only reported when Netlify answers directly with a 2xx. Redirects are not
 * followed: "/" is redirected to "/vi" by the app itself, and following that redirect would land the
 * POST on a page that answers 200 without any submission having been stored. Nothing here fakes success.
 *
 * The field names are plain snake_case so a CSV export from Netlify can be mapped into Haravan later.
 * This module has no framework imports, so it is unit-tested with `node --test`.
 */

/** Must equal the blueprint form's `name` in public/__forms.html. */
export const FORM_NAME = "glowj-coming-soon";

/** Where submissions are POSTed: a normal site path. The blueprint file is only for build-time detection. */
export const FORM_ENDPOINT = "/";

/** Netlify's native spam trap: named in the blueprint's `netlify-honeypot` attribute. */
export const HONEYPOT_FIELD = "bot-field";

/** Everything Netlify stores for a lead, in export order (besides Netlify's own created_at). */
export const FORM_FIELDS = ["phone_raw", "phone_normalized", "locale", "source", "campaign", "consent_at", "consent_version"] as const;

export type LeadLocale = "vi" | "en";

export type LeadContext = {
  locale: LeadLocale;
  /** Which site, e.g. "drinkglowj.com". */
  source: string;
  /** Which stage or campaign, e.g. "coming-soon". */
  campaign: string;
  /** The version of the consent notice that was on screen (src/lib/lead-capture/consent.ts). */
  consentVersion: string;
  now?: () => Date;
};

export type LeadFields = Record<"form-name" | typeof HONEYPOT_FIELD | (typeof FORM_FIELDS)[number], string>;

/**
 * The exact payload for Netlify. Returns null when the typed number is not a Vietnamese mobile number,
 * so an invalid number never leaves the browser.
 */
export function buildLeadFields(rawInput: string, ctx: LeadContext, honeypot = ""): LeadFields | null {
  const phone_raw = rawInput.trim();
  const phone_normalized = normalizeVietnamesePhone(phone_raw);
  if (!phone_normalized) return null;
  return {
    "form-name": FORM_NAME,
    [HONEYPOT_FIELD]: honeypot,
    phone_raw,
    phone_normalized,
    locale: ctx.locale,
    source: ctx.source,
    campaign: ctx.campaign,
    consent_at: (ctx.now ?? (() => new Date()))().toISOString(),
    consent_version: ctx.consentVersion,
  };
}

export function encodeFields(fields: LeadFields): string {
  return new URLSearchParams(fields).toString();
}

export type SubmitResult = { status: "success" } | { status: "error"; reason: "invalid" | "unavailable" };

const TIMEOUT_MS = 10_000;

/** Validate, post to Netlify, and report honestly: success only when Netlify accepted the submission. */
export async function submitLead(
  rawInput: string,
  ctx: LeadContext,
  honeypot = "",
  fetchImpl: typeof fetch = (input, init) => fetch(input, init),
): Promise<SubmitResult> {
  const fields = buildLeadFields(rawInput, ctx, honeypot);
  if (!fields) return { status: "error", reason: "invalid" };

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const response = await fetchImpl(FORM_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: encodeFields(fields),
      redirect: "manual", // a redirect means the POST was not handled as a form submission: not success
      signal: controller.signal,
    });
    return response.ok ? { status: "success" } : { status: "error", reason: "unavailable" };
  } catch {
    return { status: "error", reason: "unavailable" };
  } finally {
    clearTimeout(timer);
  }
}
