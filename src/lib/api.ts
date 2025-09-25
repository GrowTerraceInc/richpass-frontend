// src/lib/api.ts

// --- APIベースURL（ENV優先。なければデフォルト値） ---
const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE ?? 'https://api.richpassapp.com';

// --- エラー型（status/code を持てる Error 拡張） ---
type HttpError = Error & { status?: number; code?: string };

function makeHttpError(message: string, status?: number, code?: string): HttpError {
  const e = new Error(message) as HttpError;
  if (status !== undefined) e.status = status;
  if (code) e.code = code;
  return e;
}

function throwUnauth(): never {
  throw makeHttpError('UNAUTH', 401, 'UNAUTH');
}

// --- ブラウザ限定：XSRF-TOKEN を cookie から取り出してデコード ---
function getXsrfTokenFromCookie(): string | undefined {
  if (typeof document === 'undefined') return undefined;
  const raw = document.cookie.split('; ').find((s) => s.startsWith('XSRF-TOKEN='));
  if (!raw) return undefined;
  const v = raw.split('=')[1] ?? '';
  try { return decodeURIComponent(v); } catch { return v; }
}

// --- CSRF配布（Sanctum：Double Submit Cookie） ---
export async function getCsrfCookie(): Promise<true> {
  const res = await fetch(`${API_BASE}/sanctum/csrf-cookie`, {
    method: 'GET',
    credentials: 'include',
    cache: 'no-store',
    headers: { 'X-Requested-With': 'XMLHttpRequest' },
  });
  // Laravelは204を返す実装が多い。200でもOK。
  if (!res.ok && res.status !== 204) {
    throw makeHttpError(`CSRF_FAIL:${res.status}`, res.status, 'CSRF_FAIL');
  }
  return true;
}

// --- 共通fetch：include/no-store/401→例外 'UNAUTH' ---
export async function apiFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: 'include',
    cache: 'no-store',
    headers: { Accept: 'application/json', ...(init.headers || {}) },
    ...init,
  });
  if (res.status === 401) throwUnauth();
  return res;
}

// --- JSON ヘルパ（壊れたJSONの可視化） ---
export async function json<T = unknown>(res: Response): Promise<T> {
  try {
    return (await res.json()) as T;
  } catch {
    const text = await res.text();
    throw makeHttpError(`JSON_PARSE_FAIL:${res.status}:${text?.slice(0, 200)}`, res.status, 'JSON_PARSE_FAIL');
  }
}

// --- /api/me（未ログインは 'UNAUTH' 例外に統一） ---
export type MeResponse = { id: number; name: string; email: string };

export async function me(): Promise<MeResponse> {
  const r = await apiFetch('/api/me');
  return json<MeResponse>(r);
}

// --- /login：CSRF配布→XSRFヘッダ付与→POST ---
export async function login(email: string, password: string): Promise<true> {
  await getCsrfCookie(); // 先に配布（トークン未配布/ローテート対策）
  const token = getXsrfTokenFromCookie(); // LaravelのDouble Submit Cookie対応
  const r = await apiFetch('/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      ...(token ? { 'X-XSRF-TOKEN': token } : {}),
    },
    body: JSON.stringify({ email, password }),
  });
  if (!r.ok) throw makeHttpError(`LOGIN_FAIL:${r.status}`, r.status, 'LOGIN_FAIL');
  return true;
}

// --- /logout：CSRF配布→XSRFヘッダ付与→POST ---
export async function logout(): Promise<true> {
  await getCsrfCookie();
  const token = getXsrfTokenFromCookie();
  const r = await apiFetch('/logout', {
    method: 'POST',
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
      ...(token ? { 'X-XSRF-TOKEN': token } : {}),
    },
  });
  if (!r.ok && r.status !== 204) {
    throw makeHttpError(`LOGOUT_FAIL:${r.status}`, r.status, 'LOGOUT_FAIL');
  }
  return true;
}

/* ============================================================
 *  追加：Signup/Verify/Forgot/Reset 用の薄ラッパー
 *  - すべて credentials: 'include' / cache: 'no-store'
 *  - CSRF + XSRF ヘッダを統一処理
 * ============================================================ */

// 共通 POST ヘルパ
export async function apiPostJson(path: string, payload: unknown): Promise<Response> {
  await getCsrfCookie();
  const token = getXsrfTokenFromCookie();
  return apiFetch(path, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      ...(token ? { 'X-XSRF-TOKEN': token } : {}),
    },
    body: JSON.stringify(payload ?? {}),
  });
}

// 1) Register
export function registerApi(payload: {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  agree: boolean;
}) {
  return apiPostJson('/register', payload);
}

// 2) Resend verification
export function resendVerificationApi() {
  return apiPostJson('/email/verification-notification', {});
}

// 3) Forgot password（Fortify準拠）
export function requestPasswordResetApi(email: string) {
  return apiPostJson('/forgot-password', { email });
}

// 4) Reset password（Fortify準拠）
export function resetPasswordApi(payload: {
  token: string;
  email: string;
  password: string;
  password_confirmation: string;
}) {
  return apiPostJson('/reset-password', payload);
}
