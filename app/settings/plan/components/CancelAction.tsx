'use client';

import { useState } from 'react';
import { csrfFetch } from '@/app/lib/csrfFetch';

const API = process.env.NEXT_PUBLIC_API_ORIGIN!;

export default function CancelAction() {
  const [loading, setLoading] = useState(false);
  const [log, setLog] = useState<string | null>(null);

  async function call(atPeriodEnd: boolean) {
    if (!confirm(atPeriodEnd ? '今期の終了時に解約します。よろしいですか？' : '今すぐ解約します。よろしいですか？')) return;
    try {
      setLoading(true);
      setLog('処理中…');
      const res = await csrfFetch(`${API}/api/subscription/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ atPeriodEnd }),
      });
      const data: unknown = await res.json().catch(() => ({} as unknown));
      setLog(JSON.stringify({ status: res.status, data }, null, 2));
      // 状態を再取得して画面側で反映したいときは、ここで SWR/React Query などを叩く
      if (!res.ok) alert('解約に失敗しました。時間をおいて再度お試しください。');
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
      <div style={{display:'flex', gap:8, flexWrap:'wrap'}}>
        <button onClick={()=>call(true)}  disabled={loading} style={{ padding:'8px 12px' }}>期間終了で解約</button>
        <button onClick={()=>call(false)} disabled={loading} style={{ padding:'8px 12px', color:'#b00', border:'1px solid #b00' }}>
          即時解約
        </button>
      </div>
      {log && <pre style={{whiteSpace:'pre-wrap', fontSize:12, color:'#0a0'}}>{log}</pre>}
    </div>
  );
}
