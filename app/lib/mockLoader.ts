import { cache } from "react";
import { readFile } from "node:fs/promises";
import path from "node:path";

/* ========= Types ========= */
export type Choice = {
  id: string;
  key: "A" | "B" | "C" | "D" | "E";
  label: string;
  isCorrect: boolean;
};

export type Question = {
  id: string;
  type: "single";
  prompt: string;
  explanation?: string;
  correctKey: string;
  choices: Choice[];
};

export type Test = {
  id: string;
  courseId: string;
  lessonId: string;
  title: string;
  passScore: number;     // 合格に必要な正答数
  isPublished: boolean;
  questions: Question[];
};

export type Course = {
  id: string;
  title: string;
  category: string;
  description: string;
  outcomes: string;
  isPublished: boolean;
  position: number;
  iconUrl?: string;
};

export type Lesson = {
  id: string;
  courseId: string;
  title: string;
  summary: string;
  order: number;
  videoUrl: string;
  durationSec: number;
  isPublished: boolean;
  isFree: boolean;
  testId: string;
  thumbnailUrl: string;
};

export type Bundle = {
  tests: Record<string, Test>;
  courses: Record<string, Course>;
  lessons: Record<string, Lesson>;
};

/* ========= Loader ========= */
export const loadBundle = cache(async (): Promise<Bundle> => {
  const file = path.join(process.cwd(), "app", "mock", "mock_tests_bundle.json");
  const raw = await readFile(file, "utf8");
  return JSON.parse(raw) as Bundle;
});

/* ========= Convenience getters ========= */
export async function getTestById(testId: string): Promise<Test | null> {
  const b = await loadBundle();
  return b.tests[testId] ?? null;
}

export async function getCourseById(courseId: string): Promise<Course | null> {
  const b = await loadBundle();
  return b.courses[courseId] ?? null;
}

export async function getLessonById(lessonId: string): Promise<Lesson | null> {
  const b = await loadBundle();
  return b.lessons[lessonId] ?? null;
}
