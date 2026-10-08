/** Shape of the signup form copy. Both languages must provide every key. */
export type SignupCopy = {
  /** Visible field label. There is deliberately no placeholder. */
  label: string;
  submitLabel: string;
  /** Short consent/privacy notice next to the button. Its version lives in src/lib/lead-capture/consent.ts. */
  consentNotice: string;
  successMessage: string;
  errorMessages: {
    invalid: string;
    unavailable: string;
  };
};
