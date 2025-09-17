// app/diagnosis/components/RegistrationPromo.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import styles from "./RegistrationPromo.module.css";
import Button from "@/app/components/ui/Button";

export default function RegistrationPromo() {
  return (
    <section className={styles.promoSection} aria-labelledby="promo-title">
      <div className={styles.inner}>
        {/* 1) 画像（/public/diagnosis/promo-hero.png を用意） */}
        <div className={styles.hero}>
          <Image
            src="/diagnosis/promo-hero.png"
            alt="分析完了を示すイメージ"
            width={270}
            height={180}
            priority
            className={styles.heroImg}
            sizes="(max-width: 640px) 60vw, (max-width: 1024px) 40vw, 270px"
          />
        </div>

        {/* 2) 見出し */}
        <h1 id="promo-title" className={styles.title}>
          分析が完了しました！
        </h1>

        {/* 3) 説明文 */}
        <p className={styles.desc}>
          あなたのための「金融タイプ」と「お金との付き合い方」の分析結果が、
          まもなく表示されます。
        </p>

        {/* 4) メリットカード（中央寄せ） */}
        <div className={styles.benefitsCard} aria-labelledby="benefits-heading">
          <h2 id="benefits-heading" className={styles.cardHeading}>
            アカウント登録（無料）でできること
          </h2>
          <ul className={styles.list} role="list">
            <li>✓ あなただけの診断結果を無料で閲覧</li>
            <li>✓ 結果をいつでも見返せるように保存</li>
            <li>✓ あなたに最適な学習プランの提案</li>
          </ul>
        </div>

        {/* 5) CTA */}
        <div className={styles.ctaWrap}>
          <Link
            href="/signup"
            aria-label="無料で結果を見る（アカウント登録へ）"
            className={styles.ctaLinkReset}
          >
            <Button variant="primary" size="large">
              {/* SPのみ改行、PC/Tabletは1行表示 */}
              無料で結果を見る{" "}
              <br className={styles.brSmOnly} />
              （アカウント登録へ）
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
