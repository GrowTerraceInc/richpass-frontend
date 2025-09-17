import Link from 'next/link';
import styles from './VerticalTimeline.module.css';
import { CheckCircle, PlayCircle, Lock } from '@/app/components/Icons';

export type TimelineItem = {
  id: string;
  title: string;
  status: 'done' | 'current' | 'locked';
  href?: string; // ← 追加：クリック先
};

export default function VerticalTimeline({ items }: { items: TimelineItem[] }) {
  return (
    <div className={styles.wrap}>
      <div className={styles.line} aria-hidden />
      <ul className={styles.ul}>
        {items.map((it) => {
          const Inner = (
            <div
              className={styles.panel}
              aria-current={it.status === 'current' ? 'step' : undefined}
            >
              <div className={styles.title}><strong>{it.title}</strong></div>
            </div>
          );

          return (
            <li key={it.id} className={styles.li}>
              <span className={styles.dot} aria-hidden>
                {it.status === 'done' && <CheckCircle size={28} />}
                {it.status === 'current' && <PlayCircle size={28} />}
                {it.status === 'locked' && <Lock size={28} />}
              </span>

              {it.href && it.status !== 'locked' ? (
                <Link href={it.href} className={styles.panelLink} aria-label={`${it.title}へ`}>
                  {Inner}
                </Link>
              ) : (
                Inner
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
