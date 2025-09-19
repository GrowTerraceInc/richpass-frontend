'use client';

import { useEffect, useState } from 'react';
import styles from '../Plan.module.css';

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
  const [unauth, setUnauth] = useState(false);

  useEffect(() => {
    fetch(`${API}/api/subscription/status`, { credentials:'include', headers:{Accept:'application/json'} })
      .then(async r => { if (r.status === 401) { setUnauth(true); return { status:null }; } return r.json(); })
      .then(d => setRow(d.status ?? null))
      .catch(() => {});
  }, []);

  if (unauth) return <div className={styles.subtle}>ログインが必要です。<a href="/login-lite" style={{textDecoration:'underline'}}>ログインする</a></div>;
  if (!row) return null;

  const plan   = row.current_plan_id ?? 'FREE';
  const status = row.status ?? '—';
  const renew  = row.renews_at ? new Date(row.renews_at).toLocaleDateString() : '—';
  const atEnd  = !!row.cancel_at_period_end;

  const planCls = `${styles.chip} ${styles.chipPrimary}`;
  return (
    <div className={styles.badges}>
      <span className={planCls}>{plan}</span>
      <span className={styles.chip}>状態: {status}</span>
      <span className={styles.chip}>次回更新: {renew}</span>
      {atEnd && <span className={`${styles.chip} ${styles.chipWarn}`}>期末で解約予定</span>}
    </div>
  );
}
