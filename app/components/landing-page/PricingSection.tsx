"use client";

import styles from "./PricingSection.module.css";

type Feature = {
  name: string;
  available: boolean;
  detail: string;
  tier?: "basic" | "premium";
};

type Plan = {
  id: "basic" | "premium";
  name: string;
  priceAmount: string;
  priceSuffix?: string;
  description: string;
  features: Feature[];
};

const PLANS: Plan[] = [
  {
    id: "basic",
    name: "無料プラン",
    priceAmount: "¥0",
    description: "まずは気軽に試したい方へ",
    features: [
      { name: "金融タイプ診断", available: true, detail: "簡易レポート", tier: "basic" },
      { name: "コース視聴", available: true, detail: "各コース1本目のみ" },
      { name: "コミュニティ機能", available: true, detail: "閲覧のみ" },
      { name: "ブックマーク／復習", available: false, detail: "利用不可" },
      { name: "限定イベント", available: false, detail: "参加不可" },
    ],
  },
  {
    id: "premium",
    name: "プレミアムプラン",
    priceAmount: "¥980",
    priceSuffix: "/ 月",
    description: "全ての機能で、本気で学びたい方へ",
    features: [
      { name: "金融タイプ診断", available: true, detail: "詳細レポート", tier: "premium" },
      { name: "コース視聴", available: true, detail: "全レッスン見放題", tier: "premium" },
      { name: "コミュニティ機能", available: true, detail: "参加・投稿が可能", tier: "premium" },
      { name: "ブックマーク／復習", available: true, detail: "全機能利用可能", tier: "premium" },
      { name: "限定イベント", available: true, detail: "参加可能", tier: "premium" },
    ],
  },
];

export default function PricingSection() {
  return (
    <section className={`section bg-white`} aria-labelledby="pricing-title">
      <div className={`container container--md`}>
        <h2 id="pricing-title" className={`${styles.heading} h2`}>
          あなたに合ったプランを選ぼう
        </h2>

        <div className={styles.plansContainer}>
          {PLANS.map((plan) => (
            <article
              key={plan.id}
              className={`${styles.planCard} ${plan.id === "premium" ? styles.premium : ""}`}
              aria-labelledby={`${plan.id}-title`}
            >
              <header className={styles.cardHeader}>
                <h3 id={`${plan.id}-title`} className={styles.planName}>
                  {plan.name}
                </h3>

                <div className={styles.price}>
                  <span className={styles.priceAmount}>{plan.priceAmount}</span>
                  {plan.priceSuffix && <span className={styles.priceSuffix}>{plan.priceSuffix}</span>}
                </div>

                <p className={styles.description}>{plan.description}</p>
              </header>

              <ul className={styles.featuresList}>
                {plan.features.map((f) => {
                  const tierClass =
                    f.tier === "premium" ? styles.premiumTier : f.tier === "basic" ? styles.basicTier : "";
                  return (
                    <li key={f.name} className={styles.featureRow}>
                      <span className={styles.featureName}>{f.name}</span>
                      <span
                        className={`${styles.valueBadge} ${f.available ? styles.yes : styles.no} ${tierClass}`}
                        aria-label={f.available ? `${f.detail}（利用可）` : `${f.detail}（未対応）`}
                        title={f.detail}
                      >
                        <span className={styles.valueIcon} aria-hidden="true">
                          {f.available ? (f.tier === "premium" ? "★" : "✓") : "—"}
                        </span>
                        <span className={styles.valueLabel}>{f.detail}</span>
                      </span>
                    </li>
                  );
                })}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
