// app/settings/plan/PlanCurrentCard.tsx
'use client';

import { useEffect, useState } from 'react';
import styles from './PlanPage.module.css';
import LinkButton from '@/app/components/ui/LinkButton';
import { getSubscriptionStatusApi } from '../../lib/billingClient';

// 元UIの Plan 情報（page.tsx から渡す）
type PlanLite = { planId: string; name: string };

// env: PREMIUMのStripe価格IDをカンマ区切りで設定（例）NEXT_PUBLIC_PREMIUM_PRICE_IDS=price_XXXX,price_YYYY
const PREMIUM_PRICE_IDS: string[] = (process.env.NEXT_PUBLIC_PREMIUM_PRICE_IDS ?? '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

function formatDateYmd(iso?: string | null) {
  if (!iso) return '-';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '-';
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
}

// 元UIの表記ルールを踏襲
function displayName(name: string, planId: string) {
  if (planId.toLowerCase() === 'pro' || name.toUpperCase() === 'PRO') return 'PREMIUM';
  if (planId.toLowerCase() === 'premium') return 'PREMIUM';
  return 'FREE';
}

// Stripeのprice_id→アプリ内planIdへの解決（憶測禁止のため、envでのみ判定）
function resolvePlanIdFromPriceId(currentPlanPriceId: string | null): 'free' | 'premium' | null {
  if (!currentPlanPriceId) return 'free'; // priceが無い＝FREE想定（課金中でない）
  if (PREMIUM_PRICE_IDS.includes(currentPlanPriceId)) return 'premium';
  return null; // マッピング不明→誤表記回避のためnull
}

export default function PlanCurrentCard({ plans }: { plans: PlanLite[] }) {
  const [status, setStatus] = useState<string>('');
  const [currentPriceId, setCurrentPriceId] = useState<string | null>(null);
  const [renewsAt, setRenewsAt] = useState<string | null>(null);
  const [last4, setLast4] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const j = await getSubscriptionStatusApi();
        if (!mounted) return;
        setStatus(j.status ?? '');
        setCurrentPriceId(j.current_plan_id ?? null);
        setRenewsAt(j.renews_at ?? null);
        setLast4(j.payment_method?.last4 ?? null);
      } catch {
        // 失敗時は既定のまま
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // envマッピングで planId を解決し、元UIの表示名ルールに渡す
  const resolvedPlanId = resolvePlanIdFromPriceId(currentPriceId); // 'free' | 'premium' | null
  const resolvedPlan =
    resolvedPlanId ? plans.find((p) => p.planId === resolvedPlanId) ?? null : null;

  const planLabel = resolvedPlanId
    ? displayName(resolvedPlan?.name ?? (resolvedPlanId === 'premium' ? 'PREMIUM' : 'FREE'), resolvedPlanId)
    : (currentPriceId ?? '-'); // マッピング不明時はprice文字列をそのまま（誤表記回避）

  return (
    <section className={styles.currentCard}>
      <div className={styles.row}>
        <div className={styles.label}>現在のプラン</div>
        <div className={styles.value}>
          {planLabel}
          {status === 'past_due' ? '（お支払い要確認）' : ''}
          {status === 'canceled' ? '（解約済み）' : ''}
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.label}>更新日</div>
        <div className={styles.value}>{formatDateYmd(renewsAt)}</div>
      </div>

      <div className={styles.row}>
        <div className={styles.label}>お支払い方法</div>
        <div className={styles.value}>
          {last4 ? `**** **** **** ${last4}` : '未設定 / モック'}
        </div>
      </div>

      <div className={styles.actions}>
        <LinkButton variant="secondary" size="small" href="/settings/billing/payment-method">
          支払い方法を変更
        </LinkButton>
        <LinkButton variant="secondary" size="small" href="/settings/plan/change">
          プランを変更
        </LinkButton>
      </div>
    </section>
  );
}
