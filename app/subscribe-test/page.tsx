'use client';

import { useState } from 'react';

const API = process.env.NEXT_PUBLIC_API_ORIGIN!; // 例: https://api.richpassapp.com

function getXsrfFromCookie() {
  const m = document.cookie.split('; ').find(v => v.startsWith('XSRF-TOKEN='));
  return m ? decodeURIComponent(m.split('=')[1]) : '';
}

async function ensureCsrf() {
  if (!getXsrfFromCookie()) {
    await fetch(`${API}/sanctum/csrf-cookie`, {
      credentials: 'include',
      headers: { Accept: 'application/json' },
    });
  }
}

export default function Page() {
  const [email, setEmail] = useState('test@richpassapp.com');
  const [password, setPassword] = useState('Abcdef1!');
  const [log, setLog] = useState<string>('準備OK');

  const append = (x: unknown) =>
    setLog((p) => p + '\n' + JSON.stringify(x, null, 2));

  async function login() {
    const res = await fetch(`${API}/api/auth/login`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json().catch(() => ({}));
    append({ login_status: res.status, data });
  }

  async function me() {
    const res = await fetch(`${API}/api/me`, {
      credentials: 'include',
      headers: { 'Accept': 'application/json' },
    });
    const data = await res.json().catch(() => ({}));
    append({ me_status: res.status, data });
  }

  async function subscribe() {
    const res = await fetch(`${API}/api/subscribe`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Accept': 'application/json' },
    });
    const data = await res.json().catch(() => ({}));
    append({ subscribe_status: res.status, data });
    if (res.ok && data?.url) window.location.href = data.url;
    if (res.status === 401) append({ hint: '未ログインです。先に「ログイン」を押してください。' });
  }

  return (
    <main style={{ padding: 24, fontFamily: 'system-ui' }}>
      <h1>Subscribe Test</h1>
      <p>1) ログイン → 2) Me → 3) 購読を開始 の順で確認します。</p>

      <div style={{ display:'grid', gap:8, maxWidth:420 }}>
        <label>Email<input value={email} onChange={e=>setEmail(e.target.value)} style={{ width:'100%' }} /></label>
        <label>Password<input type="password" value={password} onChange={e=>setPassword(e.target.value)} style={{ width:'100%' }} /></label>

        <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
          <button onClick={login} style={{ padding:'8px 12px' }}>1) ログイン</button>
          <button onClick={me} style={{ padding:'8px 12px' }}>2) Me</button>
          <button onClick={subscribe} style={{ padding:'8px 12px' }}>3) 購読を開始</button>
        </div>

        <pre style={{ background:'#111', color:'#0f0', padding:12, minHeight:200, whiteSpace:'pre-wrap' }}>{log}</pre>
      </div>
    </main>
  );
}
