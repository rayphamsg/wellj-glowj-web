import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";

const form = readFileSync(join(process.cwd(), "src/components/sections/SignupForm.tsx"), "utf8");
const input = form.match(/<input\s+id=\{inputId\}[\s\S]*?\/>/)?.[0] ?? "";

/**
 * Regression: a visitor whose valid number got "unavailable" (or whose typo got "invalid") must keep
 * seeing what they typed and be able to retry at once. The field is controlled, so the entered number
 * stays until the success bar replaces the strip. The browser-level proof is `npm run test:e2e`
 * (scripts/e2e-signup-input.mjs); node has no DOM here, so this pins the implementation that makes it pass.
 */
describe("Zalo field keeps what the visitor typed", () => {
  it("is a controlled input (value + onChange), never defaultValue or a form reset", () => {
    assert.ok(input.length > 0, "contact input not found");
    assert.match(input, /value=\{contact\}/);
    assert.match(input, /onChange=\{\(event\) => setContact\(event\.target\.value\)\}/);
    assert.ok(!/defaultValue/.test(form), "defaultValue would be reset by React's form reset");
    assert.ok(!/\.reset\(|requestFormReset/.test(form), "never reset the form by hand");
  });

  it("only drops the value when the success bar replaces the strip", () => {
    assert.match(form, /\{!success && \(/);
    assert.ok(!/setContact\(""\)/.test(form), "the value must not be cleared in code");
  });

  it("blocks duplicate submits while pending", () => {
    assert.match(form, /<Button type="submit" disabled=\{pending\}/);
    assert.match(form, /if \(pending\) return;/);
  });

  it("shows success only from the result of the Netlify submission, never optimistically", () => {
    assert.match(form, /const result = await submitLead\(/);
    assert.match(form, /setState\(result\);/);
    assert.equal((form.match(/status: "success"/g) ?? []).length, 1, "only the type declaration may mention a success state");
  });

  it("posts to Netlify Forms with its honeypot and the stage, source and consent version", () => {
    assert.match(form, /<form onSubmit=\{onSubmit\}>/);
    assert.match(form, /name=\{HONEYPOT_FIELD\}/);
    assert.match(form, /campaign: stage/);
    assert.match(form, /consentVersion: CURRENT_CONSENT_VERSION/);
    assert.match(form, /new URL\(site\.url\)\.hostname/);
  });

  it("has phone semantics and visible ink text with an ink caret on the air field", () => {
    assert.match(input, /type="tel"/);
    assert.match(input, /inputMode="tel"/);
    assert.match(input, /autoComplete="tel-national"/);
    assert.ok(!/placeholder/.test(input), "no placeholder: the label is always visible");
    assert.match(input, /bg-air[^"]*text-ink[^"]*caret-ink/);
  });
});
