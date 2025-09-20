'use client';

import React, { useEffect, useState } from 'react';
import Header from '@/app/components/layout/Header';
import MobileTabBar from '@/app/components/tabbar/MobileTabBar';
import { useAuth } from '@/app/components/auth/useAuth';

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mql = window.matchMedia(`(max-width:${breakpoint}px)`);
    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    setIsMobile(mql.matches);
    if ('addEventListener' in mql) {
      mql.addEventListener('change', onChange);
      return () => mql.removeEventListener('change', onChange);
    }
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

  // ▼ CSS と合わせる：body に has-tabbar を付け外し
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const b = document.body;
    if (authed && isMobile) b.classList.add('has-tabbar');
    else b.classList.remove('has-tabbar');
  }, [authed, isMobile]);

  return (
    <>
      <Header isLoggedIn={authed} />
      {authed && isMobile && <MobileTabBar isLoggedIn={true} />}
    </>
  );
}
