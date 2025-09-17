import LinkButton from "@/app/components/ui/LinkButton";
import { CheckCircle2 } from "lucide-react";
import styles from "./SuccessPage.module.css";

export default function PasswordSuccessPage() {
  return (
    <main className="container">
      <div className="header" />

      <section className={styles.wrapper}>
        <CheckCircle2 className={styles.icon} aria-hidden="true" strokeWidth={2.5} />
        <h1 className="h2" style={{ marginTop: 8 }}>パスワードを変更しました</h1>
        <p className={styles.subtext}>
          新しいパスワードが設定されました。<br />
          次回から、新しいパスワードでログインしてください。
        </p>
        <LinkButton href="/mypage" size="large">マイページに戻る</LinkButton>
      </section>
    </main>
  );
}
