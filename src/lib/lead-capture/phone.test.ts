import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { normalizeVietnamesePhone } from "./phone.ts";

describe("normalizeVietnamesePhone", () => {
  const valid: Array<[string, string]> = [
    ["0912345678", "+84912345678"],
    ["  0912345678  ", "+84912345678"],
    ["091 234 5678", "+84912345678"],
    ["0912.345.678", "+84912345678"],
    ["0912-345-678", "+84912345678"],
    ["+84912345678", "+84912345678"],
    ["+84 912 345 678", "+84912345678"],
    ["+84 (0)912345678", "+84912345678"],
    ["84912345678", "+84912345678"],
    ["0084912345678", "+84912345678"],
    ["912345678", "+84912345678"],
    ["0352345678", "+84352345678"],
    ["0562345678", "+84562345678"],
    ["0772345678", "+84772345678"],
    ["0852345678", "+84852345678"],
  ];

  for (const [input, expected] of valid) {
    it(`accepts ${JSON.stringify(input)} as ${expected}`, () => {
      assert.equal(normalizeVietnamesePhone(input), expected);
    });
  }

  const invalid: Array<[string, string]> = [
    ["", "empty"],
    ["   ", "blank"],
    ["abc", "letters"],
    ["0912abc678", "letters inside"],
    ["12345", "too short"],
    ["091234567", "one digit short"],
    ["09123456789", "one digit long"],
    ["0112345678", "retired 01x prefix"],
    ["0212345678", "landline (02x)"],
    ["0412345678", "04x is not a mobile prefix"],
    ["+6591234567", "Singapore number"],
    ["+14155552671", "US number"],
    ["+84+912345678", "plus in the middle"],
    ["0912345678; DROP TABLE", "unsafe characters"],
    ["=1+1", "formula text"],
    ["0912345678".repeat(5), "far too long"],
  ];

  for (const [input, why] of invalid) {
    it(`rejects ${JSON.stringify(input.slice(0, 24))} (${why})`, () => {
      assert.equal(normalizeVietnamesePhone(input), null);
    });
  }

  it("gives the same key for every way of writing the same number", () => {
    const keys = new Set(["0912345678", "+84 912 345 678", "84912345678", "0912.345.678"].map(normalizeVietnamesePhone));
    assert.equal(keys.size, 1);
  });
});
