'use client';

import { useState } from 'react';

const API = (process.env.NEXT_PUBLIC_API_ORIGIN || 'https://api.richpassapp.com').replace(/\/$/, '');

function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  try {
    return JSON.stringify(err);
  } catch {
    return String(err);
  }
}

export default function LoginLitePage() {
  const [email, setEmail] = useState('test@richpassapp.com');
  const [password, setPassword] = useState('');
  const [log, setLog] = useState<string>('準備OK');
  const [busy, setBusy] = useState(false);

  const getXsrfTokenFromCookie = () => {
    const m = document.cookie.split('; ').find((c) => c.startsWith('XSRF-TOKEN='));
    return m ? decodeURIComponent(m.split('=')[1]) : '';
  };

  const handleLogin = async () => {
    setBusy(true);
    try {
      setLog('CSRF を取得中…');

      // 1) CSRF Cookie
      {
        const r = await fetch(`${API}/sanctum/csrf-cookie`, {
          credentials: 'include',
        });
        if (!r.ok) throw new Error(`csrf-cookie HTTP ${r.status}`);
      }

      // 2) /login
      setLog('ログイン中…');
      const xsrf = getXsrfTokenFromCookie();

      const r2 = await fetch(`${API}/login`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'X-XSRF-TOKEN': xsrf,
        },
        body: JSON.stringify({ email, password }),
      });

      const data: unknown = await r2.json().catch(() => ({}));

      if (!r2.ok) {
        setLog(`login: HTTP ${r2.status}\n` + JSON.stringify(data, null, 2));
        return;
      }

      setLog('ログイン成功！/settings/plan に移動します…');
      location.href = '/settings/plan';
    } catch (err: unknown) {
      setLog(`エラー: ${getErrorMessage(err)}`);
    } finally {
      setBusy(false);
    }
  };

  const handleLogout = async () => {
    setBusy(true);
    try {
      setLog('ログアウト中…');

      const xsrf = getXsrfTokenFromCookie();
      const r = await fetch(`${API}/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          Accept: 'application/json',
          'X-XSRF-TOKEN': xsrf,
        },
      });

      if (!r.ok) {
        const d: unknown = await r.json().catch(() => ({}));
        setLog(`logout: HTTP ${r.status}\n` + JSON.stringify(d, null, 2));
        return;
      }

      setLog('ログアウトしました。');
    } catch (err: unknown) {
      setLog(`エラー: ${getErrorMessage(err)}`);
    } finally {
      setBusy(false);
    }
  };

  return (
    <main style={{ maxWidth: 640, margin: '40px auto', padding: '0 20px' }}>
      <h1>Login (Lite)</h1>

      <div style={{ marginTop: 16 }}>
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ display: 'block', width: '100%', padding: 6 }}
        />
      </div>

      <div style={{ marginTop: 12 }}>
        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ display: 'block', width: '100%', padding: 6 }}
        />
      </div>

      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
        <button onClick={handleLogin} disabled={busy} style={{ padding: '6px 12px' }}>
          ログイン
        </button>
        <button onClick={handleLogout} disabled={busy} style={{ padding: '6px 12px' }}>
          ログアウト
        </button>
      </div>

      <pre
        style={{
          marginTop: 16,
          background: '#111',
          color: '#9fef00',
          padding: 12,
          borderRadius: 6,
          whiteSpace: 'pre-wrap',
        }}
      >
        {log}
      </pre>
    </main>
  );
}
