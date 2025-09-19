import styles from './Plan.module.css';
import PlanStatusBadge from './components/PlanStatusBadge';
import PortalAction from './components/PortalAction';
import CancelAction from './components/CancelAction';

export default function Page() {
  return (
    <main className={styles.section}>
      <h1 className={styles.h1}>プラン管理</h1>
      <div className={styles.subtle}>ご契約状況やお支払い方法の変更を行えます。</div>

      <PlanStatusBadge />

      <div className={styles.row}>
        <section className={styles.card}>
          <h2 className={styles.cardTitle}>お支払い・請求</h2>
          <div className={styles.cardBody}>Stripeの顧客ポータルで、カード変更や請求書の確認ができます。</div>
          <PortalAction />
        </section>

        <section className={styles.card}>
          <h2 className={styles.cardTitle}>解約</h2>
          <div className={styles.cardBody}>期末での解約予約、または今すぐ解約が選べます。</div>
          <CancelAction />
        </section>
      </div>
    </main>
  );
}
