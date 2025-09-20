export const dynamic = 'force-dynamic';

import Breadcrumbs from "@/app/components/breadcrumbs/Breadcrumbs";
import styles from "./PlanPage.module.css";
import { loadPlans, loadBillingHistory } from "@/app/lib/billing";
import PlanCurrentCard from "./PlanCurrentCard";
import BillingHistoryBridge from "./BillingHistoryBridge";

type PlanLite = { planId: string; name: string };
type PlanFromApi = { planId: string; name: string } & Record<string, unknown>;

export default async function PlanPage() {
  // 元UIどおり SSR 取得（plans / history は従来のまま）
  const [plans, history] = await Promise.all([
    loadPlans(),
    loadBillingHistory(),
  ]);

  const plansArray = Array.isArray(plans) ? plans : [];
  const plansLite: PlanLite[] = (plansArray as PlanFromApi[]).map((p) => ({
    planId: String(p.planId),
    name: String(p.name),
  }));

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
        {/* 現在のプランカード：実データ（クライアント側） */}
        <PlanCurrentCard plans={plansLite} />

        {/* お支払い履歴：SSRの初期値 → クライアントで実データに置き換え */}
        <section className={styles.historyCard}>
          <h2 className={styles.h2}>お支払い履歴</h2>
          <BillingHistoryBridge initialItems={history} initialCount={12} step={12} />
          <div className={styles.colMuted} style={{ marginTop: 6 }}>
            ※ 領収書リンクはStripeのHosted Invoice / PDFを表示します（取得可能な場合）。
          </div>
        </section>

        <div style={{ color: "var(--color-gray-600)", fontSize: 13 }}>
          ※ 現在はモック表示が残る場合があります。Stripe連携完了後は順次、実データに置換されます。
        </div>
      </div>
    </main>
  );
}
