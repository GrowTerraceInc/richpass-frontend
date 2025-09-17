import { loadBundle } from "@/app/lib/mockLoader";
import CoursesClient from "./CoursesClient";

/** クエリ or 環境変数でデモ進捗をONにできるようにする */
function isDemoEnabled(sp: { [k: string]: string | string[] | undefined }) {
  const raw = sp?.demo;
  const q = Array.isArray(raw) ? raw[0] : raw ?? "";
  return q === "progress" || process.env.NEXT_PUBLIC_DEMO_PROGRESS === "1";
}

/** コースID/インデックスから“それっぽい”進捗を安定生成（100/80/60/40/25/10/0をローテ） */
function demoProgressPct(id: string, idx: number) {
  const palette = [100, 80, 60, 40, 25, 10, 0];
  let seed = idx;
  for (let i = 0; i < id.length; i++) seed += id.charCodeAt(i);
  return palette[seed % palette.length];
}

export default async function CoursesPage(props: {
  searchParams: Promise<{ [k: string]: string | string[] | undefined }>;
}) {
  // Next.js v15: searchParams は await してから参照する
  const sp = await props.searchParams;

  const bundle = await loadBundle();
  const courses = Object.values(bundle.courses);
  const demo = isDemoEnabled(sp);

  const initialCourses = courses.map((c, i) => {
    // アイコン（CSV/DBのiconUrl優先）
    const iconSrc =
      c.iconUrl && c.iconUrl.trim() !== "" ? c.iconUrl : `/icons/courses/${c.id}.svg`;

    // 進捗（通常0%、デモ時は見栄え用の擬似値）
    const progressPct = demo ? demoProgressPct(c.id, i) : 0;
    const completed = progressPct >= 100;

    return {
      id: c.id,
      title: c.title,
      category: (c.category as "knowledge" | "product" | "life") ?? "life",
      iconSrc,
      href: `/courses/${c.id}`,
      progressPct,
      completed,
    };
  });

  return <CoursesClient initialCourses={initialCourses} />;
}
