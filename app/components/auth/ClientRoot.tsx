'use client';

import React, { useEffect } from 'react';
import { AuthProvider } from './AuthProvider';

// window を型拡張（any を使わない）
declare global {
  interface Window {
    __clientRootMounted?: boolean;
  }
}

export default function ClientRoot({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // 動作印：本番でクライアント境界が実行されたかを可視化
    if (typeof window !== 'undefined') {
      window.__clientRootMounted = true;
    }
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-client-root', 'on');
    }
  }, []);

  return <AuthProvider>{children}</AuthProvider>;
}
