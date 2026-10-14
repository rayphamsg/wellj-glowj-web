// Browser check for the Zalo field and the Netlify Forms submission, against any running build:
//   npm run build && npm start        # in one terminal
//   BASE_URL=http://localhost:3000 npm run test:e2e
// Needs Playwright (not a project dependency): set PLAYWRIGHT_MODULE to its path, and CHROMIUM_PATH
// if its browser is not installed in the default place.
//
// Netlify itself is not involved: the POST to /__forms.html is answered by the test (500, then Netlify's redirect to its success page), so
// it checks the page's behaviour: the typed number stays on every error, retry works without retyping,
// duplicate clicks are blocked while pending, the payload has the right fields, and success is shown
// only after an accepted submission.
import assert from "node:assert/strict";

const base = process.env.BASE_URL ?? "http://localhost:3000";
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ?? "playwright");
const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const posts = [];
  let answer = 500;
  await page.route("**/__forms.html", async (route) => {
    posts.push(route.request().postData());
    await new Promise((r) => setTimeout(r, 400)); // long enough to see the pending state
    if (answer === 303) return route.fulfill({ status: 303, headers: { location: "/" }, body: "" });
    await route.fulfill({ status: answer, contentType: "text/html", body: "" });
  });

  await page.goto(`${base}/vi`, { waitUntil: "networkidle" });
  const input = page.locator("#contact-hero");
  const submit = page.locator("button[type=submit]");
  const status = page.locator("[role=status]");

  // 1. Pending: the number stays, the button is disabled, a second click sends nothing.
  await input.fill("0912 345 678");
  await submit.click();
  await page.waitForFunction(() => document.querySelector("button[type=submit]").disabled);
  assert.equal(await input.inputValue(), "0912 345 678", "value must stay while pending");
  await submit.click({ force: true });
  await page.waitForFunction(() => /chưa gửi được/.test(document.querySelector("[role=status]")?.textContent ?? ""));
  assert.equal(posts.length, 1, "a second click while pending must not send a second submission");

  // 2. Netlify refused: honest error, number kept, immediate retry works.
  assert.equal(await input.inputValue(), "0912 345 678", "value must stay after a failed submission");
  assert.equal(await page.evaluate(() => document.documentElement.getAttribute("data-signup")), null, "no success signal on failure");
  await submit.click();
  await page.waitForFunction(() => document.querySelector("button[type=submit]").disabled);
  await page.waitForFunction(() => !document.querySelector("button[type=submit]").disabled);
  assert.equal(posts.length, 2, "retry without retyping");
  assert.equal(await input.inputValue(), "0912 345 678");

  // 3. Invalid number: error, number kept, nothing sent.
  await input.fill("0912 345");
  await submit.click();
  await page.waitForFunction(() => /chưa đúng/.test(document.querySelector("[role=status]")?.textContent ?? ""));
  assert.equal(posts.length, 2, "an invalid number is never sent");
  assert.equal(await input.inputValue(), "0912 345", "value must stay after an invalid number");
  assert.equal(await input.getAttribute("aria-invalid"), "true");

  // 4. Netlify accepted (it answers with a redirect to its success page): now, and only now, the success bar replaces the strip.
  answer = 303;
  await input.fill("0912 345 678");
  await submit.click();
  await page.waitForFunction(() => /Cảm ơn bạn/.test(document.querySelector("[role=status]")?.textContent ?? ""));
  assert.equal(posts.length, 3);
  assert.equal(await page.locator("#contact-hero").count(), 0, "the strip is replaced by the success bar");
  assert.equal(await page.evaluate(() => document.documentElement.getAttribute("data-signup")), "success");
  assert.ok(await status.isVisible());

  // 5. The payload Netlify receives.
  assert.equal(posts[2], "form-name=glowj-coming-soon&phone_raw=0912+345+678&phone_normalized=%2B84912345678&locale=vi&source=drinkglowj.com&campaign=coming-soon&consent_at=" + new URLSearchParams(posts[2]).get("consent_at").replace(/:/g, "%3A") + "&consent_version=draft-0&bot-field=", "exact body");
  const body = Object.fromEntries(new URLSearchParams(posts[2]));
  assert.equal(body["form-name"], "glowj-coming-soon");
  assert.equal(body.phone_raw, "0912 345 678");
  assert.equal(body.phone_normalized, "+84912345678");
  assert.equal(body.locale, "vi");
  assert.equal(body.source, "drinkglowj.com");
  assert.equal(body.campaign, "coming-soon");
  assert.equal(body.consent_version, "draft-0");
  assert.match(body.consent_at, /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
  assert.equal(body["bot-field"], "");
  assert.deepEqual(Object.keys(body).sort(), ["bot-field", "campaign", "consent_at", "consent_version", "form-name", "locale", "phone_normalized", "phone_raw", "source"]);
  console.log("ok: typed number kept on errors, duplicate clicks blocked, success only after Netlify accepts, payload correct");
} finally {
  await browser.close();
}
