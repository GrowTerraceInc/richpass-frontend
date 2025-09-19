export const dynamic = 'force-dynamic';
export const revalidate = 0;

import Breadcrumbs from '@/app/components/breadcrumbs/Breadcrumbs';
import styles from './PlanPage.module.css';

// ※ ここがポイント：サーバーで load* は呼ばない
// import { loadPlans, loadSubscriptionStatus, loadBillingHistory } from '@/app/lib/billing';
// import BillingHistoryList from '@/app/components/billing/BillingHistoryList';

// クライアント側でAPIを叩く版に差し替え
import PlanOverviewCard from './components/PlanOverviewCard';
import BillingHistoryList from './components/BillingHistoryList';

export default function PlanPage() {
  return (
    <main className="container">
      <div className="header">
        <Breadcrumbs
          items={[
            { label: 'マイページ', href: '/mypage' },
            { label: 'プラン管理', href: '/settings/plan' },
          ]}
        />
      </div>

      <div className={styles.header}>
        <h1 className={styles.title}>プラン管理</h1>
      </div>

      <div className={styles.wrap}>
        {/* 現在のプラン：ブラウザから /api/subscription/status を取得 */}
        <section className={styles.currentCard}>
          <PlanOverviewCard />
        </section>

        {/* お支払い履歴：ブラウザから /api/billing/history を取得 */}
        <section className={styles.historyCard}>
          <h2 className={styles.h2}>お支払い履歴</h2>
          <BillingHistoryList />
        </section>
      </div>
    </main>
  );
}
