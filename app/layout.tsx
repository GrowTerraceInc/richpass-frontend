// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
/* ▼ サーバーでログイン検知（既存） */
import { getSession } from "@/app/lib/auth";
/* ▼ クライアント境界（既存） */
import ClientRoot from "@/app/components/auth/ClientRoot";
/* ▼ 追加：ログイン/未ログインでナビを切替 */
import SmartChrome from "@/app/components/layout/SmartChrome";

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
    <html lang="ja" data-ssr-logged-in={isLoggedIn ? "1" : "0"}>
      <body>
        <ClientRoot>
          <div className="pageWrapper">
            {/* ▼ ログイン/未ログインでヘッダー/ボトムナビ/フッターを出し分け */}
            <SmartChrome />

            <main className="mainContent">{children}</main>
          </div>
        </ClientRoot>
      </body>
    </html>
  );
}
