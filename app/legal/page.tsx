export const dynamic = "force-dynamic";

import fs from "node:fs/promises";
import path from "node:path";
import MarkdownView from "@/app/components/markdown/MarkdownView";
import BackLink from "@/app/components/nav/BackLink";
import styles from "./LegalPage.module.css";

function formatJa(date: Date) {
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  return `${y}年${m}月${d}日`;
}

export default async function LegalPage() {
  const filePath = path.join(process.cwd(), "public", "docs", "legal.md");
  let md = "# 特定商取引法に基づく表記\n最終稿のご提供をお願いします。";
  let updated: string | null = null;

  try {
    md = await fs.readFile(filePath, "utf-8");
    const stat = await fs.stat(filePath);
    updated = formatJa(stat.mtime);
  } catch {}

  return (
    <main className="container">
      {/* 戻る（パンくずと同じ置き場） */}
      <div className="header">
        <BackLink />
      </div>

      <h1 className={styles.title}>特定商取引法に基づく表記</h1>

      {/* この中の要素はすべて同じ横幅（max 920px） */}
      <div className={styles.content}>
        <div className={styles.divider} />
        {updated && <div className={styles.updated}>最終更新日：{updated}</div>}

        <div className={styles.markdownArea}>
          {/* 太字行を見出し化（規約/プライバシーと同じ見た目） */}
          <MarkdownView markdown={md} strongAsH2 />
        </div>
      </div>
    </main>
  );
}
