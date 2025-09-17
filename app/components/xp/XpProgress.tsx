'use client';

import * as React from "react";
import ProgressBar from "@/app/components/progress/ProgressBar";
import styles from "./XpProgress.module.css";

type Props = {
  initialLevel: number;
  currentXp: number; // 現在のXP（レベル内）
  xpToNext: number;  // 次レベルに必要な総量（レベル内の満タン値）
  gainedXp: number;  // 今回獲得するXP
  color?: string;    // バー色（任意）
};

function requiredXpFor(level: number, base: number) {
  // いまは一定。逓増させたい場合はここを差し替え
  return Math.max(1, base);
}

type State = {
  level: number;
  xp: number;
  req: number;
  percent: number;
  justLeveled: boolean; // レベルアップ直後のフラグ
};

export default function XpProgress({
  initialLevel,
  currentXp,
  xpToNext,
  gainedXp,
  color = "#22c55e",
}: Props) {
  const clamp = (n: number, min = 0) => (n < min ? min : n);
  const initReq = requiredXpFor(initialLevel, xpToNext);
  const initXp = clamp(currentXp);
  const initPct = Math.min(100, Math.round((initXp / initReq) * 100));

  const [state, setState] = React.useState<State>({
    level: Math.max(1, initialLevel),
    xp: initXp,
    req: initReq,
    percent: initPct,
    justLeveled: false,
  });

  // ▼ バッジ表示制御（in/out のアニメーションをさせるために可視状態を保持）
  const [badgeVisible, setBadgeVisible] = React.useState(false);
  const [badgePhase, setBadgePhase] = React.useState<"in" | "out">("in");
  const hideTimerRef = React.useRef<number | null>(null);

  const totalGainRef = React.useRef(clamp(gainedXp));
  const animRef = React.useRef<number | null>(null);
  const cancelledRef = React.useRef(false);

  // justLeveled の変化に応じて、バッジを横フェードイン/アウト
  React.useEffect(() => {
    if (state.justLeveled) {
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
        hideTimerRef.current = null;
      }
      setBadgeVisible(true);
      setBadgePhase("in");
    } else if (badgeVisible) {
      setBadgePhase("out");
      hideTimerRef.current = window.setTimeout(() => {
        setBadgeVisible(false);
        hideTimerRef.current = null;
      }, 450); // out アニメの長さと合わせる
    }
  }, [state.justLeveled, badgeVisible]);

  React.useEffect(() => {
    cancelledRef.current = false;

    async function animateGain() {
      let level = Math.max(1, initialLevel);
      let req = requiredXpFor(level, xpToNext);
      let xp = clamp(currentXp);
      let remaining = clamp(gainedXp);

      const animateTo = (fromXp: number, toXp: number, req: number, ms = 900) =>
        new Promise<void>((resolve) => {
          const start = performance.now();
          const frame = (t: number) => {
            if (cancelledRef.current) return resolve();
            const elapsed = t - start;
            const p = Math.min(1, elapsed / ms);
            const currXp = fromXp + (toXp - fromXp) * p;
            const pct = Math.min(100, Math.round((currXp / req) * 100));
            setState((s) => ({ ...s, xp: currXp, req, percent: pct }));
            if (p < 1) {
              animRef.current = requestAnimationFrame(frame);
            } else {
              resolve();
            }
          };
          animRef.current = requestAnimationFrame(frame);
        });

      while (remaining > 0 && !cancelledRef.current) {
        const capacity = Math.max(0, req - xp);
        const add = Math.min(remaining, capacity);

        // 今のレベル内で埋める
        await animateTo(
          xp,
          xp + add,
          req,
          Math.max(500, Math.min(1200, (add / Math.max(1, req)) * 1500))
        );
        xp += add;
        remaining -= add;

        // 満タンに達し、まだ残りがあれば即レベルアップして次レベルへ
        if (xp >= req && remaining > 0) {
          setState((s) => ({ ...s, xp, req, percent: 100, justLeveled: true }));
          await sleep(350);
          level += 1;
          const nextReq = requiredXpFor(level, xpToNext);
          xp = 0;
          req = nextReq;
          setState({ level, xp, req, percent: 0, justLeveled: true });
          await sleep(150);
          // 続きの remaining を処理するため while 継続
        }
      }

      // ★ ちょうど境界：remaining が 0 でも満タンならレベルアップを確定
      if (!cancelledRef.current && remaining <= 0 && xp >= req) {
        setState((s) => ({ ...s, xp, req, percent: 100, justLeveled: true }));
        await sleep(350);
        level += 1;
        const nextReq = requiredXpFor(level, xpToNext);
        xp = 0;
        req = nextReq;
        setState({ level, xp, req, percent: 0, justLeveled: true });
        await sleep(150);
      }

      // 最終状態：バッジを消す
      setState((s) => ({ ...s, justLeveled: false }));
    }

    animateGain();

    return () => {
      cancelledRef.current = true;
      if (animRef.current) cancelAnimationFrame(animRef.current);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, [initialLevel, currentXp, xpToNext, gainedXp]);

  const remaining = Math.max(0, Math.ceil(state.req - state.xp));

  return (
    <div className={styles.wrap} aria-live="polite">
      {/* XPブロック全体をモバイルで短めに表示 */}
      <div className={styles.inner}>
        <div className={styles.header}>
          <span className={styles.level}>
            Lv. {state.level}
            {badgeVisible && (
              <span
                className={`${styles.levelUpInline} ${badgePhase === "in" ? styles.in : styles.out}`}
                role="status"
              >
                レベルアップ！
              </span>
            )}
          </span>
          <span className={styles.remain}>次まで {remaining} XP</span>
        </div>

        <ProgressBar value={state.percent} className={styles.bar} color={color} />

        <div className={styles.hintRow}>
          <span className={styles.gain}>獲得XP +{totalGainRef.current}</span>
          <span className={styles.ratio}>
            {Math.floor(state.xp)}/{state.req}
          </span>
        </div>
      </div>
    </div>
  );
}

function sleep(ms: number) {
  return new Promise<void>((r) => setTimeout(r, ms));
}
