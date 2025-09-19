'use client';

import { useEffect, useState } from 'react';
import styles from '../Plan.module.css';
import PortalAction from './PortalAction';
import PlanChangeAction from './PlanChangeAction';

const API = process.env.NEXT_PUBLIC_API_ORIGIN!;

/** 画面が最終的に使う形 */
type StatusRow = {
  user_id?: string | null;
  status: string; // 'current'|'past_due'|'canceled' など
  current_plan_id: string | null;
  renews_at: string | null; // ISO
  cancel_at_period_end: boolean | 0 | 1 | null;
  last4?: string | null;
};

/** 旧API: { status: { ... } } */
type ApiLegacy = {
  status?: {
    user_id?: string | null;
    status?: string | null;
    current_plan_id?: string | null;
    renews_at?: string | null;
    cancel_at_period_end?: boolean | 0 | 1 | null;
    last4?: string | null;
  } | null;
};

/** 新API: { status, current_plan_id, renews_at, payment_method:{brand,last4} } */
type ApiFlat = {
  user_id?: string | null;
  status?: string | null; // ← JSONで "current"
  current_plan_id?: string | null; // ← "PREMIUM" 等
  renews_at?: string | null;
  cancel_at_period_end?: boolean | 0 | 1 | null;
  last4?: string | null; // 互換のため入っている可能性あり
  payment_method?: {
    brand?: string | null;
    last4?: string | null;
  } | null;
};

function isLegacy(resp: ApiLegacy | ApiFlat): resp is ApiLegacy {
  // 旧形式は top-level に "status" オブジェクトを持つ（新形式は string）
  const s = (resp as ApiLegacy).status;
  return typeof s === 'object' && s !== null;
}

export default function PlanOverviewCard() {
  const [row, setRow] = useState<StatusRow | null>(null);
  const [unauth, setUnauth] = useState(false);

  useEffect(() => {
    fetch(`${API}/api/subscription/status`, {
      credentials: 'include',
      headers: { Accept: 'application/json' },
    })
      .then(async (r) => {
        if (r.status === 401) {
          setUnauth(true);
          return null;
        }
        return (await r.json()) as ApiLegacy | ApiFlat;
      })
      .then((d) => {
        if (!d) return;

        // 旧/新フォーマットを正規化
        let normalized: StatusRow;
        if (isLegacy(d)) {
          const s = d.status ?? null;
          normalized = {
            user_id: s?.user_id ?? null,
            status: s?.status ?? 'current',
            current_plan_id: s?.current_plan_id ?? 'free',
            renews_at: s?.renews_at ?? null,
            cancel_at_period_end: s?.cancel_at_period_end ?? null,
            last4: s?.last4 ?? null,
          };
        } else {
          normalized = {
            user_id: d.user_id ?? null,
            status: d.status ?? 'current',
            current_plan_id: d.current_plan_id ?? 'free',
            renews_at: d.renews_at ?? null,
            cancel_at_period_end: d.cancel_at_period_end ?? null,
            // ← ここが肝：新形式の payment_method.last4 を優先
            last4: d.payment_method?.last4 ?? d.last4 ?? null,
          };
        }

        setRow(normalized);
      })
      .catch(() => {
        // ネットワークエラーは無視（UIは非表示のまま）
      });
  }, []);

  if (unauth) {
    return (
      <section className={styles.card}>
        <h2 className={styles.cardTitle}>現在のプラン</h2>
        <div className={styles.subtle}>
          ログインしてください。
          <a href="/login-lite" style={{ textDecoration: 'underline', marginLeft: 6 }}>
            ログインする
          </a>
        </div>
      </section>
    );
  }

  if (!row) return null;

  const planText = (row.current_plan_id ?? 'FREE').toUpperCase();
  const statusText = row.status ?? '—';
  const renewText =
    row.renews_at && !Number.isNaN(new Date(row.renews_at).getTime())
      ? `${new Date(row.renews_at).getFullYear()}/${new Date(row.renews_at).getMonth() + 1}/${new Date(row.renews_at).getDate()}`
      : '—';
  const last4 = row.last4 ?? null;
  const atEnd =
    typeof row.cancel_at_period_end === 'boolean'
      ? row.cancel_at_period_end
      : row.cancel_at_period_end === 1;

  return (
    <section className={styles.card}>
      <h2 className={styles.cardTitle}>現在のプラン</h2>
      <div className={styles.badges}>
        <span className={`${styles.chip} ${styles.chipPrimary}`}>{planText}</span>
        <span className={styles.chip}>状態: {statusText}</span>
        <span className={styles.chip}>更新日: {renewText}</span>
        {/* last4 が取れていれば表示 */}
        {last4 ? (
          <span className={styles.chip}>支払い方法: •••• {last4}</span>
        ) : (
          <span className={styles.chip}>支払い方法: –</span>
        )}
        {atEnd && <span className={`${styles.chip} ${styles.chipWarn}`}>期末で解約予定</span>}
      </div>
      <div className={styles.row}>
        <div className={styles.btnRow}>
          <PortalAction />
          <PlanChangeAction plan={planText} />
        </div>
        <div />
      </div>
    </section>
  );
}
