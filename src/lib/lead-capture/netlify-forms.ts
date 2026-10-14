import { normalizeVietnamesePhone } from "./phone.ts";

/**
 * Stage 1 lead inbox: Netlify Forms. No database, no secrets, no server code.
 *
 * Same pattern as the working DrinkIronJ site (wellj-ironj-web, src/lib/lead-capture/netlify-form.ts):
 *  - public/__forms.html is a static "blueprint" form. Netlify reads it at build time to learn that
 *    the form `glowj-coming-soon` exists and which fields it has. A test keeps it in step with this file.
 *  - The page never posts a real <form>. The browser sends the fields with fetch() to FORM_ENDPOINT
 *    (the blueprint file, which Netlify's form handling answers), so the visitor stays on the page.
 *  - Netlify answers a stored submission with a redirect to its success page. The redirect is not
 *    followed and counts as success. Any other non-2xx answer, or a network error, is a failure; on a
 *    host without Netlify Forms (a local server, or a deploy where the form was not detected) the post
 *    fails and the visitor sees the "unavailable" message. Nothing here fakes success.
 *
 * Field names are plain snake_case so a CSV export from Netlify can be mapped into Haravan later.
 * This module has no framework imports, so it is unit-tested with `node --test`.
 */

/** The name Netlify files submissions under. Must match public/__forms.html. */
export const FORM_NAME = "glowj-coming-soon";

/** Where submissions are posted: the blueprint file, which Netlify's form handling answers. */
export const FORM_ENDPOINT = "/__forms.html";

/** Hidden field that people never fill and bots do. Also declared as the form's netlify-honeypot. */
export const HONEYPOT_FIELD = "bot-field";

/** Exactly the fields stored with each lead, in export order (besides Netlify's own timestamp). */
export const SUBMISSION_FIELDS = ["phone_raw", "phone_normalized", "locale", "source", "campaign", "consent_at", "consent_version"] as const;

export type LeadLocale = "vi" | "en";

export type Submission = Record<(typeof SUBMISSION_FIELDS)[number], string>;

export type SubmissionContext = {
  locale: LeadLocale;
  /** Which site the lead came from, e.g. "drinkglowj.com". */
  source: string;
  /** Which campaign or stage, e.g. "coming-soon". */
  campaign: string;
  /** Which version of the consent notice the visitor was shown (src/lib/lead-capture/consent.ts). */
  consentVersion: string;
  /** For tests. Defaults to now. */
  now?: Date;
};

/**
 * Turns what the visitor typed into the submission. Returns null when the number is not a valid
 * Vietnamese mobile number. `phone_raw` is what they typed (trimmed); `phone_normalized` is "+84…".
 */
export function buildSubmission(input: string, context: SubmissionContext): Submission | null {
  const phone_raw = input.trim();
  const phone_normalized = normalizeVietnamesePhone(phone_raw);
  if (!phone_normalized) return null;
  return {
    phone_raw,
    phone_normalized,
    locale: context.locale,
    source: context.source,
    campaign: context.campaign,
    consent_at: (context.now ?? new Date()).toISOString(),
    consent_version: context.consentVersion,
  };
}

/** The urlencoded body Netlify Forms expects: the form name, the fields and the empty honeypot. */
export function encodeSubmission(submission: Submission): string {
  const body = new URLSearchParams();
  body.set("form-name", FORM_NAME);
  for (const field of SUBMISSION_FIELDS) body.set(field, submission[field]);
  body.set(HONEYPOT_FIELD, "");
  return body.toString();
}

export type PostResult = { ok: true } | { ok: false; reason: "failed" };

const TIMEOUT_MS = 10_000;

/**
 * Posts the submission. Never reports success unless Netlify answered: on a host without Netlify Forms
 * (a local server, or a deploy where the form was not detected) the POST fails.
 */
export async function postSubmission(submission: Submission, fetchImpl: typeof fetch = (input, init) => fetch(input, init)): Promise<PostResult> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const response = await fetchImpl(FORM_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: encodeSubmission(submission),
      // Netlify may answer with a redirect to its own success page. Accept it without following.
      redirect: "manual",
      signal: controller.signal,
    });
    // A redirect answer means Netlify accepted the form; anything else not ok is a failure.
    return response.ok || response.type === "opaqueredirect" ? { ok: true } : { ok: false, reason: "failed" };
  } catch {
    return { ok: false, reason: "failed" };
  } finally {
    clearTimeout(timer);
  }
}
