import Link from "next/link";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <nav>
        <Link href="/terms" className={styles.navLink}>
          利用規約
        </Link>
        <Link href="/privacy" className={styles.navLink}>
          プライバシーポリシー
        </Link>
      </nav>
      <p className={styles.copyright}>© 2025 株式会社グローテラス</p>
    </footer>
  );
}
