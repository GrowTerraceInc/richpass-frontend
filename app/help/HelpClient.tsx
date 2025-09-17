"use client";

import { useMemo, useState } from "react";
import styles from "./HelpPage.module.css";
import MarkdownView from "@/app/components/markdown/MarkdownView";

export type FaqItem = { category: string; question: string; answerMd: string; order?: number };

export default function HelpClient({ items }: { items: FaqItem[] }) {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const key = q.trim().toLowerCase();
    if (!key) return items;
    return items.filter((i) =>
      [i.category, i.question, i.answerMd].some((s) => s.toLowerCase().includes(key))
    );
  }, [q, items]);

  const grouped = useMemo(() => {
    const m = new Map<string, FaqItem[]>();
    filtered.forEach((i) => {
      if (!m.has(i.category)) m.set(i.category, []);
      m.get(i.category)!.push(i);
    });
    m.forEach((arr) => arr.sort((a, b) => (a.order ?? 999) - (b.order ?? 999)));
    return Array.from(m.entries());
  }, [filtered]);

  return (
    <div className={styles.page}>
      {/* 検索 */}
      <div className={styles.searchWrap}>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="キーワードで検索（例：支払い／解約）"
          className={styles.search}
          aria-label="FAQ検索"
        />
      </div>

      {/* カテゴリアコーディオン（大見出し） */}
      <div className={styles.groupCard}>
        {grouped.length === 0 ? (
          <div className={styles.empty}>
            該当するFAQが見つかりませんでした。<br />
            <a href="/contact" style={{ color: "var(--color-primary-600)", textDecoration: "none" }}>
              お問い合わせはこちら
            </a>
          </div>
        ) : (
          grouped.map(([cat, arr]) => (
            <details key={cat} className={styles.cat} open>
              <summary>
                <span className={styles.caret}>▸</span>
                <span>{cat}</span>
              </summary>

              {/* 質問リスト（小見出し） */}
              <div className={styles.qList}>
                {arr.map((i, idx) => (
                  <details key={idx} className={styles.q}>
                    <summary>
                      <span className={styles.caret}>▸</span>
                      <span>{i.question}</span>
                    </summary>
                    <div className={styles.answer}>
                      {/* 回答はMarkdownレンダリング（太字・リンクなどが効く） */}
                      <MarkdownView markdown={i.answerMd} />
                    </div>
                  </details>
                ))}
              </div>
            </details>
          ))
        )}
      </div>

      <div className={styles.tail} />
    </div>
  );
}
