// app/lib/auth.ts
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

/** ログインセッション（必要に応じて拡張） */
export type Session = {
  userId: string;
  email?: string;
} | null;

/**
 * サーバー側でログインを検知
 * - HTTP-only Cookie "rp_session" をJWTと仮定して検証
 * - まだJWTでない場合は、簡易に存在チェックだけにしてOK（コメント参照）
 */
export async function getSession(): Promise<Session> {
  const jar = await cookies();
  const token = jar.get("rp_session")?.value;
  if (!token) return null;

  // ★運用前：まずは存在チェックだけで可
  // return { userId: "placeholder" };

  // ★本番：JWTを検証（署名鍵は環境変数）
  try {
    const secret = process.env.AUTH_JWT_SECRET || "dev-secret";
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(secret)
    );
    const userId =
      (typeof payload.sub === "string" && payload.sub) ||
      (typeof payload.userId === "string" && payload.userId) ||
      "";
    if (!userId) return null;
    const email = typeof payload.email === "string" ? payload.email : undefined;
    return { userId, email };
  } catch {
    return null;
  }
}
