// src/components/layout/Header.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./Header.module.css";
import Button from "@/components/ui/Button";
import { useAuth } from "@/lib/useAuth";

type UserExtras = { avatar_url?: string; level?: number };
const FALLBACK_AVATAR = "/images/avatar-placeholder.png";

export default function Header() {
  const router = useRouter();
  const { user, loading, doLogout, } = useAuth();
  const isLoggedIn = !!user;

  const extras = (user ?? {}) as UserExtras;
  const displayName = user?.name ?? "ユーザー";
  const level = extras.level ?? 1;

  const initialAvatar = extras.avatar_url ?? FALLBACK_AVATAR;
  const [avatarSrc, setAvatarSrc] = useState<string>(initialAvatar);
  useEffect(() => setAvatarSrc(initialAvatar), [initialAvatar]);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!isDropdownOpen) return;
    const onClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [isDropdownOpen]);

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    await doLogout();
    setIsDropdownOpen(false);
    router.replace("/login");
  };

  // ① loading中は“未ログインUI”を出さず、枠だけ（スケルトン）を表示
  if (loading) {
    return (
      <header className={styles.header} aria-label="site-header">
        <div className={styles.left}>
          <div className={styles.logoSkeleton} />
        </div>
        <div className={styles.rightPlaceholder} />
      </header>
    );
  }

  return (
    <header className={styles.header} aria-label="site-header">
      <div className={styles.left}>
        <Link href="/home" className={styles.logoWrapper} aria-label="ホーム">
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
          <nav className={`${styles.nav} ${styles.desktopOnly}`} aria-label="primary">
            <Link href="/courses" className={styles.navLink}>コース</Link>
            <Link href="/community" className={styles.navLink}>コミュニティ</Link>
            <Link href="/mypage" className={styles.navLink}>マイページ</Link>
          </nav>
        )}
      </div>

      {isLoggedIn ? (
        <div className={styles.right}>
          <button
            type="button"
            className={styles.bellBtn}
            aria-label="お知らせ"
            onClick={() => alert("通知は後で実装予定です")}
          >
            <svg className={styles.bellIcon} viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 22c1.1 0 1.99-.9 1.99-2H10a2 2 0 0 0 2 2zm6-6V11c0-3.07-1.63-5.64-4.5-6.32V4a1.5 1.5 0 0 0-3 0v.68C7.63 5.36 6 7.92 6 11v5l-1.99 2A1 1 0 0 0 5 20h14a1 1 0 0 0 .79-1.62L18 16zM16 17H8v-6c0-2.48 1.51-4 4-4s4 1.52 4 4v6z" />
            </svg>
          </button>

          <div
            ref={dropdownRef}
            className={styles.avatarWrapper}
            role="button"
            tabIndex={0}
            aria-haspopup="menu"
            aria-expanded={isDropdownOpen}
            onClick={() => setIsDropdownOpen(v => !v)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") setIsDropdownOpen(v => !v);
              if (e.key === "Escape") setIsDropdownOpen(false);
            }}
          >
            <Image
              src={avatarSrc}
              alt={`${displayName}のアバター`}
              width={30}
              height={30}
              className={styles.avatar}
              style={{ objectFit: "cover" }}
              onError={() => setAvatarSrc(FALLBACK_AVATAR)}
            />
            <div className={`${styles.dropdown} ${isDropdownOpen ? styles.dropdownOpen : ""}`} role="menu">
              <p className={styles.userName}>{displayName}</p>
              <p className={styles.userLevel}>Lv. {level}</p>
              <hr className={styles.separator} />
              <button className={styles.dropdownItem} onClick={handleLogout}>ログアウト</button>
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
  );
}
