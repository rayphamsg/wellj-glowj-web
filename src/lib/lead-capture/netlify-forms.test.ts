import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import { CURRENT_CONSENT_VERSION } from "./consent.ts";
import {
  buildSubmission,
  encodeSubmission,
  FORM_ENDPOINT,
  FORM_NAME,
  HONEYPOT_FIELD,
  postSubmission,
  SUBMISSION_FIELDS,
  type SubmissionContext,
} from "./netlify-forms.ts";

const root = new URL("../../..", import.meta.url).pathname;
const NOW = new Date("2026-10-15T03:04:05.678Z");
const ctx: SubmissionContext = { locale: "vi", source: "drinkglowj.com", campaign: "coming-soon", consentVersion: CURRENT_CONSENT_VERSION, now: NOW };

type Call = { url: string; init: RequestInit };
function fakeFetch(respond: () => unknown | Promise<unknown>): { fetchImpl: typeof fetch; calls: Call[] } {
  const calls: Call[] = [];
  const fetchImpl = (async (input: RequestInfo | URL, init?: RequestInit) => {
    calls.push({ url: String(input), init: init ?? {} });
    return respond();
  }) as typeof fetch;
  return { fetchImpl, calls };
}
const status = (code: number) => new Response("", { status: code });
/** What fetch(..., { redirect: "manual" }) returns in a browser when the server answers with a redirect. */
const opaqueRedirect = { ok: false, status: 0, type: "opaqueredirect" };
const valid = () => {
  const submission = buildSubmission("0912 345 678", ctx);
  assert.ok(submission);
  return submission;
};

describe("Netlify form payload (same pattern as the working IronJ site)", () => {
  it("is named glowj-coming-soon and posts to the blueprint file", () => {
    assert.equal(FORM_NAME, "glowj-coming-soon");
    assert.equal(FORM_ENDPOINT, "/__forms.html");
    assert.equal(new URLSearchParams(encodeSubmission(valid())).get("form-name"), "glowj-coming-soon");
  });

  it("carries exactly the Stage 1 fields, and nothing that belongs to a CRM", () => {
    const submission = valid();
    assert.deepEqual(Object.keys(submission), ["phone_raw", "phone_normalized", "locale", "source", "campaign", "consent_at", "consent_version"]);
    assert.deepEqual([...SUBMISSION_FIELDS], Object.keys(submission));
    for (const banned of ["signup_count", "first_seen_at", "last_seen_at", "status"]) assert.ok(!(banned in submission), banned);
  });

  it("keeps the typed number and the normalized +84 number", () => {
    const typed = buildSubmission("  0912 345 678 ", ctx);
    assert.equal(typed?.phone_raw, "0912 345 678");
    assert.equal(typed?.phone_normalized, "+84912345678");
    const international = buildSubmission("+84 912 345 678", ctx);
    assert.equal(international?.phone_normalized, "+84912345678");
    assert.equal(international?.phone_raw, "+84 912 345 678");
  });

  it("sets locale, source, campaign and the consent fields", () => {
    const vi = buildSubmission("0912345678", ctx);
    assert.equal(vi?.locale, "vi");
    assert.equal(vi?.source, "drinkglowj.com");
    assert.equal(vi?.campaign, "coming-soon");
    assert.equal(vi?.consent_at, "2026-10-15T03:04:05.678Z");
    assert.equal(vi?.consent_version, CURRENT_CONSENT_VERSION);
    assert.equal(buildSubmission("0912345678", { ...ctx, locale: "en" })?.locale, "en");
  });

  it("encodes form-name first, the seven fields in order, then the empty honeypot, byte for byte", () => {
    assert.equal(HONEYPOT_FIELD, "bot-field");
    const body = encodeSubmission(valid());
    assert.equal(
      body,
      "form-name=glowj-coming-soon&phone_raw=0912+345+678&phone_normalized=%2B84912345678&locale=vi&source=drinkglowj.com&campaign=coming-soon" +
        "&consent_at=2026-10-15T03%3A04%3A05.678Z&consent_version=draft-0&bot-field=",
    );
    assert.deepEqual([...new URLSearchParams(body).keys()], ["form-name", ...SUBMISSION_FIELDS, "bot-field"]);
  });
});

describe("phone validation before sending", () => {
  it("builds nothing for invalid numbers, so nothing can be sent", () => {
    for (const bad of ["", "12345", "0912 345", "0212345678", "+1 415 555 0100", "abc", "0912345678901234567890123456789012345"]) {
      assert.equal(buildSubmission(bad, ctx), null, JSON.stringify(bad));
    }
  });
});

describe("posting to Netlify", () => {
  it("posts the urlencoded form to /__forms.html without following redirects", async () => {
    const { fetchImpl, calls } = fakeFetch(() => status(200));
    assert.deepEqual(await postSubmission(valid(), fetchImpl), { ok: true });
    assert.equal(calls.length, 1);
    assert.equal(calls[0].url, "/__forms.html");
    assert.equal(calls[0].init.method, "POST");
    assert.deepEqual(calls[0].init.headers, { "Content-Type": "application/x-www-form-urlencoded" });
    assert.equal(calls[0].init.redirect, "manual");
    assert.equal(calls[0].init.body, encodeSubmission(valid()));
  });

  it("counts Netlify's redirect to its success page as accepted", async () => {
    const { fetchImpl } = fakeFetch(() => opaqueRedirect);
    assert.deepEqual(await postSubmission(valid(), fetchImpl), { ok: true });
  });

  it("never reports success when the host refuses or the network fails", async () => {
    for (const code of [400, 404, 405, 429, 500, 503]) {
      const { fetchImpl } = fakeFetch(() => status(code));
      assert.deepEqual(await postSubmission(valid(), fetchImpl), { ok: false, reason: "failed" }, String(code));
    }
    const throwing = fakeFetch(() => Promise.reject(new TypeError("Failed to fetch")));
    assert.deepEqual(await postSubmission(valid(), throwing.fetchImpl), { ok: false, reason: "failed" });
  });

  it("can be retried straight away after a failure", async () => {
    let attempt = 0;
    const { fetchImpl, calls } = fakeFetch(() => status(++attempt === 1 ? 500 : 200));
    assert.deepEqual(await postSubmission(valid(), fetchImpl), { ok: false, reason: "failed" });
    assert.deepEqual(await postSubmission(valid(), fetchImpl), { ok: true });
    assert.equal(calls.length, 2);
  });
});

describe("the static blueprint Netlify detects at build time", () => {
  const html = readFileSync(join(root, "public/__forms.html"), "utf8");
  const form = html.match(/<form[\s\S]*?<\/form>/)?.[0] ?? "";

  it("registers the form with Netlify under the same name, with the honeypot", () => {
    assert.match(form, /name="glowj-coming-soon"/);
    assert.match(form, /method="POST"/);
    assert.match(form, /data-netlify="true"/);
    assert.match(form, /netlify-honeypot="bot-field"/);
    assert.match(form, /<input type="hidden" name="form-name" value="glowj-coming-soon"/);
    assert.ok(form.includes(`name="${FORM_NAME}"`));
  });

  it("declares exactly the fields the site posts, so none is dropped or unexpected", () => {
    const names = [...form.matchAll(/<input[^>]*\sname="([^"]+)"/g)].map((m) => m[1]);
    assert.deepEqual(names.sort(), ["form-name", HONEYPOT_FIELD, ...SUBMISSION_FIELDS].sort());
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
