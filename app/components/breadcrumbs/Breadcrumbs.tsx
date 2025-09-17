import Link from 'next/link';
import styles from './Breadcrumbs.module.css';

export type Crumb = { label: string; href?: string };

export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="パンくずリスト" className={styles.nav}>
      <ol className={styles.ol}>
        {items.map((c, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={i} className={styles.li}>
              {c.href && !isLast ? (
                <Link href={c.href} className={styles.link} title={c.label}>
                  {c.label}
                </Link>
              ) : (
                <span
                  aria-current="page"
                  className={styles.current}
                  title={c.label}
                >
                  {c.label}
                </span>
              )}
              {i < items.length - 1 && <span className={styles.sep}>&gt;</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
