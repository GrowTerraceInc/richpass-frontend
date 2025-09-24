"use client";

import Link from "next/link";
import Image from "next/image";
import { useLayoutEffect, useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import styles from "./MobileTabBar.module.css";

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

/** 画面幅がモバイル（<768px）かどうか判定 */
function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return isMobile;
}

export default function MobileTabBar({ isLoggedIn = false }: { isLoggedIn?: boolean }) {
  const pathname = usePathname();
  const isMobile = useIsMobile();

  // 実際にタブバーを表示するか
  const show = isLoggedIn && isMobile && !!pathname;

  // モバイルでログイン中のときだけ body に has-tabbar を付与
  useLayoutEffect(() => {
    if (show) {
      document.body.classList.add("has-tabbar");
      return () => { document.body.classList.remove("has-tabbar"); };
    }
    // show=false のときは確実に外す
    document.body.classList.remove("has-tabbar");
    return;
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

      {showModal && (
        <div className={styles.backdrop} onClick={() => setShowModal(false)}>
          <div className={styles.modal} role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalTitle}>準備中です</div>
            <p className={styles.modalBody}>コミュニティ機能は現在鋭意制作中です。</p>
            <div className={styles.modalActions}>
              <button className={styles.modalBtn} onClick={() => setShowModal(false)}>OK</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
