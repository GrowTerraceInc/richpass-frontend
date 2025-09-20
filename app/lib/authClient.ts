// /app/lib/authClient.ts
const API_BASE = process.env.NEXT_PUBLIC_API_BASE!;

/** CSRF Cookie を取得 */
export async function csrfCookie(): Promise<number> {
  const r = await fetch(`${API_BASE}/sanctum/csrf-cookie`, {
    credentials: 'include',
  });
  return r.status; // 200 or 204 期待
}

/** Cookie から XSRF-TOKEN を取り出す（Sanctum 用） */
function getXsrfFromCookie(): string | null {
  if (typeof document === 'undefined') return null;
  const raw = document.cookie.split('; ').find(s => s.startsWith('XSRF-TOKEN='));
  if (!raw) return null;
  const val = raw.split('=')[1];
  try {
    return decodeURIComponent(val);
  } catch {
    return val ?? null;
  }
}

/** メール+パスワードでログイン（Sanctum） */
export async function loginByEmailPassword(email: string, password: string) {
  // 1) 先に CSRF Cookie を取得
  const csrf = await csrfCookie();
  if (![200, 204].includes(csrf)) {
    throw new Error(`CSRF failed: ${csrf}`);
  }

  // 2) Cookie から XSRF-TOKEN を取り出し、ヘッダに付与
  const xsrf = getXsrfFromCookie();
  if (!xsrf) {
    throw new Error('CSRF token missing');
  }

  // 3) /login へ POST（必ず credentials: "include" ＋ X-XSRF-TOKEN）
  const r = await fetch(`${API_BASE}/login`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-XSRF-TOKEN': xsrf,
    },
    body: JSON.stringify({ email, password }),
  });

  if (!r.ok) {
    let msg = `Login failed: ${r.status}`;
    try {
      const j = await r.json();
      if (j?.error) msg = j.error;
    } catch {}
    throw new Error(msg);
  }

  return r.json().catch(() => ({}));
}
