import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";

const form = readFileSync(join(process.cwd(), "src/components/sections/SignupForm.tsx"), "utf8");
const input = form.match(/<input\s+id=\{inputId\}[\s\S]*?\/>/)?.[0] ?? "";

/**
 * Regression: React 19 empties a form's uncontrolled fields after every action, so a visitor whose valid
 * number got "unavailable" (or whose typo got "invalid") saw an empty field and had to retype.
 * The field is controlled, so the entered number stays until the success bar replaces the strip.
 * The browser-level proof is `npm run test:e2e` (scripts/e2e-signup-input.mjs); node has no DOM here,
 * so this pins the implementation that makes it pass.
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
  });

  it("has phone semantics and visible ink text with an ink caret on the air field", () => {
    assert.match(input, /type=\{isEmail \? "email" : isPhone \? "tel" : "text"\}/);
    assert.match(input, /inputMode=\{isEmail \? "email" : isPhone \? "tel" : undefined\}/);
    assert.match(input, /isPhone \? "tel-national"/);
    assert.ok(!/placeholder/.test(input), "no placeholder: the label is always visible");
    assert.match(input, /bg-air[^"]*text-ink[^"]*caret-ink/);
  });
});
