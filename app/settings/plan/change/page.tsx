export const dynamic = "force-dynamic";

import Breadcrumbs from "@/app/components/breadcrumbs/Breadcrumbs";
import styles from "../PlanPage.module.css";
import { loadPlans, loadSubscriptionStatus } from "@/app/lib/billing";
import PlanCard from "@/app/components/billing/PlanCard";
import LinkButton from "@/app/components/ui/LinkButton";

function displayName(name: string, planId: string) {
  if (planId.toLowerCase() === "pro" || name.toUpperCase() === "PRO") return "PREMIUM";
  if (planId.toLowerCase() === "premium") return "PREMIUM";
  return "FREE";
}

export default async function PlanChangePage() {
  const [plans, sub] = await Promise.all([loadPlans(), loadSubscriptionStatus()]);

  return (
    <main className="container">
      <div className="header">
        <Breadcrumbs
          items={[
            { label: "マイページ", href: "/mypage" },
            { label: "プラン管理", href: "/settings/plan" },
            { label: "プランを変更", href: "/settings/plan/change" },
          ]}
        />
      </div>

      <div className={styles.header}>
        <h1 className={styles.title}>プランを変更</h1>
      </div>

      <div className={styles.wrap}>
        <section className={styles.grid}>
          {plans.map((p) => {
            const name = displayName(p.name, p.planId);
            const isCurrent = p.planId === sub?.currentPlanId;
            const isPremium = p.planId.toLowerCase() === "pro" || p.planId.toLowerCase() === "premium";

            // PREMIUM へ→ /subscribe、FREE へ→ 解約フロー
            const changeHref = isPremium ? "/subscribe" : "/settings/subscription/cancel";

            return (
              <PlanCard
                key={p.planId}
                name={name}
                monthly={p.priceMonthly}
                yearly={p.priceYearly}
                features={p.features}
                isCurrent={isCurrent}
                changeHref={changeHref}
              />
            );
          })}
        </section>

        <div style={{ display: "flex", justifyContent: "center", marginTop: 16 }}>
          <LinkButton variant="secondary" href="/settings/plan" size="small">
            プラン管理に戻る
          </LinkButton>
        </div>
      </div>
    </main>
  );
}
