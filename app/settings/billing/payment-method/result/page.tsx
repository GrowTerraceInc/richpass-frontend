export const dynamic = "force-dynamic";

import Breadcrumbs from "@/app/components/breadcrumbs/Breadcrumbs";
import LinkButton from "@/app/components/ui/LinkButton";
import styles from "./ResultPage.module.css";

type SP = Record<string, string | string[] | undefined>;
const pick = (sp: SP, k: string) =>
  typeof sp[k] === "string" ? (sp[k] as string) : "";

function Icon({ kind }: { kind: "success" | "warn" | "error" | "info" }) {
  const cls =
    kind === "success"
      ? `${styles.icon} ${styles.iconSuccess}`
      : kind === "warn"
      ? `${styles.icon} ${styles.iconWarn}`
      : kind === "error"
      ? `${styles.icon} ${styles.iconError}`
      : `${styles.icon} ${styles.iconInfo}`;

  if (kind === "success") {
    return (
      <svg viewBox="0 0 24 24" className={cls} aria-hidden>
        <circle cx="12" cy="12" r="10" />
        <path d="M7 12l3 3 7-7" />
      </svg>
    );
  }
  if (kind === "error") {
    return (
      <svg viewBox="0 0 24 24" className={cls} aria-hidden>
        <circle cx="12" cy="12" r="10" />
        <path d="M8 8l8 8M16 8l-8 8" />
      </svg>
    );
  }
  // warn / info
  return (
    <svg viewBox="0 0 24 24" className={cls} aria-hidden>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 7v7" />
      {/* 点（塗りつぶし） */}
      <circle cx="12" cy="18.2" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  );
}

export default function ResultPage({ searchParams }: { searchParams: SP }) {
  const flow = pick(searchParams, "flow_state") || pick(searchParams, "state");
  const isSuccess = flow === "updated" || flow === "succeeded";
  const isNoChange = flow === "not_updated" || flow === "canceled";
  const isUnavailable = flow === "unavailable";

  const kind: "success" | "warn" | "error" | "info" = isSuccess
    ? "success"
    : isNoChange
    ? "warn"
    : isUnavailable
    ? "error"
    : "info";

  const title = "お支払い方法の変更";

  const message = isSuccess
  ? "カード情報の更新が完了しました。\nプラン管理に反映されるまで数秒かかる場合があります。"
  : isNoChange
  ? "変更は行われませんでした。\nもう一度やり直す場合は「お支払い方法を変更」から再度お試しください。"
  : isUnavailable
  ? "現在Stripeへの接続に問題が発生しました。\n時間をおいて再度お試しください。"
  : "処理が完了しました。\n念のためプラン管理で最新のカード末尾をご確認ください。";

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

      <div className={styles.wrapper} role="status" aria-live="polite">
        <Icon kind={kind} />
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.subtext}>{message}</p>

        <div className={styles.btnRow}>
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
      </div>
    </main>
  );
}
