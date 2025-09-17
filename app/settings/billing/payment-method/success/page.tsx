import LinkButton from "@/app/components/ui/LinkButton";
import { CheckCircle2 } from "lucide-react";
import styles from "./SuccessPage.module.css";

export default function PaymentMethodSuccessPage() {
  return (
    <main className="container">
      <div className="header" />

      <section className={styles.wrapper}>
        <CheckCircle2 className={styles.icon} aria-hidden="true" strokeWidth={2.5} />
        <h1 className="h2" style={{ marginTop: 8 }}>お支払い方法を変更しました</h1>
        <p className={styles.subtext}>
          新しいカード情報が登録されました。<br />
          次回以降の決済に適用されます。
        </p>
        <LinkButton href="/settings/plan" size="large">プラン管理に戻る</LinkButton>
      </section>
    </main>
  );
}
