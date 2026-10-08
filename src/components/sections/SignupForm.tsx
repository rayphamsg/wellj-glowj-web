"use client";

import { useActionState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { submitLead } from "@/lib/lead-capture/actions";
import type { SignupState } from "@/lib/lead-capture/process";
import { CURRENT_CONSENT_VERSION } from "@/lib/lead-capture/consent";
import type { LeadChannel, LeadLocale } from "@/lib/lead-capture/types";

type SignupFormProps = {
  /** Which kind of contact this form collects. */
  channel?: LeadChannel;
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
};

const initial: SignupState = { status: "idle" };

/**
 * Provider-agnostic signup. It only talks to `submitLead`; which provider
 * receives the lead is decided in src/lib/lead-capture/adapters.ts.
 *
 * Presentation (docs/DESIGN_SYSTEM.md section 14): a flat strip sitting in the liquid. Visible
 * label, no placeholder, square corners, ink CTA. On success the strip is replaced by an ink bar
 * and the page's fill level responds (set via the data-signup attribute; see globals.css).
 * The lead-capture behaviour is unchanged.
 */
export function SignupForm({
  channel = "zalo",
  locale,
  placement,
  label,
  submitLabel,
  consentNotice,
  successMessage,
  errorMessages,
}: SignupFormProps) {
  const [state, action, pending] = useActionState(submitLead, initial);
  const isEmail = channel === "email";
  const isPhone = channel === "zalo";
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

  return (
    <form action={action}>
      <input type="hidden" name="channel" value={channel} />
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="consentVersion" value={CURRENT_CONSENT_VERSION} />
      {/* Honeypot field; hidden from people, filled by bots. */}
      <input type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />

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
              type={isEmail ? "email" : isPhone ? "tel" : "text"}
              inputMode={isEmail ? "email" : isPhone ? "tel" : undefined}
              autoComplete={isEmail ? "email" : isPhone ? "tel" : "off"}
              required
              aria-describedby={error ? `${noticeId} ${errorId}` : noticeId}
              aria-invalid={error && state.status === "error" && state.reason === "invalid" ? true : undefined}
              className="min-h-14 w-full min-w-0 border-0 border-b-[3px] border-transparent bg-air px-5 text-lg font-medium text-ink focus-visible:outline-offset-[-3px] aria-[invalid=true]:border-ink lg:flex-1"
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
        {success && <p className="bg-ink px-5 py-4 text-[17px] font-semibold text-air">{successMessage}</p>}
        {error && (
          <p id={errorId} className="mt-3 text-[15px] font-semibold">
            <span aria-hidden="true">! </span>
            {errorText}
          </p>
        )}
      </div>
    </form>
  );
}
