"use client";

import { useMemo, useState } from "react";
import clsx from "clsx";
import CourseFilterPills, { Pill } from "@/app/components/course/CourseFilterPills";
import CourseCard, { CourseCardData } from "@/app/components/course/CourseCard";
import styles from "./CoursesPage.module.css";

const PILLS: Pill[] = [
  { key: "all", label: "ALL" },
  { key: "knowledge", label: "知識・制度" },
  { key: "product", label: "具体的商品・手法" },
  { key: "life", label: "ライフ・その他" },
];

type Props = {
  initialCourses: (CourseCardData & { category: Pill["key"] })[];
};

export default function CoursesClient({ initialCourses }: Props) {
  const [cat, setCat] = useState<Pill["key"]>("all");
  const courses = useMemo(
    () => (cat === "all" ? initialCourses : initialCourses.filter((c) => c.category === cat)),
    [cat, initialCourses]
  );

  return (
    <main className="container">
      <h1 className={clsx("h2", styles.title)}>コース一覧</h1>
      <CourseFilterPills pills={PILLS} value={cat} onChange={setCat} />
      <section className={styles.grid} aria-label="コース一覧">
        {courses.map((c) => (
          <CourseCard key={c.id} {...c} />
        ))}
      </section>
    </main>
  );
}
