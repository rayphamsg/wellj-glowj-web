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

describe("brand isolation (Stage 1)", () => {
  it("serves no bottle or packaging file on any route", () => {
    const served = walk(join(root, "public")).map((f) => f.toLowerCase());
    assert.ok(served.length > 0);
    for (const file of served) assert.ok(!/bottle|chai|pack|label/.test(file), `unexpected asset: ${file}`);
  });

  it("references no bottle in the app or components", () => {
    for (const file of walk(join(root, "src")).filter((f) => /\.(ts|tsx|css)$/.test(f) && !f.endsWith(".test.ts"))) {
      const text = readFileSync(file, "utf8");
      // Comments may say "no bottle"; code must not load one.
      assert.ok(!/glowj-bottle|bottle\.(png|webp|jpe?g|svg)|bottleAlt/i.test(text), `bottle reference in ${file}`);
    }
  });

  it("header uses the official logo and the hero uses the official droplet", () => {
    assert.match(read("src/components/layout/Header.tsx"), /Wordmark/);
    assert.match(read("src/components/layout/Wordmark.tsx"), /GlowJLogo/);
    assert.match(read("src/components/visual/HeroVisual.tsx"), /\/images\/glowj-droplet\.webp/);
    assert.match(read("src/app/[locale]/page.tsx"), /HeroVisual/);
  });

  it("keeps the official logo paths and colours unchanged", () => {
    const logo = read("src/components/brand/GlowJLogo.tsx");
    assert.match(logo, /#ef4650/); // coral J
    assert.match(logo, /#0b1212/); // wordmark
    assert.equal((logo.match(/<path /g) ?? []).length, 5);
  });
});
