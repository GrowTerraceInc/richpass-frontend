// app/signup/components/RegistrationComplete.tsx
"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./RegistrationComplete.module.css";
import Button from "@/app/components/ui/Button";

export default function RegistrationComplete() {
  // ★ デモ用：このページ表示時にログイン済みクッキーをセット
  useEffect(() => {
    // 有効期限やSecureなどは本番の要件に合わせて調整
    document.cookie = `logged_in=1; path=/; max-age=86400`;
  }, []);

  return (
    <section className={styles.container} aria-labelledby="rc-title">
      <div className={styles.inner}>
        {/* 1) ヒーロー画像（/public/signup/complete-hero.png を配置） */}
        <div className={styles.hero}>
          <Image
            src="/signup/complete-hero.png"
            alt="登録完了のお祝い画像"
            width={300}
            height={200}
            priority
            className={styles.heroImg}
            sizes="(max-width: 640px) 60vw, (max-width: 1024px) 40vw, 300px"
          />
        </div>

        {/* 2) 見出し */}
        <h1 id="rc-title" className={styles.title}>
          ようこそ、リッチパスへ！
        </h1>

        {/* 3) 説明（小画面でも2行で必ず改行） */}
        <p className={styles.desc}>
          <span className={styles.line1}>アカウント登録が完了しました。</span>
          <span className={styles.line2}>
            あなたの診断結果を見て、学習の第一歩を始めましょう。
          </span>
        </p>

        {/* 4) CTA（診断結果へ） */}
        <div className={styles.ctaWrap}>
          {/* もし結果タイプがあるなら ?type= を付与してください */}
          <Link href="/diagnosis/result" className={styles.linkReset}>
            <Button variant="primary" size="large">診断結果を見る</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
