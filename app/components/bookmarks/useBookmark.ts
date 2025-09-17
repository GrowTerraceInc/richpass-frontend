"use client";

import * as React from "react";

export function useBookmark(lessonId: string) {
  const [isBookmarked, setIsBookmarked] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch("/api/bookmarks", { cache: "no-store" });
        const data: { lessonIds: string[] } = await res.json();
        if (mounted) setIsBookmarked(data.lessonIds.includes(lessonId));
      } catch {
        // noop
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [lessonId]);

  const toggle = React.useCallback(async () => {
    if (loading) return;
    const next = !isBookmarked;
    setIsBookmarked(next); // 楽観更新
    try {
      const res = await fetch("/api/bookmarks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lessonId,
          action: next ? "add" : "remove",
        }),
      });
      if (!res.ok) throw new Error("bookmark failed");
      // サーバー結果は無視（楽観更新したまま）
    } catch {
      // 失敗時はロールバック
      setIsBookmarked(!next);
    }
  }, [isBookmarked, lessonId, loading]);

  return { isBookmarked, toggle, loading };
}
