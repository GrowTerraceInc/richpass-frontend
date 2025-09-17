import fs from "node:fs/promises";
import path from "node:path";
import Papa, { ParseResult } from "papaparse";

export type Profile = {
  userId: string;
  displayName: string;
  email?: string;
  photoUrl?: string;
  locale?: string;
  timezone?: string;
  bio?: string;
};

type CsvRow = {
  userId?: string;
  displayName?: string;
  photoUrl?: string;
  email?: string;
  locale?: string;
  timezone?: string;
  bio?: string;
};

async function readFirst(paths: string[]): Promise<string | null> {
  for (const p of paths) {
    try {
      const txt = await fs.readFile(p, "utf-8");
      return txt;
    } catch { /* try next */ }
  }
  return null;
}

/** モックCSVからプロファイルを読み込む（優先: app/mock → public/mock） */
export async function loadProfile(userId = "u_demo_001"): Promise<Profile> {
  const cwd = process.cwd();
  const candidates = [
    path.join(cwd, "app", "mock", "Profiles.csv"),
    path.join(cwd, "app", "mock", "profiles.csv"),
    path.join(cwd, "public", "mock", "Profiles.csv"),
    path.join(cwd, "public", "mock", "profiles.csv"),
  ];

  const csv = await readFirst(candidates);
  if (!csv) {
    // 何も無ければダミーで返す
    return {
      userId,
      displayName: "Daichi",
      email: "daichi@example.com",
      photoUrl: "",
      locale: "ja-JP",
      timezone: "Asia/Tokyo",
    };
  }

  const parsed: ParseResult<CsvRow> = Papa.parse<CsvRow>(csv, {
    header: true,
    skipEmptyLines: true,
  });
  const rows = parsed.data;

  const row = rows.find(r => String(r.userId ?? "").trim() === userId);
  if (!row) {
    return {
      userId,
      displayName: "User",
      email: "user@example.com",
      photoUrl: "",
      locale: "ja-JP",
      timezone: "Asia/Tokyo",
    };
  }

  return {
    userId: String(row.userId ?? userId),
    displayName: String(row.displayName ?? "User"),
    email: row.email ? String(row.email) : undefined,
    photoUrl: row.photoUrl ? String(row.photoUrl) : undefined,
    locale: row.locale ? String(row.locale) : undefined,
    timezone: row.timezone ? String(row.timezone) : undefined,
    bio: row.bio ? String(row.bio) : undefined,
  };
}
