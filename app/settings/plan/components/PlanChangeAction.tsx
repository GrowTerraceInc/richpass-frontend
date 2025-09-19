'use client';
import styles from '../Plan.module.css';
const API = process.env.NEXT_PUBLIC_API_ORIGIN!;

export default function PlanChangeAction({ plan }: { plan: string }) {
  const isFree = (plan || 'FREE').toUpperCase() === 'FREE';
  const onClick = () => {
    if (isFree) {
      // そのままCheckoutへ（CORS不要）
      window.location.href = `${API}/api/subscribe/redirect`;
    } else {
      // 既存の変更フロー（ページが用意済みなら）
      window.location.href = '/settings/plan/change';
    }
  };
  return (
    <button onClick={onClick} className={`${styles.btn} ${styles.btnPrimary}`}>
      {isFree ? 'プレミアムにアップグレード' : 'プランを変更'}
    </button>
  );
}
