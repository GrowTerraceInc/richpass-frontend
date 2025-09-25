'use client';

import Image from 'next/image';
import Link from 'next/link';
import styles from './RegistrationComplete.module.css';
import Button from '@/components/ui/Button';

export default function RegistrationComplete() {
  return (
    <section className={styles.container} aria-labelledby="rc-title">
      <div className={styles.inner}>
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
        <h1 id="rc-title" className={styles.title}>ようこそ、リッチパスへ！</h1>
        <p className={styles.desc}>
          <span className={styles.line1}>アカウント登録が完了しました。</span>
          <span className={styles.line2}>あなたの診断結果を見て、学習の第一歩を始めましょう。</span>
        </p>
        <div className={styles.ctaWrap}>
          <Link href="/diagnosis/result" className={styles.linkReset}>
            <Button variant="primary" size="large">診断結果を見る</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
