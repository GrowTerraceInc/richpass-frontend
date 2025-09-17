// app/courses/[courseId]/page.tsx
import Link from "next/link";
import clsx from "clsx";
import { loadBundle } from "@/app/lib/mockLoader";
import Breadcrumbs from "@/app/components/breadcrumbs/Breadcrumbs";
import ProgressBar from "@/app/components/progress/ProgressBar";
import { Button } from "@/app/components/ui/Button";
import styles from "./CourseDetailPage.module.css";

/** /courses/[id]?demo=progress で進捗デモを有効に */
function isDemoEnabled(searchParams?: { [k: string]: string | string[] | undefined }) {
  const q = (searchParams?.demo ?? "") as string;
  return q === "progress" || process.env.NEXT_PUBLIC_DEMO_PROGRESS === "1";
}
type LessonStatus = "done" | "current" | "locked";

/** クエリから done / pct を読み取って擬似進捗を生成 */
function planProgress(total: number, searchParams?: { [k: string]: string | string[] | undefined }) {
  const rawPct = (searchParams?.pct as string | undefined)?.trim();
  const pctNum = rawPct != null ? Number(rawPct) : NaN;
  const pct = Number.isFinite(pctNum) ? (pctNum > 1 ? pctNum / 100 : pctNum) : NaN;

  const rawDone = (searchParams?.done as string | undefined)?.trim();
  const doneNum = rawDone != null ? Number(rawDone) : NaN;

  let doneCount = 0;
  if (Number.isFinite(doneNum)) {
    doneCount = Math.max(0, Math.min(total, Math.round(doneNum)));
  } else if (Number.isFinite(pct)) {
    doneCount = Math.max(0, Math.min(total, Math.round(total * pct)));
  } else {
    doneCount = Math.max(0, Math.floor(total * 0.25)); // 既定：25%
  }

  const currentIdx = doneCount >= total ? -1 : doneCount; // 全完了なら current なし
  return { doneCount, currentIdx };
}

export default async function CourseDetailPage(props: {
  params: Promise<{ courseId: string }>;
  searchParams?: Promise<{ [k: string]: string | string[] | undefined }>;
}) {
  const { courseId } = await props.params;
  const sp = props.searchParams ? await props.searchParams : undefined;

  // ---- DB/モックからデータ取得 ----
  const bundle = await loadBundle();
  const course = bundle.courses[courseId];
  if (!course) {
    return (
      <main className="container">
        <h1 className="text-xl font-semibold">コースが見つかりません</h1>
        <Link href="/courses" className="text-blue-600 underline">
          コース一覧へ戻る
        </Link>
      </main>
    );
  }

  // レッスン一覧（order順）
  const lessons = Object.values(bundle.lessons)
    .filter((l) => l.courseId === courseId)
    .sort((a, b) => a.order - b.order);

  const total = lessons.length;

  // 進捗（デモ or 既定）
  let doneCount = 0;
  let currentIdx = 0;
  if (isDemoEnabled(sp)) {
    const plan = planProgress(total, sp);
    doneCount = plan.doneCount;
    currentIdx = plan.currentIdx;
  } else {
    doneCount = 0;
    currentIdx = total > 0 ? 0 : -1;
  }

  const items = lessons.map((l, idx) => {
    let status: LessonStatus = "locked";
    if (idx < doneCount) status = "done";
    else if (idx === currentIdx) status = "current";
    return {
      id: l.id,
      title: l.title,
      href: `/courses/${courseId}/lesson/${l.id}`,
      status,
    };
  });

  const progressPct = total ? Math.round((doneCount / total) * 100) : 0;

  // 続きから：current > locked の最初 > 最後
  const firstNext =
    items.find((i) => i.status === "current") ??
    items.find((i) => i.status === "locked") ??
    items[items.length - 1];
  const continueHref = firstNext?.href ?? `/courses/${courseId}`;

  return (
    <main className={clsx("container", styles.wrap)}>
      <div className={styles.header}>
        <Breadcrumbs
          items={[
            { label: "コース一覧", href: "/courses" },
            { label: course.title },
          ]}
        />
      </div>

      <h1 className={clsx("h2", styles.title)}>{course.title}</h1>
      <p className={styles.desc}>{course.description}</p>

      <aside className={styles.highlight} role="note" aria-label="このコースを終えると、あなたは…">
        <strong className={styles.hlTitle}>このコースを終えると、あなたは…</strong>
        <p>{course.outcomes}</p>
      </aside>

      <div className={styles.progressRow}>
        <span>進捗 {progressPct}%</span>
        <ProgressBar value={progressPct} className={styles.progress} />
      </div>

      <div className={styles.actions}>
        <Link href={continueHref}>
          <Button variant="primary" size="large">続きから学習する</Button>
        </Link>
      </div>

      {/* タイムライン */}
      <ol className={styles.timeline} aria-label="レッスン一覧">
        {items.map((it) => (
          <li key={it.id} className={clsx(styles.item, styles[it.status])}>
            {/* 左マーカー */}
            {it.status === "locked" ? (
              <span className={styles.marker} aria-hidden>
                <svg viewBox="0 0 24 24" className={styles.markerSvg}>
                  <path d="M8 12h8v6H8z" fill="#9ca3af" />
                  <path d="M9 12v-2a3 3 0 1 1 6 0v2" stroke="#9ca3af" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </span>
            ) : (
              <Link
                href={it.href}
                className={clsx(styles.marker, styles.markerButton)}
                aria-label={`${it.title} を開く`}
              >
                <svg viewBox="0 0 24 24" className={styles.markerSvg} aria-hidden>
                  {it.status === "done" && (
                    <g transform="translate(0 0.8)">
                      <path
                        d="M16.97 7.97a.75.75 0 0 1 0 1.06l-6.01 6.01a.75.75 0 0 1-1.06 0L7.03 12.1a.75.75 0 1 1 1.06-1.06l1.81 1.81 5.48-5.48a.75.75 0 0 1 1.06 0z"
                        fill="#fff"
                      />
                    </g>
                  )}
                  {it.status === "current" && <path d="M10 8l6 4-6 4V8z" fill="#fff" />}
                </svg>
              </Link>
            )}

            {/* レッスンカード */}
            <div className={clsx(styles.lessonCard, it.status === "locked" && styles.disabled)}>
              <Link href={it.href} className={styles.lessonMain}>
                <div className={styles.lessonTitle}>{it.title}</div>
              </Link>
              {it.status !== "locked" && (
                <Link href={it.href} className={styles.lessonAction}>
                  <Button variant="primary" size="small">学習する</Button>
                </Link>
              )}
            </div>
          </li>
        ))}
      </ol>
    </main>
  );
}
