// src/lib/useAuth.ts
'use client';

import { useCallback, useEffect, useState } from 'react';
import { me, login as apiLogin, logout as apiLogout } from '@/lib/api';

export type User = { id: number; name: string; email: string } | null;

type AuthState = {
  user: User;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  doLogin: (email: string, password: string) => Promise<void>;
  doLogout: () => Promise<void>;
};

export function useAuth(): AuthState {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const u = await me();          // /api/me（未ログインは UNAUTH を throw）
      setUser(u);
    } catch (e) {
      const m = e instanceof Error ? e.message : String(e);
      if (m === 'UNAUTH') {
        setUser(null);
      } else {
        setError('Network error');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const doLogin = useCallback(async (email: string, password: string) => {
    setError(null);
    await apiLogin(email, password); // 成功で Cookie セット
    await refresh();                 // 直後に /api/me で同期
  }, [refresh]);

  const doLogout = useCallback(async () => {
    setError(null);
    await apiLogout();               // サーバ側のセッション破棄
    setUser(null);                   // 即時にクライアント状態をクリア
  }, []);

  useEffect(() => {
    void refresh();                  // 初回マウントで状態同期
  }, [refresh]);

  return { user, loading, error, refresh, doLogin, doLogout };
}
