'use client';

import { useEffect, useMemo, useState } from 'react';
import styles from '../Plan.module.css';

const API = process.env.NEXT_PUBLIC_API_ORIGIN!;

type Item = {
  id: string;
  // サーバ都合で date or created が来るので両対応
  date?: string | null;
  created?: string | null;
  description?: string | null; // 例: "2025年9月利用分"
  amount?: number | null;      // **円**で返ってくる前提（/100しない）
  currency?: string | null;    // 例: 'jpy'
  receipt_url?: string | null;
  receiptUrl?: string | null;  // 互換
};

export default function BillingHistoryList() {
  const [items, setItems] = useState<Item[]>([]);
  const [limit, setLimit] = useState(12);
  const [unauth, setUnauth] = useState(false);

  useEffect(() => {
    fetch(`${API}/api/billing/history`, {
      credentials: 'include',
      headers: { Accept: 'application/json' },
    })
      .then(async (r) => {
        if (r.status === 401) {
          setUnauth(true);
          return { items: [] as Item[] };
        }
        return r.json();
      })
      .then((d: { items?: Item[] }) => setItems(Array.isArray(d.items) ? d.items : []))
      .catch(() => setItems([]));
  }, []);

  // hooksは条件分岐の前で呼ぶ
  const shown = useMemo(() => items.slice(0, limit), [items, limit]);

  if (unauth) return null;

  const formatAmount = (n: number | null | undefined, ccy: string | null | undefined) =>
    new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: (ccy ?? 'JPY').toUpperCase(),
    }).format(n ?? 0); // **/100しない**

  const buildDescription = (it: Item) => {
    if (it.description && it.description.trim().length > 0) return it.description;
    const iso = it.date ?? it.created ?? new Date().toISOString();
    const d = new Date(iso);
    if (isNaN(d.getTime())) return 'ご利用料金';
    // Fallback: 「YYYY年M月利用分」
    return `${d.getFullYear()}年${d.getMonth() + 1}月利用分`;
  };

  return (
    <section className={styles.card} style={{ marginTop: 16 }}>
      <h2 className={styles.cardTitle}>お支払い履歴</h2>
      <div className={styles.list}>
        {shown.map((it) => {
          const desc = buildDescription(it);
          const amount = formatAmount(it.amount ?? 0, it.currency ?? 'JPY');
          const url = it.receiptUrl ?? it.receipt_url ?? null;

          return (
            <div className={styles.item} key={it.id}>
              {/* 左：説明（例：「2025年9月利用分」） */}
              <div className={styles.left}>
                <div className={styles.desc}>{desc}</div>
                {/* 日付も出したくなったら下を有効化
                <div className={styles.subtle}>
                  {new Date(it.date ?? it.created ?? '').toLocaleDateString('ja-JP')}
                </div>
                */}
              </div>

              {/* 右：金額 → 領収書 */}
              <div className={styles.right}>
                <div className={styles.amount}>{amount}</div>
                {url ? (
                  <a className={styles.linkBtn} href={url} target="_blank" rel="noreferrer">
                    領収書
                  </a>
                ) : (
                  <span className={styles.linkBtn} style={{ opacity: 0.5, pointerEvents: 'none' }}>
                    領収書なし
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {items.length > limit && (
        <div className={styles.more}>
          <button className={styles.btn} onClick={() => setLimit(limit + 12)}>
            もっと見る（残り{items.length - limit}件）
          </button>
        </div>
      )}
    </section>
  );
}
