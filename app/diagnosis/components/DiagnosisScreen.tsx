// app/diagnosis/components/DiagnosisScreen.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./DiagnosisScreen.module.css";

/* =========================
   Types
========================= */
type TraitKey =
  | "knowledge"
  | "sense"
  | "risk"
  | "stable"
  | "solo"
  | "together";

type Weights = Partial<Record<TraitKey, number>>;

type Option = {
  label: string;
  weights: Weights; // この選択肢で加点されるパラメータ（複数可／1つだけも可）
};

type Question = {
  id: number;
  text: string;
  options: Option[]; // JSONに合わせて配列（想定は4件）
  chapter?: string;  // 章見出しがある場合のみ
};

type Props = {
  /** 外部JSONから読み込んだ設問（20問）を渡す */
  questions?: Question[];
};

/* =========================
   Fallback (ダミー20問)
   ※ 実運用では props.questions を渡してください
========================= */
const FALLBACK_QUESTIONS: Question[] = Array.from({ length: 20 }).map(
  (_, i) => ({
    id: i + 1,
    text: `Q${i + 1}. ダミー質問。実データを渡すと自動で置き換わります。`,
    options: [
      { label: "直感で試す", weights: { sense: 1 } },
      { label: "データ重視で選ぶ", weights: { knowledge: 1 } },
      { label: "周囲の意見を参考にする", weights: { together: 1 } },
      { label: "堅実に安全策を取る", weights: { stable: 1 } },
    ],
  })
);

/* =========================
   Main
========================= */
export default function DiagnosisScreen({ questions }: Props) {
  const router = useRouter();
  const QUESTIONS = questions ?? FALLBACK_QUESTIONS;

  const total = QUESTIONS.length;
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(
    Array(total).fill(null)
  );
  const [animateKey, setAnimateKey] = useState(0);
  const [dir, setDir] = useState<"fwd" | "back">("fwd"); // スライド方向

  const q = QUESTIONS[index];
  const canNext = answers[index] !== null;
  const canBack = index > 0;

  // 進捗（最初でも少し見える最小幅）
  const progressPct = Math.max(3, Math.floor((index / total) * 100));

  const selectOption = (optIdx: number) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[index] = optIdx;
      return next;
    });
  };

  /* ========== スコアリング ========== */

  // 同点は左（知識 / リスク / Solo）を優先
  const leftDominates = (left: number, right: number) =>
    left === right ? true : left > right;

  const computeResult = () => {
    // 合計スコア
    const scores: Record<TraitKey, number> = {
      knowledge: 0,
      sense: 0,
      risk: 0,
      stable: 0,
      solo: 0,
      together: 0,
    };

    QUESTIONS.forEach((qq, i) => {
      const ai = answers[i];
      if (ai == null) return;
      const w = qq.options[ai].weights;
      for (const k in w) {
        const key = k as TraitKey;
        scores[key] += w[key] ?? 0;
      }
    });

    // 3軸の優劣（同点は知識／リスク／Solo を優先）
    const isKnowledge = leftDominates(scores.knowledge, scores.sense);
    const isRisk = leftDominates(scores.risk, scores.stable);
    const isSolo = leftDominates(scores.solo, scores.together);

    // 8パターン判定（仕様どおりの名称にマップ）
    let patternId = 8;
    let patternLabel = "世渡りサーファー";

    if (isKnowledge && isRisk && isSolo) {
      patternId = 1;
      patternLabel = "攻めの情報通";
    } else if (isKnowledge && isRisk && !isSolo) {
      patternId = 2;
      patternLabel = "計画ドリーマー";
    } else if (isKnowledge && !isRisk && isSolo) {
      patternId = 3;
      patternLabel = "ファイナンシャル堅者";
    } else if (isKnowledge && !isRisk && !isSolo) {
      patternId = 4;
      patternLabel = "慎重な相談者";
    } else if (!isKnowledge && isRisk && isSolo) {
      patternId = 5;
      patternLabel = "ひらめきトレーダー";
    } else if (!isKnowledge && isRisk && !isSolo) {
      patternId = 6;
      patternLabel = "飛び込みクリエイター";
    } else if (!isKnowledge && !isRisk && isSolo) {
      patternId = 7;
      patternLabel = "マイペース亀さん";
    } else {
      patternId = 8;
      patternLabel = "世渡りサーファー";
    }

    return { scores, isKnowledge, isRisk, isSolo, patternId, patternLabel };
  };

  /* ========== イベント ========== */

  const handleNext = () => {
    if (!canNext) return;
    if (index < total - 1) {
      setDir("fwd");
      setIndex((i) => i + 1);
      setAnimateKey((k) => k + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      // 完了：採点 → 保存 → 結果ページへ
      const result = computeResult();
      try {
        localStorage.setItem(
          "diagnosisResult",
          JSON.stringify({
            scores: result.scores,
            type: result.patternId,
            label: result.patternLabel,
            at: new Date().toISOString(),
          })
        );
      } catch {
        /* ignore */
      }
      router.push("/diagnosis/promo");
    }
  };

  const handleBack = () => {
    if (!canBack) return;
    setDir("back");
    setIndex((i) => Math.max(0, i - 1));
    setAnimateKey((k) => k + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // キー操作（←/→、Enter、数字1〜4）
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key >= "1" && e.key <= "4") selectOption(Number(e.key) - 1);
      if (e.key === "Enter") handleNext();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handleBack();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, answers, canNext, canBack]);

  /* ========== Render ========== */
  return (
    <div className={styles.screen}>
      {/* ヘッダー（進捗） */}
      <header className={styles.header} aria-label="進捗ヘッダー">
        <div className={styles.progressRow}>
          <div
            className={styles.progressTrack}
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={total}
            aria-valuenow={index}
            aria-label="回答進捗"
          >
            <div
              className={styles.progressFill}
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <div className={styles.counter}>
            Q{index + 1} / {total}
          </div>
        </div>
      </header>

      {/* 質問エリア */}
      <main className={styles.main}>
        <div
          key={animateKey}
          className={`${styles.qPane} ${
            dir === "back" ? styles.slideInBack : styles.slideInFwd
          }`}
        >
          {/* chapter は任意表示（JSONに存在する場合のみ） */}
          {q.chapter && <p className={styles.chapter}>{q.chapter}</p>}

          <h1 className={styles.title}>{q.text}</h1>

          <div className={styles.options} role="group" aria-label="選択肢">
            {q.options.map((opt, i) => {
              const selected = answers[index] === i;
              return (
                <button
                  key={i}
                  type="button"
                  className={`${styles.option} ${
                    selected ? styles.selected : ""
                  }`}
                  onClick={() => selectOption(i)}
                  aria-pressed={selected}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>
      </main>

      {/* ナビゲーション */}
      <footer className={styles.footer}>
        <div className={styles.navRow}>
          <button
            type="button"
            className={styles.backBtn}
            onClick={handleBack}
            disabled={!canBack}
            aria-label="前の質問へ戻る"
            title="前の質問へ戻る"
          >
            戻る
          </button>
          <button
            type="button"
            className={styles.nextBtn}
            onClick={handleNext}
            disabled={!canNext}
            aria-label="次の質問へ進む"
            title="次の質問へ進む"
          >
            次へ
          </button>
        </div>
      </footer>
    </div>
  );
}
