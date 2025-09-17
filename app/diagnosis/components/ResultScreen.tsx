// app/diagnosis/components/ResultScreen.tsx
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation"; // ← useRouter は削除
import styles from "./ResultScreen.module.css";

type Scores = {
  knowledge: number;
  sense: number;
  risk: number;
  stable: number;
  solo: number;
  together: number;
};

const PATTERNS: Record<number, { title: string; desc: string }> = {
  1: { title: "攻めの情報通", desc: "データ×攻め×一匹狼。機会を見極めて積極的に動けるタイプ。" },
  2: { title: "計画ドリーマー", desc: "データ×攻め×チーム。夢に向けて皆と計画的に前進。" },
  3: { title: "ファイナンシャル堅者", desc: "データ×守り×一匹狼。堅実に積み上げる安定志向。" },
  4: { title: "慎重な相談者", desc: "データ×守り×チーム。周囲と相談しつつ着実に。" },
  5: { title: "ひらめきトレーダー", desc: "直感×攻め×一匹狼。チャンスに素早く反応。" },
  6: { title: "飛び込みクリエイター", desc: "直感×攻め×チーム。勢いと協働で切り開く。" },
  7: { title: "マイペース亀さん", desc: "直感×守り×一匹狼。無理せず自分の歩幅で継続。" },
  8: { title: "世渡りサーファー", desc: "直感×守り×チーム。波に合わせて賢く選択。" },
};

export default function ResultScreen() {
  const sp = useSearchParams();
  const [scores, setScores] = useState<Scores | null>(null);

  // クエリ ?type= を取得
  const type = useMemo(() => {
    const t = Number(sp.get("type") || 0);
    return Number.isFinite(t) && t >= 1 && t <= 8 ? t : 0;
  }, [sp]);

  // localStorage からスコアを復元
  useEffect(() => {
    try {
      const raw = localStorage.getItem("diagnosisResult");
      if (raw) {
        const parsed = JSON.parse(raw) as { scores?: Scores };
        if (parsed?.scores) setScores(parsed.scores);
      }
    } catch {
      /* ignore */
    }
  }, []);

  if (!type) {
    return (
      <div className="container section">
        <h1 className={styles.h1}>結果が見つかりませんでした</h1>
        <p className={styles.p}>もう一度診断を実行してください。</p>
        <Link href="/diagnosis/quiz" className={styles.primaryLink}>
          診断を始める
        </Link>
      </div>
    );
  }

  const meta = PATTERNS[type];

  return (
    <section className="section bg-white">
      <div className={`container ${styles.wrap}`}>
        <h1 className={styles.h1}>あなたの結果</h1>
        <div className={styles.card}>
          <div className={styles.badge}>タイプ {type}</div>
          <h2 className={styles.title}>{meta.title}</h2>
          <p className={styles.desc}>{meta.desc}</p>

          {scores && (
            <div className={styles.grid}>
              <Stat label="知識" v={scores.knowledge} />
              <Stat label="感覚" v={scores.sense} />
              <Stat label="リスク" v={scores.risk} />
              <Stat label="安定" v={scores.stable} />
              <Stat label="Solo" v={scores.solo} />
              <Stat label="Together" v={scores.together} />
            </div>
          )}

          <div className={styles.actions}>
            <Link href="/diagnosis/quiz" className={styles.primaryLink}>
              もう一度診断する
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ label, v }: { label: string; v: number }) {
  return (
    <div className={styles.stat}>
      <div className={styles.statLabel}>{label}</div>
      <div className={styles.statValue}>{v}</div>
    </div>
  );
}
