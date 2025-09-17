export const dynamic = "force-dynamic";

import Breadcrumbs from "@/app/components/breadcrumbs/Breadcrumbs";
import styles from "./CancelPage.module.css";
import { loadSubscriptionStatus } from "@/app/lib/billing";
import CancelForm from "./CancelForm";

export default async function CancelPage() {
  const sub = await loadSubscriptionStatus();

  return (
    <main className="container">
      <div className="header">
        <Breadcrumbs
          items={[
            { label: "マイページ", href: "/mypage" },
            { label: "プラン管理", href: "/settings/plan" },
            { label: "サブスクの解約", href: "/settings/subscription/cancel" },
          ]}
        />
      </div>

      <div className={styles.header}>
        <h1 className={styles.title}>サブスクの解約</h1>
      </div>

      <div className={styles.wrap}>
        <CancelForm renewsAt={sub?.renewsAt} />
      </div>
    </main>
  );
}
