// src/app/test-auth/page.tsx
'use client';
import { useState } from 'react';
import { getCsrfCookie, login, logout, me } from '@/lib/api';

type Log = string;

// 型安全にエラーメッセージへ変換
function errMsg(e: unknown): string {
  if (e instanceof Error) return e.message;
  if (typeof e === 'string') return e;
  try { return JSON.stringify(e); } catch { return String(e); }
}

export default function TestAuthPage() {
  const [logs, setLogs] = useState<Log[]>([]);
  const push = (msg: string) => setLogs((prev) => [...prev, msg]);

  const run = async () => {
    setLogs([]);

    try {
      push('1) csrf-cookie ...');
      await getCsrfCookie();
      push('csrf OK');

      push('2) login ...');
      // ★ ご自身の検証ユーザーに置換
      await login('test@richpassapp.com', 'Passw0rd!');
      push('login OK');

      push('3) me after login ...');
      const u1 = await me();
      push(`me 200: ${u1.name} <${u1.email}>`);

      push('4) logout ...');
      await logout();
      push('logout OK');

      push('5) me after logout ...');
      try {
        await me(); // ここは UNAUTH を投げる想定
        push('me unexpected 200');
      } catch (e: unknown) {
        const m = errMsg(e);
        if (m === 'UNAUTH') {
          push('me 401 → UNAUTH OK');
        } else {
          push(`me after logout unexpected error: ${m}`);
        }
      }
    } catch (e: unknown) {
      push(`ERR ${errMsg(e)}`);
    }
  };

  return (
    <main style={{ padding: 16 }}>
      <h1>Auth Smoke Test</h1>
      <button onClick={run} style={{ marginTop: 12, padding: '8px 12px' }}>
        Run auth smoke
      </button>
      <pre style={{ marginTop: 16 }}>
        {logs.join('\n')}
      </pre>
    </main>
  );
}
