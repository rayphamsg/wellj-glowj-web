"use server";

import { isEnabled } from "@/config/features";
import { stage } from "@/config/stage";
import { site } from "@/content/site";
import { getLeadAdapter } from "./adapters";
import { processSubmission, type SignupState } from "./process";

export async function submitLead(_prev: SignupState, formData: FormData): Promise<SignupState> {
  return processSubmission(formData, {
    // Set on the server, never taken from the form.
    source: new URL(site.url).hostname,
    campaign: stage,
    waitlistEnabled: isEnabled("waitlist"),
    adapter: getLeadAdapter(),
    now: () => new Date(),
  });
}
