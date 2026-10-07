import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { CONSENT_VERSIONS } from "./consent.ts";
import { processSubmission, type ProcessContext } from "./process.ts";
import type { LeadAdapter, LeadPayload } from "./types.ts";

function setup(overrides: Partial<ProcessContext> = {}) {
  const calls: LeadPayload[] = [];
  const adapter: LeadAdapter = {
    name: "fake",
    async submit(lead) {
      calls.push(lead);
      return { ok: true };
    },
  };
  const ctx: ProcessContext = {
    source: "drinkglowj.com",
    campaign: "coming-soon",
    waitlistEnabled: true,
    adapter,
    now: () => new Date("2026-01-02T03:04:05.000Z"),
    ...overrides,
  };
  return { calls, ctx };
}

function form(fields: Record<string, string>) {
  const data = new FormData();
  for (const [k, v] of Object.entries(fields)) data.set(k, v);
  return data;
}

const good = { contact: "0912 345 678", channel: "zalo", locale: "en", consentVersion: CONSENT_VERSIONS[0] };

describe("processSubmission", () => {
  it("normalizes the phone and sets source/campaign/consent on the server", async () => {
    const { calls, ctx } = setup();
    const result = await processSubmission(form({ ...good, source: "evil.example", campaign: "hack" }), ctx);
    assert.deepEqual(result, { status: "success" });
    assert.deepEqual(calls, [
      {
        contact: "+84912345678",
        contactRaw: "0912 345 678",
        channel: "zalo",
        locale: "en",
        source: "drinkglowj.com",
        campaign: "coming-soon",
        consentAt: "2026-01-02T03:04:05.000Z",
        consentVersion: CONSENT_VERSIONS[0],
      },
    ]);
  });

  it("fakes success for the honeypot without calling the adapter", async () => {
    const { calls, ctx } = setup();
    assert.deepEqual(await processSubmission(form({ ...good, company: "Bot Inc" }), ctx), { status: "success" });
    assert.equal(calls.length, 0);
  });

  it("rejects invalid phones", async () => {
    const { calls, ctx } = setup();
    assert.deepEqual(await processSubmission(form({ ...good, contact: "12345" }), ctx), { status: "error", reason: "invalid" });
    assert.equal(calls.length, 0);
  });

  it("stores nothing when the consent version is missing or unknown", async () => {
    const { calls, ctx } = setup();
    for (const consentVersion of ["", "v999"]) {
      assert.deepEqual(await processSubmission(form({ ...good, consentVersion }), ctx), { status: "error", reason: "failed" });
    }
    assert.equal(calls.length, 0);
  });

  it("falls back to vi for an unknown locale", async () => {
    const { calls, ctx } = setup();
    await processSubmission(form({ ...good, locale: "fr" }), ctx);
    assert.equal(calls[0].locale, "vi");
  });

  it("reports not-configured when the waitlist flag is off", async () => {
    const { calls, ctx } = setup({ waitlistEnabled: false });
    assert.deepEqual(await processSubmission(form(good), ctx), { status: "error", reason: "not-configured" });
    assert.equal(calls.length, 0);
  });

  it("surfaces adapter failures and thrown errors without leaking", async () => {
    const failing = setup({ adapter: { name: "x", submit: async () => ({ ok: false, reason: "failed" }) } });
    assert.deepEqual(await processSubmission(form(good), failing.ctx), { status: "error", reason: "failed" });
    const throwing = setup({
      adapter: {
        name: "x",
        submit: async () => {
          throw new Error("secret");
        },
      },
    });
    assert.deepEqual(await processSubmission(form(good), throwing.ctx), { status: "error", reason: "failed" });
  });
});
