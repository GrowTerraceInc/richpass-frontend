// app/components/layout/SmartChrome.tsx
'use client';

import React, { useEffect, useState } from 'react';
import Header from '@/app/components/layout/Header';
import Footer from '@/app/components/layout/Footer';
import MobileTabBar from '@/app/components/tabbar/MobileTabBar';
import { useAuth } from '@/app/components/auth/useAuth';

// ビューポート幅で「モバイル判定」を行う（型安全・SSR対応）
function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const query = `(max-width:${breakpoint}px)`;
    const mql = window.matchMedia(query);

    // 初期反映
    setIsMobile(mql.matches);

    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);

    // 近年のブラウザ
    if ('addEventListener' in mql) {
      mql.addEventListener('change', onChange);
      return () => mql.removeEventListener('change', onChange);
    }

    // 旧ブラウザ互換（型安全にキャスト）
    const legacy = mql as MediaQueryList & {
      addListener: (fn: (e: MediaQueryListEvent) => void) => void;
      removeListener: (fn: (e: MediaQueryListEvent) => void) => void;
    };
    legacy.addListener(onChange);
    return () => legacy.removeListener(onChange);
  }, [breakpoint]);

  return isMobile;
}

export default function SmartChrome() {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const authed = !!user;

  if (authed) {
    // ログイン時：ヘッダー + （モバイルのみ）ボトムナビ + （PCのみ）フッター
    return (
      <>
        <Header isLoggedIn={true} />
        {isMobile && <MobileTabBar isLoggedIn={true} />}
        {!isMobile && (
          <div className="siteFooterSlot">
            <Footer />
          </div>
        )}
      </>
    );
  }

  // 未ログイン時：未ログインヘッダー + フッター（常時）
  return (
    <>
      <Header isLoggedIn={false} />
      <div className="siteFooterSlot">
        <Footer />
      </div>
    </>
  );
}
