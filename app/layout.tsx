// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
/* ▼ モバイルタブ */
import MobileTabBar from "@/app/components/tabbar/MobileTabBar";
/* ▼ サーバーでログイン検知（既存） */
import { getSession } from "@/app/lib/auth";
/* ▼ 追加：クライアント境界 */
import ClientRoot from "@/app/components/auth/ClientRoot";

export const metadata: Metadata = {
  title: "Richpass",
  description: "Richpass App",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  const isLoggedIn = !!session;

  return (
    <html lang="ja">
      <body>
        {/* ▼ ここからクライアント境界（AuthProviderもこの中で動く） */}
        <ClientRoot>
          <div className="pageWrapper" data-ssr-logged-in={isLoggedIn ? "1" : "0"}>
            <Header isLoggedIn={isLoggedIn} />
            <main className="mainContent">{children}</main>
            <div className="siteFooterSlot">
              <Footer />
            </div>
          </div>
          <MobileTabBar isLoggedIn={isLoggedIn} />
        </ClientRoot>
      </body>
    </html>
  );
}
