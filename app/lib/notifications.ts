import fs from "node:fs/promises";
import path from "node:path";
import Papa, { ParseResult } from "papaparse";

export type NotificationType = "info" | "important" | "system";
export type NotificationIcon = "trophy" | "handshake" | "info";

export type Notification = {
  id: string;
  title: string;
  bodyMd?: string;
  publishedAt: string;
  isPinned: boolean;
  linkUrl?: string;
  tags: string[];
  icon?: NotificationIcon;
  type?: NotificationType;
};

/** CSVの列ゆらぎを吸収するための型（どれかが来る想定） */
type CsvRow = {
  id?: string;
  title?: string;
  body_md?: string;
  bodyMd?: string;

  published_at?: string;
  publishedAt?: string;
  createdAt?: string;

  is_pinned?: string | number | boolean;
  isPinned?: string | number | boolean;

  link_url?: string;
  linkUrl?: string;

  tags_json?: string; // JSON配列 or カンマ区切り or 単一ワード
  tags?: string;

  icon?: NotificationIcon;
  type?: NotificationType;
};

function toBool(v: unknown): boolean {
  if (typeof v === "boolean") return v;
  const s = String(v ?? "").trim().toLowerCase();
  return s === "true" || s === "1" || s === "yes";
}

function parseTags(v: unknown): string[] {
  if (!v) return [];
  const s = String(v).trim();
  if (!s) return [];
  if (s.startsWith("[") && s.endsWith("]")) {
    try {
      const arr = JSON.parse(s);
      return Array.isArray(arr) ? arr.map((t) => String(t)) : [];
    } catch {
      return [];
    }
  }
  return s.split(",").map((t) => t.trim()).filter(Boolean);
}

function inferIcon(n: Pick<Notification, "title" | "tags">): NotificationIcon {
  const tags = (n.tags ?? []).map((t) => t.toLowerCase());
  const title = (n.title ?? "").toLowerCase();
  if (tags.includes("achievement") || /クリア|達成|complete/.test(title)) return "trophy";
  if (tags.includes("friend") || /友達|申請|friend/.test(title)) return "handshake";
  return "info";
}

async function readFirst(paths: string[]): Promise<string | null> {
  for (const p of paths) {
    try {
      const txt = await fs.readFile(p, "utf-8");
      return txt;
    } catch {
      /* try next */
    }
  }
  return null;
}

/** dev/prod 双方で CSV を読み込む。無ければ空配列（500回避） */
export async function loadNotifications(): Promise<Notification[]> {
  const cwd = process.cwd();

  // 優先順: app/mock(大小両方) → public/mock(大小両方)
  const candidates = [
    path.join(cwd, "app", "mock", "Notifications.csv"),
    path.join(cwd, "app", "mock", "notifications.csv"),
    path.join(cwd, "public", "mock", "Notifications.csv"),
    path.join(cwd, "public", "mock", "notifications.csv"),
  ];

  let csv: string | null = await readFirst(candidates);

  // 最後の保険: HTTPで /mock/notifications.csv を試す（開発時）
  if (!csv) {
    try {
      const base =
        process.env.NEXT_PUBLIC_APP_ORIGIN ??
        (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");
      const res = await fetch(`${base}/mock/notifications.csv`, { cache: "no-store" });
      if (res.ok) csv = await res.text();
    } catch {
      /* ignore */
    }
  }

  if (!csv) {
    console.warn(
      `[notifications] CSV not found. Tried:\n${candidates.map((p) => ` - ${p}`).join("\n")}\n(and GET /mock/notifications.csv)`
    );
    return [];
  }

  const parsed: ParseResult<CsvRow> = Papa.parse<CsvRow>(csv, {
    header: true,
    skipEmptyLines: true,
  });
  const rows: CsvRow[] = parsed.data;

  const items: Notification[] = rows
    .map((row): Notification | null => {
      const publishedAt = row.published_at || row.publishedAt || row.createdAt || "";
      const tags = parseTags(row.tags_json ?? row.tags);

      const n: Notification = {
        id: String(row.id ?? "").trim(),
        title: String(row.title ?? "").trim(),
        bodyMd: row.body_md ?? row.bodyMd ?? "",
        publishedAt,
        isPinned: toBool(row.is_pinned ?? row.isPinned),
        linkUrl: row.link_url ?? row.linkUrl ?? "",
        tags,
        icon: (row.icon as NotificationIcon) ?? undefined,
        type: (row.type as NotificationType) ?? undefined,
      };

      if (!n.icon) n.icon = inferIcon({ title: n.title, tags: n.tags });
      if (!n.id || !n.title || !n.publishedAt) return null;
      return n;
    })
    .filter((x): x is Notification => x !== null)
    .sort((a, b) => {
      if (!!a.isPinned !== !!b.isPinned) return a.isPinned ? -1 : 1;
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    });

  return items;
}

export async function getNotificationById(id: string): Promise<Notification | null> {
  const items = await loadNotifications();
  return items.find((x) => x.id === id) ?? null;
}
