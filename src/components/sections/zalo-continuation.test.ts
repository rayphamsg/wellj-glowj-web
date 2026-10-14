import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import { en } from "../../content/en/index.ts";
import { site } from "../../content/site.ts";
import { vi } from "../../content/vi/index.ts";

const root = new URL("../../..", import.meta.url).pathname;
const read = (path: string) => readFileSync(join(root, path), "utf8");
const component = read("src/components/sections/ZaloContinuation.tsx");
const form = read("src/components/sections/SignupForm.tsx");
const page = read("src/app/[locale]/page.tsx");
const css = read("src/app/globals.css");

/**
 * The after-submit flow (structure from the working IronJ site): confirmation first, then an OPTIONAL Zalo
 * step about 0.7s later. The timing, breakpoints and "nothing before success" are also proved in a real
 * browser by `npm run test:e2e` (scripts/e2e-zalo-flow.mjs); node has no DOM here, so this pins the code.
 */
describe("after-submit copy", () => {
  it("confirms with the approved wording (shown in capitals)", () => {
    assert.equal(vi.signup.successMessage, "Đã ghi nhận.");
    assert.equal(en.signup.successMessage, "You’re on the list.");
    assert.match(form, /signup-success[^"]*\buppercase\b/);
  });

  it("offers the Zalo step in Vietnamese as briefed, and in English", () => {
    assert.deepEqual(
      { title: vi.home.zalo.title, optional: vi.home.zalo.optional, open: vi.home.zalo.open, scanHint: vi.home.zalo.scanHint },
      { title: "Kết nối Zalo", optional: "Tuỳ chọn", open: "Mở Zalo", scanHint: "Theo dõi GlowJ trên Zalo để nhận tin ra mắt và ưu đãi đầu tiên." },
    );
    assert.equal(en.home.zalo.open, "Open Zalo");
    assert.equal(en.home.zalo.optional, "Optional");
  });
});

describe("Zalo step is optional, delayed and only after a real success", () => {
  it("renders nothing before the submission was accepted", () => {
    assert.match(form, /\{success && successSlot\}/);
    assert.match(page, /successSlot=\{zaloStep\}/);
    assert.equal((form.match(/successSlot/g) ?? []).length, 3, "prop type, destructure and the one render, nothing else");
  });

  it("fades in about 0.7s after the confirmation, only when motion is allowed (instant otherwise)", () => {
    const motion = css.match(/@media \(prefers-reduced-motion: no-preference\) \{[\s\S]*?\n\}\n/)?.[0] ?? "";
    assert.match(motion, /\.zalo-reveal\s*\{\s*animation:\s*zalo-in 600ms ease 0\.7s backwards;/);
    assert.match(motion, /@keyframes zalo-in/);
    assert.equal((css.match(/\.zalo-reveal/g) ?? []).length, 1, "no animation or hiding outside the no-preference block");
    assert.ok(!/infinite/.test(motion.match(/zalo-in[^;]*;/)?.[0] ?? ""), "plays once");
  });

  it("desktop gets the QR step, phone and tablet get one open-Zalo row", () => {
    assert.match(component, /className="hidden border-t-2 border-ink pt-5 lg:grid lg:grid-cols-\[6rem_1fr\]/);
    assert.match(component, /className="flex min-h-14 items-center gap-4 border-2 border-ink px-4 lg:hidden"/);
    assert.match(component, /copy\.scanHint/);
    assert.equal((component.match(/\{copy\.optional\}/g) ?? []).length, 2, "marked optional on both layouts");
  });

  it("opens Zalo in a new tab safely, from both layouts, and never makes the step required", () => {
    assert.equal((component.match(/href=\{href\} target="_blank" rel="noopener noreferrer"/g) ?? []).length, 2, "desktop link and mobile row");
    assert.ok(!/required|<form|<input/.test(component), "the step is a link, not a second form");
  });

  it("keeps GlowJ's flat system: square, no shadow, no extra colour", () => {
    assert.ok(!/rounded|shadow|blur|gradient|#[0-9a-f]{3,6}\b/i.test(component));
  });
});

describe("production safety while the real Zalo OA does not exist", () => {
  it("is rendered only when BOTH the real link and the real QR are set", () => {
    assert.match(page, /const \{ zalo, zaloQr \} = site\.social;/);
    assert.match(page, /const zaloStep = zalo && zaloQr \? <ZaloContinuation copy=\{home\.zalo\} href=\{zalo\} qrSrc=\{zaloQr\} \/> : undefined;/);
    assert.match(component, /href: string;/);
    assert.match(component, /qrSrc: string;/);
  });

  it("the link and the QR come from one isolated config value each, never invented", () => {
    assert.ok(site.social.zalo === null || /^https:\/\/zalo\.me\//.test(site.social.zalo), "site.social.zalo must be the real OA link");
    assert.ok(site.social.zaloQr === null || /^\/brand\/.+\.(png|svg|webp)$/.test(site.social.zaloQr));
    const sources = [component, form, page, read("src/content/site.ts")].join("\n");
    assert.ok(!/zalo\.me\/[a-z0-9]/i.test(sources), "no hard-coded Zalo URL");
    const pkg = JSON.parse(read("package.json")) as { dependencies: Record<string, string> };
    assert.ok(!Object.keys(pkg.dependencies).some((d) => /qr/i.test(d)), "no QR generator dependency: the QR is a real file");
  });

  it("has no placeholder, disabled button or 'coming later' text anywhere in the Zalo step or its copy", () => {
    const code = component.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|[^:])\/\/.*$/gm, "$1");
    const shipped = [code, JSON.stringify(vi.home.zalo), JSON.stringify(en.home.zalo)].join("\n");
    assert.ok(!/placeholder|aria-disabled|pendingNote|not provided|coming|sắp có|soon/i.test(shipped), "no placeholder wording");
    assert.ok(!("pendingNote" in vi.home.zalo) && !("pendingNote" in en.home.zalo));
    assert.ok(!/AssetPlaceholder/.test(code));
  });

  it("without the real values the page shows only the normal confirmation", () => {
    assert.match(form, /\{success && successSlot\}/); // an undefined slot renders nothing
    if (site.social.zalo === null || site.social.zaloQr === null) assert.match(page, /: undefined;/);
  });
});
