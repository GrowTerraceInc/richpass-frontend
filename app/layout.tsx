// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
/* ▼ モバイルタブ */
import MobileTabBar from "@/app/components/tabbar/MobileTabBar";
/* ▼ 追加：ログイン検知ヘルパー（SSR） */
import { getSession } from "@/app/lib/auth";
/* ▼ 追加：クライアント側の認証管理（Provider） */
import { AuthProvider } from "@/app/components/auth/AuthProvider";

export const metadata: Metadata = {
  title: "Richpass",
  description: "Richpass App",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // サーバー側でログイン検知（既存の見た目は維持）
  const session = await getSession();
  const isLoggedIn = !!session;

  return (
    <html lang="ja">
      <body>
        {/* ▼ クライアント側の認証状態（/api/me）を全体で管理 */}
        <AuthProvider>
          <div className="pageWrapper" data-ssr-logged-in={isLoggedIn ? "1" : "0"}>
            {/* SSRのログイン状態に合わせた表示（従来どおり） */}
            <Header isLoggedIn={isLoggedIn} />
            <main className="mainContent">{children}</main>

            {/* ▼ タブ表示中はCSSで非表示にするためのスロット */}
            <div className="siteFooterSlot">
              <Footer />
            </div>
          </div>

          {/* ▼ モバイル専用の下部タブ（PCでは非表示） */}
          <MobileTabBar isLoggedIn={isLoggedIn} />
        </AuthProvider>
      </body>
    </html>
  );
}
