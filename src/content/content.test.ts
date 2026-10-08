import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { en } from "./en/index.ts";
import { vi } from "./vi/index.ts";

/** Flattens an object's keys so both languages can be compared. */
function keys(value: unknown, prefix = ""): string[] {
  if (typeof value !== "object" || value === null) return [prefix];
  return Object.entries(value).flatMap(([k, v]) => keys(v, prefix ? `${prefix}.${k}` : k));
}

describe("content", () => {
  it("vi and en dictionaries have identical keys", () => {
    assert.deepEqual(keys(vi).sort(), keys(en).sort());
  });

  it("headline accents are part of their headline", () => {
    for (const d of [vi, en]) assert.ok(d.home.headline.includes(d.home.headlineAccent));
  });

  it("uses the approved Stage 1 headlines, category and signup copy", () => {
    assert.equal(vi.home.headline, "Bù lại để luôn tươi.");
    assert.equal(en.home.headline, "Hydrate Your Glow.");
    assert.equal(vi.home.category, "GlowJ — Mix bù khoáng rạng ngời.");
    assert.equal(en.home.category, "Natural hydration for active women.");
    assert.equal(vi.signup.label, "Số Zalo của bạn");
    assert.equal(vi.signup.submitLabel, "Nhắn tôi khi GlowJ ra mắt");
    assert.equal(en.signup.label, "Your Zalo number");
    assert.equal(en.signup.submitLabel, "Tell me when GlowJ launches");
  });

  it("keeps the Vietnamese category phrase out of the English locale", () => {
    assert.ok(!JSON.stringify(en).toLowerCase().includes("bù khoáng"));
  });

  it("carries no copy from another brand", () => {
    const text = JSON.stringify([vi, en]).toLowerCase();
    assert.ok(!text.includes("ironj"));
    assert.ok(!text.includes("bù khoáng tự nhiên"));
  });
});
