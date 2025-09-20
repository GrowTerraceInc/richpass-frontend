export const dynamic = 'force-dynamic';

import Breadcrumbs from "@/app/components/breadcrumbs/Breadcrumbs";
import styles from "./PlanPage.module.css";
import { loadPlans, loadBillingHistory } from "@/app/lib/billing";
import BillingHistoryList from "@/app/components/billing/BillingHistoryList";
import PlanCurrentCard from "./PlanCurrentCard";

// 元UIの型に合わせた最小情報だけをPlanCurrentCardへ渡す
type PlanLite = { planId: string; name: string };
type PlanFromApi = { planId: string; name: string } & Record<string, unknown>;

export default async function PlanPage() {
  // 元の構造どおり SSR で取得（UIはそのまま）
  const [plans, history] = await Promise.all([
    loadPlans(),
    loadBillingHistory(),
  ]);

  // any禁止対応：型を安全に絞って変換
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
        {/* 現在のプランカードのみ、クライアント側で実データに差し替え（見た目は元UIのまま） */}
        <PlanCurrentCard plans={plansLite} />

        {/* 履歴は従来どおり。API未実装でも既存モックがあれば表示維持 */}
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
    </main>
  );
}
