import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import { CURRENT_CONSENT_VERSION } from "./consent.ts";
import {
  buildLeadFields,
  encodeFields,
  FORM_ENDPOINT,
  FORM_FIELDS,
  FORM_NAME,
  HONEYPOT_FIELD,
  submitLead,
  type LeadContext,
} from "./netlify-forms.ts";

const root = new URL("../../..", import.meta.url).pathname;
const NOW = new Date("2026-10-15T03:04:05.678Z");
const ctx: LeadContext = { locale: "vi", source: "drinkglowj.com", campaign: "coming-soon", consentVersion: CURRENT_CONSENT_VERSION, now: () => NOW };

type Call = { url: string; init: RequestInit };
function fakeFetch(respond: () => Response | Promise<Response>): { fetchImpl: typeof fetch; calls: Call[] } {
  const calls: Call[] = [];
  const fetchImpl = (async (input: RequestInfo | URL, init?: RequestInit) => {
    calls.push({ url: String(input), init: init ?? {} });
    return respond();
  }) as typeof fetch;
  return { fetchImpl, calls };
}

describe("Netlify form payload", () => {
  it("is named glowj-coming-soon and posts to the site root (the blueprint is only for detection)", () => {
    assert.equal(FORM_NAME, "glowj-coming-soon");
    assert.equal(FORM_ENDPOINT, "/");
    assert.equal(buildLeadFields("0912 345 678", ctx)?.["form-name"], "glowj-coming-soon");
  });

  it("carries exactly the Stage 1 fields, and nothing that belongs to a CRM", () => {
    const fields = buildLeadFields("0912 345 678", ctx);
    assert.ok(fields);
    assert.deepEqual(Object.keys(fields).sort(), ["form-name", HONEYPOT_FIELD, ...FORM_FIELDS].sort());
    assert.deepEqual([...FORM_FIELDS], ["phone_raw", "phone_normalized", "locale", "source", "campaign", "consent_at", "consent_version"]);
    for (const banned of ["signup_count", "first_seen_at", "last_seen_at", "status"]) assert.ok(!(banned in fields), banned);
  });

  it("keeps the typed number and the normalized +84 number", () => {
    const fields = buildLeadFields("  0912 345 678 ", ctx);
    assert.equal(fields?.phone_raw, "0912 345 678");
    assert.equal(fields?.phone_normalized, "+84912345678");
    assert.equal(buildLeadFields("+84 912 345 678", ctx)?.phone_normalized, "+84912345678");
    assert.equal(buildLeadFields("+84 912 345 678", ctx)?.phone_raw, "+84 912 345 678");
  });

  it("sets locale, source, campaign and the consent fields", () => {
    const vi = buildLeadFields("0912345678", ctx);
    assert.equal(vi?.locale, "vi");
    assert.equal(vi?.source, "drinkglowj.com");
    assert.equal(vi?.campaign, "coming-soon");
    assert.equal(vi?.consent_at, "2026-10-15T03:04:05.678Z");
    assert.equal(vi?.consent_version, CURRENT_CONSENT_VERSION);
    assert.equal(buildLeadFields("0912345678", { ...ctx, locale: "en" })?.locale, "en");
  });

  it("includes Netlify's honeypot field, empty for people and passed through when a bot filled it", () => {
    assert.equal(buildLeadFields("0912345678", ctx)?.[HONEYPOT_FIELD], "");
    assert.equal(buildLeadFields("0912345678", ctx, "http://spam.example")?.[HONEYPOT_FIELD], "http://spam.example");
    assert.equal(HONEYPOT_FIELD, "bot-field");
  });

  it("is a url-encoded body that round-trips", () => {
    const fields = buildLeadFields("+84 912 345 678", ctx);
    assert.ok(fields);
    const parsed = Object.fromEntries(new URLSearchParams(encodeFields(fields)));
    assert.deepEqual(parsed, fields);
  });
});

describe("phone validation before sending", () => {
  it("rejects invalid numbers without any network call", async () => {
    for (const bad of ["", "12345", "0912 345", "0212345678", "+1 415 555 0100", "abc", "0912345678901234567890123456789012345"]) {
      const { fetchImpl, calls } = fakeFetch(() => new Response("", { status: 200 }));
      assert.equal(buildLeadFields(bad, ctx), null, bad);
      assert.deepEqual(await submitLead(bad, ctx, "", fetchImpl), { status: "error", reason: "invalid" }, bad);
      assert.equal(calls.length, 0, `no request for ${JSON.stringify(bad)}`);
    }
  });
});

describe("submitting to Netlify", () => {
  it("posts the url-encoded form to / and reports success only on a direct 2xx", async () => {
    const { fetchImpl, calls } = fakeFetch(() => new Response("", { status: 200 }));
    assert.deepEqual(await submitLead("0912 345 678", ctx, "", fetchImpl), { status: "success" });
    assert.equal(calls.length, 1);
    assert.equal(calls[0].url, "/");
    assert.equal(calls[0].init.method, "POST");
    assert.equal(calls[0].init.redirect, "manual");
    assert.deepEqual(calls[0].init.headers, { "Content-Type": "application/x-www-form-urlencoded" });
    const body = Object.fromEntries(new URLSearchParams(String(calls[0].init.body)));
    assert.deepEqual(Object.keys(body).sort(), ["form-name", "bot-field", ...FORM_FIELDS].sort());
    assert.equal(body["form-name"], "glowj-coming-soon");
    assert.equal(body["bot-field"], "");
    assert.equal(body.phone_normalized, "+84912345678");
  });

  it("does not count a redirect as success (the app redirects / to /vi, which would swallow the POST)", async () => {
    const redirected = { fetchImpl: (async () => ({ ok: false, status: 0, type: "opaqueredirect" })) as unknown as typeof fetch };
    assert.deepEqual(await submitLead("0912 345 678", ctx, "", redirected.fetchImpl), { status: "error", reason: "unavailable" });
    const seen = fakeFetch(() => new Response(null, { status: 307, headers: { location: "/vi" } }));
    assert.deepEqual(await submitLead("0912 345 678", ctx, "", seen.fetchImpl), { status: "error", reason: "unavailable" });
  });

  it("never reports success when Netlify refuses or the network fails", async () => {
    for (const status of [400, 404, 405, 429, 500, 503]) {
      const { fetchImpl } = fakeFetch(() => new Response("", { status }));
      assert.deepEqual(await submitLead("0912 345 678", ctx, "", fetchImpl), { status: "error", reason: "unavailable" }, String(status));
    }
    const throwing = fakeFetch(() => Promise.reject(new TypeError("Failed to fetch")));
    assert.deepEqual(await submitLead("0912 345 678", ctx, "", throwing.fetchImpl), { status: "error", reason: "unavailable" });
  });

  it("can be retried straight away after a failure", async () => {
    let attempt = 0;
    const { fetchImpl, calls } = fakeFetch(() => new Response("", { status: ++attempt === 1 ? 500 : 200 }));
    assert.deepEqual(await submitLead("0912 345 678", ctx, "", fetchImpl), { status: "error", reason: "unavailable" });
    assert.deepEqual(await submitLead("0912 345 678", ctx, "", fetchImpl), { status: "success" });
    assert.equal(calls.length, 2);
  });
});

describe("the static blueprint Netlify detects at deploy time", () => {
  const html = readFileSync(join(root, "public/__forms.html"), "utf8");
  const form = html.match(/<form[\s\S]*?<\/form>/)?.[0] ?? "";

  it("registers the form with Netlify under the same name, with the honeypot", () => {
    assert.match(form, /name="glowj-coming-soon"/);
    assert.match(form, /data-netlify="true"/);
    assert.match(form, /netlify-honeypot="bot-field"/);
    assert.match(form, /<input type="hidden" name="form-name" value="glowj-coming-soon"/);
    assert.ok(form.includes(`name="${FORM_NAME}"`));
  });

  it("declares exactly the fields the site posts, so none is dropped or unexpected", () => {
    const names = [...form.matchAll(/<input[^>]*\sname="([^"]+)"/g)].map((m) => m[1]);
    assert.deepEqual(names.sort(), ["form-name", HONEYPOT_FIELD, ...FORM_FIELDS].sort());
  });

  it("stays out of search results", () => {
    assert.match(html, /<meta name="robots" content="noindex, nofollow"/);
  });
});

describe("no Google Sheets dependency", () => {
  function walk(dir: string): string[] {
    return readdirSync(dir).flatMap((name) => {
      const full = join(dir, name);
      return statSync(full).isDirectory() ? walk(full) : [full];
    });
  }
  const sources = walk(join(root, "src")).filter((f) => /\.(ts|tsx|css)$/.test(f) && !f.endsWith(".test.ts"));

  it("needs no Google environment variable, library or adapter", () => {
    for (const file of sources) {
      const text = readFileSync(file, "utf8").replace(/next\/font\/google/g, "");
      assert.ok(!/GOOGLE_|google-auth-library|googleapis|sheets\.google/i.test(text), `Google reference in ${file}`);
    }
    const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8")) as { dependencies: Record<string, string> };
    assert.ok(!Object.keys(pkg.dependencies).some((d) => /google|googleapis/.test(d)), "Google dependency in package.json");
    assert.ok(!existsSync(join(root, ".env.example")), "no environment variables are needed, so no .env.example");
    assert.ok(!sources.some((f) => /google-sheets|adapters\.ts|actions\.ts/.test(f)), "old provider files must be gone");
  });
});
