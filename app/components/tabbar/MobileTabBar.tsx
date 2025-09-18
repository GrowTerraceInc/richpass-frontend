"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import styles from "./MobileTabBar.module.css";

/** タブ定義（hrefは実際のルートに合わせて調整） */
const tabs = [
  { key: "home",      label: "ホーム",       href: "/home",      icon: "/icons/tab-home.svg" },
  { key: "courses",   label: "コース",       href: "/courses",   icon: "/icons/tab-courses.svg" },
  { key: "community", label: "コミュニティ", href: "/community", icon: "/icons/tab-community.svg" },
  { key: "mypage",    label: "マイページ",   href: "/mypage",    icon: "/icons/tab-mypage.svg" },
] as const;

function isActive(pathname: string, href: string) {
  if (href === "/home") return pathname === "/home" || pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

/** どのページでタブを表示するか（ログイン有無で切り替え） */
function shouldShow(pathname: string, isLoggedIn: boolean) {
  if (isLoggedIn) {
    // ログイン後：主要画面で表示（設定/法務/お問い合わせなどでは非表示）
    const allow = ["/", "/home", "/courses", "/community", "/mypage"];
    const deny  = ["/settings", "/account", "/contact", "/notifications", "/terms", "/privacy", "/legal", "/subscribe"];
    const ok    = allow.some((p) => (p === "/" ? pathname === "/" : pathname.startsWith(p)));
    const ng    = deny.some((p) => pathname.startsWith(p));
    return ok && !ng;
  } else {
    // 未ログイン：サインアップ時だけ表示（必要なら /login を追加）
    return pathname.startsWith("/signup");
  }
}

/** Props: ログイン状態を親（layout）から受け取る */
export default function MobileTabBar({ isLoggedIn = false }: { isLoggedIn?: boolean }) {
  const pathname = usePathname();
  const show = !!pathname && shouldShow(pathname, isLoggedIn);

  // タブ表示時だけ body にクラス付与 → そのページだけフッター非表示＆下余白追加
  useEffect(() => {
    if (!show) return;
    document.body.classList.add("has-tabbar");
    return () => {
      document.body.classList.remove("has-tabbar");
    };
  }, [show]);

  const [showModal, setShowModal] = useState(false);

  if (!show) return null;

  return (
    <>
      <nav className={styles.tabbar} aria-label="モバイルナビゲーション">
        <div className={styles.inner}>
          {tabs.map((t) => {
            const active = isActive(pathname!, t.href);
            const isCommunity = t.key === "community";

            // コミュニティは遷移させず“準備中”モーダル
            if (isCommunity) {
              return (
                <button
                  key={t.key}
                  type="button"
                  className={`${styles.item} ${active ? styles.active : ""}`}
                  onClick={() => setShowModal(true)}
                  aria-label="コミュニティ（準備中）"
                >
                  <Image src={t.icon} alt="" width={28} height={28} className={styles.icon} unoptimized />
                  <span className={styles.label}>{t.label}</span>
                </button>
              );
            }

            // 未ログイン時はマイページ/コースなどへ飛ばしたくない場合はここで処理（必要なら）
            // if (!isLoggedIn && (t.key === "mypage" || t.key === "courses")) { ... }

            return (
              <Link
                key={t.key}
                href={t.href}
                className={`${styles.item} ${active ? styles.active : ""}`}
                aria-current={active ? "page" : undefined}
              >
                <Image src={t.icon} alt="" width={28} height={28} className={styles.icon} unoptimized />
                <span className={styles.label}>{t.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* 準備中モーダル */}
      {showModal && (
        <div className={styles.backdrop} onClick={() => setShowModal(false)}>
          <div className={styles.modal} role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalTitle}>準備中です</div>
            <p className={styles.modalBody}>
              コミュニティ機能は現在鋭意制作中です。公開まで今しばらくお待ちください。
            </p>
            <div className={styles.modalActions}>
              <button className={styles.modalBtn} onClick={() => setShowModal(false)}>OK</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
