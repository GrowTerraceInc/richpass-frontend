// /app/lib/authClient.ts
const API_BASE = process.env.NEXT_PUBLIC_API_BASE!;

/** CSRF Cookie を取得 */
export async function csrfCookie(): Promise<number> {
  const r = await fetch(`${API_BASE}/sanctum/csrf-cookie`, {
    credentials: 'include',
  });
  return r.status;
}

/** メール+パスワードでログイン */
export async function loginByEmailPassword(email: string, password: string) {
  const csrf = await csrfCookie();
  if (![200, 204].includes(csrf)) {
    throw new Error(`CSRF failed: ${csrf}`);
  }

  const r = await fetch(`${API_BASE}/login`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
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
