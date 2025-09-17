"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import ProgressBar from "@/app/components/progress/ProgressBar";
import TestQuestion from "@/app/components/test/TestQuestion";
import styles from "./TestPage.module.css";

type ABKey = "A" | "B" | "C" | "D" | "E";
type Choice = { id: string; key: ABKey; label: string; isCorrect: boolean };
type Question = {
  id: string;
  type: "single";
  prompt: string;
  explanation?: string;
  correctKey: string;
  choices: Choice[];
};

const toChoiceKey = (k: string): ABKey => {
  const up = String(k).trim().toUpperCase();
  if (up === "A" || up === "B" || up === "C" || up === "D" || up === "E") return up;
  return "A";
};
const orderOf: Record<ABKey, number> = { A: 0, B: 1, C: 2, D: 3, E: 4 };

export default function TestRunner(props: {
  courseId: string;
  testId: string;
  passScore: number;
  questions: Question[];
  lessonId?: string;
  title?: string;
  nextLessonId?: string;
  isLast?: boolean;
}) {
  const { courseId, testId, passScore, questions, lessonId, title, nextLessonId, isLast } = props;
  const router = useRouter();

  const [index, setIndex] = useState(0);
  const [results, setResults] = useState<Record<string, boolean>>({});

  const total = questions.length;
  const current = questions[index];

  const answeredCount = useMemo(() => Object.keys(results).length, [results]);
  const progress = total ? Math.round((answeredCount / total) * 100) : 0;

  /** 1問ずつ進行の二重発火ロック */
  const advanceLockRef = useRef(false);
  useEffect(() => {
    advanceLockRef.current = false; // 次の問題が描画されたらロック解除
  }, [index]);

  /** 結果ページへの遷移は useEffect で実施（render中のrouter更新を回避） */
  const navigatedRef = useRef(false);
  useEffect(() => {
    if (!total) return;
    if (answeredCount !== total) return;
    if (navigatedRef.current) return;
    navigatedRef.current = true;

    const correctCount = Object.values(results).reduce((acc, ok) => acc + (ok ? 1 : 0), 0);
    const need = Math.min(passScore, total);
    const pass = correctCount >= need;

    const params = new URLSearchParams({
      score: String(correctCount),
      total: String(total),
      need: String(need),
      pass: pass ? "1" : "0",
      testId,
    });

    if (title) params.set("title", title);
    if (lessonId) params.set("lessonId", lessonId);
    if (nextLessonId) params.set("nextLessonId", nextLessonId);
    if (typeof isLast === "boolean") params.set("isLast", isLast ? "1" : "0");

    // デバッグログ（必要なければ削除OK）
    console.log("[Runner->ResultRedirect]", {
      to: `/courses/${courseId}/stage/${pass ? "clear" : "fail"}`,
      query: Object.fromEntries(params.entries()),
    });

    router.replace(`/courses/${courseId}/stage/${pass ? "clear" : "fail"}?${params.toString()}`);
  }, [answeredCount, total, passScore, results, testId, title, lessonId, nextLessonId, isLast, courseId, router]);

  /** 回答→次へ */
  function handleNext(isCorrect: boolean) {
    if (!current) return;
    if (advanceLockRef.current) return;
    advanceLockRef.current = true;

    // 回答結果を追加
    setResults((prev) => ({ ...prev, [current.id]: isCorrect }));

    // 最終問以外なら次の設問へ
    if (index < total - 1) {
      setIndex(index + 1);
    }
    // 最終問のときは useEffect がリダイレクトを担当
  }

  const tq = current
    ? {
        id: current.id,
        text: current.prompt,
        choices: current.choices
          .map((c) => ({ key: toChoiceKey(c.key), label: c.label }))
          .sort((a, b) => orderOf[a.key] - orderOf[b.key]),
        correct: toChoiceKey(current.correctKey),
        explanation: current.explanation,
      }
    : null;

  return (
    <section className={styles.runner}>
      <div className={styles.inner}>
        {/* 上部メタ（Q進捗 + バー） */}
        <div className={styles.meta}>
          <div className={styles.qcount}>
            <span className={styles.q}>
              Q <strong>{index + 1}</strong>/<span className={styles.total}>{total}</span>
            </span>
          </div>
          <ProgressBar className={styles.progress} value={progress} aria-label="解答進捗" />
        </div>

        {/* 問題本体 */}
        {tq && (
          <div className={styles.questionWrap} aria-label={`問題 ${index + 1}/${total}`}>
            <TestQuestion
              key={current.id}
              question={tq}
              index={index + 1}
              total={total}
              onNext={handleNext}
              showMeta={false}
            />
          </div>
        )}
      </div>
    </section>
  );
}
