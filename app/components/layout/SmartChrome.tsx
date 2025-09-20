// app/components/layout/SmartChrome.tsx
'use client';

import React, { useLayoutEffect, useState } from 'react';
import Header from '@/app/components/layout/Header';
import MobileTabBar from '@/app/components/tabbar/MobileTabBar';
import { useAuth } from '@/app/components/auth/useAuth';

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false);
  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;
    const mql = window.matchMedia(`(max-width:${breakpoint}px)`);
    const update = () => setIsMobile(mql.matches);
    update();
    mql.addEventListener?.('change', update);
    return () => mql.removeEventListener?.('change', update);
  }, [breakpoint]);
  return isMobile;
}

export default function SmartChrome() {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const authed = !!user;
  const hasTabbar = authed && isMobile;

  // “今の状態”に合わせて body クラスをトグル（残留防止）
  useLayoutEffect(() => {
    if (typeof document === 'undefined') return;
    document.body.classList.toggle('has-tabbar', hasTabbar);
    return () => {
      document.body.classList.remove('has-tabbar');
    };
  }, [hasTabbar]);

  return (
    <>
      <Header isLoggedIn={authed} />
      {hasTabbar && (
        <div id="rp-bottom-nav">
          <MobileTabBar isLoggedIn={true} />
        </div>
      )}
    </>
  );
}
