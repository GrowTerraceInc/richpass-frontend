'use client';

import { useState } from 'react';
import styles from '../Auth.module.css';
import Button from '@/components/ui/Button';
import BackLink from '@/components/nav/BackLink';
import { requestPasswordReset } from '@/lib/useAuth';

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);

    if (!email) return setFormError('メールアドレスを入力してください。');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setFormError('メールアドレスの形式が正しくありません。');

    setSubmitting(true);
    const res = await requestPasswordReset(email);
    setSubmitting(false);

    if (res.ok) setDone(true);
    else setFormError(res.message ?? '送信に失敗しました。時間をおいて再度お試しください。');
  }

  return (
    <div className={styles.screen}>
      {/* 高さ60pxの戻るバー */}
      <div className={styles.backBar}>
        <div className={styles.backBarInner}>
          <BackLink className={styles.backBarNav} label="＜ ログイン画面に戻る" href="/login" />
        </div>
      </div>

      {/* 本体：パディング8px */}
      <div className={styles.screenBody}>
        <div className={styles.screenBodyInner}>
          <div className={styles.card}>
            <header className={styles.header}>
              <h2 className="h2">パスワードの再設定</h2>
              <p className={styles.subTextCenter}>
                ご登録のメールアドレスを入力してください。<br />
                パスワード再設定用のリンクをお送りします。
              </p>
              {formError && <div className={styles.alert} role="alert">{formError}</div>}
              {done && <div className={styles.success}>再設定用のリンクを送信しました。</div>}
            </header>

            {!done && (
              <form onSubmit={onSubmit} noValidate className={styles.form}>
                <div className={styles.formRow}>
                  <label htmlFor="email" className={styles.label}>メールアドレス</label>
                  <input
                    id="email" type="email" placeholder="you@example.com" autoComplete="email"
                    value={email} onChange={e => setEmail(e.target.value)} required className={styles.input}
                  />
                </div>

                <div className={styles.actions}>
                  <Button type="submit" variant="primary" size="large" disabled={submitting}>
                    {submitting ? '送信中...' : '再設定リンクを送信する'}
                  </Button>
                </div>
              </form>
            )}

            {done && <div className={styles.actions}><a href="/login" className={styles.link}>ログイン画面に戻る</a></div>}
          </div>
        </div>
      </div>
    </div>
  );
}
