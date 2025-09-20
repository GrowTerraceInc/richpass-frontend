'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginByEmailPassword } from '@/app/lib/authClient';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      await loginByEmailPassword(email, password);
      router.push('/settings/plan'); // ログイン後の遷移先
    } catch (error: unknown) {
      if (error instanceof Error) {
        setErr(error.message);
      } else {
        setErr('ログインに失敗しました');
      }
    } finally {
      setLoading(false);
    }
  }


  return (
    <main className="min-h-dvh flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6">
        <h1 className="text-2xl font-bold text-center">ログイン</h1>

        {err && (
          <div className="rounded-lg border border-red-300 bg-red-50 p-3 text-red-700 text-sm">
            {err}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="block text-sm text-gray-600">メールアドレス</label>
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border p-3"
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm text-gray-600">パスワード</label>
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border p-3"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl border px-4 py-3 font-medium hover:bg-gray-50 disabled:opacity-50"
          >
            {loading ? 'ログイン中…' : 'ログイン'}
          </button>
        </form>

        <p className="text-center text-xs text-gray-500">
          ※ Sanctum（Cookieセッション）で動作します。
        </p>
      </div>
    </main>
  );
}
