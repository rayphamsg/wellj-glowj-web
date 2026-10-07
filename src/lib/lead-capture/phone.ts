/**
 * Vietnamese mobile phone normalization. No imports, so it is easy to test.
 *
 * Accepts the ways people actually type a number ("0912 345 678",
 * "+84 912 345 678", "84912345678", "0084912345678", "+84 (0)912345678",
 * "912345678") and returns the canonical "+84" + 9 digits, or null.
 *
 * Mobile only: the 9 digits after +84 must start with 3, 5, 7, 8 or 9.
 * Landlines, retired 11-digit numbers and non-Vietnamese numbers are rejected.
 */

const ALLOWED_CHARS = /^[0-9+\s().-]+$/;
const MAX_INPUT_LENGTH = 32;
const NATIONAL_MOBILE = /^[35789]\d{8}$/;

export function normalizeVietnamesePhone(input: string): string | null {
  const raw = input.trim();
  if (raw.length === 0 || raw.length > MAX_INPUT_LENGTH) return null;
  if (!ALLOWED_CHARS.test(raw)) return null;
  // A "+" is only valid as the very first character.
  if (raw.lastIndexOf("+") > 0) return null;

  const digits = raw.replace(/\D/g, "");
  let national: string;

  if (raw.startsWith("+")) {
    if (!digits.startsWith("84")) return null;
    national = digits.slice(2);
  } else if (digits.startsWith("0084")) {
    national = digits.slice(4);
  } else if (digits.startsWith("84") && digits.length === 11) {
    national = digits.slice(2);
  } else if (digits.startsWith("0")) {
    national = digits.slice(1);
  } else {
    national = digits;
  }

  // "+84 (0)912..." style: drop the redundant trunk zero after the country code.
  if (national.length === 10 && national.startsWith("0")) national = national.slice(1);

  return NATIONAL_MOBILE.test(national) ? `+84${national}` : null;
}
