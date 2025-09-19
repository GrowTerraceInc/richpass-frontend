'use client';
import styles from '../Plan.module.css';

export default function PortalAction() {
  const go = () => { window.location.href = '/settings/billing/payment-method'; };
  return (
    <div className={styles.btnRow}>
      <button onClick={go} className={`${styles.btn} ${styles.btnPrimary}`}>
        お支払い方法を変更
      </button>
      <span className={styles.kicker}>カード変更は安全なStripe画面で完了します</span>
    </div>
  );
}
