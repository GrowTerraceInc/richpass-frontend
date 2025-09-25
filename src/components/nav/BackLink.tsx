"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import styles from "./BackLink.module.css";

type Props = {
  className?: string;
  label?: string;   // 既定: ＜ 戻る
  href?: string;    // 指定時はそのURLへ。未指定なら history.back()
};

export default function BackLink({ className, label = "＜ 戻る", href }: Props) {
  const router = useRouter();

  return (
    <nav className={clsx(styles.nav, className)} aria-label="breadcrumb">
      {href ? (
        <Link href={href} className={styles.link}>{label}</Link>
      ) : (
        <button
          type="button"
          onClick={() => router.back()}
          className={styles.link}
          aria-label="前の画面に戻る"
        >
          {label}
        </button>
      )}
    </nav>
  );
}
