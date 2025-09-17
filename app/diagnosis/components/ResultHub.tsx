// app/diagnosis/components/ResultHub.tsx
import Image from "next/image";
import {
  getDiagnosisById,
  type DiagnosisTypeId,
} from "../data/diagnosisTypes";
import styles from "./ResultHub.module.css";
import ScoreRadar from "./ScoreRadar"; // ★ 追加

const DIAGNOSIS_IMG_BASE = "/diagnosis/types";

type Props = { typeId: DiagnosisTypeId };

export default function ResultHub({ typeId }: Props) {
  const t = getDiagnosisById(typeId);
  if (!t) return <p className={styles.resultHub}>診断タイプが見つかりません。</p>;

  const imgSrc = `${DIAGNOSIS_IMG_BASE}/${t.image}`;

  return (
    <section className={styles.resultHub}>
      <h1 className={styles.pageTitle}>あなたの詳細診断レポート</h1>
      <p className={styles.pageLead}>あなたの金融タイプ</p>

      <div className={styles.heroImg}>
        <Image
          src={imgSrc}
          alt={t.nameJa}
          width={200}
          height={200}
          className={styles.heroImgInner}
          priority
        />
      </div>

      <h2 className={styles.typeName}>【{t.nameJa}タイプ】</h2>

      <ul className={styles.keywords}>
        {t.tags.map((tag: string) => (
          <li key={tag}>{tag}</li>
        ))}
      </ul>

      <p className={styles.description}>{t.summary}</p>

      {/* ★ レーダーチャート（モックデータで表示） */}
      <div className={styles.graphBox}>
        <ScoreRadar />
      </div>

      <section className={styles.sectionCard}>
        <h3 className={styles.sectionHeading}>
          <span className={styles.sectionIcon} aria-hidden>💪</span>
          あなたの強み
        </h3>
        <p className={styles.text}>{t.strengths}</p>
      </section>

      <section className={styles.sectionCard}>
        <h3 className={styles.sectionHeading}>
          <span className={styles.sectionIcon} aria-hidden>⚠️</span>
          あなたの弱み
        </h3>
        <p className={styles.text}>{t.weaknesses}</p>
      </section>

      <section className={styles.sectionCard}>
        <h3 className={styles.sectionHeading}>
          <span className={styles.sectionIcon} aria-hidden>💡</span>
          アドバイス
        </h3>
        <p className={styles.text}>{t.advice}</p>
      </section>

      <section className={styles.courseCallout}>
        <h3 className={styles.sectionHeadingTight}>
          <span className={styles.sectionIcon} aria-hidden>📚</span>
          おすすめの学習コース
        </h3>
        <p className={styles.text}>{t.recommendedCourses}</p>
        <div className={styles.courseCtaRow}>
          <a href="/courses" className={styles.primaryCta}>
            あなたの学習コースへ進む
          </a>
        </div>
      </section>
    </section>
  );
}
