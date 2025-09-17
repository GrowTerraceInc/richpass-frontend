import fs from "node:fs/promises";
import path from "node:path";
import Papa, { ParseResult } from "papaparse";

export type Preferences = {
  userId: string;
  notifyEmail: boolean;
  productEmail: boolean;
  marketingOptIn: boolean;
  notifyPush: boolean;
  notifyInApp: boolean;
  locale?: string;
  timezone?: string;
  theme?: "system" | "light" | "dark";
};

type CsvRow = Partial<Preferences>;

function toBool(v: unknown, def = false): boolean {
  if (typeof v === "boolean") return v;
  const s = String(v ?? "").trim().toLowerCase();
  if (!s) return def;
  return s === "true" || s === "1" || s === "yes";
}

async function readFirst(paths: string[]): Promise<string | null> {
  for (const p of paths) {
    try { return await fs.readFile(p, "utf-8"); } catch { /* try next */ }
  }
  return null;
}

/** モックCSVからUserPreferencesを読み込み（app/mock を優先） */
export async function loadPreferences(userId = "u_demo_001"): Promise<Preferences> {
  const cwd = process.cwd();
  const candidates = [
    path.join(cwd, "app", "mock", "Preferences.csv"),
    path.join(cwd, "app", "mock", "preferences.csv"),
    path.join(cwd, "public", "mock", "Preferences.csv"),
    path.join(cwd, "public", "mock", "preferences.csv"),
  ];

  const csv = await readFirst(candidates);
  if (!csv) {
    // デフォルト
    return {
      userId,
      notifyEmail: true,
      productEmail: true,
      marketingOptIn: false,
      notifyPush: false,
      notifyInApp: true,
      locale: "ja-JP",
      timezone: "Asia/Tokyo",
      theme: "system",
    };
  }

  const parsed: ParseResult<CsvRow> = Papa.parse<CsvRow>(csv, { header: true, skipEmptyLines: true });
  const row = parsed.data.find(r => String(r.userId ?? "").trim() === userId);

  if (!row) return await loadPreferences(); // 既定にフォールバック

  return {
    userId,
    notifyEmail: toBool(row.notifyEmail, true),
    productEmail: toBool(row.productEmail, true),
    marketingOptIn: toBool(row.marketingOptIn, false),
    notifyPush: toBool(row.notifyPush, false),
    notifyInApp: toBool(row.notifyInApp, true),
    locale: row.locale,
    timezone: row.timezone,
    theme: (row.theme as Preferences["theme"]) ?? "system",
  };
}
