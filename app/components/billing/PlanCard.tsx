"use client";

import styles from "./PlanCard.module.css";
import Button from "@/app/components/ui/Button";
import clsx from "clsx";
import Link from "next/link";

type Props = {
  name: string;          // 表示名（PREMIUM / FREE）
  monthly: number;
  yearly?: number;       // 互換用（表示しない）
  features: string[];
  isCurrent?: boolean;
  onChangePlan?: () => void; // 未指定なら内蔵モック
  changeHref?: string;       // これがあれば遷移（例：/settings/subscription/cancel）
};

export default function PlanCard({
  name,
  monthly,
  features,
  isCurrent,
  onChangePlan,
  changeHref,
}: Props) {
  const jp = new Intl.NumberFormat("ja-JP", { style: "currency", currency: "JPY" });

  const handleClick = () => {
    if (isCurrent) return;
    if (onChangePlan) onChangePlan();
    else alert(`プラン「${name}」に変更（モック）`);
  };

  return (
    <section className={clsx(styles.card, isCurrent && styles.cardCurrent)}>
      <div className={styles.header}>
        <div className={styles.name}>{name}</div>
        {isCurrent && <span className={styles.badgeCurrent}>現在のプラン</span>}
      </div>

      {/* 月額のみ表示 */}
      <div className={styles.priceRow}>
        <div className={styles.price}>{jp.format(monthly)} / 月</div>
      </div>

      {features?.length > 0 && (
        <ul className={styles.features}>
          {features.map((f, i) => (
            <li key={i}>{f}</li>
          ))}
        </ul>
      )}

      <div className={styles.actions}>
        {isCurrent ? (
          <Button variant="secondary" disabled>
            選択中
          </Button>
        ) : changeHref ? (
          <Link href={changeHref} style={{ textDecoration: "none" }}>
            <Button variant="secondary">このプランに変更</Button>
          </Link>
        ) : (
          <Button variant="secondary" onClick={handleClick}>
            このプランに変更（モック）
          </Button>
        )}
      </div>
    </section>
  );
}
