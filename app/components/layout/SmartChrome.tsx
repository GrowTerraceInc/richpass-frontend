// app/components/layout/SmartChrome.tsx
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
  const authed  = !!user;

  // body.has-tabbar を“今の状態”に正しく同期（残留させない）
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
