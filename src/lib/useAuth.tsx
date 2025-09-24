'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { me, login as apiLogin, logout as apiLogout } from '@/lib/api';

export type User = { id: number; name: string; email: string } | null;

type AuthContextValue = {
  user: User;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  doLogin: (email: string, password: string) => Promise<void>;
  doLogout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const mounted = useRef(false);
  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; };
  }, []);

  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // ID を固定した refresh（依存なし）
  const refresh = useCallback(async () => {
    if (!mounted.current) return;
    setLoading(true);
    setError(null);
    try {
      const u = await me(); // /api/me
      if (!mounted.current) return;
      setUser(u);
    } catch (e) {
      if (!mounted.current) return;
      const m = e instanceof Error ? e.message : String(e);
      if (m === 'UNAUTH') {
        setUser(null);
      } else {
        setError('Network error');
      }
    } finally {
      if (mounted.current) setLoading(false);
    }
  }, []);

  const doLogin = useCallback(async (email: string, password: string) => {
    if (!mounted.current) return;
    setError(null);
    await apiLogin(email, password); // Cookie セット
    // 直後の同期
    await refresh();
  }, [refresh]);

  const doLogout = useCallback(async () => {
    if (!mounted.current) return;
    setError(null);
    await apiLogout(); // サーバ側セッション破棄
    if (mounted.current) setUser(null);
  }, []);

  // 初回マウントで一度だけ同期
  useEffect(() => { void refresh(); }, [refresh]);

  const value = useMemo<AuthContextValue>(
    () => ({ user, loading, error, refresh, doLogin, doLogout }),
    [user, loading, error, refresh, doLogin, doLogout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
  return ctx;
}
