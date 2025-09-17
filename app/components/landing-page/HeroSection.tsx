"use client";

import Image from "next/image";
import styles from "./HeroSection.module.css";
import Button from "@/app/components/ui/Button";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className={styles.hero} aria-label="ヒーローセクション">
      {/* 背景（Image + object-position で確実に位置制御） */}
      <div className={styles.bgMedia} aria-hidden="true">
        <Image
          src="/landing-page/hero-image.jpg"
          alt=""               /* 装飾用なので空alt */
          fill
          priority
          sizes="100vw"
          className={styles.bgImage}
        />
      </div>

      {/* オーバーレイ & グラデーション */}
      <div className={styles.overlay} aria-hidden="true" />
      <div className={styles.gradientBottom} aria-hidden="true" />

      {/* コンテンツ */}
      <div className={styles.content}>
        <div className={styles.top}>
          <h1 className={styles.title}>
            <span className={styles.lineMobileBlock}>未来の不安を、</span>
            <span className={`${styles.lineMobileBlock} ${styles.brDesktop}`}>
              自信に変える。
            </span>
            <span className={styles.lineMobileBlock}>新しい金融学習体験を、</span>
            <span className={styles.lineMobileBlock}>今すぐ。</span>
          </h1>
        </div>

        <div className={styles.bottom}>
          <p className={styles.description}>
            簡単なタイプ診断から始まり、<br />
            ゲーム感覚で楽しく続く。<br />
            あなたのペースで、<br />
            お金の知識をアップデートしよう。
          </p>

          <Link href="/diagnosis" aria-label="無料で診断を始める">
          <Button variant="primary" size="large">
            まずは無料で診断する
          </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
