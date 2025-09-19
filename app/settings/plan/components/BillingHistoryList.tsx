'use client';

import { useEffect, useMemo, useState } from 'react';
import styles from '../Plan.module.css';

const API = process.env.NEXT_PUBLIC_API_ORIGIN!;

type Item = {
  id: string;
  // サーバ都合で date or created が来るので両対応
  date?: string | null;
  created?: string | null;
  description?: string | null;
  amount?: number | null;    // 最小貨幣単位
  currency?: string | null;  // 'jpy'
  receipt_url?: string | null;
  receiptUrl?: string | null; // 互換
};

export default function BillingHistoryList() {
  const [items, setItems] = useState<Item[]>([]);
  const [limit, setLimit] = useState(12);
  const [unauth, setUnauth] = useState(false);

  useEffect(() => {
    fetch(`${API}/api/billing/history`, { credentials:'include', headers:{Accept:'application/json'} })
      .then(async r => { if (r.status === 401) { setUnauth(true); return { items:[] }; } return r.json(); })
      .then(d => setItems((d.items as Item[]) ?? []))
      .catch(() => setItems([]));
  }, []);

  // hooksは条件分岐の前で呼ぶ
  const shown = useMemo(() => items.slice(0, limit), [items, limit]);

  if (unauth) return null;

  const yen = (n: number | null | undefined) => `¥${((n ?? 0)/100).toLocaleString('ja-JP')}`;

  return (
    <section className={styles.card} style={{marginTop:16}}>
      <h2 className={styles.cardTitle}>お支払い履歴</h2>
      <div className={styles.list}>
        {shown.map((it) => {
          const iso = it.date ?? it.created ?? new Date().toISOString();
          const d   = new Date(iso);
          const date = d.toLocaleDateString('ja-JP', { year:'numeric', month:'long', day:'numeric' });
          const amount = yen(it.amount);
          const url = it.receiptUrl ?? it.receipt_url ?? null;

          return (
            <div className={styles.item} key={it.id}>
              <div className={styles.left}>
                <div className={styles.desc}>{date}　{it.description || 'ご利用料金'}</div>
              </div>
              <div className={styles.right}>
                <div className={styles.amount}>{amount}</div>
                {url ? (
                  <a className={styles.linkBtn} href={url} target="_blank" rel="noreferrer">領収書</a>
                ) : (
                  <span className={styles.linkBtn} style={{opacity:.5,pointerEvents:'none'}}>領収書なし</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {items.length > limit && (
        <div className={styles.more}>
          <button className={styles.btn} onClick={()=>setLimit(limit+12)}>もっと見る（残り{items.length-limit}件）</button>
        </div>
      )}
    </section>
  );
}
