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
  it("no copy from another brand is present", () => {
    const text = JSON.stringify([vi, en]).toLowerCase();
    assert.ok(!text.includes("ironj"));
    assert.ok(!text.includes("bù khoáng"));
  });
});
