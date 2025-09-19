'use client';

import { useState } from 'react';
import styles from '../Plan.module.css';
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
      if (!res.ok) alert('解約に失敗しました。時間をおいて再度お試しください。');
    } finally { setLoading(false); }
  }

  return (
    <div>
      <div className={styles.btnRow}>
        <button onClick={()=>call(true)} disabled={loading} className={styles.btn}>期間終了で解約</button>
        <button onClick={()=>call(false)} disabled={loading} className={`${styles.btn} ${styles.btnDanger}`}>即時解約</button>
      </div>
      <div className={styles.kicker}>解約はいつでも再開できます。即時解約はすぐに視聴不可になります。</div>
      {log && <pre className={styles.kicker} style={{whiteSpace:'pre-wrap'}}>{log}</pre>}
    </div>
  );
}
