'use client';

import { useEffect, useState } from 'react';
import styles from '../Plan.module.css';
import PortalAction from './PortalAction';
import PlanChangeAction from './PlanChangeAction';

const API = process.env.NEXT_PUBLIC_API_ORIGIN!;

type StatusRow = {
  user_id: string;
  status: 'current'|'past_due'|'canceled'|string;
  current_plan_id: string|null;
  renews_at: string|null;
  cancel_at_period_end: 0|1|boolean|null;
  last4?: string|null;
};

export default function PlanOverviewCard() {
  const [row, setRow] = useState<StatusRow | null>(null);
  const [unauth, setUnauth] = useState(false);

  useEffect(() => {
    fetch(`${API}/api/subscription/status`, { credentials:'include', headers:{Accept:'application/json'} })
      .then(async r => { if (r.status === 401) { setUnauth(true); return { status:null }; } return r.json(); })
      .then(d => setRow(d.status ?? null))
      .catch(() => {});
  }, []);

  if (unauth) return (
    <section className={styles.card}>
      <h2 className={styles.cardTitle}>現在のプラン</h2>
      <div className={styles.subtle}>ログインしてください。<a href="/login-lite" style={{textDecoration:'underline'}}>ログインする</a></div>
    </section>
  );

  if (!row) return null;

  const plan   = (row.current_plan_id ?? 'FREE').toUpperCase();
  const status = row.status ?? '—';
  const renew  = row.renews_at ? new Date(row.renews_at).toLocaleDateString() : '—';
  const last4  = row.last4 ?? null;
  const atEnd  = !!row.cancel_at_period_end;

  return (
    <section className={styles.card}>
      <h2 className={styles.cardTitle}>現在のプラン</h2>
      <div className={styles.badges}>
        <span className={`${styles.chip} ${styles.chipPrimary}`}>{plan}</span>
        <span className={styles.chip}>状態: {status}</span>
        <span className={styles.chip}>更新日: {renew}</span>
        {last4 && <span className={styles.chip}>支払い方法: **** **** **** {last4}</span>}
        {atEnd && <span className={`${styles.chip} ${styles.chipWarn}`}>期末で解約予定</span>}
      </div>
      <div className={styles.row}>
        <div className={styles.btnRow}>
          <PortalAction />
          <PlanChangeAction plan={plan} />
        </div>
        <div />
      </div>
    </section>
  );
}
