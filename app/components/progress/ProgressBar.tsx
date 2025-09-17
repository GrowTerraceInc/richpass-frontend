import clsx from "clsx";
import styles from "./ProgressBar.module.css";
import type { CSSProperties } from "react";

/** CSS 変数を使うために CSSProperties を拡張 */
type ProgressBarStyle = CSSProperties & {
  ["--bar-color"]?: string;
  ["--progress-height"]?: string | number;
  ["--progress-track"]?: string;
};

export default function ProgressBar({
  value,
  className,
  "aria-label": ariaLabel,
  color, // 例: "#22c55e" / "var(--color-success-600)"
}: {
  value: number;                 // 0..100
  className?: string;
  "aria-label"?: string;
  color?: string;
}) {
  const v = Math.max(0, Math.min(100, Math.round(value)));

  const styleVars: ProgressBarStyle | undefined = color
    ? { ["--bar-color"]: color }
    : undefined;

  return (
    <div
      className={clsx(styles.root, className)}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={v}
      aria-label={ariaLabel}
      style={styleVars}
    >
      <div className={styles.track}>
        <div className={styles.fill} style={{ width: `${v}%` }} />
      </div>
    </div>
  );
}
