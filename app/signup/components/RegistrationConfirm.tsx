// app/signup/components/RegistrationConfirm.tsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./RegistrationConfirm.module.css";
import Button from "@/app/components/ui/Button";

type Props = {
  nickname: string;
  email: string;
  onConfirm?: () => void; // 任意: 呼び出し元で登録APIを呼ぶ場合
};

export default function RegistrationConfirm({ nickname, email, onConfirm }: Props) {
  const router = useRouter();

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
      return;
    }
    // デモ: そのまま結果へ遷移する導線例（必要に応じて差し替え）
    router.push("/signup"); // 実運用では登録API成功後の画面へ
  };

  return (
    <section className={styles.section} aria-labelledby="confirm-title">
      <div className={styles.inner}>
        {/* 1) H1 */}
        <h1 id="confirm-title" className={styles.title}>
          登録内容の確認
        </h1>

        {/* 2) 説明 */}
        <p className={styles.desc}>以下の内容でよろしいですか？</p>

        {/* 3) 確認ボックス */}
        <div className={styles.confirmBox}>
          <div className={styles.confirmItem}>
            <span className={styles.label}>ニックネーム</span>
            <span className={styles.value}>{nickname}</span>
          </div>
          <hr className={styles.sep} />
          <div className={styles.confirmItem}>
            <span className={styles.label}>メールアドレス</span>
            <span className={styles.value}>{email}</span>
          </div>
        </div>

        {/* 4) CTA */}
        <div className={styles.cta}>
          <Button variant="primary" size="large" onClick={handleConfirm}>
            この内容で登録する
          </Button>
        </div>

        {/* 5) 修正リンク */}
        <div className={styles.backRow}>
          <Link href="/signup" className={styles.backLink}>
            修正する
          </Link>
        </div>
      </div>
    </section>
  );
}
