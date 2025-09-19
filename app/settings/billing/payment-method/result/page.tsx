export const dynamic = "force-dynamic";

import Breadcrumbs from "@/app/components/breadcrumbs/Breadcrumbs";
import LinkButton from "@/app/components/ui/LinkButton";
import styles from "../PaymentMethodPage.module.css";

type SP = Record<string, string | string[] | undefined>;

function pick(searchParams: SP, key: string) {
  const v = searchParams[key];
  return typeof v === "string" ? v : "";
}

export default function ResultPage({ searchParams }: { searchParams: SP }) {
  // Stripe が付与する/こちらで付けた可能性のあるクエリを吸収
  const flow = pick(searchParams, "flow_state") || pick(searchParams, "state");
  const isSuccess = flow === "updated" || flow === "succeeded";
  const isNoChange = flow === "not_updated" || flow === "canceled";
  const isUnavailable = flow === "unavailable";

  // 見出し & サブメッセージ
  const title = "お支払い方法の変更";
  let body =
    "処理が完了しました。念のためプラン管理で最新のカード末尾をご確認ください。";

  if (isSuccess) {
    body = "カード情報の更新が完了しました。プラン管理に反映されるまで数秒かかる場合があります。";
  } else if (isNoChange) {
    body = "変更は行われませんでした。もう一度やり直す場合は「お支払い方法を変更」から再度お試しください。";
  } else if (isUnavailable) {
    body = "現在Stripeに接続できませんでした。時間をおいて再度お試しください。";
  }

  return (
    <main className="container">
      <div className="header">
        <Breadcrumbs
          items={[
            { label: "マイページ", href: "/mypage" },
            { label: "プラン管理", href: "/settings/plan" },
            { label: "お支払い方法の変更", href: "/settings/billing/payment-method" },
            { label: "結果", href: "/settings/billing/payment-method/result" },
          ]}
        />
      </div>

      <div className={styles.header}>
        <h1 className={styles.title}>{title}</h1>
      </div>

      <div className={styles.wrap}>
        <section className={styles.card}>
          <p style={{ margin: 0 }}>{body}</p>
          <div className={styles.actions} style={{ marginTop: 8 }}>
            <LinkButton variant="secondary" href="/settings/plan" size="small">
              プラン管理に戻る
            </LinkButton>
            {!isSuccess && (
              <LinkButton
                variant="primary"
                href="/settings/billing/payment-method"
                size="small"
              >
                もう一度試す
              </LinkButton>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
