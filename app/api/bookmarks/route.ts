import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const COOKIE_KEY = "rp_bookmarks";

type BookmarkPayload = {
  lessonId: string;
  action?: "add" | "remove";
};

async function readList(): Promise<string[]> {
  const store = await cookies(); // ★ await 必須
  const raw = store.get(COOKIE_KEY)?.value;
  if (!raw) return [];
  try {
    const arr = JSON.parse(raw) as unknown;
    return Array.isArray(arr) && arr.every((s) => typeof s === "string") ? arr : [];
  } catch {
    return [];
  }
}

async function writeList(list: string[]): Promise<void> {
  const store = await cookies(); // ★ await 必須
  store.set({
    name: COOKIE_KEY,
    value: JSON.stringify(list),
    httpOnly: false, // クライアントから直接参照しないなら true でもOK
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365, // 1年
  });
}

export async function GET() {
  const lessonIds = await readList();
  return NextResponse.json({ lessonIds });
}

export async function POST(req: Request) {
  const body = (await req.json()) as BookmarkPayload;
  const { lessonId, action } = body;

  if (!lessonId || typeof lessonId !== "string") {
    return NextResponse.json({ error: "lessonId is required" }, { status: 400 });
  }

  const set = new Set(await readList());
  if (action === "remove") set.delete(lessonId);
  else set.add(lessonId);

  const lessonIds = Array.from(set);
  await writeList(lessonIds);

  return NextResponse.json({ ok: true, lessonIds });
}
