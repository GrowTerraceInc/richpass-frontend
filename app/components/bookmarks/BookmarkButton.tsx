"use client";

import * as React from "react";
import { useBookmark } from "./useBookmark";
import styles from "./BookmarkButton.module.css";

export default function BookmarkButton({
  lessonId,
  className,
}: {
  lessonId: string;
  className?: string;
}) {
  const { isBookmarked, toggle, loading } = useBookmark(lessonId);

  // 表示テキスト／スクリーンリーダー用ラベル
  const text = isBookmarked ? "ブックマーク済み" : "ブックマーク";
  const aria = isBookmarked ? "ブックマークを解除" : "ブックマークする";

  return (
    <button
      type="button"
      className={`${styles.btn} ${isBookmarked ? styles.on : ""} ${className ?? ""}`}
      aria-pressed={isBookmarked}
      aria-label={aria}
      title={aria}
      disabled={loading}
      onClick={toggle}
    >
      {/* しおりアイコン（filled） */}
      <svg viewBox="0 0 24 24" className={styles.icon} aria-hidden>
        <path d="M6 3h12a2 2 0 0 1 2 2v16l-8-4-8 4V5a2 2 0 0 1 2-2z" fill="currentColor" />
        <path d="M12 14l-6 3V5a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v12l-6-3z" fill="currentColor" opacity=".12" />
      </svg>
      <span className={styles.text}>{text}</span>
    </button>
  );
}
