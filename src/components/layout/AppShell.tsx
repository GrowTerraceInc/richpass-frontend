// /Users/daichi/Desktop/projects/richpass-frontend/src/components/layout/AppShell.tsx
"use client";

import { useEffect, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { useAuth } from "@/lib/useAuth";
import MobileTabBar from "@/components/layout/MobileTabBar";

function useIsMobile() {
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

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const isLoggedIn = !!user;
  const isMobile = useIsMobile();

  // PC/タブ: 常時、モバイル: 未ログインのみ。loading中は出さない。
  const showFooter = !loading && (!isMobile || !isLoggedIn);

  return (
    <div className="app-shell">
      <Header />
      <main className="app-content">{children}</main>
      {showFooter && <Footer />}
      <MobileTabBar isLoggedIn={isLoggedIn} />
    </div>
  );
}
