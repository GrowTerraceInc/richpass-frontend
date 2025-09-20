// app/settings/plan/PlanCurrentCard.tsx
'use client';

import { useEffect, useState } from 'react';
import styles from './PlanPage.module.css';
import LinkButton from '@/app/components/ui/LinkButton';
import { getSubscriptionStatusApi } from '../../lib/billingClient';

// Planの最小情報（サーバ側の loadPlans() から渡してもらう想定）
type PlanLite = { planId: string; name: string };

function formatDateYmd(iso?: string | null) {
  if (!iso) return '-';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '-';
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
}

// 既存UIの表記ルールを踏襲
function displayName(name: string, planId: string) {
  if (planId.toLowerCase() === 'pro' || name.toUpperCase() === 'PRO') return 'PREMIUM';
  if (planId.toLowerCase() === 'premium') return 'PREMIUM';
  return 'FREE';
}

export default function PlanCurrentCard({ plans }: { plans: PlanLite[] }) {
  const [status, setStatus] = useState<string>('');
  const [currentPlanId, setCurrentPlanId] = useState<string | null>(null);
  const [renewsAt, setRenewsAt] = useState<string | null>(null);
  const [last4, setLast4] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const j = await getSubscriptionStatusApi();
        if (!mounted) return;
        setStatus(j.status ?? '');
        setCurrentPlanId(j.current_plan_id ?? null);
        setRenewsAt(j.renews_at ?? null);
        setLast4(j.payment_method?.last4 ?? null);
      } catch {
        // 失敗時は初期表示（'-'）のまま
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const plan = currentPlanId
    ? plans.find((p) => p.planId === currentPlanId) ?? null
    : null;
  const planLabel = plan
    ? displayName(plan.name, plan.planId)
    : currentPlanId ?? '-';

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
