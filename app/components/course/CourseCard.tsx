import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./CourseCard.module.css";

export type CourseCardData = {
  id: string;
  title: string;
  completed?: boolean;
  /** 0..100 */
  progressPct?: number;
  iconSrc?: string;   // /courses/... or https...
  href?: string;      // default /courses/<id>
};

export default function CourseCard({
  id,
  title,
  completed = false,
  progressPct = 0,
  iconSrc,
  href,
}: CourseCardData) {
  const target = href ?? `/courses/${id}`;
  const src = iconSrc ?? `/icons/courses/${id}.svg`;
  const fallback = "/icons/courses/_default.svg";
  const widthPct = Math.min(100, Math.max(0, progressPct));

  return (
    <Link
      href={target}
      className={`${styles.card} ${completed ? styles.completed : ""}`}
      aria-label={title}
    >
      {/* 中央寄せの内容ブロック（アイコン＋タイトル） */}
      <div className={styles.content}>
        <div className={styles.iconWrap}>
          <div className={styles.iconCircle}>
            <SafeImage src={src} alt={title} fallback={fallback} />
          </div>
          {completed && <span className={styles.badge} aria-label="完了">✓</span>}
        </div>

        {/* タイトル縦中央：外枠で縦中央、内側で2行クランプ */}
        <div className={styles.titleOuter}>
          <div className={styles.titleText} title={title}>
            {title}
          </div>
        </div>
      </div>

      {/* 0%でも常時表示（トラックは薄グレー、バーのみ可変） */}
      <div className={styles.progressTrack}>
        <div className={styles.progressBar} style={{ width: `${widthPct}%` }} />
      </div>
    </Link>
  );
}

/** 404時にfallbackへ切替える軽量ヘルパー */
function SafeImage({ src, alt, fallback }: { src: string; alt: string; fallback: string }) {
  const [cur, setCur] = React.useState(src);
  return (
    <Image
      src={cur}
      alt={alt}
      width={56}
      height={56}
      className={styles.iconImage}
      onError={() => setCur(fallback)}
      priority={false}
    />
  );
}
