'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { csrfFetch } from '@/app/lib/csrfFetch';
const API = process.env.NEXT_PUBLIC_API_ORIGIN!;

type Notification = {
  id: string; title: string; body_md: string; type: string;
  is_pinned: 0|1; link_url?: string|null; published_at: string;
};

export default function Page({ params }: { params: { id: string } }) {
  const [n, setN] = useState<Notification | null>(null);
  const [err, setErr] = useState<string|null>(null);
  const id = params.id;

  useEffect(() => {
    fetch(`${API}/api/notifications/${id}`, {
      credentials:'include', headers:{ Accept:'application/json' }
    })
      .then(r => r.json())
      .then(d => setN(d.notification ?? null))
      .catch(e => setErr(String(e)));
  }, [id]);

  async function markRead() {
    try {
      const r = await csrfFetch(`${API}/api/notifications/${id}/read`, { method:'POST' });
      if (!r.ok) throw new Error(`read ${r.status}`);
      alert('既読にしました');
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : String(e));
    }
  }

  if (err) return <main style={{padding:24}}><p style={{color:'red'}}>{err}</p></main>;
  if (!n)  return <main style={{padding:24}}><p>読み込み中…</p></main>;

  return (
    <main style={{ padding:24, fontFamily:'system-ui' }}>
      <Link href="/notifications" style={{fontSize:12}}>&larr; 戻る</Link>
      <h1>{n.title}</h1>
      <div style={{fontSize:12, color:'#666'}}>{new Date(n.published_at).toLocaleString()}</div>
      <div style={{marginTop:12, whiteSpace:'pre-wrap'}}>{n.body_md}</div>
      <div style={{marginTop:16, display:'flex', gap:8}}>
        <button onClick={markRead}>既読にする</button>
        {n.link_url ? <a href={n.link_url} target="_blank" rel="noreferrer">関連リンク</a> : null}
      </div>
    </main>
  );
}
