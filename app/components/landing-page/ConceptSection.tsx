import Image from "next/image";
import styles from "./ConceptSection.module.css";

export default function ConceptSection() {
  return (
    <section className={`${styles.conceptSection} section bg-white`} aria-label="コンセプト">
      <div className={`${styles.inner} container container--sm`}>
        {/* ロゴ（モバイルでも大きめ、PCで伸びすぎない） */}
        <Image
          src="/logo.png"
          alt="サービスロゴ"
          width={420}
          height={112}
          priority
          className={styles.logo}
          sizes="(max-width: 767px) 70vw, (max-width: 1023px) 360px, 420px"
        />

        {/* キャッチコピー */}
        <h2 className={`${styles.heading} h2`}>
          あなたの未来を豊かにする
          <br />
          <span className={styles.emphasis}>『通行証』</span>
        </h2>

        {/* 説明文（SPだけ指定位置で改行） */}
        <p className={styles.description}>
          リッチパスは、<br className={styles.brSmOnly} />
          単なる金融学習アプリではありません。<br className={styles.brSmOnly} />
          学びを<span className={styles.kagi}>「良い習慣」</span>に変え、<br className={styles.brSmOnly} />
          <span className={styles.kagi}>「続けられる環境」</span>を提供する<br className={styles.brSmOnly} />
          新しいかたちのラーニングサービスです。
        </p>
      </div>
    </section>
  );
}
