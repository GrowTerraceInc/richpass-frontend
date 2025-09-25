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
import {
  me,
  login as apiLogin,
  logout as apiLogout,
  registerApi,
  resendVerificationApi,
  requestPasswordResetApi,
  resetPasswordApi,
} from '@/lib/api';

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
      if (m === 'UNAUTH') setUser(null);
      else setError('Network error');
    } finally {
      if (mounted.current) setLoading(false);
    }
  }, []);

  const doLogin = useCallback(async (email: string, password: string) => {
    if (!mounted.current) return;
    setError(null);
    await apiLogin(email, password);
    await refresh();
  }, [refresh]);

  const doLogout = useCallback(async () => {
    if (!mounted.current) return;
    setError(null);
    await apiLogout();
    if (mounted.current) setUser(null);
  }, []);

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

/* ============================================================
 *  追加：signup / verify / forgot / reset 用の薄ラッパー
 *  - 型安全（no-explicit-any 回避）
 *  - 422 フィールドエラー / message の標準化
 * ============================================================ */

type FieldErrors = Record<string, string[]>;
type ApiError = { message?: string; errors?: FieldErrors };
type ActionResult =
  | { ok: true }
  | { ok: false; message?: string; fieldErrors?: FieldErrors };

async function parseApiError(res: Response): Promise<ApiError | null> {
  try {
    const ct = res.headers.get('content-type') ?? '';
    if (!ct.includes('application/json')) return null;
    const data: unknown = await res.clone().json();
    if (data && typeof data === 'object') {
      const anyObj = data as Record<string, unknown>;
      const message = typeof anyObj.message === 'string' ? anyObj.message : undefined;
      const errors = (anyObj.errors && typeof anyObj.errors === 'object')
        ? (anyObj.errors as FieldErrors)
        : undefined;
      return { message, errors };
    }
  } catch {
    /* noop */
  }
  return null;
}

function toResult(res: Response, err: ApiError | null): ActionResult {
  if (res.ok) return { ok: true };
  return { ok: false, message: err?.message, fieldErrors: err?.errors };
}

export async function register(payload: {
  name: string; email: string; password: string; password_confirmation: string; agree: boolean;
}): Promise<ActionResult> {
  const res = await registerApi(payload);
  const err = await parseApiError(res);
  return toResult(res, err);
}

export async function resendVerification(): Promise<ActionResult> {
  const res = await resendVerificationApi();
  const err = await parseApiError(res);
  return toResult(res, err);
}

export async function requestPasswordReset(email: string): Promise<ActionResult> {
  const res = await requestPasswordResetApi(email);
  const err = await parseApiError(res);
  return toResult(res, err);
}

export async function resetPassword(payload: {
  token: string; email: string; password: string; password_confirmation: string;
}): Promise<ActionResult> {
  const res = await resetPasswordApi(payload);
  const err = await parseApiError(res);
  return toResult(res, err);
}
