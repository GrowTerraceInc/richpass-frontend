// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
/* ▼ モバイルタブ */
import MobileTabBar from "@/app/components/tabbar/MobileTabBar";
/* ▼ 追加：ログイン検知ヘルパー */
import { getSession } from "@/app/lib/auth";

export const metadata: Metadata = {
  title: "Richpass",
  description: "Richpass App",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // サーバーでログイン検知（既存の見た目は維持）
  const session = await getSession();
  const isLoggedIn = !!session;

  return (
    <html lang="ja">
      <body>
        <div className="pageWrapper">
          {/* ログイン状態はここで制御可能 */}
          <Header isLoggedIn={isLoggedIn} />
          <main className="mainContent">{children}</main>
          {/* ▼ タブ表示中はCSSで非表示にするためのスロット */}
          <div className="siteFooterSlot">
            <Footer />
          </div>
        </div>

        {/* ▼ モバイル専用の下部タブ（PCでは非表示） */}
        <MobileTabBar isLoggedIn={isLoggedIn} />
      </body>
    </html>
  );
}
