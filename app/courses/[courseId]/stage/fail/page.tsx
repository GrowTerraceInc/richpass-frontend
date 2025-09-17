import Link from "next/link";
import Image from "next/image";
import Button from "@/app/components/ui/Button";
import styles from "./StageFailPage.module.css";
import { getTestById } from "@/app/lib/mockLoader";

function failHeading(score: number, total: number, need: number): string {
  const gap = Math.max(0, need - score);

  if (score <= 0) return "ここからスタート！";
  if (gap <= 1) return "あと少し！";     // 合格まで1問
  if (gap === 2) return "惜しい！";      // 合格まで2問
  if (score / Math.max(1, total) >= 0.6) return "もう一歩！";
  if (score / Math.max(1, total) >= 0.3) return "次に備えて復習しよう";
  return "次につながる一歩！";
}

export default async function FailPage(props: {
  params: Promise<{ courseId: string }>;
  searchParams: Promise<{
    score?: string;
    total?: string;
    need?: string;
    testId?: string;
    testid?: string;   // 表記ゆれ対応
    lessonId?: string; // 復習遷移用
    title?: string;    // テストタイトル（任意）
  }>;
}) {
  const { courseId } = await props.params;
  const sp = await props.searchParams;

  const score = Number(sp.score ?? 0);
  const total = Number(sp.total ?? 0);
  const need = Number(sp.need ?? 0);

  // testId は表記ゆれ両対応
  const testId = (sp.testId ?? sp.testid ?? "").toString();
  const lessonId = sp.lessonId ?? "";

  // タイトルはクエリ優先、無ければ testId から補完
  let testTitle = sp.title ?? "";
  if (!testTitle && testId) {
    const test = await getTestById(testId).catch(() => null);
    testTitle = test?.title ?? "";
  }

  // 復習先：lessonId があれば単数パス / 無ければコースTOP
  const reviewHref = lessonId
    ? `/courses/${courseId}/lesson/${lessonId}`
    : `/courses/${courseId}`;

  const heading = failHeading(score, total, need);

  return (
    <section className={`mx-auto max-w-[760px] px-4 ${styles.wrap}`}>
      <div className={styles.illust}>
        {/* レスポンシブ化（はみ出し対策） */}
        <Image
          src="/images/result-fail.png"
          alt=""
          width={420}
          height={240}
          priority
          sizes="(max-width: 640px) 90vw, 420px"
          style={{ width: "100%", height: "auto" }}
          className={styles.illustImg}
        />
      </div>

      {/* テストタイトル（Clear と同位置・見た目） */}
      {testTitle && <h2 className={styles.testTitle}>{testTitle}</h2>}

      {/* 見出し（スコア連動） */}
      <h1 className={styles.h1}>{heading}</h1>

      <p className={styles.score}>
        <strong>{score}/{total}問 正解</strong>
      </p>

      <p className={styles.msg}>
        間違えた問題も、大切な学びの一部です。<br />動画を見直して、もう一度挑戦してみましょう！
      </p>

      <div className={styles.actions}>
        <Link href={`/courses/${courseId}/test/${testId}`} className="contents">
          <Button variant="primary" size="large" className="w-full max-w-[420px]">
            もう一度テストに挑戦する
          </Button>
        </Link>

        <Link href={reviewHref} className="contents">
          <Button variant="secondary" size="large" className="w-full max-w-[420px]">
            動画を見直して復習する
          </Button>
        </Link>
      </div>
    </section>
  );
}
