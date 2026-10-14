"use client";

import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { stage } from "@/config/stage";
import { site } from "@/content/site";
import { CURRENT_CONSENT_VERSION } from "@/lib/lead-capture/consent";
import { HONEYPOT_FIELD, buildSubmission, postSubmission, type LeadLocale } from "@/lib/lead-capture/netlify-forms";

type SignupFormProps = {
  /** Which language the visitor is using. Stored with the lead. */
  locale: LeadLocale;
  /** Where on the site this form sits, e.g. "hero". Only used to keep element ids unique. */
  placement: string;
  /** All visible text is supplied by the caller (src/content). */
  label: string;
  submitLabel: string;
  /** Short consent/privacy notice under the strip. Version: src/lib/lead-capture/consent.ts. */
  consentNotice: string;
  successMessage: string;
  errorMessages: {
    invalid: string;
    unavailable: string;
  };
  /** Shown only after Netlify accepted the submission, below the confirmation (the optional Zalo step). */
  successSlot?: ReactNode;
};

type FormState = { status: "idle" } | { status: "pending" } | { status: "success" } | { status: "error"; reason: "invalid" | "unavailable" };

const initial: FormState = { status: "idle" };

// Set once: where the lead came from and which stage it was collected in.
const source = new URL(site.url).hostname;

/**
 * Stage 1 signup. The visitor's number is validated in the browser and posted to Netlify Forms
 * (src/lib/lead-capture/netlify-forms.ts; the blueprint in public/__forms.html is for detection). Success is shown only
 * after Netlify accepts the submission.
 *
 * Presentation (docs/DESIGN_SYSTEM.md section 14): a flat strip sitting in the liquid. Visible
 * label, no placeholder, square corners, ink CTA. On success the strip is replaced by an ink bar
 * and the page's fill level responds (set via the data-signup attribute; see globals.css).
 */
export function SignupForm({
  locale,
  placement,
  label,
  submitLabel,
  consentNotice,
  successMessage,
  errorMessages,
  successSlot,
}: SignupFormProps) {
  const [state, setState] = useState<FormState>(initial);
  // Controlled: the typed number stays visible on every error and while pending, so the visitor can
  // retry at once. It is only dropped when the success bar replaces the strip.
  const [contact, setContact] = useState("");
  const pending = state.status === "pending";
  const inputId = `contact-${placement}`;
  const noticeId = `consent-${placement}`;
  const errorId = `error-${placement}`;
  const success = state.status === "success";
  const error = state.status === "error";
  const errorText = state.status === "error" ? (state.reason === "invalid" ? errorMessages.invalid : errorMessages.unavailable) : "";

  // Restrained signup response: the page raises the liquid a little and adds one halo ring (CSS reacts to this).
  useEffect(() => {
    if (success) document.documentElement.setAttribute("data-signup", "success");
  }, [success]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return; // one submission at a time

    // Honeypot: real visitors leave this hidden field empty. A bot that filled it sends nothing.
    if (new FormData(event.currentTarget).get(HONEYPOT_FIELD)) {
      setState({ status: "error", reason: "unavailable" });
      return;
    }
    const submission = buildSubmission(contact, { locale, source, campaign: stage, consentVersion: CURRENT_CONSENT_VERSION });
    if (!submission) {
      setState({ status: "error", reason: "invalid" });
      return;
    }

    setState({ status: "pending" });
    const result = await postSubmission(submission);
    setState(result.ok ? { status: "success" } : { status: "error", reason: "unavailable" });
  }

  return (
    <>
      <form onSubmit={onSubmit}>
        {/* Netlify's honeypot (named in public/__forms.html): hidden from people, filled by bots. */}
        <input type="text" name={HONEYPOT_FIELD} tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />

        {!success && (
          <>
            <div className="signup-lead">
              <label htmlFor={inputId} className="block text-sm font-semibold">
                {label}
              </label>
            </div>
            <div className="mt-2 flex flex-col lg:flex-row">
              <input
                id={inputId}
                name="contact"
                type="tel"
                inputMode="tel"
                autoComplete="tel-national"
                value={contact}
                onChange={(event) => setContact(event.target.value)}
                required
                aria-describedby={error ? `${noticeId} ${errorId}` : noticeId}
                aria-invalid={error && state.status === "error" && state.reason === "invalid" ? true : undefined}
                className="min-h-14 w-full min-w-0 border-0 border-b-[3px] border-transparent bg-air px-5 text-lg font-medium text-ink caret-ink focus-visible:outline-offset-[-3px] aria-[invalid=true]:border-ink lg:flex-1"
              />
              <Button type="submit" disabled={pending} className="w-full lg:w-auto">
                {submitLabel}
              </Button>
            </div>
            <p id={noticeId} className="mt-3 max-w-[60ch] text-[13px] font-normal leading-[1.45]">
              {consentNotice}
            </p>
          </>
        )}

        {/* One persistent live region: it announces the success bar or the error message. */}
        <div role="status" aria-live="polite">
          {success && <p className="signup-success bg-ink px-5 py-4 text-[17px] font-semibold uppercase tracking-[0.04em] text-air">{successMessage}</p>}
          {error && (
            <p id={errorId} className="mt-3 text-[15px] font-semibold">
              <span aria-hidden="true">! </span>
              {errorText}
            </p>
          )}
        </div>
      </form>
      {success && successSlot}
    </>
  );
}
