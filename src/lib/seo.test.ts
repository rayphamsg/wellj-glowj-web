import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { absoluteUrl, languageAlternates, sitemapEntries } from "./seo.ts";

describe("seo", () => {
  it("builds absolute URLs on the apex domain", () => {
    assert.equal(absoluteUrl("/vi"), "https://drinkglowj.com/vi");
    assert.ok(!absoluteUrl("/").includes("www."));
  });
  it("emits hreflang for vi, en and x-default -> /vi", () => {
    assert.deepEqual(languageAlternates(), {
      vi: "https://drinkglowj.com/vi",
      en: "https://drinkglowj.com/en",
      "x-default": "https://drinkglowj.com/vi",
    });
  });
  it("lists every locale in the sitemap with alternates", () => {
    const entries = sitemapEntries([""]);
    assert.deepEqual(
      entries.map((e) => e.url),
      ["https://drinkglowj.com/vi", "https://drinkglowj.com/en"],
    );
    for (const entry of entries) assert.equal(entry.alternates.languages["x-default"], "https://drinkglowj.com/vi");
  });
});
