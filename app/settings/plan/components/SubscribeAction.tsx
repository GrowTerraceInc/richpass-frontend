'use client';

import { useState } from 'react';
import { csrfFetch } from '@/app/lib/csrfFetch';

const API = process.env.NEXT_PUBLIC_API_ORIGIN!;

type SubscribeResponse = { url?: string };

export default function SubscribeAction() {
  const [loading, setLoading] = useState(false);
  const [log, setLog] = useState<string | null>(null);

  async function handleSubscribe() {
    try {
      setLoading(true);
      setLog('処理中…');
      const res = await csrfFetch(`${API}/api/subscribe`, { method: 'POST' });
      const data: unknown = await res.json().catch(() => ({} as unknown));
      setLog(JSON.stringify({ status: res.status, data }, null, 2));

      const url = (data as SubscribeResponse)?.url;
      if (res.ok && typeof url === 'string') {
        window.location.href = url; // Stripe Checkoutへ
      } else if (res.status === 401) {
        alert('未ログインです。先にログインしてください。');
      } else {
        alert('購読開始に失敗しました。時間をおいて再度お試しください。');
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      setLog(msg);
      alert('エラーが発生しました。');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{display:'grid', gap:8}}>
      <button
        onClick={handleSubscribe}
        disabled={loading}
        style={{ padding:'10px 16px', fontSize:16 }}
      >
        {loading ? '処理中…' : 'プレミアムにアップグレード'}
      </button>
      {log && <pre style={{whiteSpace:'pre-wrap', fontSize:12, color:'#0a0'}}>{log}</pre>}
    </div>
  );
}
