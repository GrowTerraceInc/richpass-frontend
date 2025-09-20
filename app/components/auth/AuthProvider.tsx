'use client';

import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';

type ApiUser = { id: number; name: string; email: string; plan?: string };
type UserState = ApiUser | null | undefined; // undefined = loading

type AuthContextValue = {
  user: UserState;
  refresh: () => Promise<ApiUser | null>;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function apiBase() {
  // 両ENVのどちらかを採用（どちらも設定済みなら BASE を優先）
  return process.env.NEXT_PUBLIC_API_BASE
    || process.env.NEXT_PUBLIC_API_ORIGIN
    || '';
}

function readXsrfCookie(): string {
  if (typeof document === 'undefined') return '';
  const hit = document.cookie.split('; ').find(c => c.startsWith('XSRF-TOKEN='));
  return hit ? decodeURIComponent(hit.split('=')[1]) : '';
}

// ---- 追加：window.__auth を型安全に拡張（@ts-ignore不要） ----
declare global {
  interface Window {
    __auth?: {
      refresh: () => Promise<ApiUser | null>;
      logout: () => Promise<void>;
      getUser: () => UserState;
    };
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserState>(undefined); // 初期はloading

  const refresh = useCallback(async () => {
    try {
      const res = await fetch(`${apiBase()}/api/me`, {
        method: 'GET',
        credentials: 'include',
        headers: { Accept: 'application/json' },
        cache: 'no-store',
      });
      if (res.ok) {
        const data: ApiUser = await res.json();
        setUser(data);
        return data;
      }
      setUser(null);
      return null;
    } catch {
      setUser(null);
      return null;
    }
  }, []);

  const logout = useCallback(async () => {
    const xsrf = readXsrfCookie();
    // 仕様：POST /logout + X-XSRF-TOKEN（204）
    await fetch(`${apiBase()}/logout`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        ...(xsrf ? { 'X-XSRF-TOKEN': xsrf } : {}),
      },
      cache: 'no-store',
    }).catch(() => {});
    setUser(null);
  }, []);

  useEffect(() => {
    // 初期化で状態同期
    refresh();
  }, [refresh]);

  // デバッグ用フックを window に提供（型拡張済み）
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.__auth = { refresh, logout, getUser: () => user };
    }
  }, [user, refresh, logout]);

  const value = useMemo<AuthContextValue>(() => ({ user, refresh, logout }), [user, refresh, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
