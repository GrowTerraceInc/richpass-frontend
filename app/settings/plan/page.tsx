import styles from './Plan.module.css';
import PlanOverviewCard from './components/PlanOverviewCard';
import BillingHistoryList from './components/BillingHistoryList';

export default function Page() {
  return (
    <main className={styles.section}>
      <h1 className={styles.h1}>プラン管理</h1>
      <div className={styles.subtle}>ご契約状況やお支払い方法の変更を行えます。</div>

      <PlanOverviewCard />
      <BillingHistoryList />
    </main>
  );
}
