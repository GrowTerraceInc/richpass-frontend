import clsx from "clsx";
import { notFound } from "next/navigation";
import LessonClient from "./LessonClient";
import { getCourseById, getLessonById } from "@/app/lib/mockLoader";
import styles from "./LessonPage.module.css";
import type { ComponentProps } from "react";

/** 安全なオブジェクト判定 */
function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

/** title を安全に取り出す（無ければフォールバック） */
function pickTitle(obj: unknown, fallback: string): string {
  if (isRecord(obj)) {
    const t = obj["title"];
    if (typeof t === "string") return t;
  }
  return fallback;
}

export default async function LessonPage(props: {
  params: Promise<{ courseId: string; lessonId: string }>;
}) {
  const { courseId, lessonId } = await props.params;

  const course: unknown = await getCourseById(courseId).catch(() => null);
  const lesson: unknown = await getLessonById(lessonId).catch(() => null);
  if (!lesson) return notFound();

  const courseTitle = pickTitle(course, courseId);

  type LessonClientProps = ComponentProps<typeof LessonClient>;
  const lessonForClient = lesson as LessonClientProps["lesson"];

  return (
    <main className={clsx("container", styles.wrap)}>
      {/* パンくずは Client 側で表示（統一） */}
      <LessonClient
        courseId={courseId}
        courseTitle={courseTitle}
        lesson={lessonForClient}
      />
    </main>
  );
}
