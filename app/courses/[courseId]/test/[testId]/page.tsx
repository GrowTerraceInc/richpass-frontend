import clsx from "clsx";
import TestRunner from "./runner";
import { notFound } from "next/navigation";
import { getTestById, getCourseById, getLessonById } from "@/app/lib/mockLoader";
import Breadcrumbs from "@/app/components/breadcrumbs/Breadcrumbs";
import styles from "./TestPage.module.css";

/** コースが lessonIds を持つ形 */
type CourseWithLessonIds = { lessonIds: string[] };
type LessonRef = { id: string } | string;
type CourseWithLessons = { lessons: LessonRef[] };
type CourseWithTitle = { title: string };

function hasLessonIds(course: unknown): course is CourseWithLessonIds {
  return !!course && typeof course === "object" && "lessonIds" in course && Array.isArray((course as CourseWithLessonIds).lessonIds);
}
function isLessonRefArray(arr: unknown): arr is LessonRef[] {
  return Array.isArray(arr) && arr.every(v => typeof v === "string" || (v && typeof v === "object" && "id" in v));
}
function hasLessons(course: unknown): course is CourseWithLessons {
  return !!course && typeof course === "object" && "lessons" in course && isLessonRefArray((course as CourseWithLessons).lessons);
}
function hasTitle(course: unknown): course is CourseWithTitle {
  return !!course && typeof course === "object" && "title" in course && typeof (course as CourseWithTitle).title === "string";
}

export default async function Page(props: {
  params: Promise<{ courseId: string; testId: string }>;
}) {
  const { courseId, testId } = await props.params;

  const test = await getTestById(testId);
  if (!test) return notFound();

  const course = await getCourseById(courseId);
  const lesson = test.lessonId ? await getLessonById(test.lessonId) : null;

  const lessonTitle = lesson?.title ?? test.title;
  const courseTitle = hasTitle(course) ? course.title : courseId;

  // 次レッスンIDの算出（任意：Clearで使うためRunner経由で渡す）
  const currentLessonId = test.lessonId ?? "";
  let orderedLessonIds: string[] = [];
  if (hasLessonIds(course)) orderedLessonIds = course.lessonIds;
  else if (hasLessons(course)) {
    orderedLessonIds = course.lessons
      .map((l) => (typeof l === "string" ? l : l.id))
      .filter((id): id is string => typeof id === "string" && id.length > 0);
  }
  const curIdx = currentLessonId ? orderedLessonIds.findIndex((id) => id === currentLessonId) : -1;
  const hasNext = curIdx >= 0 && curIdx < orderedLessonIds.length - 1 && Boolean(orderedLessonIds[curIdx + 1]);
  const nextLessonId = hasNext ? orderedLessonIds[curIdx + 1] : "";
  const isLast = curIdx >= 0 && curIdx === orderedLessonIds.length - 1;

  return (
    <main className={clsx("container", styles.wrap)}>
      <div className={styles.header}>
        <Breadcrumbs
          items={[
            { label: "コース一覧", href: "/courses" },
            { label: courseTitle, href: `/courses/${courseId}` },
            { label: lessonTitle },
          ]}
        />
      </div>

      {/* 2行タイトル（中央寄せ） */}
      <h1 className={styles.h1}>
        <span className={styles.h1Main}>{lessonTitle}</span>
        <span className={styles.h1Sub}>理解度チェック</span>
      </h1>

      {/* 本文（Q進捗・プログレス・設問）は narrow 幅で統一 */}
      <div className={styles.narrow}>
        <TestRunner
          courseId={courseId}
          testId={test.id}
          passScore={test.passScore}
          questions={test.questions}
          lessonId={currentLessonId}
          title={lessonTitle}
          nextLessonId={nextLessonId}
          isLast={isLast}
        />
      </div>
    </main>
  );
}
