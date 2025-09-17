"use client";

import Image from "next/image";
import Link from "next/link";
import styles from "./Header.module.css";
import Button from "@/app/components/ui/Button";

interface HeaderProps {
  isLoggedIn: boolean;
  userName?: string;
  userLevel?: number;
  userAvatarUrl?: string;
}

export default function Header({
  isLoggedIn,
  userName,
  userLevel,
  userAvatarUrl,
}: HeaderProps) {
  return (
    <>
      <header className={styles.header}>
        {/* 左：ロゴ + ナビ（PC表示のみ） */}
        <div className={styles.left}>
          <Link href="/" className={styles.logoWrapper} aria-label="ホームへ戻る">
            <Image
              src="/logo.png"
              alt="Service Logo"
              width={240}
              height={56}
              priority
              className={styles.logoImage}
            />
          </Link>

          {isLoggedIn && (
            <nav className={`${styles.nav} ${styles.desktopOnly}`}>
              <Link href="/courses" className={styles.navLink}>
                コース
              </Link>
              <Link href="/community" className={styles.navLink}>
                コミュニティ
              </Link>
              <Link href="/mypage" className={styles.navLink}>
                マイページ
              </Link>
            </nav>
          )}
        </div>

        {/* 右：ログイン時は通知＋アバター／未ログイン時はボタン群 */}
        {isLoggedIn ? (
          <div className={styles.right}>
            <button
              type="button"
              className={styles.bellBtn}
              aria-label="お知らせ"
              onClick={() => alert("通知は後で実装予定です")}
            >
              <svg
                className={styles.bellIcon}
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M12 22c1.1 0 1.99-.9 1.99-2H10a2 2 0 0 0 2 2zm6-6V11c0-3.07-1.63-5.64-4.5-6.32V4a1.5 1.5 0 0 0-3 0v.68C7.63 5.36 6 7.92 6 11v5l-1.99 2A1 1 0 0 0 5 20h14a1 1 0 0 0 .79-1.62L18 16zM16 17H8v-6c0-2.48 1.51-4 4-4s4 1.52 4 4v6z" />
              </svg>
            </button>

            <div className={styles.avatarWrapper} role="button" tabIndex={0}>
              <Image
                src={userAvatarUrl || "/default-avatar.png"}
                alt={`${userName || "ユーザー"}のアバター`}
                width={30}
                height={30}
                className={styles.avatar}
              />
              <div className={styles.dropdown}>
                <p className={styles.userName}>{userName}</p>
                <p className={styles.userLevel}>Lv. {userLevel}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.authButtons}>
            <Link href="/login" aria-label="ログインページへ">
              <Button variant="secondary" size="small">ログイン</Button>
            </Link>
            <Link href="/signup" aria-label="会員登録ページへ">
              <Button variant="primary" size="small">無料会員登録</Button>
            </Link>
          </div>
        )}
      </header>

      {/* モバイル専用タブメニュー */}
      {isLoggedIn && (
        <nav className={`${styles.bottomNav} ${styles.mobileOnly}`}>
          <Link href="/courses" className={styles.bottomNavItem}>
            コース
          </Link>
          <Link href="/community" className={styles.bottomNavItem}>
            コミュニティ
          </Link>
          <Link href="/mypage" className={styles.bottomNavItem}>
            マイページ
          </Link>
        </nav>
      )}
    </>
  );
}
