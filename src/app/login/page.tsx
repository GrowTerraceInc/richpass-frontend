'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/useAuth';
import LoginForm, { type LoginFormValues } from './LoginForm';
import styles from './LoginPage.module.css';

export default function LoginPage() {
  const router = useRouter();
  const sp = useSearchParams();
  const next = sp.get('next') ?? '/home';

  const { user, refresh, doLogin } = useAuth();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // （保険）すでに認証済みなら遷移
  useEffect(() => {
    if (user) {
      router.replace(next);
      router.refresh();
    }
  }, [user, router, next]);

  const successBanner = useMemo(() => {
    const s = sp?.get('success');
    return s === 'password-updated'
      ? 'パスワードが更新されました。新しいパスワードでログインしてください。'
      : null;
  }, [sp]);

  const handleSubmit = async ({ email, password }: LoginFormValues) => {
    if (loading) return;
    setErrorMsg(null);
    setLoading(true);
    try {
      // 1) ログイン実行（CSRF/セッションは api.ts 側で処理済み）
      await doLogin(email, password);

      // 2) 状態同期（念のため）— 失敗しても遷移自体は行う
      try { await refresh(); } catch {}

      // 3) 明示遷移：ここで /home（または next）へ必ず移動
      router.replace(next);
      // Playwright の waitForURL と噛み合わせるために refresh は任意でOK
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={styles.wrap} aria-labelledby="login-title" data-testid="login-root">
      <div className={styles.inner}>
        <h1 id="login-title" className={styles.title}>ログイン</h1>
        <div className={styles.formBlock}>
          <LoginForm
            onSubmit={handleSubmit}
            loading={loading}
            errorMessage={errorMsg}
            successBanner={successBanner}
            variant="plain"
            hideTitle
          />
        </div>
      </div>
    </section>
  );
}
