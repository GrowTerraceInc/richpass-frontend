"use client";

import { useRouter } from "next/navigation";
import clsx from "clsx";
// ← パンくずのCSSをそのまま借りる
import bc from "@/app/components/breadcrumbs/Breadcrumbs.module.css";

type Props = {
  className?: string;           // 追加クラスが必要なら
  label?: string;               // 文言（既定: ＜ 戻る）
};

export default function BackLink({ className, label = "＜ 戻る" }: Props) {
  const router = useRouter();

  return (
    // パンくずと同じ .nav（余白/色/サイズを統一）
    <nav className={clsx(bc.nav, className)} aria-label="breadcrumb">
      {/* 見た目はリンク。buttonのデフォルト装飾だけリセット */}
      <button
        type="button"
        onClick={() => router.back()}
        className={bc.link}
        style={{
          background: "none",
          border: "none",
          padding: 0,
          margin: 0,
          font: "inherit",
          cursor: "pointer",
          whiteSpace: "nowrap",
        }}
        aria-label="前の画面に戻る"
      >
        {label}
      </button>
    </nav>
  );
}
