import Link from "next/link";
import clsx from "clsx";
import styles from "./Footer.module.css";
import { useAuth } from "@/lib/useAuth";

export default function Footer() {
  const { user, loading } = useAuth();
  if (loading) return null;

  const isLoggedIn = !!user;

  return (
    <footer
      className={clsx(styles.footer, isLoggedIn && styles.narrow)}
      aria-label="site-footer"
    >
      <div className={styles.inner}>
        {!isLoggedIn && (
          <nav className={styles.links} aria-label="legal">
            <Link href="/terms" className={styles.navLink}>利用規約</Link>
            <Link href="/privacy" className={styles.navLink}>プライバシーポリシー</Link>
          </nav>
        )}
        <p className={styles.copyright}>© 2025 株式会社グローテラス</p>
      </div>
    </footer>
  );
}
