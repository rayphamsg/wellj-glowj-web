// Browser check for the Zalo field: the number the visitor typed must stay visible after an
// "invalid" or "unavailable" response, and the retry must work without retyping.
//
// Run against a deployment WITHOUT lead-capture secrets (a valid number then returns "unavailable"):
//   npm run build && npm start        # in one terminal
//   BASE_URL=http://localhost:3000 npm run test:e2e
// Needs Playwright (not a project dependency): set PLAYWRIGHT_MODULE to its path, and CHROMIUM_PATH
// if its browser is not installed in the default place.
import assert from "node:assert/strict";

const base = process.env.BASE_URL ?? "http://localhost:3000";
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ?? "playwright");
const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(`${base}/vi`, { waitUntil: "networkidle" });
  const input = page.locator("#contact-hero");
  const submit = page.locator("button[type=submit]");
  const message = (re) =>
    page.waitForFunction((s) => new RegExp(s).test(document.querySelector("[role=status]")?.textContent ?? ""), re.source, { timeout: 15000 });

  // The pending phase can be shorter than a Playwright round trip, so watch for it inside the page.
  await page.evaluate(() => {
    const field = document.querySelector("#contact-hero");
    const button = document.querySelector("button[type=submit]");
    window.__pending = [];
    new MutationObserver(() => {
      if (button.disabled) window.__pending.push(field.value);
    }).observe(button, { attributes: true, attributeFilter: ["disabled"] });
  });
  await input.fill("0912 345 678");
  await submit.click();
  await message(/chưa gửi được/);
  const pending = await page.evaluate(() => window.__pending);
  assert.ok(pending.length > 0, "submit must be disabled while pending");
  assert.ok(pending.every((v) => v === "0912 345 678"), "value must stay visible while pending");
  await message(/chưa gửi được/);
  await page.waitForTimeout(300);
  assert.equal(await input.inputValue(), "0912 345 678", "value must stay after provider unavailable");

  await submit.click(); // immediate retry, nothing retyped
  await message(/chưa gửi được/);
  await page.waitForTimeout(300);
  assert.equal(await input.inputValue(), "0912 345 678", "value must stay after a retry");

  await input.fill("0912 345");
  await submit.click();
  await message(/chưa đúng/);
  await page.waitForTimeout(300);
  assert.equal(await input.inputValue(), "0912 345", "value must stay after an invalid number");
  assert.equal(await input.getAttribute("aria-invalid"), "true");

  const style = await input.evaluate((e) => ({ color: getComputedStyle(e).color, caret: getComputedStyle(e).caretColor, bg: getComputedStyle(e).backgroundColor }));
  assert.deepEqual(style, { color: "rgb(11, 18, 18)", caret: "rgb(11, 18, 18)", bg: "rgb(247, 250, 249)" });
  console.log("ok: the Zalo field keeps the typed number; ink text and caret on the air field");
} finally {
  await browser.close();
}
