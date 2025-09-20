// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import Footer from "./components/layout/Footer";
import { getSession } from "@/app/lib/auth";
import ClientRoot from "@/app/components/auth/ClientRoot";
import SmartChrome from "@/app/components/layout/SmartChrome";

export const metadata: Metadata = {
  title: "Richpass",
  description: "Richpass App",
};

export default async function RootLayout({
  children,
}: { children: React.ReactNode }) {
  const session = await getSession();
  const isLoggedIn = !!session;

  return (
    <html lang="ja" data-ssr-logged-in={isLoggedIn ? "1" : "0"}>
      <body>
        <ClientRoot>
          <div className="pageWrapper">
            {/* ヘッダー＆（必要なら）ボトムナビ */}
            <SmartChrome />

            {/* 本文エリアは伸縮してフッターを最下部へ押し下げる */}
            <main className="mainContent">{children}</main>

            {/* フッターは常に末尾。ただし CSS で「ボトムナビがある時は非表示」 */}
            <div className="siteFooterSlot">
              <Footer />
            </div>
          </div>
        </ClientRoot>
      </body>
    </html>
  );
}
