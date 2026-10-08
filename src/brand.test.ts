import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";

const root = new URL("..", import.meta.url).pathname;
const read = (path: string) => readFileSync(join(root, path), "utf8");

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
}

/** Source text without comments, so rules can be written in comments without tripping the guards. */
function code(file: string): string {
  return readFileSync(file, "utf8").replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|[^:])\/\/.*$/gm, "$1");
}

const sources = walk(join(root, "src")).filter((f) => /\.(ts|tsx|css)$/.test(f) && !f.endsWith(".test.ts"));

/**
 * The single sanctioned serif/italic (docs/DESIGN_SYSTEM.md section 8): Fraunces Medium Italic for
 * the headline's coral accent word. Removed before the guardrails scan; pinned by its own test below.
 */
function withoutSanctionedAccent(file: string, text: string): string {
  if (file.endsWith("globals.css")) {
    return text.replace(/\.headline-accent\s*\{[^}]*\}/, "").replace(/--font-accent:[^;]*;/, "");
  }
  if (file.endsWith("layout.tsx")) {
    return text.replace(/,\s*Fraunces\b/, "").replace(/const accent = Fraunces\(\{[\s\S]*?\}\);/, "");
  }
  return text;
}

describe("brand isolation (Stage 1)", () => {
  it("serves no bottle or packaging file on any route", () => {
    const served = walk(join(root, "public")).map((f) => f.toLowerCase());
    assert.ok(served.length > 0);
    for (const file of served) assert.ok(!/bottle|chai|pack|label/.test(file), `unexpected asset: ${file}`);
  });

  it("references no bottle in the app or components", () => {
    for (const file of sources) {
      assert.ok(!/glowj-bottle|bottle\.(png|webp|jpe?g|svg)|bottleAlt/i.test(code(file)), `bottle reference in ${file}`);
    }
  });

  it("header uses the official logo and the page uses the official droplet", () => {
    assert.match(read("src/components/layout/Header.tsx"), /Wordmark/);
    assert.match(read("src/components/layout/Wordmark.tsx"), /GlowJLogo/);
    assert.match(read("src/components/fill/FillLine.tsx"), /\/images\/glowj-droplet\.webp/);
    assert.match(read("src/app/[locale]/page.tsx"), /FillLine/);
  });

  it("keeps the official logo paths and colours unchanged", () => {
    const logo = read("src/components/brand/GlowJLogo.tsx");
    assert.match(logo, /#ef4650/); // coral J
    assert.match(logo, /#0b1212/); // wordmark
    assert.equal((logo.match(/<path /g) ?? []).length, 5);
  });

  it("never alters the droplet image (no filter, transform, rotation or recolour on it)", () => {
    const fill = read("src/components/fill/FillLine.tsx");
    const droplet = fill.match(/<Image[^>]*glowj-droplet\.webp[^>]*\/>/)?.[0] ?? "";
    assert.ok(droplet.length > 0);
    assert.ok(!/filter|rotate|scale|blur|style=/.test(droplet), "droplet image must be unmodified");
  });
});

describe('"The Fill Line" guardrails (docs/DESIGN_SYSTEM.md sections 16-17)', () => {
  const banned: Array<[RegExp, string]> = [
    [/gradient\(/i, "gradient"],
    [/backdrop-|backdrop:/i, "glass / backdrop filter"],
    [/box-shadow|drop-shadow|shadow-|text-shadow/i, "shadow"],
    [/blur/i, "blur"],
    [/\bitalic\b|font-style:\s*italic/i, "italic"],
    [/(?<!sans-)\bserif\b|Fraunces|Montserrat|Plus_Jakarta/i, "serif / retired fonts"],
    [/rounded|border-radius/i, "rounded corners"],
    [/#fffaf4|#fdfcfb|beige|ivory|parchment|cream/i, "warm off-white"],
    [/bg-white|text-white|#fff\b|#ffffff/i, "white (air is #F7FAF9)"],
  ];

  for (const [pattern, name] of banned) {
    it(`uses no ${name}`, () => {
      for (const file of sources) assert.ok(!pattern.test(withoutSanctionedAccent(file, code(file))), `${name} found in ${file}`);
    });
  }

  it("confines the serif italic to the headline accent word", () => {
    const users = sources.filter((f) => /Fraunces|headline-accent|font-accent/.test(code(f))).map((f) => f.replace(root, ""));
    assert.deepEqual(users.sort(), ["src/app/[locale]/layout.tsx", "src/app/globals.css", "src/components/fill/Headline.tsx"]);
    assert.match(read("src/app/[locale]/layout.tsx"), /Fraunces\(\{[\s\S]*?weight: \["500"\][\s\S]*?style: \["italic"\]/);
    assert.match(read("src/components/fill/Headline.tsx"), /word === accent \? <span className="headline-accent text-coral">/);
  });

  it("uses exactly the three approved colours", () => {
    const css = read("src/app/globals.css");
    for (const hex of ["#f7faf9", "#ef4650", "#0b1212"]) assert.ok(css.toLowerCase().includes(hex), `missing ${hex}`);
    const declared = [...code(join(root, "src/app/globals.css")).matchAll(/#[0-9a-f]{3,8}\b/gi)].map((m) => m[0].toLowerCase());
    for (const hex of declared) assert.ok(["#f7faf9", "#ef4650", "#0b1212"].includes(hex), `unapproved colour ${hex}`);
  });

  it("keeps the veil within 55-65% coral and the halo in the air only", () => {
    const css = read("src/app/globals.css");
    assert.match(css, /\.fill-veil[\s\S]*?opacity:\s*0\.(5[5-9]|6[0-5]?)\b/);
    assert.match(read("src/components/fill/FillLine.tsx"), /glowj-halo\.svg/);
  });
});
