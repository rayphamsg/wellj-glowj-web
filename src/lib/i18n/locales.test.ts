import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { DEFAULT_LOCALE, isLocale, LOCALES, otherLocale } from "./locales.ts";

describe("locales", () => {
  it("supports exactly vi and en, defaulting to vi", () => {
    assert.deepEqual([...LOCALES], ["vi", "en"]);
    assert.equal(DEFAULT_LOCALE, "vi");
  });
  it("rejects unknown locales", () => {
    for (const bad of ["", "fr", "VI", "vi/", "../en"]) assert.equal(isLocale(bad), false);
    assert.equal(isLocale("vi"), true);
    assert.equal(isLocale("en"), true);
  });
  it("switches to the other locale", () => {
    assert.equal(otherLocale("vi"), "en");
    assert.equal(otherLocale("en"), "vi");
  });
});
