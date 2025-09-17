"use client";

import { useMemo, useState } from "react";
import type { BillingHistoryItem } from "@/app/lib/billing";
import Button from "@/app/components/ui/Button";
import styles from "@/app/settings/plan/PlanPage.module.css";

function formatDateYmd(iso?: string) {
  if (!iso) return "-";
  const d = new Date(iso);
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
}

export default function BillingHistoryList({
  items,
  initialCount = 12,
  step = 12,
}: {
  items: BillingHistoryItem[];
  initialCount?: number;
  step?: number;
}) {
  const [shown, setShown] = useState(initialCount);
  const jp = useMemo(
    () => new Intl.NumberFormat("ja-JP", { style: "currency", currency: "JPY" }),
    []
  );

  const visible = items.slice(0, shown);
  const remaining = Math.max(items.length - shown, 0);

  return (
    <>
      <div className={styles.historyList}>
        {visible.length === 0 ? (
          <div className={styles.colMuted}>履歴はまだありません。</div>
        ) : (
          visible.map((h) => (
            <div key={h.id} className={styles.historyRow}>
              {/* 上段：日付のみ */}
              <div className={`${styles.colDate} ${styles.colMuted}`}>{formatDateYmd(h.date)}</div>

              {/* 下段：内容・金額・領収書（横一列） */}
              <div className={styles.colDesc}>{h.description}</div>
              <div className={`${styles.colAmount} ${styles.colRight}`}>{jp.format(h.amount)}</div>
              <div className={styles.colReceipt}>
                {h.receiptUrl ? (
                  <a href={h.receiptUrl} target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>
                    <Button variant="secondary" size="small">領収書</Button>
                  </a>
                ) : (
                  <span className={styles.colMuted}>領収書なし</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {remaining > 0 && (
        <div style={{ textAlign: "center", marginTop: 12 }}>
          <Button variant="secondary" onClick={() => setShown((n) => n + step)} size="small">
            もっと見る（残り{remaining}件）
          </Button>
        </div>
      )}
    </>
  );
}
