'use client';
import { useId, useMemo, useState, useEffect, useRef } from 'react';
import clsx from 'clsx';
import styles from './TestQuestion.module.css';

export type Choice = { key: 'A'|'B'|'C'|'D'|'E'; label: string };
export type Question = {
  id: string;
  text: string;
  choices: Choice[];
  correct: Choice['key'];
  explanation?: string;
};

type Props = {
  question: Question;
  index: number;   // 1-based
  total: number;
  onNext?: (isCorrect: boolean) => void;
  /** ランナー側で進捗UIを持つ場合は false にして重複を防ぐ */
  showMeta?: boolean;
};

export default function TestQuestion({ question, index, total, onNext, showMeta = true }: Props) {
  const name = useId();
  const [selected, setSelected] = useState<Choice['key'] | null>(null);
  const [submitted, setSubmitted] = useState(false);

  // 中央オーバーレイの出現制御
  const [showOverlay, setShowOverlay] = useState(false);
  const overlayTimer = useRef<number | null>(null);

  // 「次の問題へ」二重発火を同期ロックで防止
  const nextLockRef = useRef(false);
  const [nextDisabled, setNextDisabled] = useState(false); // 見た目用（即 disabled）

  useEffect(() => {
    return () => {
      if (overlayTimer.current) window.clearTimeout(overlayTimer.current);
    };
  }, []);

  const isCorrect = useMemo(
    () => submitted && selected === question.correct,
    [submitted, selected, question.correct]
  );

  const canSubmit = !!selected && !submitted;
  const isLast = index === total;                 // ★ 最終問かどうか
  const nextLabel = isLast ? '結果を見る' : '次の問題へ';

  function handleSelect(k: Choice['key']) {
    if (submitted) return; // 回答後は変更不可
    setSelected(k);
  }

  function handleSubmit() {
    if (!canSubmit) return;
    setSubmitted(true);

    // 中央オーバーレイを表示 → 約1.1秒でフェードアウト
    setShowOverlay(true);
    overlayTimer.current = window.setTimeout(() => {
      setShowOverlay(false);
    }, 1100);
  }

  function handleNext() {
    if (nextLockRef.current) return;   // 二重呼び出し防止
    nextLockRef.current = true;
    setNextDisabled(true);
    onNext?.(isCorrect === true);
  }

  return (
    <div className={styles.wrap}>
      {showMeta && (
        <div className={styles.meta}>
          <span className={styles.qLabel}>Q {index}/{total}</span>
          <div
            className={styles.progressTrack}
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={total}
            aria-valuenow={index}
          />
        </div>
      )}

      <h3 className={styles.title}>{question.text}</h3>

      <fieldset className={styles.fieldset}>
        <legend className="sr-only">選択肢</legend>
        {question.choices.map((c) => {
          const selectedThis = selected === c.key;
          const correctThis  = submitted && c.key === question.correct;
          const wrongThis    = submitted && selectedThis && c.key !== question.correct;

          return (
            <label
              key={c.key}
              className={clsx(
                styles.choice,
                selectedThis && !submitted && styles.selected,
                correctThis && styles.correct,
                wrongThis && styles.wrong
              )}
              aria-disabled={submitted}
            >
              <input
                type="radio"
                className="sr-only"
                name={name}
                value={c.key}
                disabled={submitted}
                onChange={() => handleSelect(c.key)}
                aria-checked={selectedThis}
              />
              <span className={styles.choiceKey} aria-hidden>({c.key})</span>
              <span className={styles.choiceText}>{c.label}</span>
              {wrongThis && <span className={styles.mark} aria-label="不正解">✕</span>}
              {correctThis && <span className={styles.mark} aria-label="正解">✓</span>}
            </label>
          );
        })}
      </fieldset>

      {/* 解説（提出後のみ） */}
      {submitted && (
        <div className={styles.explanation} aria-live="polite">
          <strong>解説</strong>
          <p>{question.explanation ?? 'この問題の解説は準備中です。'}</p>
        </div>
      )}

      <div className={styles.footer}>
        {!submitted ? (
          <button
            type="button"
            className={styles.primaryBtn}
            onClick={handleSubmit}
            disabled={!canSubmit}
            aria-disabled={!canSubmit}
          >
            回答する
          </button>
        ) : (
          <button
            type="button"
            className={styles.primaryBtn}
            onClick={handleNext}
            disabled={nextDisabled}
            aria-disabled={nextDisabled}
            aria-label={nextLabel}
          >
            {nextLabel}
          </button>
        )}
      </div>

      {/* 中央オーバーレイ（回答後にポン→フェードアウト） */}
      {showOverlay && (
        <div className={styles.overlay} aria-hidden>
          <div className={clsx(styles.overlayCard, isCorrect ? styles.overlayOk : styles.overlayNg)}>
            {isCorrect ? '正解！' : '不正解'}
          </div>
        </div>
      )}
    </div>
  );
}
