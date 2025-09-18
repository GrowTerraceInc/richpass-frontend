'use client';

import { useEffect, useState } from 'react';
const API = process.env.NEXT_PUBLIC_API_ORIGIN!;

type Notification = {
  id: string; title: string; body_md: string; type: string;
  is_pinned: 0|1; link_url?: string|null; published_at: string;
};

export default function Page() {
  const [items, setItems] = useState<Notification[]>([]);
  const [err, setErr] = useState<string|null>(null);

  useEffect(() => {
    fetch(`${API}/api/notifications`, { credentials:'include', headers:{Accept:'application/json'} })
      .then(r => r.json()).then(d => setItems(d.items ?? []))
      .catch(e => setErr(String(e)));
  }, []);

  return (
    <main style={{ padding:24, fontFamily:'system-ui' }}>
      <h1>お知らせ</h1>
      {err && <p style={{color:'red'}}>{err}</p>}
      <ul style={{display:'grid', gap:12, padding:0, listStyle:'none'}}>
        {items.map(n => (
          <li key={n.id} style={{border:'1px solid #ddd', borderRadius:12, padding:12}}>
            {n.is_pinned ? <span style={{fontSize:12, color:'#b50', marginRight:8}}>📌ピン留め</span> : null}
            <a href={`/notifications/${n.id}`} style={{fontSize:16, textDecoration:'underline'}}>{n.title}</a>
            <div style={{fontSize:12, color:'#666'}}>{new Date(n.published_at).toLocaleString()}</div>
          </li>
        ))}
      </ul>
    </main>
  );
}
