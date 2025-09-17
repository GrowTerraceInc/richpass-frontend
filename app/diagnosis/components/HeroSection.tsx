import Image from "next/image";
import styles from "./HeroSection.module.css";
import Button from "@/app/components/ui/Button";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className={`section bg-brand-100`} aria-label="ヒーロー">
      <div className={`container ${styles.inner}`}>

        {/* 上段アバター（中央だけ少し上げる） */}
        <div className={styles.rowTop} aria-hidden="true">
          <div className={styles.avatarWrap}>
            <Image src="/diagnosis/avatars/type-a.png" alt="" fill className={styles.avatarImg} sizes="128px" />
          </div>
          <div className={`${styles.avatarWrap} ${styles.centerTop}`}>
            <Image src="/diagnosis/avatars/type-b.png" alt="" fill className={styles.avatarImg} sizes="128px" />
          </div>
          <div className={styles.avatarWrap}>
            <Image src="/diagnosis/avatars/type-c.png" alt="" fill className={styles.avatarImg} sizes="128px" />
          </div>
        </div>

        {/* タイトル：SPのみ3行、MD+は2行 */}
        <h1 className={styles.title}>
          あなたの
          <br className={styles.brSmOnly} />
          金銭感覚を解き明かす
          <br className={styles.brSmOnly} />
          <br className={styles.brMdUp} />
          新しいお金の性格診断
        </h1>

        {/* 下段アバター（中央だけ少し下げる） */}
        <div className={styles.rowBottom} aria-hidden="true">
          <div className={styles.avatarWrap}>
            <Image src="/diagnosis/avatars/type-d.png" alt="" fill className={styles.avatarImg} sizes="128px" />
          </div>
          <div className={`${styles.avatarWrap} ${styles.centerBottom}`}>
            <Image src="/diagnosis/avatars/type-e.png" alt="" fill className={styles.avatarImg} sizes="128px" />
          </div>
          <div className={styles.avatarWrap}>
            <Image src="/diagnosis/avatars/type-f.png" alt="" fill className={styles.avatarImg} sizes="128px" />
          </div>
        </div>

        {/* リード */}
        <p className={styles.lead}>
          簡単な質問に答えるだけで、あなたの隠れた強みや陥りがちなパターンがわかります。
        </p>

        {/* チップ */}
        <ul className={styles.chips} aria-label="診断の特徴">
          <li>無料</li>
          <li>登録不要</li>
          <li>診断時間：約5分</li>
        </ul>

        {/* CTA */}
        <div className={styles.ctaArea}>
          <Link href="/diagnosis/quiz" aria-label="無料で診断を始める">
          <Button variant="primary" size="large">診断を始める</Button>
          </Link>
          <p className={styles.note}>アカウント登録は不要です</p>
        </div>

        {/* 実績数値：中央にコンパクト配置 */}
        <div className={styles.stats} aria-label="診断の実績">
          <div className={styles.statItem}>
            <div className={styles.statValue}>18%</div>
            <div className={styles.statLabel}>慎重な相談者<br />最も一般的なタイプ</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statValue}>4%</div>
            <div className={styles.statLabel}>計画ドリーマー<br />最も珍しいタイプ</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statValue}>8</div>
            <div className={styles.statLabel}>金銭性格タイプ</div>
          </div>
        </div>

      </div>
    </section>
  );
}
