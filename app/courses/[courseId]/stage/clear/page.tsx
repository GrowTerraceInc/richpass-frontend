import Link from "next/link";
import Image from "next/image";
import Button from "@/app/components/ui/Button";
import styles from "./StageClearPage.module.css";
import { getTestById, getCourseById, getLessonById } from "@/app/lib/mockLoader";
import XpProgress from "../../../../components/xp/XpProgress";

/** Course に lessonIds が載っているケースの型 */
type CourseWithLessonIds = { lessonIds: string[] };

function hasLessonIds(course: unknown): course is CourseWithLessonIds {
  return (
    !!course &&
    typeof course === "object" &&
    "lessonIds" in course &&
    Array.isArray((course as CourseWithLessonIds).lessonIds) &&
    (course as CourseWithLessonIds).lessonIds.every((id) => typeof id === "string")
  );
}

export default async function ClearPage(props: {
  params: Promise<{ courseId: string }>;
  searchParams: Promise<{
    score?: string;
    total?: string;
    need?: string;
    testId?: string;
    testid?: string;   // 表記ゆれ対応
    lessonId?: string; // 受験したレッスンID
    title?: string;    // テストタイトル
    nextLessonId?: string; // Runner から渡る “次レッスンID”（最優先）
    isLast?: string;       // "1"なら最後（任意）

    // ▼ XP用（任意）
    lv?: string;
    xp?: string;
    req?: string;
    gain?: string;
  }>;
}) {
  const { courseId } = await props.params;
  const sp = await props.searchParams;

  // --- スコア ---
  const score = Number(sp.score ?? 0);
  const total = Number(sp.total ?? 0);

  // testId 両対応
  const testId = (sp.testId ?? sp.testid ?? "").toString();
  const lessonId = sp.lessonId ?? "";
  const qpNextLessonId = sp.nextLessonId ?? "";
  const qpIsLast = sp.isLast === "1";

  // タイトル：クエリ優先、無ければ testId から取得
  let testTitle = sp.title ?? "";
  if (!testTitle && testId) {
    const test = await getTestById(testId).catch(() => null);
    testTitle = test?.title ?? "";
  }

  // --- 次レッスン算出（フォールバック） ---
  let computedNextLessonId = "";
  let computedIsLast = false;
  if (!qpNextLessonId || !qpIsLast) {
    const course = await getCourseById(courseId).catch(() => null);
    const lessonIds: string[] = hasLessonIds(course) ? course!.lessonIds : [];
    if (lessonIds.length && lessonId) {
      const curIdx = lessonIds.findIndex((id) => id === lessonId);
      if (curIdx >= 0) {
        const hasNext = curIdx < lessonIds.length - 1 && Boolean(lessonIds[curIdx + 1]);
        computedNextLessonId = hasNext ? lessonIds[curIdx + 1] : "";
        computedIsLast = curIdx === lessonIds.length - 1;
      }
    }
    if (!computedNextLessonId && lessonId) {
      const m = lessonId.match(/^(.*?)-(\d+)$/);
      if (m) {
        const base = m[1];
        const n = Number(m[2]);
        const candidate = `${base}-${n + 1}`;
        const nextLesson = await getLessonById(candidate).catch(() => null);
        if (nextLesson) {
          computedNextLessonId = candidate;
          computedIsLast = false;
        } else {
          computedIsLast = true;
        }
      }
    }
  }
  const finalNextLessonId = qpNextLessonId || computedNextLessonId;
  const finalIsLast = qpIsLast || computedIsLast;

  // --- XP 表示用パラメータ ---
  const toNum = (v: string | undefined, d: number) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : d;
  };
  const initialLevel = toNum(sp.lv, 1);
  const currentXp = toNum(sp.xp, 0);
  const xpToNext = toNum(sp.req, 100);
  const gainedXp = toNum(sp.gain, 50);

  // ルーティング
  const listHref = `/courses`;
  const nextHref = `/courses/${courseId}/lesson/${finalNextLessonId}`;
  const canShowNextButton =
    !!finalNextLessonId && finalNextLessonId !== lessonId && !finalIsLast;

  return (
    <section className={`mx-auto max-w-[760px] px-4 ${styles.wrap}`}>
      {/* レスポンシブ画像（aspect維持のため style で width/height をセット） */}
      <div className={styles.illust}>
        <Image
          src="/images/result-clear.png"
          alt=""
          width={420}
          height={240}
          priority
          sizes="(max-width: 640px) 90vw, 420px"
          style={{ width: "100%", height: "auto" }}
          className={styles.illustImg}
        />
      </div>

      {/* テストタイトル（Fail と同位置） */}
      {testTitle && <h2 className={styles.testTitle}>{testTitle}</h2>}

      {/* 見出し */}
      <h1 className={styles.h1}>ステージクリア！</h1>

      {/* スコア */}
      <p className={styles.score}>
        <strong>{score}/{total}問 正解</strong>
      </p>

      {/* XPアニメーション */}
      <div className={styles.xpSection}>
        <XpProgress
          initialLevel={initialLevel}
          currentXp={currentXp}
          xpToNext={xpToNext}
          gainedXp={gainedXp}
          color="#22c55e"
        />
      </div>

      {/* アクション */}
      <div className={styles.actions}>
        <Link href={listHref} className="contents">
          <Button variant="primary" size="large" className="w-full max-w-[420px]">
            コース一覧へ
          </Button>
        </Link>

        {canShowNextButton && (
          <Link href={nextHref} className="contents">
            <Button variant="secondary" size="large" className="w-full max-w-[420px]">
              続きのレッスンへ
            </Button>
          </Link>
        )}
      </div>
    </section>
  );
}
