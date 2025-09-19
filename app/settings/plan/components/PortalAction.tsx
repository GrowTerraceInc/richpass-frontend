'use client';
import styles from '../Plan.module.css';
const API = process.env.NEXT_PUBLIC_API_ORIGIN!;
export default function PortalAction() {
  const go = () => { window.location.href = `${API}/api/billing/portal/redirect`; };
  return (
    <div className={styles.btnRow}>
      <button onClick={go} className={`${styles.btn} ${styles.btnPrimary}`}>お支払い方法・請求の管理</button>
      <span className={styles.kicker}>カード変更、請求書の確認、住所変更など</span>
    </div>
  );
}
