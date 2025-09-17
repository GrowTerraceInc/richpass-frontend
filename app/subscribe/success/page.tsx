// app/subscribe/success/page.tsx
import Image from "next/image";
import Link from "next/link";
import styles from "./Success.module.css";
import Button from "@/app/components/ui/Button";

export default function SuccessPage() {
  return (
    <section className={styles.container} aria-labelledby="title">
      {/* 1枚画像（/public/subscribe/success-hero.png） */}
      <div className={styles.hero}>
        <Image
          src="/subscribe/success-hero.png"
          alt="決済完了のイメージ"
          width={240}
          height={160}
          priority
          className={styles.heroImg}
        />
      </div>

      <h1 id="title" className={styles.title}>
        ようこそ！<br />プレミアムプランへ！
      </h1>

      <p className={styles.lead}>
        ご登録ありがとうございます。<br />
        リッチパスの全ての機能がご利用可能になりました。
      </p>

      <div className={styles.cta}>
        <Link href="/diagnosis/detail" className={styles.linkReset}>
          <Button variant="primary" size="large">詳細な診断結果を見る</Button>
        </Link>
      </div>
    </section>
  );
}
