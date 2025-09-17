// app/diagnosis/components/ResultSummary.tsx
import Image from "next/image";
import styles from "./ResultSummary.module.css";
import {
  getDiagnosisById,
  type DiagnosisTypeId,
} from "../data/diagnosisTypes";
import ScoreRadar from "./ScoreRadar";
import Button from "../../../app/components/ui/Button";
import Link from "next/link";

const DIAGNOSIS_IMG_BASE = "/diagnosis/types";

type Props = { typeId: DiagnosisTypeId };

export default function ResultSummary({ typeId }: Props) {
  const t = getDiagnosisById(typeId);
  if (!t) return <p className={styles.container}>診断タイプが見つかりません。</p>;

  const imgSrc = `${DIAGNOSIS_IMG_BASE}/${t.image}`;

  return (
    <section className={styles.container}>
      {/* ヘッダー */}
      <h1 className={styles.pageTitle}>あなたの診断レポート</h1>
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
        {t.tags.map((tag) => (
          <li key={tag}>{tag}</li>
        ))}
      </ul>

      <p className={styles.description}>{t.summary}</p>

      {/* 簡易レーダー（高さ控えめ） */}
      <div className={styles.graphBox}>
        <ScoreRadar />
      </div>

      {/* 共有導線（任意） */}
      <div className={styles.share}>
        <span className={styles.shareLead}>この結果をシェアする</span>
        <div className={styles.shareBtns}>
          <button className={styles.iconBtn} aria-label="Share on X">X</button>
          <button className={styles.iconBtn} aria-label="Share on LINE">LINE</button>
        </div>
      </div>

      {/* ここから「詳細をぼかす」区画 */}
      <section className={styles.lockSection}>
        <h3 className={styles.lockHeading}>さらに詳しく！ あなたの詳細診断レポート</h3>

        {/* 強み（ぼかし） */}
        <div className={styles.blurCard}>
          <h4 className={styles.cardTitle}>あなたの強み</h4>
          <div className={styles.blurredWrap}>
            <p className={styles.blurredContent}>{t.strengths}</p>
            <div className={styles.blurOverlay}>
              <span className={styles.lockIcon} aria-hidden>🔒</span>
              <p>プレミアム登録で全文を閲覧できます</p>
            </div>
          </div>
        </div>

        {/* 弱み（ぼかし） */}
        <div className={styles.blurCard}>
          <h4 className={styles.cardTitle}>あなたの弱み</h4>
          <div className={styles.blurredWrap}>
            <p className={styles.blurredContent}>{t.weaknesses}</p>
            <div className={styles.blurOverlay}>
              <span className={styles.lockIcon} aria-hidden>🔒</span>
              <p>プレミアム登録で全文を閲覧できます</p>
            </div>
          </div>
        </div>

        {/* アドバイス（ぼかし） */}
        <div className={styles.blurCard}>
          <h4 className={styles.cardTitle}>アドバイス</h4>
          <div className={styles.blurredWrap}>
            <p className={styles.blurredContent}>{t.advice}</p>
            <div className={styles.blurOverlay}>
              <span className={styles.lockIcon} aria-hidden>🔒</span>
              <p>プレミアム登録で全文を閲覧できます</p>
            </div>
          </div>
        </div>

        {/* コールアウト＋ボタン */}
        <div className={styles.upgradeCallout}>
          <p className={styles.upgradeLead}>
            詳細レポート（全文）と学習コースの提案を今すぐチェック！
          </p>
          <Link href="/diagnosis" aria-label="プレミアムプランで診断レポートを見る">
          <Button variant="primary" size="large">プレミアムプランで診断レポートを見る</Button>
          </Link>
          <p className={styles.note}>
            登録後はこのページからロックが解除され、全文が表示されます。
          </p>
        </div>
      </section>
    </section>
  );
}
