"use client";
import styles from "./CourseFilterPills.module.css";

export type Pill = { key: string; label: string };

export default function CourseFilterPills({
  pills,
  value,
  onChange,
}: {
  pills: Pill[];
  value: Pill["key"];
  onChange: (k: Pill["key"]) => void;
}) {
  return (
    <div className={styles.root}>
      <div className={styles.scroller} role="tablist" aria-label="カテゴリ">
        {pills.map((p) => {
          const active = p.key === value;
          return (
            <button
              key={p.key}
              role="tab"
              aria-selected={active}
              className={`${styles.pill} ${active ? styles.active : ""}`}
              onClick={() => onChange(p.key)}
            >
              {p.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
