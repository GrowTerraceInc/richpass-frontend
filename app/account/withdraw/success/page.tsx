import LinkButton from "@/app/components/ui/LinkButton";
import { CheckCircle2 } from "lucide-react";
import styles from "./SuccessPage.module.css";

export default function WithdrawSuccessPage() {
  return (
    <main className="container">
      <div className="header" />
      <section className={styles.wrapper}>
        <CheckCircle2 className={styles.icon} aria-hidden="true" strokeWidth={2.5} />
        <h1 className="h2" style={{ marginTop: 8 }}>退会手続きが完了しました</h1>
        <p className={styles.subtext}>
          これまでのご利用、ありがとうございました。<br />
          必要に応じてお問い合わせよりご連絡ください。
        </p>
        <LinkButton href="/mypage" size="large">マイページへ</LinkButton>
      </section>
    </main>
  );
}
