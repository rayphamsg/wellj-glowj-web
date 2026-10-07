import assert from "node:assert/strict";
import { beforeEach, describe, it, mock } from "node:test";
import { createGoogleSheetsAdapter, googleSheetsConfigFromEnv, SHEET_COLUMNS } from "./google-sheets-adapter.ts";
import type { LeadPayload } from "./types.ts";

type Cell = string | number;
type Failure = number | "network";

/** A tiny in-memory stand-in for the Google Sheets REST API. */
class FakeSheet {
  header: string[] = [...SHEET_COLUMNS];
  rows: Cell[][] = [];
  requests: Array<{ method: string; range: string; query: URLSearchParams }> = [];
  failures: Failure[] = [];

  fetch = (async (input: string | URL | Request, init?: RequestInit) => {
    const url = new URL(String(input));
    const method = init?.method ?? "GET";
    const decoded = decodeURIComponent(url.pathname.split("/values/")[1] ?? "");
    const match = /^'(.*)'!(.+?)(:append)?$/.exec(decoded);
    assert.ok(match, `unexpected path ${decoded}`);
    const range = match[2];
    this.requests.push({ method, range, query: url.searchParams });

    const failure = this.failures.shift();
    if (failure === "network") throw new TypeError("fetch failed");
    if (typeof failure === "number") return new Response("{}", { status: failure });

    const body = init?.body ? (JSON.parse(String(init.body)) as { values: Cell[][] }) : null;
    let json: unknown = {};
    if (method === "GET" && range === `A1:${String.fromCharCode(64 + SHEET_COLUMNS.length)}1`) {
      json = { values: [this.header] };
    } else if (method === "GET" && range === "A2:A") {
      json = this.rows.length ? { values: this.rows.map((row) => [row[0]]) } : {};
    } else if (method === "GET" && /^J\d+$/.test(range)) {
      const row = this.rows[Number(range.slice(1)) - 2];
      json = { values: [[String(row[9])]] };
    } else if (method === "PUT" && /^I\d+:J\d+$/.test(range) && body) {
      const row = this.rows[Number(/^I(\d+)/.exec(range)![1]) - 2];
      [row[8], row[9]] = body.values[0];
    } else if (method === "POST" && match[3] && body) {
      this.rows.push(body.values[0]);
    } else {
      assert.fail(`unexpected request ${method} ${range}`);
    }
    return new Response(JSON.stringify(json), { status: 200 });
  }) as typeof fetch;

  count(method: string) {
    return this.requests.filter((r) => r.method === method).length;
  }
}

const lead: LeadPayload = {
  contact: "+84912345678",
  contactRaw: "0912 345 678",
  channel: "zalo",
  locale: "vi",
  source: "drinkglowj.com",
  campaign: "coming-soon",
  consentAt: "2026-10-07T01:00:00.000Z",
  consentVersion: "draft-0",
};

const config = { spreadsheetId: "SHEET_ID", tab: "Leads", clientEmail: "svc@example.iam", privateKey: "KEY" };

let sheet: FakeSheet;
let clock: string;
let tokenCalls: boolean[];

function makeAdapter(getAccessToken?: (force?: boolean) => Promise<string>) {
  return createGoogleSheetsAdapter(config, {
    fetchImpl: sheet.fetch,
    now: () => new Date(clock),
    sleep: async () => {},
    getAccessToken:
      getAccessToken ??
      (async (force) => {
        tokenCalls.push(Boolean(force));
        return "token";
      }),
  });
}

beforeEach(() => {
  sheet = new FakeSheet();
  clock = "2026-10-07T02:00:00.000Z";
  tokenCalls = [];
});

describe("google sheets adapter: new lead", () => {
  it("appends one row with every column, defaults and as literal text", async () => {
    const result = await makeAdapter().submit(lead);
    assert.deepEqual(result, { ok: true, duplicate: false });
    assert.equal(sheet.rows.length, 1);
    assert.deepEqual(sheet.rows[0], [
      "+84912345678",
      "0912 345 678",
      "vi",
      "drinkglowj.com",
      "coming-soon",
      "2026-10-07T01:00:00.000Z",
      "draft-0",
      "2026-10-07T02:00:00.000Z",
      "2026-10-07T02:00:00.000Z",
      1,
      "new",
    ]);
    const append = sheet.requests.find((r) => r.method === "POST");
    assert.equal(append?.query.get("valueInputOption"), "RAW");
    assert.equal(append?.query.get("insertDataOption"), "INSERT_ROWS");
  });
});

describe("google sheets adapter: duplicate lead", () => {
  it("updates last_seen_at and signup_count only, keeps one row, still succeeds", async () => {
    const adapter = makeAdapter();
    await adapter.submit(lead);
    const first = [...sheet.rows[0]];

    clock = "2026-10-08T09:30:00.000Z";
    const result = await adapter.submit({ ...lead, contactRaw: "+84 912 345 678", consentAt: "2026-10-08T09:30:00.000Z" });

    assert.deepEqual(result, { ok: true, duplicate: true });
    assert.equal(sheet.rows.length, 1);
    const row = sheet.rows[0];
    assert.equal(row[7], first[7], "first_seen_at is never overwritten");
    assert.equal(row[8], "2026-10-08T09:30:00.000Z", "last_seen_at is updated");
    assert.equal(row[9], 2, "signup_count is incremented");
    for (const i of [0, 1, 2, 3, 4, 5, 6, 10]) assert.equal(row[i], first[i], `${SHEET_COLUMNS[i]} is unchanged`);
  });

  it("keeps a status the team has changed", async () => {
    const adapter = makeAdapter();
    await adapter.submit(lead);
    sheet.rows[0][10] = "contacted";
    await adapter.submit(lead);
    assert.equal(sheet.rows[0][10], "contacted");
    assert.equal(sheet.rows[0][9], 2);
  });

  it("counts up on every repeat", async () => {
    const adapter = makeAdapter();
    for (let i = 0; i < 4; i++) await adapter.submit(lead);
    assert.equal(sheet.rows.length, 1);
    assert.equal(sheet.rows[0][9], 4);
  });

  it("does not create two rows for a double click", async () => {
    const adapter = makeAdapter();
    const [a, b] = await Promise.all([adapter.submit(lead), adapter.submit(lead)]);
    assert.equal(a.ok && b.ok, true);
    assert.equal(sheet.rows.length, 1);
    assert.equal(sheet.rows[0][9], 2);
  });

  it("treats different numbers as different leads", async () => {
    const adapter = makeAdapter();
    await adapter.submit(lead);
    await adapter.submit({ ...lead, contact: "+84352345678" });
    assert.equal(sheet.rows.length, 2);
  });
});

describe("google sheets adapter: failures", () => {
  it("reports failed when Google keeps returning 500, after one retry", async () => {
    const error = mock.method(console, "error", () => {});
    sheet.failures = [500, 500, 500, 500];
    const result = await makeAdapter().submit(lead);
    assert.deepEqual(result, { ok: false, reason: "failed" });
    assert.equal(sheet.requests.length, 2, "one attempt plus one retry");
    assert.equal(sheet.rows.length, 0);
    error.mock.restore();
  });

  it("recovers when the first attempt hits a temporary error", async () => {
    sheet.failures = [503];
    const result = await makeAdapter().submit(lead);
    assert.equal(result.ok, true);
    assert.equal(sheet.rows.length, 1);
  });

  it("reports failed when the network is down", async () => {
    const error = mock.method(console, "error", () => {});
    sheet.failures = ["network", "network"];
    assert.deepEqual(await makeAdapter().submit(lead), { ok: false, reason: "failed" });
    error.mock.restore();
  });

  it("refreshes the token once after a 401", async () => {
    sheet.failures = [401];
    const result = await makeAdapter().submit(lead);
    assert.equal(result.ok, true);
    assert.deepEqual(tokenCalls.slice(0, 2), [false, true]);
  });

  it("reports failed on a permission error (403) without retrying", async () => {
    const error = mock.method(console, "error", () => {});
    sheet.failures = [403];
    assert.deepEqual(await makeAdapter().submit(lead), { ok: false, reason: "failed" });
    assert.equal(sheet.requests.length, 1);
    error.mock.restore();
  });

  it("reports failed when authentication fails", async () => {
    const error = mock.method(console, "error", () => {});
    const adapter = makeAdapter(async () => {
      throw new Error("bad key");
    });
    assert.deepEqual(await adapter.submit(lead), { ok: false, reason: "failed" });
    assert.equal(sheet.requests.length, 0);
    error.mock.restore();
  });

  it("refuses to write when the sheet header does not match", async () => {
    const error = mock.method(console, "error", () => {});
    sheet.header = ["email", "phone"];
    assert.deepEqual(await makeAdapter().submit(lead), { ok: false, reason: "failed" });
    assert.equal(sheet.count("POST"), 0);
    error.mock.restore();
  });

  it("never logs phone numbers, tokens or keys", async () => {
    const error = mock.method(console, "error", () => {});
    sheet.failures = [500, 500];
    await makeAdapter().submit(lead);
    const logged = JSON.stringify(error.mock.calls.map((c) => c.arguments));
    assert.ok(logged.length > 0);
    assert.ok(!logged.includes("84912345678") && !logged.includes("0912") && !logged.includes("token") && !logged.includes("KEY"));
    error.mock.restore();
  });

  it("only handles the zalo (phone) channel", async () => {
    const result = await makeAdapter().submit({ ...lead, channel: "email", contact: "a@b.co" });
    assert.deepEqual(result, { ok: false, reason: "invalid" });
    assert.equal(sheet.requests.length, 0);
  });
});

describe("googleSheetsConfigFromEnv", () => {
  const full = {
    GOOGLE_SHEETS_SPREADSHEET_ID: "abc",
    GOOGLE_SERVICE_ACCOUNT_EMAIL: "svc@example.iam",
    GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY: "-----BEGIN-----\\nLINE\\n-----END-----",
  };

  it("returns null when anything is missing, so the no-op adapter is used", () => {
    assert.equal(googleSheetsConfigFromEnv({}), null);
    for (const key of Object.keys(full)) {
      const partial: Record<string, string> = { ...full };
      delete partial[key];
      assert.equal(googleSheetsConfigFromEnv(partial), null, `missing ${key}`);
    }
  });

  it("defaults the tab to Leads and restores key newlines", () => {
    const config = googleSheetsConfigFromEnv(full);
    assert.equal(config?.tab, "Leads");
    assert.equal(config?.privateKey, "-----BEGIN-----\nLINE\n-----END-----");
  });

  it("uses a custom tab name when given", () => {
    assert.equal(googleSheetsConfigFromEnv({ ...full, GOOGLE_SHEETS_TAB: "Leads test" })?.tab, "Leads test");
  });
});
