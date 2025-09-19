export const dynamic = "force-dynamic";

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

  // 実データを優先して判定（大文字小文字を吸収）
  const current = sub
    ? plans.find((p) => p.planId.toLowerCase() === (sub.currentPlanId ?? "").toLowerCase())
    : undefined;
  const isPremium = (current?.planId ?? "").toLowerCase() === "premium";

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
      </div>

      <div className={styles.wrap}>
        {/* 現在のプラン（実データ） */}
        <section className={styles.currentCard}>
          <div className={styles.row}>
            <div className={styles.label}>現在のプラン</div>
            <div className={styles.value}>
              {current ? displayName(current.name, current.planId) : (sub?.currentPlanId?.toUpperCase() ?? "-")}
              {sub?.status === "past_due" && "（お支払い要確認）"}
              {sub?.status === "canceled" && "（解約済み）"}
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
              {sub?.last4 ? `**** **** **** ${sub.last4}` : "-"}
            </div>
          </div>

          <div className={styles.actions}>
            <LinkButton variant="secondary" size="small" href="/settings/billing/payment-method">
              支払い方法を変更
            </LinkButton>

            {/* ← 常時表示。FREEのときは「アップグレード」、PREMIUMのときは「プランを変更」 */}
            <LinkButton variant="secondary" size="small" href="/settings/plan/change">
              {isPremium ? "プランを変更" : "プレミアムにアップグレード"}
            </LinkButton>
          </div>
        </section>

        {/* 請求履歴（実データ） */}
        <section className={styles.historyCard}>
          <h2 className={styles.h2}>お支払い履歴</h2>
          <BillingHistoryList items={history} initialCount={12} step={12} />
        </section>
      </div>
    </main>
  );
}
