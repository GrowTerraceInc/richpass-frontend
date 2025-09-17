export const dynamic = "force-dynamic";

import Breadcrumbs from "@/app/components/breadcrumbs/Breadcrumbs";
import LinkButton from "@/app/components/ui/LinkButton";
import styles from "./PaymentMethodPage.module.css";
import { loadSubscriptionStatus } from "@/app/lib/billing";
import RedirectToStripeButton from "./RedirectToStripeButton";

export default async function PaymentMethodPage() {
  const sub = await loadSubscriptionStatus();

  return (
    <main className="container">
      <div className="header">
        <Breadcrumbs
          items={[
            { label: "マイページ", href: "/mypage" },
            { label: "プラン管理", href: "/settings/plan" },
            { label: "お支払い方法の変更", href: "/settings/billing/payment-method" },
          ]}
        />
      </div>

      <div className={styles.header}>
        <h1 className={styles.title}>お支払い方法の変更</h1>
      </div>

      <div className={styles.wrap}>
        {/* 現在の支払い方法（サマリのみ） */}
        <section className={styles.card}>
          <div className={styles.row}>
            <div className={styles.label}>現在のカード</div>
            <div className={styles.value}>
              {sub?.last4 ? `**** **** **** ${sub.last4}` : "未設定 / モック"}
            </div>
          </div>

          <p className={styles.note}>
            この画面ではカード番号の入力は行いません。<br />
            下のボタンから Stripe の管理ページ（Customer Portal）に移動して、カード情報を変更してください。
          </p>

          <div className={styles.actions}>
            <RedirectToStripeButton />
            <LinkButton variant="secondary" href="/settings/plan" size="small">
              プラン管理に戻る
            </LinkButton>
          </div>
        </section>
      </div>
    </main>
  );
}
