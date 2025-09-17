// scripts/generate-mock.ts
/* CSV → app/mock/mock_tests_bundle.json を再生成
   修正点: choices を (testId::questionId) の複合キーで突合せ
   すべて no-explicit-any で通るよう、型を明確化
*/
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { parse } from "csv-parse/sync";

/* ====== Types (rows) ====== */
type ABKey = "A" | "B" | "C" | "D" | "E";

type CourseRow = {
  id: string; title: string; category: string; description: string;
  outcomes: string; isPublished: string; position: string; iconUrl?: string;
};
type LessonRow = {
  id: string; courseId: string; title: string; summary: string;
  order: string; videoUrl: string; durationSec: string;
  isPublished: string; isFree: string; testId: string; thumbnailUrl: string;
};
type TestRow = {
  id: string; courseId: string; lessonId: string; title: string; passScore: string; isPublished: string;
};
type QuestionRow = {
  id: string; testId: string; order: string; text: string; explanation?: string; correctKey: string;
};
type ChoiceRow = { testId: string; questionId: string; key: string; label: string };

/* ====== Types (bundle) ====== */
type Choice = { id: string; key: ABKey; label: string; isCorrect: boolean };
type Question = {
  id: string; type: "single"; prompt: string; explanation: string; correctKey: ABKey; choices: Choice[];
};
type Test = {
  id: string; courseId: string; lessonId: string; title: string;
  passScore: number; isPublished: boolean; questions: Question[];
};
type Course = {
  id: string; title: string; category: string; description: string;
  outcomes: string; isPublished: boolean; position: number; iconUrl: string;
};
type Lesson = {
  id: string; courseId: string; title: string; summary: string; order: number;
  videoUrl: string; durationSec: number; isPublished: boolean; isFree: boolean; testId: string; thumbnailUrl: string;
};
type Bundle = { tests: Record<string, Test>; courses: Record<string, Course>; lessons: Record<string, Lesson> };

/* ====== Paths ====== */
const ROOT    = process.cwd();
const CSV_DIR = join(ROOT, "app/mock/csv");
const OUT     = join(ROOT, "app/mock/mock_tests_bundle.json");

/* ====== Utils ====== */
const readCSV = <T>(name: string): T[] =>
  parse(readFileSync(join(CSV_DIR, name), "utf8"), {
    columns: true, trim: true, skip_empty_lines: true,
  }) as T[];

const toBool = (v: unknown): boolean =>
  String(v ?? "").toLowerCase() === "true" || String(v ?? "").trim() === "1";

const toNum = (v: unknown, d = 0): number => {
  const n = Number(v);
  return Number.isFinite(n) ? n : d;
};

const toKey = (k: unknown): ABKey => {
  const u = String(k ?? "").trim().toUpperCase();
  return (["A", "B", "C", "D", "E"] as const).includes(u as ABKey) ? (u as ABKey) : "A";
};

/* ====== Main ====== */
function main(): void {
  const coursesCSV   = readCSV<CourseRow>("Courses.csv");
  const lessonsCSV   = readCSV<LessonRow>("Lessons.csv");
  const testsCSV     = readCSV<TestRow>("Tests.csv");
  const questionsCSV = readCSV<QuestionRow>("Questions.csv");
  const choicesCSV   = readCSV<ChoiceRow>("Choices.csv");

  // 1) Courses
  const courses: Record<string, Course> = {};
  for (const r of coursesCSV) {
    courses[r.id] = {
      id: r.id,
      title: r.title ?? "",
      category: r.category ?? "life",
      description: r.description ?? "",
      outcomes: r.outcomes ?? "",
      isPublished: toBool(r.isPublished),
      position: toNum(r.position, 0),
      iconUrl: r.iconUrl ?? "",
    };
  }

  // 2) Lessons
  const lessons: Record<string, Lesson> = {};
  for (const r of lessonsCSV) {
    lessons[r.id] = {
      id: r.id,
      courseId: r.courseId ?? "",
      title: r.title ?? "",
      summary: r.summary ?? "",
      order: toNum(r.order, 0),
      videoUrl: r.videoUrl ?? "",
      durationSec: toNum(r.durationSec, 0),
      isPublished: toBool(r.isPublished),
      isFree: toBool(r.isFree),
      testId: r.testId ?? "",
      thumbnailUrl: r.thumbnailUrl ?? "",
    };
  }

  // 3) Choices index by (testId::questionId)
  const orderMap: Record<ABKey, number> = { A: 0, B: 1, C: 2, D: 3, E: 4 };
  const choicesByTQ: Record<string, Array<{ key: ABKey; label: string }>> = {};
  for (const c of choicesCSV) {
    const tid = String(c.testId).trim();
    const qid = String(c.questionId).trim();
    const k: ABKey = toKey(c.key);
    const lbl = c.label ?? "";
    const TQ = `${tid}::${qid}`;
    (choicesByTQ[TQ] ||= []).push({ key: k, label: lbl });
  }
  Object.keys(choicesByTQ).forEach((k) =>
    choicesByTQ[k].sort((a, b) => orderMap[a.key] - orderMap[b.key])
  );

  // 4) Tests -> Questions -> Choices (複合キーで安全に突合せ)
  const tests: Record<string, Test> = {};
  for (const t of testsCSV) {
    const tid = t.id;
    const qRows = questionsCSV
      .filter((q) => String(q.testId).trim() === tid)
      .sort((a, b) => toNum(a.order, 0) - toNum(b.order, 0));

    const qs: Question[] = qRows.map((q) => {
      const TQ = `${tid}::${q.id}`;
      const ch: Choice[] = (choicesByTQ[TQ] ?? []).map((c) => ({
        id: `${q.id}-${c.key}`,
        key: c.key,
        label: c.label,
        isCorrect: c.key === toKey(q.correctKey),
      }));
      return {
        id: q.id,
        type: "single",
        prompt: q.text ?? "",
        explanation: q.explanation ?? "",
        correctKey: toKey(q.correctKey),
        choices: ch,
      };
    });

    tests[tid] = {
      id: tid,
      courseId: t.courseId ?? "",
      lessonId: t.lessonId ?? "",
      title: t.title ?? "",
      passScore: toNum(t.passScore, 0),
      isPublished: toBool(t.isPublished),
      questions: qs,
    };
  }

  const bundle: Bundle = { tests, courses, lessons };
  mkdirSync(join(ROOT, "app/mock"), { recursive: true });
  writeFileSync(OUT, JSON.stringify(bundle, null, 2), "utf8");
  console.log(`✅ Wrote ${OUT}`);
}

main();
