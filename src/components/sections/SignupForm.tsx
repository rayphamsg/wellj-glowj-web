"use client";

import { useActionState } from "react";
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
  /** All visible text is supplied by the caller (see docs/CONTENT_GUIDE.md). */
  label: string;
  placeholder: string;
  submitLabel: string;
  /** Short consent/privacy notice shown next to the button. Version: src/lib/lead-capture/consent.ts. */
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
 * Styling is intentionally minimal until the design phase.
 */
export function SignupForm({
  channel = "zalo",
  locale,
  placement,
  label,
  placeholder,
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

  return (
    <form action={action} className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
      <input type="hidden" name="channel" value={channel} />
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="consentVersion" value={CURRENT_CONSENT_VERSION} />
      {/* Honeypot field; hidden from people, filled by bots. */}
      <input type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
      <label className="sr-only" htmlFor={inputId}>
        {label}
      </label>
      <input
        id={inputId}
        name="contact"
        type={isEmail ? "email" : isPhone ? "tel" : "text"}
        inputMode={isEmail ? "email" : isPhone ? "tel" : undefined}
        autoComplete={isEmail ? "email" : isPhone ? "tel" : "off"}
        required
        placeholder={placeholder}
        aria-describedby={noticeId}
        className="min-h-11 flex-1 rounded-md border border-line px-3 text-base"
      />
      <Button type="submit" disabled={pending}>
        {submitLabel}
      </Button>
      <p id={noticeId} className="text-sm text-muted sm:basis-full">
        {consentNotice}
      </p>
      <p role="status" aria-live="polite" className="text-sm sm:basis-full">
        {state.status === "success" && successMessage}
        {state.status === "error" && (state.reason === "invalid" ? errorMessages.invalid : errorMessages.unavailable)}
      </p>
    </form>
  );
}
