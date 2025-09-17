export const dynamic = "force-dynamic";

import fs from "node:fs/promises";
import path from "node:path";
import MarkdownView from "@/app/components/markdown/MarkdownView";
import BackLink from "@/app/components/nav/BackLink";
import styles from "./TermsPage.module.css";

function formatJa(date: Date) {
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  return `${y}年${m}月${d}日`;
}

export default async function TermsPage() {
  const filePath = path.join(process.cwd(), "public", "docs", "terms.md");
  let md = "# 利用規約\n最終稿のご提供をお願いします。";
  let updated: string | null = null;

  try {
    md = await fs.readFile(filePath, "utf-8");
    const stat = await fs.stat(filePath);
    updated = formatJa(stat.mtime);
  } catch {}

  return (
    <main className="container">
      {/* ✅ パンくずと同じ置き場：.header 内に BackLink */}
      <div className="header">
        <BackLink />
      </div>

      <h1 className={styles.title}>利用規約</h1>

      {/* ▼ この中の要素はすべて同じ横幅（max 920px） */}
      <div className={styles.content}>
        <div className={styles.divider} />
        {updated && <div className={styles.updated}>最終更新日：{updated}</div>}

        <div className={styles.markdownArea}>
          <MarkdownView markdown={md} strongAsH2 />
        </div>
      </div>
    </main>
  );
}
