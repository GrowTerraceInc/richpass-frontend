// app/subscribe/page.tsx
"use client";

import { useState } from "react";
import styles from "./Checkout.module.css";
import Button from "@/app/components/ui/Button";

const BASE_PRICE = 980;                  // 円
const DISCOUNT_AMOUNT = 430;             // 円（980→550）
const DISCOUNT_MONTHS = 3;               // 最初の3請求に割引
const TRIAL_DAYS = Number(process.env.NEXT_PUBLIC_TRIAL_DAYS ?? "30"); // 0でトライアル無し
const IS_TRIAL = TRIAL_DAYS > 0;
const MONTH_LABEL = `${new Date().getMonth() + 1}月中限定`;

function addDays(date: Date, days: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}
function addMonths(date: Date, months: number) {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}
function formatYMD(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}/${m}/${d}`;
}

export default function SubscribePage() {
  const [coupon, setCoupon] = useState("");
  const [applied, setApplied] = useState<null | { code: string }>(null);
  const [error, setError] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [loading, setLoading] = useState(false);

  // クーポン検証 → OKなら適用
  const applyCoupon = async () => {
    setError(null);
    setApplied(null);
    if (!coupon.trim()) {
      setError("クーポンコードを入力してください。");
      return;
    }
    setVerifying(true);
    try {
      const res = await fetch("/api/checkout/validate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ code: coupon.trim() }),
      });
      const json = await res.json();
      if (!json.valid) {
        setError(json.message || "クーポンコードが無効です。");
        setVerifying(false);
        return;
      }
      setApplied({ code: coupon.trim() });
    } catch {
      setError("クーポンの確認に失敗しました。時間をおいて再度お試しください。");
    } finally {
      setVerifying(false);
    }
  };

  // 決済開始（適用済みクーポンはサーバーで静かに事前適用）
  const startCheckout = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/checkout/session", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ couponCode: applied?.code ?? null }),
      });
      const json = await res.json();
      if (!res.ok || !json.url) {
        setError(json.error || "決済の開始に失敗しました。");
        setLoading(false);
        return;
      }
      window.location.href = json.url;
    } catch {
      setError("決済の開始に失敗しました。");
      setLoading(false);
    }
  };

  // ===== スケジュール表示（初回＋その後2回＝計3回 + 4ヶ月目以降） =====
  // 初回請求日：TRIAL_DAYS>0 → 今日+TRIAL_DAYS（日）、0 → 今日（= 即課金）
  const firstChargeDate = IS_TRIAL ? addDays(new Date(), TRIAL_DAYS) : new Date();

  // クーポン適用済みなら 550円が3回、未適用なら 980円が3回
  const discounted = !!applied;
  const firstThreeAmounts = Array.from(
    { length: DISCOUNT_MONTHS },
    () => (discounted ? BASE_PRICE - DISCOUNT_AMOUNT : BASE_PRICE)
  );

  // 4ヶ月目以降（通常料金に戻る）の開始日
  const fourthChargeDate = addMonths(firstChargeDate, DISCOUNT_MONTHS);

  return (
    <section className={styles.container} aria-labelledby="title">
      <h1 id="title" className={styles.title}>プレミアムプランお申し込み</h1>

      {/* 1. プラン（単一） */}
      <div className={styles.block}>
        <div className={styles.planCard} data-selected>
          {/* 初月無料の強調（TRIAL_DAYS>0 のときだけ） */}
          {IS_TRIAL && (
            <div className={styles.trialBanner} aria-label="今月限定・初月無料">
              <span className={styles.trialBadge}>{MONTH_LABEL}</span>
              <span className={styles.trialText}>
                今だけ <strong>初月無料</strong>
              </span>
            </div>
          )}

          <div className={styles.planHeader}>
            <div className={styles.planName}>プレミアム（月額）</div>
            <div className={styles.planPrice}>
              ¥{BASE_PRICE.toLocaleString()}
              <span className={styles.per}>/月</span>
            </div>
          </div>
          <p className={styles.planNote}>いつでも解約できます</p>
        </div>
      </div>

      {/* 2. クーポン入力 */}
      <div className={styles.block}>
        <label className={styles.label}>
          クーポンコードをお持ちの方は入力してください。
          <div className={styles.couponRow}>
            <input
              className={styles.input}
              placeholder="クーポンコードを入力"
              value={coupon}
              onChange={(e) => setCoupon(e.target.value)}
            />
            <Button
              variant="secondary"
              size="medium"
              onClick={applyCoupon}
              disabled={verifying}
            >
              {verifying ? "確認中…" : "適用"}
            </Button>
          </div>
        </label>
        {applied && (
          <p className={styles.couponApplied}>「{applied.code}」を適用しました。</p>
        )}
        {error && <p className={styles.error}>{error}</p>}
      </div>

      {/* 3. 決済スケジュール（クーポン反映） */}
      <div className={styles.block}>
        <div className={styles.summaryCard}>
          <ul className={styles.schedule} role="list">
            {firstThreeAmounts.map((amt, i) => {
              const label = i === 0 ? "初回決済" : `${i + 1}回目`;
              const date = formatYMD(addMonths(firstChargeDate, i));
              return (
                <li key={i} className={styles.scheduleRow}>
                  <span className={styles.scheduleLabel}>{label}</span>
                  <span className={styles.scheduleDate}>{date}</span>
                  <strong className={styles.scheduleAmount}>
                    ¥{amt.toLocaleString()}
                  </strong>
                </li>
              );
            })}

            {/* ★ 追加：4ヶ月目以降（通常料金） */}
            <li className={styles.scheduleRow}>
              <span className={styles.scheduleLabel}>4ヶ月目以降</span>
              <span className={styles.scheduleDate}>{formatYMD(fourthChargeDate)}</span>
              <strong className={styles.scheduleAmount}>
                ¥{BASE_PRICE.toLocaleString()}/月
              </strong>
            </li>
          </ul>

          <p className={styles.smallNote}>
            ※ 表示は目安です。実際の金額・適用状況は決済画面（Stripe）でご確認ください。<br />
            {IS_TRIAL
              ? "※ 初月は無料（トライアル）です。"
              : "※ 現在トライアルは実施していません。"}
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className={styles.block}>
        <div className={styles.cta}>
          <Button
            variant="primary"
            size="large"
            onClick={startCheckout}
            disabled={loading}
          >
            {loading ? "処理中..." : "お支払いへ進む"}
          </Button>
        </div>
      </div>
    </section>
  );
}
