'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/useAuth';
import LoginForm, { type LoginFormValues } from './LoginForm';
import styles from './LoginPage.module.css';

type Props = {
  nextPath: string;         // Server から渡す遷移先
  successParam?: string;    // 'password-updated' 等
};

export default function LoginContent({ nextPath, successParam }: Props) {
  const router = useRouter();
  const { user, refresh, doLogin } = useAuth();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // すでに認証済みなら遷移（元コード踏襲）
  useEffect(() => {
    if (user) {
      router.replace(nextPath);
      router.refresh();
    }
  }, [user, router, nextPath]);

  const successBanner = useMemo(() => {
    return successParam === 'password-updated'
      ? 'パスワードが更新されました。新しいパスワードでログインしてください。'
      : null;
  }, [successParam]);

  const handleSubmit = async ({ email, password }: LoginFormValues) => {
    if (loading) return;
    setErrorMsg(null);
    setLoading(true);
    try {
      // 1) ログイン実行（CSRF/セッションは api.ts 側で処理）
      await doLogin(email, password);

      // 2) 状態同期（念のため）— 失敗しても遷移自体は行う
      try { await refresh(); } catch {}

      // 3) 明示遷移
      router.replace(nextPath);
      // Playwright の waitForURL と噛み合わせるために refresh は任意
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
