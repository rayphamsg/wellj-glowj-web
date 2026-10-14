// Browser check for the after-submit flow: confirmation first, then the optional Zalo step about 0.7s later.
//   npm run build && npm start
//   BASE_URL=http://localhost:3000 npm run test:e2e
// Needs Playwright (not a project dependency): set PLAYWRIGHT_MODULE to its path, and CHROMIUM_PATH if its
// browser is not installed in the default place. Set SHOTS=/some/dir to also save screenshots.
//
// Netlify is answered by the test (a 303 to its success page, like the real thing), so this checks the page.
//
// The Zalo step only exists once site.social.zalo and site.social.zaloQr are both set. By default this
// checks the production-safe state: the confirmation works and NOTHING about Zalo appears. Run with
// EXPECT_ZALO=1 (and the real values in src/content/site.ts) to check the reveal, QR and open-Zalo row.
import assert from "node:assert/strict";

const base = process.env.BASE_URL ?? "http://localhost:3000";
const shots = process.env.SHOTS;
const expectZalo = process.env.EXPECT_ZALO === "1";
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ?? "playwright");
const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});

async function run({ name, width, height, reducedMotion, qr }) {
  const context = await browser.newContext({ viewport: { width, height }, reducedMotion: reducedMotion ? "reduce" : "no-preference" });
  const page = await context.newPage();
  await page.route("**/__forms.html", (route) => route.fulfill({ status: 303, headers: { location: "/" }, body: "" }));
  await page.goto(`${base}/vi`, { waitUntil: "networkidle" });

  // Nothing about Zalo before a successful submission.
  assert.equal(await page.locator(".zalo-reveal").count(), 0, `${name}: no Zalo step before submitting`);
  assert.equal(await page.getByText("Kết nối Zalo").count(), 0);

  await page.fill("#contact-hero", "0912 345 678");
  await page.click("button[type=submit]");
  await page.waitForSelector(".signup-success");
  const t0 = Date.now();

  // The confirmation is there at once, in capitals.
  const confirmation = page.locator(".signup-success");
  assert.equal((await confirmation.textContent()).trim(), "Đã ghi nhận.");
  assert.equal(await confirmation.evaluate((e) => getComputedStyle(e).textTransform), "uppercase");

  const zalo = page.locator(".zalo-reveal");
  if (!expectZalo) {
    // Production-safe state: no Zalo step, no placeholder, no note, now or after the reveal delay would have passed.
    await page.waitForTimeout(1800);
    assert.equal(await zalo.count(), 0, `${name}: no Zalo step without the real link and QR`);
    const text = await page.locator("body").innerText();
    assert.ok(!/Zalo|QR|placeholder|Tuỳ chọn|Optional/i.test(text.replace(/Số Zalo của bạn|Your Zalo number/g, "")), `${name}: no Zalo or placeholder text anywhere`);
    assert.equal(await page.locator("a[href*='zalo']").count(), 0, `${name}: no Zalo link`);
    assert.equal(await page.evaluate(() => document.documentElement.getAttribute("data-signup")), "success", `${name}: the success response still plays`);
    if (shots) await page.screenshot({ path: `${shots}/${name}-success-no-zalo.png` });
    await context.close();
    return;
  }
  await zalo.waitFor({ state: "attached" });
  const opacity = () => zalo.evaluate((e) => Number(getComputedStyle(e).opacity));
  if (reducedMotion) {
    assert.equal(await opacity(), 1, `${name}: reduced motion shows the final state at once`);
    assert.equal(await zalo.evaluate((e) => getComputedStyle(e).animationName), "none");
  } else {
    const early = await opacity();
    assert.ok(early < 0.1, `${name}: the Zalo step has not appeared yet right after the confirmation (opacity ${early})`);
    if (shots) await page.screenshot({ path: `${shots}/${name}-1-confirmation.png` });
    await page.waitForFunction(() => Number(getComputedStyle(document.querySelector(".zalo-reveal")).opacity) > 0.05, null, { timeout: 3000 });
    const appeared = Date.now() - t0;
    assert.ok(appeared > 450 && appeared < 1400, `${name}: the Zalo step appears roughly 0.7s after the confirmation (${appeared} ms)`);
    await page.waitForFunction(() => Number(getComputedStyle(document.querySelector(".zalo-reveal")).opacity) === 1, null, { timeout: 3000 });
  }
  await page.waitForTimeout(1900); // let the success lift and halo ring settle too
  if (shots) await page.screenshot({ path: `${shots}/${name}-2-zalo.png` });

  // Desktop shows the QR step; phone and tablet show the open-Zalo row. Exactly one is visible.
  const display = (selector) => page.locator(selector).first().evaluate((e) => getComputedStyle(e).display);
  const desktop = await zalo.locator("> div").first().evaluate((e) => getComputedStyle(e).display);
  const row = await zalo.locator("> div, > a").nth(1).evaluate((e) => getComputedStyle(e).display);
  if (qr) {
    assert.equal(desktop, "grid", `${name}: QR step visible`);
    assert.equal(row, "none", `${name}: no mobile row on desktop`);
  } else {
    assert.equal(desktop, "none", `${name}: no QR step below the desktop breakpoint`);
    assert.notEqual(row, "none");
    const box = await zalo.locator("> div, > a").nth(1).boundingBox();
    assert.ok(box && box.height >= 56, `${name}: tap target is at least 56px tall`);
    assert.ok(box.x >= 0 && box.x + box.width <= width, `${name}: the row fits the screen`);
  }
  void display;

  // The optional step never blocks anything and is clearly optional.
  assert.ok((await zalo.textContent()).includes("Tuỳ chọn"));
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth), 0, `${name}: no horizontal overflow`);
  await context.close();
}

try {
  await run({ name: "mobile-390", width: 390, height: 844, qr: false });
  await run({ name: "tablet-820", width: 820, height: 1180, qr: false });
  await run({ name: "desktop-1440", width: 1440, height: 900, qr: true });
  await run({ name: "desktop-1440-reduced-motion", width: 1440, height: 900, reducedMotion: true, qr: true });
  console.log(expectZalo ? "ok: no Zalo step before success; confirmation first, Zalo about 0.7s later; QR on desktop, open-Zalo row below; reduced motion instant" : "ok: confirmation works, no Zalo step or placeholder anywhere (real Zalo OA not set)");
} finally {
  await browser.close();
}
