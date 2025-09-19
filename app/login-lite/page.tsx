'use client';

import { useState } from 'react';

const API = process.env.NEXT_PUBLIC_API_ORIGIN!;

function getXsrf() {
  const m = document.cookie.split('; ').find(v => v.startsWith('XSRF-TOKEN='));
  return m ? decodeURIComponent(m.split('=')[1]) : '';
}

export default function Page() {
  const [email, setEmail] = useState('test@richpassapp.com');
  const [password, setPassword] = useState('Abcdef1!');
  const [log, setLog] = useState<string>('準備OK');

  const append = (x: unknown) => setLog(p => p + '\n' + JSON.stringify(x, null, 2));

  async function login() {
    try {
      await fetch(`${API}/sanctum/csrf-cookie`, { credentials:'include', headers:{Accept:'application/json'} });
      const xsrf = getXsrf();
      const r = await fetch(`${API}/api/auth/login`, {
        method:'POST',
        credentials:'include',
        headers:{ Accept:'application/json','Content-Type':'application/json','X-XSRF-TOKEN': xsrf },
        body: JSON.stringify({ email, password }),
      });
      const d = await r.json().catch(()=>({}));
      append({ login_status:r.status, d });
    } catch (e:any) { append({ login_error:String(e?.message||e) }); }
  }

  async function logout() {
    try {
      await fetch(`${API}/sanctum/csrf-cookie`, { credentials:'include', headers:{Accept:'application/json'} });
      const xsrf = getXsrf();
      const r = await fetch(`${API}/api/logout`, {
        method:'POST', credentials:'include', headers:{ Accept:'application/json','X-XSRF-TOKEN': xsrf },
      });
      const d = await r.json().catch(()=>({}));
      append({ logout_status:r.status, d });
    } catch (e:any) { append({ logout_error:String(e?.message||e) }); }
  }

  return (
    <main style={{ padding:24, fontFamily:'system-ui' }}>
      <h1>Login (Lite)</h1>
      <div style={{ display:'grid', gap:8, maxWidth:420 }}>
        <label>Email<input value={email} onChange={e=>setEmail(e.target.value)} style={{ width:'100%' }} /></label>
        <label>Password<input type="password" value={password} onChange={e=>setPassword(e.target.value)} style={{ width:'100%' }} /></label>
        <div style={{ display:'flex', gap:8 }}>
          <button onClick={login}>ログイン</button>
          <button onClick={logout}>ログアウト</button>
        </div>
        <pre style={{ background:'#111', color:'#0f0', padding:12, minHeight:160, whiteSpace:'pre-wrap' }}>{log}</pre>
      </div>
    </main>
  );
}
