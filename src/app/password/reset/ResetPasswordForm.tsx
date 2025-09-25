'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../Auth.module.css';
import signupStyles from '@/app/signup/components/RegistrationForm.module.css';
import Button from '@/components/ui/Button';
import BackLink from '@/components/nav/BackLink';
import { resetPassword } from '@/lib/useAuth';
import { scorePassword, passwordPolicyError } from '@/lib/password';

type FieldErrors = Record<string, string[]>;

export default function ResetPasswordForm({ token, email }: { token: string; email: string }) {
  const router = useRouter();

  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');

  const [pwTouched, setPwTouched] = useState(false);
  const [pw2Touched, setPw2Touched] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors | null>(null);

  // サインアップと同一ロジック
  const pwStrength = useMemo(() => scorePassword(password), [password]);
  const policyErrorRaw = useMemo(() => passwordPolicyError(password), [password]);
  const policyError =
    pwTouched && password.length > 0 ? policyErrorRaw ?? undefined : undefined;

  const confirmErrorRaw =
    password2.length > 0 && password !== password2 ? 'パスワードが一致しません。' : '';
  const confirmError =
    pw2Touched && password2.length > 0 ? confirmErrorRaw || undefined : undefined;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError(null);
    setFieldErrors(null);

    if (!token || !email) return setFormError('リンクが無効です。再度お試しください。');
    if (!password || !password2) return setFormError('新しいパスワードを入力してください。');

    const policyErr = passwordPolicyError(password);
    if (policyErr) return setFormError(policyErr);

    if (password !== password2) return setFormError('パスワードが一致しません。');

    setSubmitting(true);
    const res = await resetPassword({ token, email, password, password_confirmation: password2 });
    setSubmitting(false);

    if (res.ok) return router.replace('/login?reset=ok');

    setFormError(res.message ?? 'パスワードの更新に失敗しました。');
    if (res.fieldErrors) setFieldErrors(res.fieldErrors);
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
              <h2 className="h2">新しいパスワードの設定</h2>
              <p className={styles.subTextCenter}>新しいパスワードを入力してください。</p>
              {formError && <div className={styles.alert} role="alert">{formError}</div>}
            </header>

            <form onSubmit={onSubmit} noValidate className={styles.form}>
              {/* Password（= サインアップと同じUI/クラス構成） */}
              <div className={styles.formRow}>
                <label htmlFor="password" className={signupStyles.label}>新しいパスワード</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="8文字以上／大文字・小文字・数字・記号のうち3種類以上を推奨"
                  className={signupStyles.input}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onBlur={() => setPwTouched(true)}
                  autoComplete="new-password"
                  required
                  minLength={8}
                  aria-invalid={!!policyError}
                />
                <div className={`${signupStyles.meter} ${signupStyles[`meter--${Math.max(1, pwStrength)}`]}`}>
                  <div
                    className={signupStyles.meterFill}
                    style={{ width: `${(pwStrength / 4) * 100}%` }}
                    aria-hidden="true"
                  />
                </div>
                {policyError && <div className={signupStyles.error}>{policyError}</div>}

                {/* API由来のPWエラー（422など）も同じトーンで */}
                {fieldErrors?.password && (
                  <div className={signupStyles.error}>{fieldErrors.password.join(' ')}</div>
                )}
              </div>

              {/* Password confirm（見た目も合わせる） */}
              <div className={styles.formRow}>
                <label htmlFor="password2" className={signupStyles.label}>新しいパスワード（確認用）</label>
                <input
                  id="password2"
                  name="password2"
                  type="password"
                  className={signupStyles.input}
                  value={password2}
                  onChange={e => setPassword2(e.target.value)}
                  onBlur={() => setPw2Touched(true)}
                  autoComplete="new-password"
                  required
                  aria-invalid={!!confirmError}
                />
                {confirmError && <div className={signupStyles.error}>{confirmError}</div>}
              </div>

              <div className={styles.actions}>
                <Button type="submit" variant="primary" size="large" disabled={submitting}>
                  {submitting ? '更新中…' : 'パスワードを再設定する'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
