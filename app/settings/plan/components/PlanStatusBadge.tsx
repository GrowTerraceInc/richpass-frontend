'use client';

import { useEffect, useState } from 'react';

const API = process.env.NEXT_PUBLIC_API_ORIGIN!;

type StatusRow = {
  user_id: string;
  status: 'current'|'past_due'|'canceled'|string;
  current_plan_id: string|null;
  renews_at: string|null;
  cancel_at_period_end: 0|1|boolean|null;
};

export default function PlanStatusBadge() {
  const [row, setRow] = useState<StatusRow | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${API}/api/subscription/status`, {
      credentials: 'include',
      headers: { Accept: 'application/json' },
    })
      .then(r => r.json())
      .then(d => setRow(d.status ?? null))
      .catch(e => setError(String(e)));
  }, []);

  if (error) return <div style={{color:'#b00'}}>読み込みエラー</div>;
  if (!row)  return null;

  const plan = row.current_plan_id ?? 'FREE';
  const status = row.status ?? '—';
  const renew = row.renews_at ? new Date(row.renews_at).toLocaleDateString() : '—';
  const atEnd = !!row.cancel_at_period_end;

  const chipColor =
    status === 'current' ? '#0a0'
    : status === 'past_due' ? '#b60'
    : status === 'canceled' ? '#999'
    : '#666';

  return (
    <div style={{display:'flex', gap:8, alignItems:'center', flexWrap:'wrap', margin:'8px 0 16px'}}>
      <span style={{border:`1px solid ${chipColor}`, color:chipColor, borderRadius:999, padding:'4px 10px', fontSize:12}}>
        {plan}
      </span>
      <span style={{border:'1px solid #ccc', borderRadius:999, padding:'4px 10px', fontSize:12}}>
      状態: {status}
      </span>
      <span style={{border:'1px solid #ccc', borderRadius:999, padding:'4px 10px', fontSize:12}}>
        次回更新: {renew}
      </span>
      {atEnd && (
        <span style={{border:'1px solid #c00', color:'#c00', borderRadius:999, padding:'4px 10px', fontSize:12}}>
          期末で解約予定
        </span>
      )}
    </div>
  );
}
