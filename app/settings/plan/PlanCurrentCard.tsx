// app/settings/plan/PlanCurrentCard.tsx
'use client';

import { useEffect, useState } from 'react';
import styles from './PlanPage.module.css';
import LinkButton from '@/app/components/ui/LinkButton';
import { getSubscriptionStatusApi, type SubscriptionStatusApi } from '../../lib/billingClient';

type PlanLite = { planId: string; name: string };

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

function displayName(name: string, planId: string) {
  if (planId.toLowerCase() === 'pro' || name.toUpperCase() === 'PRO') return 'PREMIUM';
  if (planId.toLowerCase() === 'premium') return 'PREMIUM';
  return 'FREE';
}

function resolvePlanIdFromPriceId(currentPlanPriceId: string | null): 'free' | 'premium' | null {
  if (!currentPlanPriceId) return 'free';
  if (PREMIUM_PRICE_IDS.includes(currentPlanPriceId)) return 'premium';
  return null;
}

function readPlanField(obj: unknown): 'free' | 'premium' | string | undefined {
  if (obj && typeof obj === 'object' && 'plan' in obj) {
    const val = (obj as { plan?: unknown }).plan;
    if (typeof val === 'string') return val;
  }
  return undefined;
}

export default function PlanCurrentCard({ plans }: { plans: PlanLite[] }) {
  const [status, setStatus] = useState<string>('');
  const [currentPriceId, setCurrentPriceId] = useState<string | null>(null);
  const [renewsAt, setRenewsAt] = useState<string | null>(null);
  const [last4, setLast4] = useState<string | null>(null);
  const [planFromApi, setPlanFromApi] = useState<'free' | 'premium' | string | undefined>(undefined);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const j: SubscriptionStatusApi = await getSubscriptionStatusApi();
        if (!mounted) return;
        setStatus(j.status ?? '');
        setCurrentPriceId(j.current_plan_id ?? null);
        setRenewsAt(j.renews_at ?? null);
        setLast4(j.payment_method?.last4 ?? null);
        setPlanFromApi(readPlanField(j));
      } catch {
        // noop
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // 1) 即時解約なら強制FREE（表記もFREEに寄せる）
  let resolvedPlanId: 'free' | 'premium' | null =
    status === 'canceled'
      ? 'free'
      : planFromApi === 'premium'
      ? 'premium'
      : planFromApi === 'free'
      ? 'free'
      : null;

  // 2) planが不明ならENVのprice_idマッピングでフォールバック
  if (!resolvedPlanId) {
    resolvedPlanId = resolvePlanIdFromPriceId(currentPriceId);
  }

  const resolvedPlan =
    resolvedPlanId ? plans.find((p) => p.planId === resolvedPlanId) ?? null : null;

  const planLabel = resolvedPlanId
    ? displayName(
        resolvedPlan?.name ?? (resolvedPlanId === 'premium' ? 'PREMIUM' : 'FREE'),
        resolvedPlanId
      )
    : (currentPriceId ?? '-');

  return (
    <section className={styles.currentCard}>
      <div className={styles.row}>
        <div className={styles.label}>現在のプラン</div>
        <div className={styles.value}>
          {planLabel}
          {status === 'past_due' ? '（お支払い要確認）' : ''}
          {/* （解約済み）の表記は混乱防止のため削除 */}
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.label}>更新日</div>
        <div className={styles.value}>
          {/* 即時解約時は日付を出さず “-” 表示 */}
          {status === 'canceled' ? '-' : formatDateYmd(renewsAt)}
        </div>
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
