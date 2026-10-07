import { GoogleAuth } from "google-auth-library";
import type { LeadAdapter, LeadPayload, LeadResult } from "./types";

/**
 * Google Sheets lead adapter. Server-side only: credentials come from
 * environment variables and are never sent to the browser.
 *
 * One row per contact. The sheet's first row must hold these headers, in this
 * order (the adapter checks this before writing):
 */
export const SHEET_COLUMNS = [
  "phone_normalized",
  "phone_raw",
  "locale",
  "source",
  "campaign",
  "consent_at",
  "consent_version",
  "first_seen_at",
  "last_seen_at",
  "signup_count",
  "status",
] as const;

type Column = (typeof SHEET_COLUMNS)[number];

export type GoogleSheetsConfig = {
  spreadsheetId: string;
  tab: string;
  clientEmail: string;
  privateKey: string;
};

/** Everything the adapter needs from outside. Replaced in tests. */
export type SheetsDeps = {
  getAccessToken: (forceRefresh?: boolean) => Promise<string>;
  fetchImpl: typeof fetch;
  now: () => Date;
  sleep: (ms: number) => Promise<void>;
};

const SHEETS_API = "https://sheets.googleapis.com/v4/spreadsheets";
const SCOPE = "https://www.googleapis.com/auth/spreadsheets";
const TIMEOUT_MS = 8000;
const RETRY_DELAY_MS = 500;

export function googleSheetsConfigFromEnv(env: Record<string, string | undefined> = process.env): GoogleSheetsConfig | null {
  const spreadsheetId = env.GOOGLE_SHEETS_SPREADSHEET_ID?.trim();
  const clientEmail = env.GOOGLE_SERVICE_ACCOUNT_EMAIL?.trim();
  // Hosting dashboards often store the key with literal "\n" instead of newlines.
  const privateKey = env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, "\n").trim();
  if (!spreadsheetId || !clientEmail || !privateKey) return null;
  return { spreadsheetId, tab: env.GOOGLE_SHEETS_TAB?.trim() || "Leads", clientEmail, privateKey };
}

/** Official Google auth library; it caches and refreshes the access token. */
function createTokenProvider(config: GoogleSheetsConfig): SheetsDeps["getAccessToken"] {
  const makeAuth = () =>
    new GoogleAuth({
      credentials: { client_email: config.clientEmail, private_key: config.privateKey },
      scopes: [SCOPE],
    });
  let auth = makeAuth();
  return async (forceRefresh) => {
    if (forceRefresh) auth = makeAuth();
    const token = await auth.getAccessToken();
    if (!token) throw new Error("no access token");
    return token;
  };
}

/** A failed Sheets step. The message names the step, never lead data. */
class SheetsError extends Error {
  constructor(step: string, detail: string) {
    super(`${step}: ${detail}`);
  }
}

function columnLetter(name: Column): string {
  return String.fromCharCode(65 + SHEET_COLUMNS.indexOf(name));
}

export function createGoogleSheetsAdapter(config: GoogleSheetsConfig, overrides: Partial<SheetsDeps> = {}): LeadAdapter {
  const deps: SheetsDeps = {
    getAccessToken: overrides.getAccessToken ?? createTokenProvider(config),
    fetchImpl: overrides.fetchImpl ?? fetch,
    now: overrides.now ?? (() => new Date()),
    sleep: overrides.sleep ?? ((ms) => new Promise((resolve) => setTimeout(resolve, ms))),
  };

  const firstColumn = columnLetter(SHEET_COLUMNS[0]);
  const lastColumn = columnLetter(SHEET_COLUMNS[SHEET_COLUMNS.length - 1]);
  const lastSeen = columnLetter("last_seen_at");
  const count = columnLetter("signup_count");

  /** URL-safe A1 range on the configured tab, e.g. 'Leads'!A2:A. */
  const range = (a1: string) => encodeURIComponent(`'${config.tab.replace(/'/g, "''")}'!${a1}`);

  /**
   * One Sheets REST call. Retries once for an expired token (401) and once for
   * a temporary problem (429, 5xx, network). Never includes lead data in errors.
   */
  async function request(step: string, method: "GET" | "POST" | "PUT", path: string, body?: unknown): Promise<unknown> {
    let forceRefresh = false;
    let retriedAuth = false;
    let retriedTransient = false;

    for (;;) {
      let token: string;
      try {
        token = await deps.getAccessToken(forceRefresh);
      } catch {
        throw new SheetsError(step, "auth failed");
      }

      let response: Response;
      try {
        response = await deps.fetchImpl(`${SHEETS_API}/${config.spreadsheetId}${path}`, {
          method,
          headers: {
            Authorization: `Bearer ${token}`,
            ...(body === undefined ? {} : { "Content-Type": "application/json" }),
          },
          body: body === undefined ? undefined : JSON.stringify(body),
          signal: AbortSignal.timeout(TIMEOUT_MS),
          cache: "no-store",
        });
      } catch {
        if (retriedTransient) throw new SheetsError(step, "network error or timeout");
        retriedTransient = true;
        await deps.sleep(RETRY_DELAY_MS);
        continue;
      }

      if (response.ok) return response.json();
      if (response.status === 401 && !retriedAuth) {
        retriedAuth = true;
        forceRefresh = true;
        continue;
      }
      if ((response.status === 429 || response.status >= 500) && !retriedTransient) {
        retriedTransient = true;
        await deps.sleep(RETRY_DELAY_MS);
        continue;
      }
      throw new SheetsError(step, `HTTP ${response.status}`);
    }
  }

  // The header only needs checking once per running instance.
  let headerChecked = false;
  async function ensureHeader(): Promise<void> {
    if (headerChecked) return;
    const data = (await request("header", "GET", `/values/${range(`${firstColumn}1:${lastColumn}1`)}`)) as { values?: string[][] };
    const found = data.values?.[0] ?? [];
    if (found.length !== SHEET_COLUMNS.length || SHEET_COLUMNS.some((name, i) => found[i] !== name)) {
      throw new SheetsError("header", `row 1 does not match the expected columns (${SHEET_COLUMNS.join(", ")})`);
    }
    headerChecked = true;
  }

  async function upsert(lead: LeadPayload): Promise<LeadResult> {
    await ensureHeader();
    const nowIso = deps.now().toISOString();

    const lookup = (await request("lookup", "GET", `/values/${range(`${firstColumn}2:${firstColumn}`)}`)) as { values?: string[][] };
    const index = (lookup.values ?? []).findIndex((row) => row[0] === lead.contact);

    if (index >= 0) {
      // Known number: touch only last_seen_at and signup_count. Everything else,
      // including first_seen_at, consent and status, is left as it is.
      const rowNumber = index + 2;
      const current = (await request("read count", "GET", `/values/${range(`${count}${rowNumber}`)}`)) as { values?: string[][] };
      const parsed = Number.parseInt(current.values?.[0]?.[0] ?? "", 10);
      const next = (Number.isFinite(parsed) && parsed > 0 ? parsed : 1) + 1;
      await request("update", "PUT", `/values/${range(`${lastSeen}${rowNumber}:${count}${rowNumber}`)}?valueInputOption=RAW`, {
        values: [[nowIso, next]],
      });
      return { ok: true, duplicate: true };
    }

    const row: Record<Column, string | number> = {
      phone_normalized: lead.contact,
      phone_raw: lead.contactRaw,
      locale: lead.locale,
      source: lead.source,
      campaign: lead.campaign,
      consent_at: lead.consentAt,
      consent_version: lead.consentVersion,
      first_seen_at: nowIso,
      last_seen_at: nowIso,
      signup_count: 1,
      status: "new",
    };
    await request(
      "append",
      "POST",
      `/values/${range(`${firstColumn}:${lastColumn}`)}:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`,
      { values: [SHEET_COLUMNS.map((name) => row[name])] },
    );
    return { ok: true, duplicate: false };
  }

  // Serialize submissions for the same number inside one server instance, so a
  // double click cannot create two rows. (Sheets has no unique constraint;
  // see docs/SITE_ARCHITECTURE.md for the remaining cross-instance edge case.)
  const inflight = new Map<string, Promise<unknown>>();
  async function withLock<T>(key: string, task: () => Promise<T>): Promise<T> {
    const previous = inflight.get(key) ?? Promise.resolve();
    const run = previous.catch(() => undefined).then(task);
    inflight.set(key, run);
    try {
      return await run;
    } finally {
      if (inflight.get(key) === run) inflight.delete(key);
    }
  }

  return {
    name: "google-sheets",
    async submit(lead) {
      // This adapter stores phone numbers (Stage 1 is Zalo only).
      if (lead.channel !== "zalo") return { ok: false, reason: "invalid" };
      try {
        return await withLock(lead.contact, () => upsert(lead));
      } catch (error) {
        // Log the failing step only: never phone numbers, tokens or keys.
        const what = error instanceof SheetsError ? error.message : "unexpected error";
        console.error(`[lead-capture] google-sheets failed (${what})`);
        return { ok: false, reason: "failed" };
      }
    },
  };
}
