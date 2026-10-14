import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";

const root = new URL("../..", import.meta.url).pathname;
const PNG = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

/**
 * The favicon is the OFFICIAL droplet (cropped, padded and resized only), wired through the Next.js App Router
 * file conventions: src/app/favicon.ico serves /favicon.ico and src/app/apple-icon.png the Apple touch icon.
 * Both are static metadata routes that sit above the [locale] segment, so /favicon.ico never reaches it.
 */
describe("favicon", () => {
  const ico = readFileSync(join(root, "src/app/favicon.ico"));

  it("is an .ico with 16, 32 and 48 px PNG frames", () => {
    assert.equal(ico.readUInt16LE(0), 0);
    assert.equal(ico.readUInt16LE(2), 1, "icon resource");
    assert.equal(ico.readUInt16LE(4), 3, "three frames");
    const sizes: number[] = [];
    for (let i = 0; i < 3; i++) {
      const entry = 6 + i * 16;
      const size = ico[entry];
      sizes.push(size);
      assert.equal(ico[entry + 1], size, "square");
      const bytes = ico.readUInt32LE(entry + 8);
      const offset = ico.readUInt32LE(entry + 12);
      assert.ok(ico.subarray(offset, offset + 8).equals(PNG), `frame ${size} is a PNG`);
      assert.equal(ico.readUInt32BE(offset + 16), size, "PNG width matches");
      assert.equal(ico.readUInt32BE(offset + 20), size, "PNG height matches");
      assert.equal(ico[offset + 25], 6, "RGBA, so the corners stay transparent on light and dark tabs");
      assert.ok(offset + bytes <= ico.length);
    }
    assert.deepEqual(sizes, [16, 32, 48]);
  });

  it("has an Apple touch icon of 180 px", () => {
    const apple = readFileSync(join(root, "src/app/apple-icon.png"));
    assert.ok(apple.subarray(0, 8).equals(PNG));
    assert.equal(apple.readUInt32BE(16), 180);
    assert.equal(apple.readUInt32BE(20), 180);
  });

  it("is derived from the official droplet only, and is not declared twice", () => {
    const generator = readFileSync(join(root, "scripts/generate-favicon.py"), "utf8");
    assert.match(generator, /brand-assets\/official\/glowj-droplet-source\.webp/);
    assert.ok(!/ImageDraw|draw\.|ellipse|polygon/i.test(generator), "no drawing: crop, pad and resize only");
    assert.ok(existsSync(join(root, "brand-assets/official/glowj-droplet-source.webp")));
    assert.ok(!existsSync(join(root, "public/favicon.ico")), "one favicon.ico, the App Router one");
    const layout = readFileSync(join(root, "src/app/[locale]/layout.tsx"), "utf8");
    assert.ok(!/\bicons\s*:/.test(layout), "the file conventions are the single source for icons");
  });
});
