"use client";

import { useState } from "react";
import styles from "./Checkout.module.css";
import Button from "@/app/components/ui/Button";
import { csrfFetch } from "@/app/lib/csrfFetch";

const API = process.env.NEXT_PUBLIC_API_ORIGIN!;

const BASE_PRICE = 980;                  // 円
const DISCOUNT_AMOUNT = 430;             // 円（980→550）
const DISCOUNT_MONTHS = 3;               // 最初の3請求に割引
const TRIAL_DAYS = Number(process.env.NEXT_PUBLIC_TRIAL_DAYS ?? "30"); // 0でトライアル無し
const IS_TRIAL = TRIAL_DAYS > 0;
const MONTH_LABEL = `${new Date().getMonth() + 1}月中限定`;

function addDays(date: Date, days: number) { const d = new Date(date); d.setDate(d.getDate() + days); return d; }
function addMonths(date: Date, months: number) { const d = new Date(date); d.setMonth(d.getMonth() + months); return d; }
function formatYMD(date: Date) { const y = date.getFullYear(); const m = String(date.getMonth() + 1).padStart(2, "0"); const d = String(date.getDate()).padStart(2, "0"); return `${y}/${m}/${d}`; }

export default function SubscribePage() {
  const [coupon, setCoupon] = useState("");
  const [applied, setApplied] = useState<null | { code: string }>(null);
  const [error, setError] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [loading, setLoading] = useState(false);

  // 画面上の適用だけ（実検証は /api/subscribe 実行時にサーバで行う）
  const applyCoupon = async () => {
    setError(null);
    setApplied(null);
    if (!coupon.trim()) { setError("クーポンコードを入力してください。"); return; }
    setVerifying(true);
    try {
      setApplied({ code: coupon.trim() });
    } finally {
      setVerifying(false);
    }
  };

  // 決済開始：サーバ（/api/subscribe）が code を検証してから Checkout URL を返す
  const startCheckout = async () => {
    try {
      setError(null);
      setLoading(true);
      const r = await csrfFetch(`${API}/api/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: applied?.code ?? undefined }),
      });
      const d: unknown = await r.json().catch(() => ({} as unknown));
      const url = (d as { url?: string; error?: string }).url;
      const err = (d as { error?: string }).error;
      if (!r.ok || !url) {
        if (err === "INVALID_PROMO_CODE") setError("クーポンコードが無効です。");
        else setError("決済の開始に失敗しました。");
        setLoading(false);
        return;
      }
      window.location.href = url;
    } catch {
      setError("決済の開始に失敗しました。");
      setLoading(false);
    }
  };

  // ===== 表示（元のUIを保持） =====
  const firstChargeDate = IS_TRIAL ? addDays(new Date(), TRIAL_DAYS) : new Date();
  const discounted = !!applied;
  const firstThreeAmounts = Array.from({ length: DISCOUNT_MONTHS }, () => (discounted ? BASE_PRICE - DISCOUNT_AMOUNT : BASE_PRICE));
  const fourthChargeDate = addMonths(firstChargeDate, DISCOUNT_MONTHS);

  return (
    <section className={styles.container} aria-labelledby="title">
      <h1 id="title" className={styles.title}>プレミアムプランお申し込み</h1>

      <div className={styles.block}>
        <div className={styles.planCard} data-selected>
          {IS_TRIAL && (
            <div className={styles.trialBanner} aria-label="今月限定・初月無料">
              <span className={styles.trialBadge}>{MONTH_LABEL}</span>
              <span className={styles.trialText}>今だけ <strong>初月無料</strong></span>
            </div>
          )}
          <div className={styles.planHeader}>
            <div className={styles.planName}>プレミアム（月額）</div>
            <div className={styles.planPrice}>
              ¥{BASE_PRICE.toLocaleString()} <span className={styles.per}>/月</span>
            </div>
          </div>
          <p className={styles.planNote}>いつでも解約できます</p>
        </div>
      </div>

      <div className={styles.block}>
        <label className={styles.label}>
          クーポンコードをお持ちの方は入力してください。
          <div className={styles.couponRow}>
            <input className={styles.input} placeholder="クーポンコードを入力" value={coupon} onChange={(e) => setCoupon(e.target.value)} />
            <Button variant="secondary" size="medium" onClick={applyCoupon} disabled={verifying}>
              {verifying ? "確認中…" : "適用"}
            </Button>
          </div>
        </label>
        {applied && <p className={styles.couponApplied}>「{applied.code}」を適用しました。</p>}
        {error && <p className={styles.error}>{error}</p>}
      </div>

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
                  <strong className={styles.scheduleAmount}>¥{amt.toLocaleString()}</strong>
                </li>
              );
            })}
            <li className={styles.scheduleRow}>
              <span className={styles.scheduleLabel}>4ヶ月目以降</span>
              <span className={styles.scheduleDate}>{formatYMD(fourthChargeDate)}</span>
              <strong className={styles.scheduleAmount}>¥{BASE_PRICE.toLocaleString()}/月</strong>
            </li>
          </ul>
          <p className={styles.smallNote}>
            ※ 表示は目安です。実際の金額・適用状況は決済画面（Stripe）でご確認ください。<br />
            {IS_TRIAL ? "※ 初月は無料（トライアル）です。" : "※ 現在トライアルは実施していません。"}
          </p>
        </div>
      </div>

      <div className={styles.block}>
        <div className={styles.cta}>
          <Button variant="primary" size="large" onClick={startCheckout} disabled={loading}>
            {loading ? "処理中..." : "お支払いへ進む"}
          </Button>
        </div>
      </div>
    </section>
  );
}
