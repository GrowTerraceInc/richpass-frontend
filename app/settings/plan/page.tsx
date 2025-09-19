import PlanStatusBadge from './components/PlanStatusBadge';
import CancelAction from './components/CancelAction';
import PortalAction from './components/PortalAction';
import SubscribeAction from './components/SubscribeAction';
import Breadcrumbs from "@/app/components/breadcrumbs/Breadcrumbs";
import LinkButton from "@/app/components/ui/LinkButton";
import styles from "./PlanPage.module.css";
import { loadPlans, loadSubscriptionStatus, loadBillingHistory } from "@/app/lib/billing";
import BillingHistoryList from "@/app/components/billing/BillingHistoryList";

function formatDateYmd(iso?: string) {
  if (!iso) return "-";
  const d = new Date(iso);
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
}

function displayName(name: string, planId: string) {
  if (planId.toLowerCase() === "pro" || name.toUpperCase() === "PRO") return "PREMIUM";
  if (planId.toLowerCase() === "premium") return "PREMIUM";
  return "FREE";
}

export default async function PlanPage() {
  const [plans, sub, history] = await Promise.all([
    loadPlans(),
    loadSubscriptionStatus(),
    loadBillingHistory(),
  ]);
  const current = plans.find((p) => p.planId === sub?.currentPlanId);

  return (
    <main className="container">
      <div className="header">
        <Breadcrumbs
          items={[
            { label: "マイページ", href: "/mypage" },
            { label: "プラン管理", href: "/settings/plan" },
          ]}
        />
      </div>

      <div className={styles.header}>
        <h1 className={styles.title}>プラン管理</h1>
      <PlanStatusBadge />
      </div>

      <div className={styles.wrap}>
        <section className={styles.currentCard}>
          <div className={styles.row}>
            <div className={styles.label}>現在のプラン</div>
            <div className={styles.value}>
              {current ? displayName(current.name, current.planId) : sub?.currentPlanId ?? "-"}
              {sub?.status === "past_due" ? "（お支払い要確認）" : ""}
              {sub?.status === "canceled" ? "（解約済み）" : ""}
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.label}>更新日</div>
            <div className={styles.value}>
              {sub?.cancelAtPeriodEnd ? "期間末で解約予定" : formatDateYmd(sub?.renewsAt)}
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.label}>お支払い方法</div>
            <div className={styles.value}>
              {sub?.last4 ? `**** **** **** ${sub.last4}` : "未設定 / モック"}
            </div>
          </div>

          <div className={styles.actions}>
            {/* 小さめボタンに（デスクトップでも違和感なし） */}
            <LinkButton variant="secondary" size="small" href="/settings/billing/payment-method">
              支払い方法を変更
            </LinkButton>
            <LinkButton variant="secondary" size="small" href="/settings/plan/change">
              プランを変更
            </LinkButton>
          </div>
        </section>

        <section className={styles.historyCard}>
          <h2 className={styles.h2}>お支払い履歴</h2>
          <BillingHistoryList items={history} initialCount={12} step={12} />
          <div className={styles.colMuted} style={{ marginTop: 6 }}>
            ※ 領収書リンクはモックです。Stripe連携後は各請求（Invoice）のPDF/Hosted Invoice URLを表示します。
          </div>
        </section>

        <div style={{ color: "var(--color-gray-600)", fontSize: 13 }}>
          ※ 現在はモック表示です。Stripe連携後に「プランを変更」からチェックアウト/ポータルへ遷移します。
        </div>
      </div>
    
  <div style={{marginTop:16}}><SubscribeAction /></div>

  <div style={{marginTop:16}}><PortalAction /></div>

  <div style={{marginTop:16}}><CancelAction /></div>
</main>
  );
}
